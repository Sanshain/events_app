from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class Profile(AbstractUser):
    is_author = models.BooleanField(default=False)


class Event(models.Model):
    name = models.CharField(max_length=50)

    date_of_creation = models.DateField()
    occurring_date = models.DateField()
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)


class Action(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
