from enum import unique

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.serializers import serialize
from django.http import HttpResponse
from rest_framework import status, viewsets
from rest_framework.decorators import action
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
from apps.api.utils.pagination import LargeResultsSetPagination
from apps.posts.models import Comment, Post, ReplyComment
from apps.posts.services import create_post
from apps.users.models import Subscription

User = get_user_model()

class CommentViewSet(viewsets.ModelViewSet):
    def get_renderers(self):
        accept = self.request.META.get('HTTP_ACCEPT', '')
        if ('text/html' in accept and
                self.request.user.is_staff):
            return [BrowsableAPIRenderer()]
        return [JSONRenderer()]

    def get_permissions(self):
        if self.action in ['retrieve', 'list']:
            return [AllowAny()]
        elif self.action in ['create', 'destroy']:
            return [IsAuthenticated()]
        return super().get_permissions()

    @action(detail=True, methods=['get'])
    def set_like(self, request, pk):
        comment = set_comment_like(request, pk)

        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        post_pk = request.data.get('post')
        comment = create_comment(request, post_pk)
        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        comment_pk = kwargs.get('pk')
        delete_comment(request, comment_pk)
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

    def retrieve(self, request, *args, **kwargs):
        comment_pk = kwargs.get('pk')
        comments = get_object_or_404(Comment, id=comment_pk)
        serializer = CommentSerializer(comments, context={'request': request})
        return Response(serializer.data)


class PostViewSet(viewsets.ModelViewSet):
    pagination_class = LargeResultsSetPagination

    def get_renderers(self):
        accept = self.request.META.get('HTTP_ACCEPT', '')
        if ('text/html' in accept and
                self.request.user.is_staff):
            return [BrowsableAPIRenderer()]
        return [JSONRenderer()]

    def get_permissions(self):
        if self.action in ['retrieve', 'list']:
            return [AllowAny()]
        elif self.action in ['create', 'destroy']:
            return [IsAuthenticated()]
        return super().get_permissions()

    @action(detail=True, methods=['get'])
    def set_like(self, request, pk):
        post = set_post_like(request, pk)
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """
        Return one post
        """
        post_pk = kwargs.get('pk')
        post = get_object_or_404(Post, id=post_pk)
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Create post
        """
        return create_post(request)

    def list(self, request, *args, **kwargs):
        filter_name = request.GET.get('filter')
        if filter_name == 'Свежее':
            filter_name = '-pub_date'
        elif filter_name == 'Популярное':
            filter_name = '-views_count'
        elif filter_name == 'Обсуждаемое':
            filter_name = '-comment_count'
        else:
            filter_name = '-pub_date'

        queryset = Post.objects.order_by(filter_name).distinct()[2:]

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = SearchPostSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)


class ReplyCommentViewSet(viewsets.ModelViewSet):
    def get_renderers(self):
        accept = self.request.META.get('HTTP_ACCEPT', '')
        if ('text/html' in accept and
                self.request.user.is_staff):
            return [BrowsableAPIRenderer()]
        return [JSONRenderer()]

    def get_permissions(self):
        if self.action in ['retrieve', 'list']:
            return [AllowAny()]
        elif self.action in ['create', 'destroy']:
            return [IsAuthenticated()]
        return super().get_permissions()

    @action(detail=True, methods=['get'])
    def set_like(self, request, pk):
        comment = set_comment_like(request, pk)

        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        comment = create_reply_comment(request)
        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        comment_pk = kwargs.get('pk')
        parent_pk = request.data.get('parent_pk')
        delete_reply_comment(request, comment_pk, parent_pk)
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

    def retrieve(self, request, *args, **kwargs):
        comment_pk = kwargs.get('pk')
        comments = get_object_or_404(ReplyComment, id=comment_pk)
        serializer = CommentSerializer(comments, context={'request': request})
        return Response(serializer.data)



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
        post = get_object_or_404(Post, id=pk)
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)


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


class GetSelfPosts(viewsets.ModelViewSet):

    def list(self, request, *args, **kwargs):
        username = kwargs.get('username')
        user = get_object_or_404(User, username=username)
        queryset = Post.objects.filter(user=user)
        serializer = SearchPostSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

class GetSelfComments(viewsets.ModelViewSet):

    def list(self, request, *args, **kwargs):
        username = kwargs.get('username')
        user = get_object_or_404(User, username=username)
        queryset = Comment.objects.filter(user=user)
        serializer = CommentSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
