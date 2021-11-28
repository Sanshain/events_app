from django.http import HttpRequest
from django.shortcuts import render

# Create your views here.
from rest_framework.generics import ListAPIView, GenericAPIView, CreateAPIView
from rest_framework.response import Response

from .models import Event, Action
from .serializers import EventSerializer, CreateUserProfileSerializer, ProfileSerializer, ActionSerializer


def index(request: HttpRequest, *args): return render(request, 'index.html', {})


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


class ClaimCreationAPIView(CreateAPIView):
    queryset = Action.objects.all()
    serializer_class = ActionSerializer

    def post(self, request, *args, **kwargs):
        r = super().post(request, *args, **kwargs)
        return r

