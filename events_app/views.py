from django.http import HttpRequest
from django.shortcuts import render

# Create your views here.
from rest_framework.generics import ListAPIView, GenericAPIView
from rest_framework.response import Response

from .models import Event
from .serializers import EventSerializer, CreateUserProfileSerializer, ProfileSerializer


def index(request: HttpRequest): return render(request, 'index.html', {})


class EventsListAPI(ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class RegistrationAPI(GenericAPIView):
    serializer_class = CreateUserProfileSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": ProfileSerializer(user, context=self.get_serializer_context()).data,
        })
