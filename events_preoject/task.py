from datetime import datetime, timedelta

import django_rq
from django.conf import settings
from django.core.mail import send_mail

from ..events_app.models import Event, Action

scheduler = django_rq.get_scheduler('default')


def push_notification(action: Action):

    send_mail(
        'The event is coming soon',
        f'My friend, {action.user.username}, {action.event.name}  is coming soon!',
        settings.EMAIL_HOST_USER.strip(),
        [action.user.email]
    )


# def push_notification(event_id):
#     event: Event = Event.objects.filter(pk=event_id)
#     actions = Action.objects.filter(event=event).select_related('user')
#     for action in actions:
#         send_mail(
#             'The event is coming soon',
#             f'My friend, {action.user.username}, {event.name}  is coming soon!',
#             settings.EMAIL_HOST_USER.strip(),
#             [action.user.email]
#         )
#
#
# def reminder():
#     events = Event.objects.filter(date_of_creation__gt=datetime.now() + timedelta(days=1))
#     for event in events:
#         job = scheduler.enqueue_at(event.date_of_creation + timedelta(days=-1), push_notification, event.id)
