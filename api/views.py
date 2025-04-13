from django.http import JsonResponse
from rest_framework.decorators import api_view
import pyrebase
from rest_framework import status
from rest_framework.response import Response
from datetime import datetime
import googlemaps
import google.generativeai as genai
import requests
# ✅ Firebase configuration (use your actual working values)
firebaseConfig = {
    "apiKey": "AIzaSyBvF4sctKkdQFSkkvvDyLKENJMFlaWCWQU",
    "authDomain": "coe-project-24d1c.firebaseapp.com",
    "databaseURL": "https://coe-project-24d1c-default-rtdb.firebaseio.com",
    "projectId": "coe-project-24d1c",
    "storageBucket": "coe-project-24d1c.appspot.com",
    "messagingSenderId": "244172124947",
    "appId": "1:244172124947:web:7b21248ef1d4b1d5f060e6",
    "measurementId": "G-KGC9E9TWWH"
}

# ✅ Initialize Firebase
firebase = pyrebase.initialize_app(firebaseConfig)
db = firebase.database()
auth = firebase.auth()
GEMINI_API_KEY = "AIzaSyAYhGvML3XNS2k3O47wyqTx7FBf6Kjut1s."  # Already in your setup
GOOGLE_MAPS_API_KEY = "AIzaSyBf7g228DZPB46GCpKufTBV_QpinWBCJp4"  # Already in your setup
WEATHER_API_KEY = "c092817bdb9a68d7bab9fc141fc91944"
gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)
gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

@api_view(['POST'])
def register_user(request):
    print("[DEBUG] Register endpoint hit.")
    try:
        data = request.data
        print("[DEBUG] Received data:", data)

        username = data.get('username')
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phonenumber')
        password = data.get('password')
        confirm_password = data.get('confirmPassword')

        # ✅ Check all required fields
        # 💥 Debug Field Values
        print("[DEBUG] username:", username)
        print("[DEBUG] name:", name)
        print("[DEBUG] email:", email)
        print("[DEBUG] phone:", phone)
        print("[DEBUG] password:", password)
        print("[DEBUG] confirm_password:", confirm_password)

    # ✅ Check all fields are present and not empty
        required_fields = [username, name, email, phone, password, confirm_password]
        if any(field is None or str(field).strip() == '' for field in required_fields):
            return JsonResponse({"status": "error", "message": "All fields are required"}, status=400)
    # ✅ Password match check
        if password.strip() != confirm_password.strip():
            return JsonResponse({"status": "error", "message": "Passwords do not match"}, status=400)
        # ✅ Check if user exists
        users = db.child("users").get()
        if users is not None and users.each() is not None:
            for user in users.each():
                user_data = user.val()
                if user_data.get("email") == email:
                    return JsonResponse({"status": "error", "message": "Email already registered"}, status=400)
                if user_data.get("phone") == phone:
                    return JsonResponse({"status": "error", "message": "Phone number already registered"}, status=400)
                if user_data.get("username") == username:
                    return JsonResponse({"status": "error", "message": "Username already taken"}, status=400)

        # ✅ Save new user
        result = db.child("users").push({
            "username": username,
            "name": name,
            "email": email,
            "phone": phone,
            "password": password,  # ❗ hash this in production!
        })

        print("[DEBUG] Firebase push result:", result)
        return JsonResponse({"status": "success", "message": "User registered successfully"}, status=201)

    except Exception as e:
        print("[ERROR]", str(e))
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@api_view(['POST'])
def login_user(request):
    print("[DEBUG] Login endpoint hit.")
    if request.method == 'POST':
        try:
            data = request.data
            print("[DEBUG] Received data:", data)

            identifier = data.get('identifier')  # can be email or username
            password = data.get('password')

            if not all([identifier, password]):
                return JsonResponse({"status": "error", "message": "Identifier and password are required"}, status=400)

            # ✅ Fetch all users
            users = db.child("users").get()
            if users is None:
                return JsonResponse({"status": "error", "message": "No users found in the database"}, status=404)

            for user in users.each():
                user_data = user.val()
                if (user_data["email"] == identifier or user_data["name"] == identifier) and user_data["password"] == password:
                    print("[DEBUG] User authenticated successfully.")
                    return JsonResponse({
                        "status": "success",
                        "message": "Login successful",
                        "email": user_data["email"],  # return the actual email
                        "name": user_data["name"]
                    }, status=200)

            print("[DEBUG] No matching user found.")
            return JsonResponse({"status": "error", "message": "Invalid credentials"}, status=400)

        except Exception as e:
            print("[ERROR]", str(e))
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=400)


@api_view(['GET'])
def get_user_by_email(request):
    email = request.GET.get('email')
    if not email:
        return JsonResponse({"status": "error", "message": "Email is required"}, status=400)
    
    try:
        users = db.child("users").get()

        if users is None:
            return JsonResponse({"status": "error", "message": "No users found in the database"}, status=404)
        
        for user in users.each():
            data = user.val()
            if data["email"] == email:
                return JsonResponse({"status": "success", "name": data["name"]}, status=200)

        return JsonResponse({"status": "error", "message": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@api_view(['POST'])
def create_package(request):
    print("[DEBUG] Create Package endpoint hit.")

    if request.method == 'POST':
        try:
            data = request.data
            print("[DEBUG] Received data:", data)  # Debug: Log the incoming data

            # Extract username and packageDetails from request data
            username = data.get('username')
            user_input = data.get('packageDetails')

            # Check if username and package details are provided
            if not all([username, user_input]):
                print("[DEBUG] Missing username or packageDetails")  # Debug: Log missing fields
                return JsonResponse({"status": "error", "message": "Username and package details are required"}, status=400)

            # Calculate number of days
            def fix_year(year): return '20' + year if len(year) == 2 else year
            sd = user_input['startDate'].split('-')
            ed = user_input['endDate'].split('-')
            print("[DEBUG] Start Date:", sd, "End Date:", ed)  # Debug: Log start and end dates
            sd[2] = fix_year(sd[2])
            ed[2] = fix_year(ed[2])
            user_input['numDays'] = (datetime.strptime('-'.join(ed), "%d-%m-%Y") - datetime.strptime('-'.join(sd), "%d-%m-%Y")).days
            print("[DEBUG] Calculated number of days:", user_input['numDays'])  # Debug: Log calculated number of days

            # Build Gemini prompt
            prompt = f"""
            Create a detailed travel itinerary with:
            - Starting Point: {user_input['startplace']}
            - Destination: {user_input['destinationplace']}
            - Dates: {user_input['startDate']} to {user_input['endDate']}
            - Number of People: {user_input['numPeople']}
            - Number of Days: {user_input['numDays']}
            - Preferences: {', '.join(user_input['preferences'])}
            - Goals: {', '.join(user_input['goals'])}
            - Dietary Restrictions: {user_input['diet']}
            - Budget: {user_input['budget']}

            Include daily activities, restaurants, travel tips, transport modes, and cost estimates.
            Return everything as a detailed JSON itinerary.
            """

            print("[DEBUG] Gemini prompt created:", prompt)  # Debug: Log generated prompt for Gemini

            gemini_response = model.generate_content(prompt)
            itinerary = gemini_response.text if gemini_response.text else "No itinerary generated"
            print("[DEBUG] Gemini response:", itinerary)  # Debug: Log Gemini response

            # Push to Firebase using username instead of email
            users = db.child("users").get()
            if users is None:
                print("[DEBUG] No users found in Firebase")  # Debug: Log if no users are found
                return JsonResponse({"status": "error", "message": "No users found"}, status=404)

            print("[DEBUG] Users found in Firebase:", users)  # Debug: Log users data
            for user in users.each():
                user_data = user.val()
                if user_data["username"] == username:
                    print("[DEBUG] Found matching user:", user_data)  # Debug: Log the user that matches
                    user_packages = user_data.get("packages", [])
                    user_packages.append({
                        "input": user_input,
                        "itinerary": itinerary
                    })
                    db.child("users").child(user.key()).update({"packages": user_packages})
                    print("[DEBUG] Gemini-based itinerary stored in Firebase.")  # Debug: Log success
                    return JsonResponse({"status": "success", "message": "Package created with Gemini itinerary"}, status=201)

            print("[DEBUG] User not found in Firebase")  # Debug: Log if user is not found
            return JsonResponse({"status": "error", "message": "User not found"}, status=404)

        except Exception as e:
            print("[ERROR] Exception occurred:", str(e))  # Debug: Log any exception that occurs
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=400)