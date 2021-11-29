from django.contrib import admin

# Register your models here.
from django.db.models import QuerySet

from .models import Profile, Event, Action


@admin.register(Profile)
class BookAdmin(admin.ModelAdmin):
    search_fields = ['username', 'first_name', 'last_name']
    list_display = ['username', 'is_author']


@admin.register(Event)
class BookAdmin(admin.ModelAdmin):
    ordering = ['occurring_date']
    search_fields = ['name']
    list_display = ['name', 'occurring_date']


@admin.register(Action)
class BookAdmin(admin.ModelAdmin):
    list_display = ['action', 'id', 'date']
    autocomplete_fields = ['user', 'event']

    def get_queryset(self, request):
        r: QuerySet = super().get_queryset(request).select_related()
        return r

    def action(self, obj: Action):
        return f'`{obj.user.username}` joined to `{obj.event.name}`'
