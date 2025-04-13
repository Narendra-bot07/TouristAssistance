from django.urls import path
from .views import register_user, login_user, get_user_by_email,create_package

urlpatterns = [
    path('register/', register_user),
    path('login/', login_user),
    path('get-user/', get_user_by_email),  
    path('save_trip_package/', create_package, name='save_trip_package'),
]
