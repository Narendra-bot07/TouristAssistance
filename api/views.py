from django.http import JsonResponse
from rest_framework.decorators import api_view
import pyrebase
from rest_framework import status
from rest_framework.response import Response
from datetime import datetime,date
import googlemaps
import google.generativeai as genai
import requests
import json
import re
from dateutil.relativedelta import relativedelta
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

firebase = pyrebase.initialize_app(firebaseConfig)
db = firebase.database()
auth = firebase.auth()

GEMINI_API_KEY = "AIzaSyAYhGvML3XNS2k3O47wyqTx7FBf6Kjut1s"  # Removed trailing dot
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
        dob_str = data.get('dob')  # Get DOB as string

        # ✅ Debug Field Values
        print("[DEBUG] username:", username)
        print("[DEBUG] name:", name)
        print("[DEBUG] email:", email)
        print("[DEBUG] phone:", phone)
        print("[DEBUG] password:", password)
        print("[DEBUG] confirm_password:", confirm_password)
        print("[DEBUG] dob:", dob_str)

        # ✅ Check all fields are present and not empty
        required_fields = [username, name, email, phone, password, confirm_password, dob_str]
        if any(field is None or str(field).strip() == '' for field in required_fields):
            return JsonResponse({"status": "error", "message": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Validate date format and calculate age
        try:
            dob = datetime.strptime(dob_str, '%Y-%m-%d').date()
            today = date.today()
            age = relativedelta(today, dob).years
            
            # Validate minimum age (example: 13 years)
            if age < 13:
                return JsonResponse({
                    "status": "error",
                    "message": "You must be at least 13 years old to register"
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except ValueError:
            return JsonResponse({
                "status": "error",
                "message": "Invalid date format. Use YYYY-MM-DD"
            }, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Password match check
        if password.strip() != confirm_password.strip():
            return JsonResponse({
                "status": "error",
                "message": "Passwords do not match"
            }, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Check if user exists
        users = db.child("users").get()
        if users.val() is not None:
            for user in users.each():
                user_data = user.val()
                if user_data.get("email") == email:
                    return JsonResponse({
                        "status": "error",
                        "message": "Email already registered"
                    }, status=status.HTTP_400_BAD_REQUEST)
                if user_data.get("phone") == phone:
                    return JsonResponse({
                        "status": "error",
                        "message": "Phone number already registered"
                    }, status=status.HTTP_400_BAD_REQUEST)
                if user_data.get("username") == username:
                    return JsonResponse({
                        "status": "error",
                        "message": "Username already taken"
                    }, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Save new user with age
        result = db.child("users").push({
            "username": username,
            "name": name,
            "email": email,
            "phone": phone,
            "password": password,  # ❗ Remember to hash in production!
            "dob": dob_str,
            "age": age,  # Store calculated age
            "created_at": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat()
        })

        print("[DEBUG] Firebase push result:", result)
        return JsonResponse({
            "status": "success",
            "message": "User registered successfully",
            "data": {
                "username": username,
                "email": email,
                "age": age
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("[ERROR]", str(e))
        return JsonResponse({
            "status": "error",
            "message": "Registration failed",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def login_user(request):
    print("[DEBUG] Login endpoint hit.")
    if request.method == 'POST':
        try:
            data = request.data
            print("[DEBUG] Received data:", data)

            identifier = data.get('identifier')  
            password = data.get('password')

            if not identifier or not password:
                return JsonResponse({"status": "error", "message": "Identifier and password are required"}, status=status.HTTP_400_BAD_REQUEST)

            # ✅ Fetch all users
            users = db.child("users").get()
            if users.val() is None:
                return JsonResponse({"status": "error", "message": "No users found in the database"}, status=status.HTTP_404_NOT_FOUND)

            for user in users.each():
                user_data = user.val()
                if (user_data.get("email") == identifier or user_data.get("username") == identifier) and user_data.get("password") == password:
                    print("[DEBUG] User authenticated successfully.")
                    return JsonResponse({
                        "status": "success",
                        "message": "Login successful",
                        "email": user_data.get("email"),
                        "username": user_data.get("username"),
                        "name": user_data.get("name")
                    }, status=status.HTTP_200_OK)

            print("[DEBUG] No matching user found.")
            return JsonResponse({"status": "error", "message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("[ERROR]", str(e))
            return JsonResponse({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_user_by_email(request):
    email = request.GET.get('email')
    if not email:
        return JsonResponse({"status": "error", "message": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        users = db.child("users").get()

        if users.val() is None:
            return JsonResponse({"status": "error", "message": "No users found in the database"}, status=status.HTTP_404_NOT_FOUND)

        for user in users.each():
            data = user.val()
            if data.get("email") == email:
                return JsonResponse({"status": "success", "name": data.get("name")}, status=status.HTTP_200_OK)

        return JsonResponse({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from uuid import uuid4  # 🆕 ADDED for unique ID generation
from datetime import datetime
import json
import re
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import JsonResponse

@api_view(['POST'])
def create_package(request):
    print("[DEBUG] Create Package endpoint hit.")

    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)

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
            }, status=status.HTTP_400_BAD_REQUEST)

        # 🔄 Fix Date Format & Compute Duration
        def fix_year(year): 
            return '20' + year if len(year) == 2 else year
            
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
            }, status=status.HTTP_400_BAD_REQUEST)

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
        print("[DEBUG] Sent prompt to Gemini:", prompt)

        # Generate response
        gemini_response = model.generate_content(prompt)
        response_text = gemini_response.text
        print("[DEBUG] Gemini raw response:", response_text)

        try:
            clean_response = re.sub(r'```json|```', '', response_text).strip()
            itinerary = json.loads(clean_response)
            print("[DEBUG] Successfully parsed itinerary.")
        except json.JSONDecodeError as e:
            print("[ERROR] Failed to parse Gemini response:", e)
            try:
                json_start = response_text.find('[')
                json_end = response_text.rfind(']') + 1
                if json_start != -1 and json_end != -1:
                    clean_response = response_text[json_start:json_end]
                    itinerary = json.loads(clean_response)
                else:
                    raise ValueError("No valid JSON found in response")
            except Exception as e2:
                print("[ERROR] Secondary parsing failed:", e2)
                return JsonResponse({
                    "status": "error",
                    "message": "Failed to parse itinerary JSON",
                    "raw_response": response_text
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 🆕 Generate Unique Package ID
        package_id = str(uuid4())
        print(f"[DEBUG] Generated Package ID: {package_id}")

        # 🔥 Save to Firebase
        users = db.child("users").get()
        if users.val() is None:
            return JsonResponse({"status": "error", "message": "No users found in database"}, status=status.HTTP_404_NOT_FOUND)

        user_found = False
        for user in users.each():
            user_data = user.val()
            if user_data.get("username") == username:
                user_packages = user_data.get("packages", [])
                user_packages.append({
                    "package_id": package_id, 
                    "input": user_input,
                    "itinerary": itinerary
                })
                db.child("users").child(user.key()).update({"packages": user_packages})
                print("[DEBUG] Successfully saved itinerary for user:", username)
                user_found = True
                break

        if not user_found:
            return JsonResponse({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        return JsonResponse({
            "status": "success",
            "packageID": package_id,
            "packageDetails": user_input,
            "itinerary": itinerary
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("[ERROR] Exception occurred:", str(e))
        return JsonResponse({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_latest_itinerary(request, username):
    try:
        # Validate input
        if not username or not isinstance(username, str):
            return JsonResponse({
                "status": "error",
                "message": "Invalid username provided"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Fetch all users
        users = db.child("users").get()
        if not users:
            return JsonResponse({
                "status": "error",
                "message": "No users found in system"
            }, status=status.HTTP_404_NOT_FOUND)

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
            }, status=status.HTTP_404_NOT_FOUND)

        # Get packages list
        packages = user_data.get("packages", [])
        if not packages:
            return JsonResponse({
                "status": "error",
                "message": "No itineraries found for this user"
            }, status=status.HTTP_404_NOT_FOUND)

        # Get latest package based on index
        latest_package = packages[-1]

        # Parse itinerary only if it's a string
        itinerary = latest_package.get("itinerary")
        if isinstance(itinerary, str):
            try:
                cleaned_str = re.sub(r'```json|```', '', itinerary).strip()
                parsed_itinerary = json.loads(cleaned_str)
            except Exception as e:
                print("[ERROR] Failed to parse itinerary string:", e)
                return JsonResponse({
                    "status": "error",
                    "message": "Itinerary parsing failed. Invalid format."
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            parsed_itinerary = itinerary

        return JsonResponse({
            "status": "success",
            "packageDetails": latest_package.get("input"),
            "itinerary": parsed_itinerary
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print("[ERROR]", str(e))
        return JsonResponse({
            "status": "error",
            "message": "An internal server error occurred"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_recent_packages(request, username):
    try:
        # Validate username
        if not username or not isinstance(username, str):
            return JsonResponse({"status": "error", "message": "Invalid username provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the user from Firebase
        users = db.child("users").get()
        if not users:
            return JsonResponse({"status": "error", "message": "No users found in system"}, status=status.HTTP_404_NOT_FOUND)

        # Find the user
        user_data = None
        for user in users.each():
            if user.val().get("username") == username:
                user_data = user.val()
                break

        if not user_data:
            return JsonResponse({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the packages for the user
        packages = user_data.get("packages", [])
        if not packages:
            return JsonResponse({"status": "error", "message": "No packages found for this user"}, status=status.HTTP_404_NOT_FOUND)

        # Return the most recent packages (last 5)
        recent_packages = packages[-5:] if len(packages) > 5 else packages

        return JsonResponse({
            "status": "success",
            "recentPackages": recent_packages
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_user_profile(request, username):
    try:
        # Validate input
        if not username or not isinstance(username, str):
            return JsonResponse({"status": "error", "message": "Invalid username provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch users from Firebase
        users = db.child("users").get()
        if not users:
            return JsonResponse({"status": "error", "message": "No users found"}, status=status.HTTP_404_NOT_FOUND)

        # Search for user by username
        user_data = None
        for user in users.each():
            if user.val().get("username") == username:
                user_data = user.val()
                break

        if not user_data:
            return JsonResponse({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Prepare and return the user profile with only the required fields
        profile = {
            "email": user_data.get("email"),
            "username": user_data.get("username"),
            "name": user_data.get("name"),
            "number": user_data.get("phone"),
            "dob": user_data.get("dob"),
            "age": user_data.get("age")
        }

        return JsonResponse({
            "status": "success",
            "profile": profile
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def update_user(request, username):
    print("[DEBUG] Update endpoint hit.")
    try:
        # Get the data from the request
        data = request.data
        print("[DEBUG] Received data:", data)

        name = data.get('name')
        email = data.get('email')
        phone = data.get('phoneNumber')
        dob = data.get('dob')  # Date of Birth

        # ✅ Debug Field Values
        print("[DEBUG] name:", name)
        print("[DEBUG] email:", email)
        print("[DEBUG] phone:", phone)
        print("[DEBUG] dob:", dob)

        # ✅ Check all fields are present and not empty
        required_fields = [name, email, phone, dob]
        if any(field is None or str(field).strip() == '' for field in required_fields):
            print("[DEBUG] Missing required fields.")
            return JsonResponse({"status": "error", "message": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Calculate age from DOB
        try:
            dob_date = datetime.strptime(dob, '%Y-%m-%d')  # Assuming dob is in 'YYYY-MM-DD' format
            today = datetime.today()
            age = today.year - dob_date.year - ((today.month, today.day) < (dob_date.month, dob_date.day))
            print("[DEBUG] Age calculated:", age)
        except Exception as e:
            print("[ERROR] Error calculating age:", str(e))
            return JsonResponse({"status": "error", "message": "Invalid date format for DOB"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Check if username exists in the database
        print("[DEBUG] Checking if user exists in the database for username:", username)
        user_ref = db.child("users").order_by_child("username").equal_to(username).get()

        if user_ref.val() is None:
            print("[DEBUG] User not found in the database.")
            return JsonResponse({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # ✅ Update user details in the database
        print("[DEBUG] Updating user details in Firebase...")
        user_key = list(user_ref.val().keys())[0]  # Get the user key for the matching username

        # Updating the user data in Firebase
        db.child("users").child(user_key).update({
            "name": name,
            "email": email,
            "phone": phone,
            "dob": dob,
            "age": age,
        })

        # Success response
        return JsonResponse({"status": "success", "message": "User updated successfully"}, status=status.HTTP_200_OK)

    except Exception as e:
        print("[ERROR] Exception occurred:", str(e))
        return JsonResponse({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def change_password(request, username):
    print("[DEBUG] Change password endpoint hit.")
    try:
        # Get the data from the request
        data = request.data
        print("[DEBUG] Received data:", data)

        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')

        # ✅ Debug Field Values
        print("[DEBUG] current_password:", current_password)
        print("[DEBUG] new_password:", new_password)

        # ✅ Check if fields are present and not empty
        if not current_password or not new_password:
            print("[DEBUG] Missing current or new password.")
            return JsonResponse({"status": "error", "message": "Current and new password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Check if new password is the same as the current password
        if current_password == new_password:
            print("[DEBUG] New password is the same as the current password.")
            return JsonResponse({"status": "error", "message": "New password shouldn't be the same as the old password"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Check if new password is strong enough
        if len(new_password) < 6:
            print("[DEBUG] New password too short.")
            return JsonResponse({"status": "error", "message": "New password must be at least 6 characters"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Check if username exists in the database
        print("[DEBUG] Checking if user exists in the database for username:", username)
        user_ref = db.child("users").order_by_child("username").equal_to(username).get()

        if user_ref.val() is None:
            print("[DEBUG] User not found in the database.")
            return JsonResponse({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # ✅ Fetch current password from the user's data
        user_data = list(user_ref.val().values())[0]
        stored_password = user_data.get("password")

        # ✅ Compare current password with stored password
        if current_password != stored_password:
            print("[DEBUG] Current password does not match stored password.")
            return JsonResponse({"status": "error", "message": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Update password
        print("[DEBUG] Updating password within the user document in Firebase...")
        db.child("users").child(list(user_ref.val().keys())[0]).update({
            "password": new_password,
        })

        return JsonResponse({"status": "success", "message": "Password updated successfully"}, status=status.HTTP_200_OK)

    except Exception as e:
        print("[ERROR] Exception occurred:", str(e))
        return JsonResponse({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
def get_package_details_by_id(request, username, package_id):
    try:
        print("[DEBUG] Received request for username:", username)
        print("[DEBUG] Received package_id:", package_id)

        # Fetch all users from Firebase
        users = db.child("users").get()

        if not users:
            print("[ERROR] No users found in the database")
            return JsonResponse({
                "status": "error",
                "message": "No users found in the system"
            }, status=status.HTTP_404_NOT_FOUND)

        # Find the user by username
        user_data = None
        for user in users.each():
            if user.val().get("username") == username:
                user_data = user.val()
                break

        if not user_data:
            print(f"[ERROR] User with username {username} not found")
            return JsonResponse({
                "status": "error",
                "message": "User not found"
            }, status=status.HTTP_404_NOT_FOUND)

        print(f"[DEBUG] User data found: {user_data}")

        # Get the packages list for the user
        packages = user_data.get("packages", [])
        if not packages:
            print(f"[ERROR] No packages found for user {username}")
            return JsonResponse({
                "status": "error",
                "message": "No packages found for this user"
            }, status=status.HTTP_404_NOT_FOUND)

        # Search for the specific package by ID
        package = None
        for pkg in packages:
            if pkg.get("package_id") == package_id:
                package = pkg
                break

        if not package:
            print(f"[ERROR] Package with ID {package_id} not found")
            return JsonResponse({
                "status": "error",
                "message": "Package not found"
            }, status=status.HTTP_404_NOT_FOUND)

        # Return the package details
        return JsonResponse({
            "status": "success",
            "package": package
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print("[ERROR] Exception occurred:", str(e))
        return JsonResponse({
            "status": "error",
            "message": "An internal server error occurred"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
