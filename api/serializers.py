from django.template.context_processors import request
from rest_framework import routers, serializers

from posts.models import Comment, Post, ReplyComment


class CommentSerializer(serializers.ModelSerializer):
    description = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    liked_by = serializers.SerializerMethodField()
    pub_date = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    is_authenticated = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['description', 'image', 'username', 'pub_date', 'likes',
                  'liked_by', 'id', 'liked', 'is_authenticated']

    def get_description(self, obj):
        return obj.description

    def get_pub_date(self, obj):
        return obj.pub_date

    def get_username(self, obj):
        return obj.user.username

    def get_image(self, obj):
        return obj.user.image.url

    def get_likes(self, obj):
        return obj.liked_by.count()

    def get_id(self, obj):
        return obj.id

    def get_liked_by(self, obj):
        return list(obj.liked_by.values('id', 'username'))

    def get_liked(self, obj):
        request = self.context.get('request')
        print(request)
        return obj.liked_by.filter(id=request.user.id).exists()

    def get_is_authenticated(self, obj):
        request = self.context.get('request')
        return request.user.is_authenticated


class PostSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    is_authenticated = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['likes', 'liked', 'is_authenticated', 'user_id']

    def get_likes(self, obj):
        return obj.liked_by.count()

    def get_liked(self, obj):
        request = self.context.get('request')
        return obj.liked_by.filter(id=request.user.id).exists()

    def get_is_authenticated(self, obj):
        request = self.context.get('request')
        return request.user.is_authenticated

    def get_user_id(self, obj):
        request = self.context.get('request')
        return request.user.id


class ReplyCommentSerializer(serializers.ModelSerializer):
    description = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    liked_by = serializers.SerializerMethodField()
    pub_date = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    is_authenticated = serializers.SerializerMethodField()

    class Meta:
        model = ReplyComment
        fields = ['description', 'image', 'username', 'pub_date', 'likes',
                  'liked_by', 'id', 'liked', 'is_authenticated']

    def get_description(self, obj):
        return obj.description

    def get_pub_date(self, obj):
        return obj.pub_date

    def get_username(self, obj):
        return obj.user.username

    def get_image(self, obj):
        return obj.user.image.url

    def get_likes(self, obj):
        return obj.liked_by.count()

    def get_id(self, obj):
        return obj.id

    def get_liked_by(self, obj):
        return list(obj.liked_by.values('id', 'username'))

    def get_liked(self, obj):
        request = self.context.get('request')
        return obj.liked_by.filter(id=request.user.id).exists()

    def get_is_authenticated(self, obj):
        request = self.context.get('request')
        return request.user.is_authenticated


class SearchPostSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    pub_date = serializers.SerializerMethodField()
    views_count = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    liked_by = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    wrapp_img = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['title', 'content', 'category', 'pub_date', 'views_count',
                  'user', 'comment_count', 'liked_by', 'image', 'wrapp_img',
                  'id']

    def get_title(self, obj):
        return obj.title

    def get_content(self, obj):
        return obj.content

    def get_category(self, obj):
        return obj.category

    def get_pub_date(self, obj):
        return obj.pub_date

    def get_views_count(self, obj):
        return obj.views_count

    def get_user(self, obj):
        return obj.user.username

    def get_comment_count(self, obj):
        return obj.comment_count

    def get_liked_by(self, obj):
        return list(obj.liked_by.values('id', 'username'))

    def get_image(self, obj):
        return obj.user.image.url

    def get_wrapp_img(self, obj):
        return obj.wrapp_img.url

    def get_id(self, obj):
        return obj.id