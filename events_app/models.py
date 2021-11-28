from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
from django.db.models import QuerySet
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class Profile(AbstractUser):

    objects: QuerySet

    is_author = models.BooleanField(default=False)


class Event(models.Model):

    objects: QuerySet

    name = models.CharField(max_length=50)
    date_of_creation = models.DateField(auto_now=True)
    occurring_date = models.DateField()
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    is_claim = models.BooleanField(default=False)

    __str__ = lambda self: self.name


class Action(models.Model):
    objects: QuerySet

    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    image = models.ImageField(null=True)


# SIGNALS:


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
