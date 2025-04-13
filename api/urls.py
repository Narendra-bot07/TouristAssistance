from django.urls import path
from .views import register_user, login_user, get_user_by_email,create_package,get_latest_itinerary,get_recent_packages

urlpatterns = [
    path('register/', register_user),
    path('login/', login_user),
    path('get_user/', get_user_by_email),  
    path('save_trip_package/', create_package, name='save_trip_package'),
    path('get-latest-itinerary/<str:username>/',get_latest_itinerary, name='get_latest_itinerary'),
    path('recent-packages/<str:username>/', get_recent_packages, name='get_recent_packages'),

]
