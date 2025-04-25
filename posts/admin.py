from django.contrib import admin

from posts.models import Post, Comment

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
	exclude = ('liked_by',)
	list_display = ['title', 'category', 'pub_date', 'status']
	list_filter = ['category', 'pub_date', 'status']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
	exclude = ('liked_by',)
	list_display = ['description', 'pub_date', 'post', 'user']

