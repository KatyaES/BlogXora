from django.urls import path

from api.views import AddCommentApiView, CommentToggleApiView, PostToggleApiView

urlpatterns = [
    path('add_comment/<int:pk>/', AddCommentApiView.as_view()),
    path('post/<int:post_pk>/comment/<int:comment_pk>/', CommentToggleApiView.as_view()),
    path('likes_response/<int:pk>/', PostToggleApiView.as_view())
]