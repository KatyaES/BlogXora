from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver


# User = get_user_model()

class CustomUser(AbstractUser):
    image = models.ImageField(default='profile_pics/default_profile.jpg', upload_to='profile_pics')
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'{self.username}'

    @property
    def follower_count(self):
        return self.subscription.followers.count()

    @property
    def following_count(self):
        return self.subscription.followings.count()

    @property
    def subscription(self):
        return Subscription.objects.get(user=self)

class Subscription(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, null=True)
    followers = models.ManyToManyField(CustomUser, related_name="my_follows", blank=True)
    followings = models.ManyToManyField(CustomUser, related_name="my_followings", blank=True)
