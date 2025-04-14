from django.http import JsonResponse
from rest_framework.decorators import api_view
import pyrebase
from rest_framework import status
from rest_framework.response import Response
from datetime import datetime
import googlemaps
import google.generativeai as genai
import requests
import json
import re
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

# ✅ API Keys
GEMINI_API_KEY = "AIzaSyAYhGvML3XNS2k3O47wyqTx7FBf6Kjut1s."
GOOGLE_MAPS_API_KEY = "AIzaSyBf7g228DZPB46GCpKufTBV_QpinWBCJp4"
WEATHER_API_KEY = "c092817bdb9a68d7bab9fc141fc91944"

gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)
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

        # ✅ Debug Field Values
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
                if (user_data["email"] == identifier or user_data["username"] == identifier) and user_data["password"] == password:
                    print("[DEBUG] User authenticated successfully.")
                    return JsonResponse({
                        "status": "success",
                        "message": "Login successful",
                        "email": user_data["email"],
                        "username":user_data["username"],
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

    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "Invalid request method"}, status=400)

    try:
        data = request.data
        print("[DEBUG] Received data:", data)

        username = data.get('username')
        user_input = data.get('packageDetails')

        if not username or not user_input:
            print("[DEBUG] Missing username or packageDetails")
            return JsonResponse({
                "status": "error",
                "message": "Username and package details are required"
            }, status=400)

        # 🔄 Fix Date Format & Compute Duration
        def fix_year(year): return '20' + year if len(year) == 2 else year
        try:
            sd = user_input['startDate'].split('-')
            ed = user_input['endDate'].split('-')
            sd[2] = fix_year(sd[2])
            ed[2] = fix_year(ed[2])
            start_date = datetime.strptime('-'.join(sd), "%d-%m-%Y")
            end_date = datetime.strptime('-'.join(ed), "%d-%m-%Y")
            user_input['numDays'] = (end_date - start_date).days
        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": f"Invalid date format: {str(e)}"
            }, status=400)

        # 🌍 Prompt to Gemini
        prompt = f"""
Create a detailed travel itinerary in JSON format with the following user-provided details:

- Starting point: {user_input['startplace']}
- Destination: {user_input['destinationplace']}
- Dates: {user_input['startDate']} to {user_input['endDate']}
- Number of people: {user_input['numPeople']}
- Preferences: {user_input['preferences']}
- Goals: {user_input['goals']}
- Dietary restrictions: {user_input['diet']}
- Budget: {user_input['budget']}
- Source to destination transport: {user_input.get('source_to_dest_transport', 'N/A')}
- Local transport type: {user_input.get('local_transport_type', 'N/A')}
- Stay preferences: {user_input.get('stay_preferences', 'N/A')}

Instructions:
1. Return ONLY valid JSON. Do NOT include any markdown or code formatting.
2. For each day of the trip, include the following exact format:
[ {{ "day": number, "date": string, "location": string, "activities": [ {{ "description": string, "type": string, "duration": string, "notes": string }} ], "transport": [ {{ "mode": string, "estimatedCost": number, "currency": string, "details": string }} ], "accommodation": {{ "name": string, "type": string, "estimatedCost": number, "currency": string, "notes": string }}, "meals": [ {{ "type": string, "description": string, "cost": number, "currency": string, "notes": string }} ], "costEstimate": number, "notes": string }} ]
3. Make the itinerary realistic and appropriate for a {user_input['budget']} budget.
4. Recommend culturally appropriate, location-specific activities and food.
5. Include estimated costs wherever possible.
6. Respond ONLY with valid JSON following this exact structure.
"""

        print("[DEBUG] Sending prompt to Gemini...")
        gemini_response = model.generate_content(prompt)
        response_text = gemini_response.text
        clean_response = response_text.replace('```json', '').replace('```', '').strip()

        try:
            itinerary = json.loads(clean_response)
            print("[DEBUG] Successfully parsed itinerary.")
        except json.JSONDecodeError as e:
            print("[ERROR] Failed to parse Gemini response:", e)
            return JsonResponse({
                "status": "error",
                "message": "Failed to parse itinerary JSON",
                "raw_response": response_text
            }, status=500)

        # 🔥 Save to Firebase
        users = db.child("users").get()
        if users is None:
            return JsonResponse({"status": "error", "message": "No users found in database"}, status=404)

        for user in users.each():
            user_data = user.val()
            if user_data.get("username") == username:
                user_packages = user_data.get("packages", [])
                user_packages.append({
                    "input": user_input,
                    "itinerary": itinerary
                })
                db.child("users").child(user.key()).update({"packages": user_packages})
                print("[DEBUG] Successfully saved itinerary for user:", username)

                return JsonResponse({
                    "status": "success",
                    "packageDetails": user_input,
                    "itinerary": itinerary
                }, status=201)

        return JsonResponse({"status": "error", "message": "User not found"}, status=404)

    except Exception as e:
        print("[ERROR] Exception occurred:", str(e))
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


@api_view(['GET'])
def get_latest_itinerary(request, username):
    try:
        # Validate input
        if not username or not isinstance(username, str):
            return JsonResponse({
                "status": "error",
                "message": "Invalid username provided"
            }, status=400)

        # Fetch all users
        users = db.child("users").get()
        if not users:
            return JsonResponse({
                "status": "error",
                "message": "No users found in system"
            }, status=404)

        # Find user by username
        user_data = None
        for user in users.each():
            if user.val().get("username") == username:
                user_data = user.val()
                break

        if not user_data:
            return JsonResponse({
                "status": "error",
                "message": "User not found"
            }, status=404)

        # Get packages list
        packages = user_data.get("packages", [])
        if not packages:
            return JsonResponse({
                "status": "error",
                "message": "No itineraries found for this user"
            }, status=404)

        # Get latest package based on index
        latest_package = packages[-1]

        # Parse itinerary only if it's a string
        itinerary = latest_package.get("itinerary")
        if isinstance(itinerary, str):
            try:
                cleaned_str = itinerary.replace('```json', '').replace('```', '').strip()
                parsed_itinerary = json.loads(cleaned_str)
            except Exception:
                return JsonResponse({
                    "status": "error",
                    "message": "Itinerary parsing failed. Invalid format."
                }, status=500)
        else:
            parsed_itinerary = itinerary

        return JsonResponse({
            "status": "success",
            "packageDetails": latest_package.get("input"),
            "itinerary": parsed_itinerary
        }, status=200)

    except Exception as e:
        print("[ERROR]", str(e))
        return JsonResponse({
            "status": "error",
            "message": "An internal server error occurred"
        }, status=500)
@api_view(['GET'])
def get_recent_packages(request, username):
    try:
        # Validate username
        if not username or not isinstance(username, str):
            return JsonResponse({"status": "error", "message": "Invalid username provided"}, status=400)

        # Fetch the user from Firebase
        users = db.child("users").get()
        if not users:
            return JsonResponse({"status": "error", "message": "No users found in system"}, status=404)

        # Find the user
        user_data = None
        for user in users.each():
            if user.val().get("username") == username:
                user_data = user.val()
                break

        if not user_data:
            return JsonResponse({"status": "error", "message": "User not found"}, status=404)

        # Fetch the packages for the user
        packages = user_data.get("packages", [])
        if not packages:
            return JsonResponse({"status": "error", "message": "No packages found for this user"}, status=404)

        # Sort packages based on the index (assuming 'index' is a field in each package)
        sorted_packages = sorted(packages, key=lambda x: x.get("index", 0), reverse=True)

        # Return the recent packages (you can choose how many recent packages you want to return)
        recent_packages = sorted_packages[:5]  # Example: Fetch the 5 most recent packages

        return JsonResponse({
            "status": "success",
            "recentPackages": recent_packages
        }, status=200)

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@api_view(['GET'])
def get_user_profile(request, username):
    try:
        # Validate input
        if not username or not isinstance(username, str):
            return JsonResponse({"status": "error", "message": "Invalid username provided"}, status=400)

        # Fetch users from Firebase
        users = db.child("users").get()
        if not users:
            return JsonResponse({"status": "error", "message": "No users found"}, status=404)

        # Search for user by username
        user_data = None
        for user in users.each():
            if user.val().get("username") == username:
                user_data = user.val()
                break

        if not user_data:
            return JsonResponse({"status": "error", "message": "User not found"}, status=404)

        # Prepare and return the user profile with only the required fields
        profile = {
            "email": user_data.get("email"),
            "username": user_data.get("username"),
            "name": user_data.get("name"),
            "number": user_data.get("phone"),
        }

        return JsonResponse({
            "status": "success",
            "profile": profile
        }, status=200)

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
