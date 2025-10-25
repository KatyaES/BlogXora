from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, generics
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from apps.api.utils import cache_utils

from apps.api.utils.permissions import IsAdminOrReadOnly, IsAuthor
from apps.api.serializers import PublicPostsSerializer, PublicCategorySerializer, \
    PublicUserSerializer, PublicCommentsSerializer
from apps.api.services.others import get_cached_data, clear_cache
from apps.posts.models import Post, Comment, Category
from apps.users.models import CustomUser


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = Category.objects.all().order_by('id')
    serializer_class = PublicCategorySerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filterset_fields = [
        'followers', 'cat_title'
    ]
    search_fields = ['=cat_title']

    @method_decorator(cache_page(60 * 2))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)






class UserViewSet(cache_utils.CacheAndClearMixin,
                  viewsets.ModelViewSet):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = CustomUser.objects.all()
    serializer_class = PublicUserSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    ordering_fields = ['username']
    ordering = ['username']
    filterset_fields = ['username']
    search_fields = ['username', 'email']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        data = self.get_cached_data(request,
                               prefix='users',
                               queryset=queryset,
                               page=page,
                               serializer_class=self.get_serializer_class(),
                               paginated_response=self.get_paginated_response)
        return Response(data)



class PostsViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthor,)
    queryset = Post.objects.all()
    serializer_class = PublicPostsSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'title', 'category', 'pub_date',
        'status', 'user'
    ]
    ordering_fields = ['status', 'views_count', 'comment_count']
    ordering = ['status']
    search_fields = ['status', 'title']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        data = get_cached_data(request, 'posts',
                               queryset,
                               page,
                               self.get_serializer_class(),
                               self.get_paginated_response)
        return Response(data)



class CommentsViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthor,)
    queryset = Comment.objects.all()
    serializer_class = PublicCommentsSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'pub_date', 'user'
    ]
    ordering_fields = ['pub_date']
    ordering = ['pub_date']
    search_fields = ['description']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        data = get_cached_data(request, 'comments',
                               queryset,
                               page,
                               self.get_serializer_class(),
                               self.get_paginated_response)
        return Response(data)


class PostsList(generics.ListAPIView):
    permission_classes = (IsAuthor,)
    queryset = Post.objects.all()
    serializer_class = PublicPostsSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'title', 'category', 'pub_date',
        'status', 'user'
    ]
    ordering_fields = ['status', 'views_count', 'comment_count']
    ordering = ['status']
    search_fields = ['status', 'title']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        data = get_cached_data(request, 'posts',
                               queryset,
                               page,
                               self.get_serializer_class(),
                               self.get_paginated_response)
        return Response(data)


class PostApiView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthor,)
    queryset = Post.objects.all()
    serializer_class = PublicPostsSerializer

    def retrieve(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        data = get_cached_data(request, 'posts',
                               queryset,
                               page,
                               self.get_serializer_class(),
                               self.get_paginated_response)
        return Response(data)
