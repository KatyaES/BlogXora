from rest_framework import serializers

from apps.posts.models import Comment, Post, Category
from apps.users.models import CustomUser


class CommentSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    liked_by = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    is_authenticated = serializers.SerializerMethodField()
    post = serializers.SerializerMethodField()
    post_id = serializers.SerializerMethodField()
    bookmarked_by = serializers.SerializerMethodField()
    set_bookmark = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['description', 'image', 'username', 'pub_date', 'likes',
                  'liked_by', 'id', 'liked', 'is_authenticated', 'post', 'post_id',
                  'bookmarked_by', 'set_bookmark']

    def get_set_bookmark(self, obj):
        request = self.context.get('request')
        return obj.bookmarked_by.filter(id=request.user.id).exists()

    def get_bookmarked_by(self, obj):
        return list(obj.bookmarked_by.values('id', 'username'))

    def get_post_id(self, obj):
        return obj.post.id

    def get_post(self, obj):
        return obj.post.title

    def get_username(self, obj):
        return obj.user.username

    def get_image(self, obj):
        return obj.user.image.url

    def get_likes(self, obj):
        return obj.liked_by.count()

    def get_liked_by(self, obj):
        return list(obj.liked_by.values('id', 'username'))

    def get_liked(self, obj):
        request = self.context.get('request')
        return obj.liked_by.filter(id=request.user.id).exists()

    def get_is_authenticated(self, obj):
        request = self.context.get('request')
        return request.user.is_authenticated

class PostSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    is_authenticated = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()
    bookmark_count = serializers.SerializerMethodField()
    set_bookmark = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['likes', 'liked', 'is_authenticated', 'user_id', 'bookmark_count', 'set_bookmark']


    def get_bookmark_count(self, obj):
        return obj.bookmark_user.count()

    def get_set_bookmark(self, obj):
        request = self.context.get('request')
        return obj.bookmark_user.filter(id=request.user.id).exists()

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



class SearchPostSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    wrapp_img = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    tag = serializers.SerializerMethodField()


    class Meta:
        model = Post
        fields = ['title', 'content', 'category', 'pub_date', 'views_count',
                  'user', 'comment_count', 'liked_by', 'image', 'wrapp_img',
                  'id', 'user_id', 'bookmark_user', 'post_type', 'tag']


    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_tag(self, obj):
        return obj.category.tag

    def get_user_id(self, obj):
        return obj.user.id

    def get_category(self, obj):
        return obj.category.cat_title

    def get_user(self, obj):
        return obj.user.username

    def get_image(self, obj):
        return obj.user.image.url

    def get_wrapp_img(self, obj):
        if obj.wrapp_img and hasattr(obj.wrapp_img, 'url'):
            return obj.wrapp_img.url
        return None

class UserSubscriptionSerializer(serializers.ModelSerializer):
    followers = serializers.SerializerMethodField()
    followings = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'followers', 'followings', 'username']

    def get_followers(self, obj):
        request = self.context.get('request')
        return [{'username': object.user.username,
                 'image': object.user.image.url,
                 'id': object.user.id} for object in obj.my_followers.all() if object.user != request.user]

    def get_followings(self, obj):
        request = self.context.get('request')
        return [{'username': object.user.username,
                 'image': object.user.image.url,
                 'id': object.user.id} for object in obj.my_followings.all() if object.user != request.user]


class PublicPostsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class PublicCommentsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class PublicCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class PublicUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['url', 'id', 'username', 'bio', 'email', 'image']
