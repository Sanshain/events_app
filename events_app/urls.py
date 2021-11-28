import logging

from django.contrib import admin
from django.db import connection
from django.urls import path
from rest_framework.authtoken import views

from .views import index, EventsListAPI, RegistrationAPI

logger = logging.Logger(__name__)


def queries_count(func):
    def proxy(*args, **kwargs):        
        r = func(*args, **kwargs)
        queries_cnt = len(connection.queries)
        logger.debug(f'{func}: {queries_cnt} queries')
        return r
    return proxy


urlpatterns = [
    path('', index, name='main'),
    path('login', index),
    path('claim', index),

    path('api-token-auth', views.obtain_auth_token),
    path('events_list', queries_count(EventsListAPI.as_view()), name='events_list'),
    path('user_sign_up', RegistrationAPI.as_view(), name='user_sign_up'),
]
