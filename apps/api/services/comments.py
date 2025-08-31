from django.core.cache import cache
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response

from apps.posts.models import Post, Comment, ReplyComment
from apps.users.models import Notifications


def create_comment(request, post_pk):
    request_comment = request.data.get('comment')
    post = get_object_or_404(Post, id=post_pk)
    comment = Comment.objects.create(
        post=post,
        description=request_comment,
        user=request.user,
    )
    post.comment_count += 1
    comment.save()
    post.save()

    if request.user != post.user or request.user != comment.user:
        notification = Notifications.objects.create(
            user=post.user,
            message=f'Пользователь <a href="/users/profile/{request.user}/">{request.user}</a> оставил комментарий под вашим <a href="/home/post/{post.id}/">постом</a>'
        )

    return comment

def delete_comment(request, comment_pk):
    comment = get_object_or_404(Comment, id=comment_pk)
    if request.user != comment.user:
        return Response({'detail': 'Вы не являетесь автором комментария.'},
                        status=status.HTTP_403_FORBIDDEN)
    comment.delete()

def set_comment_like(request, comment_pk):
    comment_type = request.GET.get('type')
    if comment_type == 'common':
        comment = get_object_or_404(Comment, id=comment_pk)
    else:
        comment = get_object_or_404(ReplyComment, id=comment_pk)

    if comment.liked_by.filter(id=request.user.id).exists():
        comment.liked_by.remove(request.user)
    else:
        comment.liked_by.add(request.user)

    cache.delete(f'comment_{comment_pk}')
    comment.save()
    return comment


def get_comments(request, post_pk, comment_pk):
    comment_type = request.GET.get('type')
    if comment_type == 'common':
        comment = get_object_or_404(Comment, post=post_pk, id=comment_pk)
    else:
        comment = get_object_or_404(ReplyComment, id=comment_pk)

    return comment


def create_reply_comment(request):
    comment = request.data.get('comment')
    comment_id = request.data.get('id')
    parent = get_object_or_404(Comment, id=comment_id)
    reply_comment = ReplyComment.objects.create(
        parent=parent,
        description=comment,
        user=request.user,
    )
    reply_comment.save()
    parent.update_reply_count()

    notification = Notifications.objects.create(
        user=parent.user,
        message=f'Пользователь <a href="/users/profile/{request.user}/">{request.user}</a> поставил лайк под вашим комментарием',
    )

    return reply_comment

def delete_reply_comment(request, comment_pk, parent_pk):
    parent = get_object_or_404(Comment, id=parent_pk)
    comment = get_object_or_404(ReplyComment, id=comment_pk)
    if request.user != comment.user:
        return Response({'detail': 'Вы не являетесь автором комментария.'},
                        status=status.HTTP_403_FORBIDDEN)
    comment.delete()
    parent.update_reply_count()