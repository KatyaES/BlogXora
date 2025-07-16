from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, generics, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import BasePermission

from apps.api.serializers import PublicPostsSerializer, PublicCommentsSerializer, PublicCategorySerializer, PublicUserSerializer
from apps.posts.models import Post, Comment, Category
from apps.users.models import CustomUser

class IsAuthor(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            if request.user.is_staff:
                return True
            return request.user == obj.user


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        return True if request.method in permissions.SAFE_METHODS else request.user.is_staff


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = Category.objects.all()
    serializer_class = PublicCategorySerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filterset_fields = [
        'followers', 'name'
    ]
    search_fields = ['=name']


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = CustomUser.objects.all()
    serializer_class = PublicUserSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    ordering_fields = ['username']
    ordering = ['username']
    filterset_fields = ['username']
    search_fields = ['username', 'email']


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
    search_filter = ['status', 'user', 'category', 'title']


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
    search_filter = ['user', 'description']


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
    search_filter = ['status', 'user', 'category', 'title']

class PostApiView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthor,)
    queryset = Post.objects.all()
    serializer_class = PublicPostsSerializer






