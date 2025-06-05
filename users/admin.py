from django.contrib import admin
from django.contrib.auth import get_user_model

from blog import settings
from users.models import CustomUser, Subscription, Notifications

User = get_user_model()
admin.site.register(Subscription)

@admin.register(User)
class ReplyCommentAdmin(admin.ModelAdmin):
	list_display = ['id', 'username']

admin.site.register(Notifications)
