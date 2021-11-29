import binascii
import os
import uuid
from datetime import timedelta

import django_rq
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.mail import EmailMessage, send_mail
from django.db.models import Exists, OuterRef
from django.http import HttpRequest
from django.shortcuts import render

# Create your views here.
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.generics import ListAPIView, GenericAPIView, CreateAPIView, RetrieveAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Event, Action, Profile
from .serializers import EventSerializer, CreateUserProfileSerializer, ProfileSerializer, ActionSerializer
from ..events_preoject.task import push_notification


def index(request: HttpRequest, *args): return render(request, 'index.html', {})


class EventsListAPI(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EventSerializer
    # filter_backends = [DjangoFilterBackend]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ['occurring_date']
    search_fields = ['name']

    def get_queryset(self):
        qs = Event.objects.all()
        qs = qs.annotate(
            claimed=Exists(Action.objects.filter(user=self.request.user, event=OuterRef('pk')))
        )
        return qs

    def post(self, request, *args, **kwargs):
        if self.request.user.is_author:
            kwargs['author'] = request.user.id
        r = super().post(request, *args, **kwargs)
        return r

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ProfileAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class AppAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'is_author': user.is_author,
        })


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
    permission_classes = [IsAuthenticated]
    queryset = Action.objects.all()
    serializer_class = ActionSerializer

    def post(self, request, *args, **kwargs):
        request.data['user'] = str(request.user.id)
        image = request.data.get('image')
        if image:
            request.data.pop('image')
            if 'base64' in image[:22]:
                header, image = image.split('base64,')
                raw_bytes = binascii.a2b_base64(image)  # base64.b64decodese
                ext = header.split('/')[1].split(';')[0]
                request.data['image'] = ContentFile(
                    raw_bytes, name=os.path.join(
                        settings.MEDIA_ROOT, uuid.uuid4().hex + '.' + ext  # os.path.abspath(os.curdir)
                    )
                )
        r = super().post(request, *args, **kwargs)
        # send:
        selected_event: Event = Event.objects.select_related('author').get(pk=request.data.get('event'))

        # email = EmailMessage( 'New claim', f'New claim from {self.request.user.username} ({
        # self.request.user.email})', to=[selected_event.author.email] ) email.send()

        send_mail(
            'New claim',
            f'New claim from {self.request.user.username} ({self.request.user.email})',
            settings.EMAIL_HOST_USER.strip(),
            [selected_event.author.email]
        )

        scheduler = django_rq.get_scheduler('default')
        job = scheduler.enqueue_at(
            selected_event.date_of_creation + timedelta(days=-1), push_notification, selected_event.id
        )

        return r
