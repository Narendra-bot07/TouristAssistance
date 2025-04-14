from django.urls import path
from .views import register_user, login_user, get_user_by_email,create_package,get_latest_itinerary,get_recent_packages,get_user_profile,update_user,change_password

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

]
