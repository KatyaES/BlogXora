from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone

from apps.users.models import CustomUser

User = get_user_model()

class Post(models.Model):
    title = models.CharField(max_length=500)
    content = models.TextField()
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    wrapp_img = models.ImageField(upload_to='post_img/', null=True, blank=True)
    cut_img = models.CharField(max_length=255, default='Без темы')
    pub_date = models.DateTimeField(default=timezone.now)
    post_type = models.CharField(max_length=100)
    status = models.TextField(default="published", choices=[("draft","Одобрено"),
                                                            ("published", "На рассмотрении"),
                                                            ("canceled", "Отклонено"),])
    views_count = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment_count = models.IntegerField(default=0)
    liked_by = models.ManyToManyField(User, related_name="liked_by", blank=True)
    bookmark_user = models.ManyToManyField(User, related_name="bookmarks", blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['status']

    @property
    def update_comment_count(self):
        total_reply_count = 0
        for comment in self.comments.all():
            total_reply_count += comment.replies.count()
        self.comment_count = self.comments.count() + total_reply_count
        self.save()
        return total_reply_count + self.comments.count()


class Comment(models.Model):
    description = models.CharField(max_length=2000)
    pub_date = models.DateTimeField(default=timezone.now)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    liked_by = models.ManyToManyField(User, related_name="likedBy", blank=True)
    reply_count = models.IntegerField(default=0)
    bookmarked_by = models.ManyToManyField(User, related_name='bookmarkedBy', blank=True)

    def __str__(self):
        return self.description

    def update_reply_count(self):
        self.reply_count = self.replies.count()
        self.save()


class ReplyComment(models.Model):
    parent = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    description = models.CharField(max_length=2000)
    pub_date = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reply_user')
    liked_by = models.ManyToManyField(User, related_name='reply_liked_by', blank=True)

class Category(models.Model):
    followers = models.ManyToManyField(CustomUser, related_name="category_follows", blank=True)
    description = models.CharField(max_length=1000, default='Nothing', null=True, blank=True)
    cat_title = models.CharField(max_length=255, unique=True)
    image = models.ImageField(upload_to='categories/')

    def __str__(self):
        return self.cat_title

    @property
    def category_follower_count(self):
        return self.category.followers.count()

    @property
    def category(self):
        return Category.objects.get(user=self)
