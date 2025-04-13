from django.contrib import admin
from .models import Register

@admin.register(Register)
class RegisterAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phonenumber')  # Customize what fields to display in the admin list
    search_fields = ('name', 'email')  # Add search functionality for name and email
    list_filter = ('name', 'email')  # Add filter options for name and email
