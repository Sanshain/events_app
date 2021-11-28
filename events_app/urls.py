from django.contrib import admin
from django.urls import path

from events_preoject.events_app.views import index

urlpatterns = [
    path('', index, name='main')
]
