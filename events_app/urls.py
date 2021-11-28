import logging

from django.contrib import admin
from django.db import connection
from django.urls import path

from .views import index, EventsList


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
    path('events_list', queries_count(EventsList.as_view()), name='events_list'),
]
