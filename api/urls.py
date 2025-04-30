from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import CommentApiView, CommentToggleApiView, PostToggleApiView, ReplyCommentApiView, SearchPostsApiView

urlpatterns = [
    path('add_comment/<int:pk>/', CommentApiView.as_view()),
    path('delete_comment/<int:comment_pk>/post/<int:post_pk>/', CommentApiView.as_view()),
    path('post/<int:post_pk>/comment/<int:comment_pk>/', CommentToggleApiView.as_view()),
    path('likes_response/<int:pk>/', PostToggleApiView.as_view()),
    path('reply_comment/', ReplyCommentApiView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('search/posts/', SearchPostsApiView.as_view()),
]