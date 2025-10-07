from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.api.v1.frontend_api import ReplyCommentViewSet, \
    SearchPostsViewSet, \
    SubscriptionViewSet, GetSelfComments, CommentViewSet, PostViewSet
from apps.users.views import CookieTokenRefreshView

router = routers.DefaultRouter()
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'reply_comments', ReplyCommentViewSet , basename='reply_comments')
router.register(r'posts', PostViewSet , basename='posts')
router.register(r'search', SearchPostsViewSet , basename='search')
router.register(r'subscription', SubscriptionViewSet , basename='subscription')

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('<str:username>/comments/', GetSelfComments.as_view({'get': 'list'})),
] + router.urls