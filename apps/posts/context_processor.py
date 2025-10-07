from django.shortcuts import render

from apps.users.models import Notifications


def notification_processor(request):
    if request.user.is_authenticated:
        notification_count = Notifications.notification_count(request.user)
        notifications = Notifications.objects.filter(user=request.user).order_by('-date')
    else:
        notification_count = ''
        notifications = Notifications.objects.none()
    return {
        'notifications': notifications,
        'notification_count': notification_count
    }
