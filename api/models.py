from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.hashers import make_password

class Register(models.Model):
    name = models.CharField(max_length=30, blank=False, null=False)
    email = models.EmailField(unique=True, blank=False, null=False)
    phonenumber = models.BigIntegerField(
        unique=True,
        blank=False,
        null=False,
        validators=[RegexValidator(r'^\d{10}$', message="Phone number must be 10 digits")]
    )
    password = models.CharField(max_length=20, blank=False, null=False)

    def save(self, *args, **kwargs):
        if self.password:
            self.password = make_password(self.password)  # Hash the password before saving
        super(Register, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
