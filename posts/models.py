from ckeditor.fields import RichTextField
from ckeditor_uploader.fields import RichTextUploadingField
from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone

from users.models import CustomUser
User = get_user_model()

class Post(models.Model):
    title = models.CharField(max_length=500)
    content = models.TextField()
    category = models.CharField(max_length=100)
    wrapp_img = models.ImageField(upload_to='post_img/', null=True)
    cut_img = models.CharField(max_length=255, default='Без темы')
    pub_date = models.DateTimeField(default=timezone.now)
    status = models.TextField(default="published", choices=[("draft","Одобрено"),
                                                            ("published", "На рассмотрении"),
                                                            ("canceled", "Отклонено"),])
    views_count = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment_count = models.IntegerField(default=0)
    liked_by = models.ManyToManyField(User, related_name="liked_by")

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['status']

    def update_comment_count(self):
        total_reply_count = 0
        for comment in self.comments.all():
            total_reply_count += comment.replies.count()
        self.comment_count = self.comments.count() + total_reply_count
        self.save()
        return total_reply_count, self.comments.count()


class Comment(models.Model):
    description = models.CharField(max_length=2000)
    pub_date = models.DateTimeField(default=timezone.now)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    liked_by = models.ManyToManyField(User, related_name="likedBy", default='none')
    reply_count = models.IntegerField(default=0)

    def update_reply_count(self):
        self.reply_count = self.replies.count()
        self.save()


class ReplyComment(models.Model):
    parent = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    description = models.CharField(max_length=2000)
    pub_date = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reply_user')
    liked_by = models.ManyToManyField(User, default='none', related_name='reply_liked_by')
