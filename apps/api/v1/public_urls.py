from django.urls import include, path
from rest_framework import routers

from apps.api.v1.public_api import PostsViewSet, CommentsViewSet, CategoryViewSet, UserViewSet, PostsList, PostApiView

router = routers.DefaultRouter()
router.register('posts', PostsViewSet, basename='post')
router.register('comments', CommentsViewSet, basename='comment')
router.register('categories', CategoryViewSet, basename='category')
router.register('user', UserViewSet, basename='customuser')

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path('list_posts/', PostsList.as_view()),
    path('post/<int:pk>/', PostApiView.as_view())

] + router.urls