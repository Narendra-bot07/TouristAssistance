from django.db import models
from django.core.validators import RegexValidator

class Register(models.Model):
    name = models.CharField(max_length=30,blank=False,null=False)
    username = models.CharField(max_length=40,unique=True,blank=False,null=False)
    password = models.CharField(max_length=20,blank=False,null=False)
    confirm_password = models.CharField(max_length=20,blank=False,null=False)
    email = models.EmailField(unique=True,blank=False,null=False)
    phonenumber = models.BigIntegerField(unique=True,blank=False,null=False,validators=[RegexValidator(r'^\d{10}$', message="Phone number must be 10 digits")])
    def __str__(self):
        return self.username
        

