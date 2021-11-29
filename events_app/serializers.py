from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import Profile, Event, Action


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'is_author')


class CreateUserProfileSerializer(ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = super().create(validated_data)
        # user = Profile.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class EventSerializer(serializers.HyperlinkedModelSerializer):

    author = serializers.CharField(source='author.email', read_only=True)
    claimed = serializers.BooleanField(allow_null=True)

    class Meta:
        model = Event
        fields = ['id', 'name', 'author', 'occurring_date', 'is_claim', 'claimed']

    def create(self, validated_data):
        if 'claimed' in validated_data.keys():
            validated_data.pop('claimed')
        event = super().create(validated_data)
        return event


class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Action
        fields = ['event', 'user', 'image']

    def create(self, validated_data):
        action = super().create(validated_data)
        return action

