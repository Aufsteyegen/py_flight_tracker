# your_app/tasks.py

from celery import shared_task
from django.core.mail import send_mail 
from .models import YourModel

@shared_task
def scan_database_and_notify():
    data_to_notify = YourModel.objects.filter(your_conditions_here)

    for item in data_to_notify:
        send_mail(
            'Sky Journal - Notification',
            'Notification Message',
            'from@example.com',
            [item.email],
            fail_silently=False,
        )
