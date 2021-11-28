from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
from django.db.models import QuerySet


class Profile(AbstractUser):

    objects: QuerySet

    is_author = models.BooleanField(default=False)


class Event(models.Model):

    objects: QuerySet

    name = models.CharField(max_length=50)
    date_of_creation = models.DateField(auto_now=True)
    occurring_date = models.DateField()
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)

    __str__ = lambda self: self.name


class Action(models.Model):
    objects: QuerySet

    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
