from django.urls import path
from .views import register_user, login_user, get_user_by_email,create_package,get_latest_itinerary,get_recent_packages,get_user_profile,update_user,change_password,get_package_details_by_id,check_active_trips,get_trip_stats,chatbot_view

urlpatterns = [
    path('register/', register_user),
    path('login/', login_user),
    path('get_user/', get_user_by_email),  
    path('save_trip_package/', create_package),
    path('get-latest-itinerary/<str:username>/',get_latest_itinerary),
    path('recent-packages/<str:username>/', get_recent_packages),
    path('profile/<str:username>/',get_user_profile),
    path('update_user/<str:username>/', update_user, name='update_user'),
    path('change-password/<str:username>/', change_password, name='change_password'),
    path('package/<str:username>/<str:package_id>/',get_package_details_by_id, name='get_package_details'),
    path('check-active-trips/<str:username>/', check_active_trips, name='check_active_trips'),
    path('trip-stats/<str:username>/', get_trip_stats, name='get_trip_stats'),
    path('chatbot/',chatbot_view,name='chat_bot')
]
