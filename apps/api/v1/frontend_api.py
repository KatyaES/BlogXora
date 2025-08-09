from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.http import HttpResponse
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.renderers import BrowsableAPIRenderer, JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.serializers import CommentSerializer, PostSerializer, ReplyCommentSerializer, SearchPostSerializer
from apps.api.services.comments import create_comment, delete_comment, set_comment_like, get_comments, \
    create_reply_comment, delete_reply_comment
from apps.api.services.others import add_user_subscription, add_bookmark
from apps.api.services.posts import set_post_like, get_filter_posts
from apps.posts.models import Comment, Post, ReplyComment
from apps.users.models import Subscription

User = get_user_model()

class CommentApiView(APIView):
    def get_renderers(self):
        accept = self.request.META.get('HTTP_ACCEPT', '')
        if ('text/html' in accept and
                self.request.user.is_staff):
            return [BrowsableAPIRenderer()]
        return [JSONRenderer()]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        elif self.request.method == 'DELETE':
            return [IsAuthenticated()]
        return super().get_permissions()

    def post(self, request, pk):
        comment = create_comment(request, pk)

        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, comment_pk):
        delete_comment(request, comment_pk)
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

    def get(self, request, comment_pk):
        comments = get_object_or_404(Comment, id=comment_pk)

        serializer = CommentSerializer(comments, context={'request': request})
        return Response(serializer.data)



class CommentToggleApiView(APIView):
    def get_renderers(self):
        accept = self.request.META.get('HTTP_ACCEPT', '')
        if ('text/html' in accept and
                self.request.user.is_staff):
            return [BrowsableAPIRenderer()]
        return [JSONRenderer()]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        return super().get_permissions()

    def post(self, request, post_pk, comment_pk):
        comment = set_comment_like(request, post_pk, comment_pk)

        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data)

    def get(self, request, post_pk, comment_pk):
        cache_key = f'comment_{comment_pk}'
        cached_comment = cache.get(cache_key)
        if cached_comment:
            data = cached_comment
            print('get comment from cache')
        else:
            comment = get_comments(request, post_pk, comment_pk)
            serializer = CommentSerializer(comment, context={'request': request})
            data = serializer.data
            cache.set(cache_key, data, 60 * 5)
            print('get comment from db')
        return Response(data)


class PostToggleApiView(APIView):
    def get_renderers(self):
        accept = self.request.META.get('HTTP_ACCEPT', '')
        if ('text/html' in accept and
                self.request.user.is_staff):
            return [BrowsableAPIRenderer()]
        return [JSONRenderer()]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        return super().get_permissions()

    def post(self, request, pk):
        set_post_like(request, pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get(self, request, pk):
        cache_key = f'like_{pk}'
        cached_post = cache.get(cache_key)
        if cached_post:
            data = cached_post
        else:
            post = get_object_or_404(Post, id=pk)
            serializer = PostSerializer(post, context={'request': request})
            data = serializer.data
            cache.set(cache_key, data, 60 * 5)
        return Response(data)

class ReplyCommentApiView(APIView):
    def get_renderers(self):
        accept = self.request.META.get('HTTP_ACCEPT', '')
        if ('text/html' in accept and
                self.request.user.is_staff):
            return [BrowsableAPIRenderer()]
        return [JSONRenderer()]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        elif self.request.method == 'DELETE':
            return [IsAuthenticated()]
        return super().get_permissions()

    def post(self, request):
        reply_comment = create_reply_comment(request)

        serializer = ReplyCommentSerializer(reply_comment, context={'request': request})
        return Response(serializer.data)

    def get(self, request, pk):
        reply_comment = get_object_or_404(ReplyComment, id=pk)

        serializer = ReplyCommentSerializer(reply_comment, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, comment_pk):
        delete_reply_comment(request, comment_pk)

        return HttpResponse(status=status.HTTP_204_NO_CONTENT)


class SearchPostsApiView(APIView):
    permission_classes = [AllowAny]

    def get_renderers(self):
        accept = self.request.META.get('HTTP_ACCEPT', '')
        if ('text/html' in accept and
                self.request.user.is_staff):
            return [BrowsableAPIRenderer()]
        return [JSONRenderer()]

    def get(self, request):
        query = request.GET.get('query')
        posts = Post.objects.filter(status__icontains='draft', title__icontains=query)

        serializer = SearchPostSerializer(posts, many=True)
        return Response(serializer.data)


class FollowsApiView(APIView):
    def get_renderers(self):
        accept = self.request.META.get('HTTP_ACCEPT', '')
        if ('text/html' in accept and
                self.request.user.is_staff):
            return [BrowsableAPIRenderer()]
        return [JSONRenderer()]

    def post(self, request, pk):
        result = add_user_subscription(request, pk)
        return Response({'status': result})

    def get(self, request, pk):
        follower_on = User.objects.get(id=pk)
        subscription, created = Subscription.objects.get_or_create(
            user=follower_on,
        )

        if request.user in subscription.followers.all():
            return Response({'status': 'subscribed'})
        return Response({'status': 'not subscribed'})


class BookmarkApiView(APIView):
    def get_renderers(self):
        accept = self.request.META.get('HTTP_ACCEPT', '')
        if ('text/html' in accept and
                self.request.user.is_staff):
            return [BrowsableAPIRenderer()]
        return [JSONRenderer()]

    def post(self, request, pk):
        add_bookmark(request, pk)

        return HttpResponse(status=204)

    def get(self, request, pk):
        cache_key = f'mark_{pk}'
        cached_mark = cache.get(cache_key)
        if cached_mark:
            data = cached_mark
        else:
            post = get_object_or_404(Post, id=pk)
            serializer = PostSerializer(post, context={'request': request})
            data = serializer.data
            cache.set(cache_key, data, 60 * 5)
        return Response(data)


class GetFilterPostsApiView(APIView):
    permission_classes = [AllowAny]
    def get_renderers(self):
        accept = self.request.META.get('HTTP_ACCEPT', '')
        if ('text/html' in accept and
                self.request.user.is_staff):
            return [BrowsableAPIRenderer()]
        return [JSONRenderer()]

    def get(self, request):
        posts = get_filter_posts(request)

        serializer = SearchPostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
