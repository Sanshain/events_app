from django.http import HttpRequest
from django.shortcuts import render

# Create your views here.
from rest_framework.generics import ListAPIView

from .models import Event
from .serializers import EventSerializer


def index(request: HttpRequest): return render(request, 'index.html', {})


class EventsList(ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
