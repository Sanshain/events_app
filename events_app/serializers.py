from rest_framework import serializers

from .models import Profile, Event, Action


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = ['username', 'email']


class EventSerializer(serializers.HyperlinkedModelSerializer):
    author = serializers.CharField(source='author.email', read_only=True)
    class Meta:
        model = Event
        fields = ['id', 'name', 'author']


class ActionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Action
        fields = '__all__'
