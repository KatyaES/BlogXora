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
    if request.user != post.user:
        notifications = Notifications.objects.create(
            user=post.user,
            actor=request.user,
            link=f'/post/{post.id}/',
            message=f'<div class="notification_message">Пользователь <a href="/users/{request.user}/">{request.user}</a> ответил под вашим <a href="/post/{post.id}/">комментарием</a></div>'
        )
    post.comment_count += 1
    comment.save()
    post.save()

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
        user = comment.user
        if request.user != comment.user:
            notifications = Notifications.objects.create (
                user=user,
                actor=request.user,
                link=f'/post/{comment.post.id}/',
                message=f'<div class="notification_message">Пользователь <a href="/users/{request.user}/">{request.user}</a> оценил ваш <a href="/post/{comment.post.id}/">комментарий</a></div>'
            )
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
    if request.user != parent.user:
        notifications = Notifications.objects.create(
            user=parent.user,
            actor=request.user,
            link=f'/post/{parent.post.id}/',
            message=f'<div class="notification_message">Пользователь <a href="/users/{request.user}/">{request.user}</a> ответил под вашим <a href="/post/{parent.post.id}/">комментарием</a></div>'
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