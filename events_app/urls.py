import logging

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.db import connection
from django.urls import path, re_path
from rest_framework.authtoken import views
from rest_framework.authtoken.views import obtain_auth_token

from .views import index, EventsListAPI, RegistrationAPI, ClaimCreationAPIView, ProfileAPIView, AppAuthToken

logger = logging.Logger(__name__)


# TODO: перенести в тесты:
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
    path('claim/<int:pk>', index),
    path('new_event', index),

    path('api-token-auth', AppAuthToken.as_view()),
    path('user/<int:pk>', ProfileAPIView.as_view(), name='profile'),
    path('user_sign_up', RegistrationAPI.as_view(), name='user_sign_up'),

    path('events_list', queries_count(EventsListAPI.as_view()), name='events_list'),
    re_path('claim_create', ClaimCreationAPIView.as_view(), name='claim'),
    # re_path('claim_create/(?P<event>\d+)?', ClaimCreationAPIView.as_view(), name='claim'),    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
