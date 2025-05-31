from django.contrib import admin
from django.contrib.auth import get_user_model

from blog import settings
from users.models import CustomUser, Subscription, Notifications

User = get_user_model()
admin.site.register(Subscription)
admin.site.register(CustomUser)

admin.site.register(Notifications)
