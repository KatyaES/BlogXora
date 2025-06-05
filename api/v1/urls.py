from django.db import router
from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.v1.views import CommentApiView, CommentToggleApiView, PostToggleApiView, ReplyCommentApiView, SearchPostsApiView, \
    FollowsApiView, BookmarkApiView, GetFilterPostsApiView


urlpatterns = [
    path('comments/<int:pk>/', CommentApiView.as_view()),
    path('comments/<int:comment_pk>/delete/', CommentApiView.as_view()),
    path('comments/<int:comment_pk>/get/', CommentApiView.as_view()),
    path('comments/<int:post_pk>/<int:comment_pk>/like/', CommentToggleApiView.as_view()),
    path('posts/<int:pk>/like/', PostToggleApiView.as_view()),
    path('reply-comments/', ReplyCommentApiView.as_view()),
    path('reply-comments/<int:pk>/', ReplyCommentApiView.as_view()),
    path('reply-comments/<int:comment_pk>/<int:post_pk>/delete/', ReplyCommentApiView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('search/posts/', SearchPostsApiView.as_view()),
    path('follows/<int:pk>/', FollowsApiView.as_view()),
    path('bookmarks/', BookmarkApiView.as_view()),
    path('filters/', GetFilterPostsApiView.as_view()),
]