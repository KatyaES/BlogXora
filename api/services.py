from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.renderers import BrowsableAPIRenderer, JSONRenderer
from rest_framework.response import Response

from posts.models import Post, Comment, ReplyComment, User
from users.models import Notifications, Subscription


def create_comment(request, pk):
    request_comment = request.data.get('comment')
    post = get_object_or_404(Post, id=pk)
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

def set_comment_like(request, post_pk, comment_pk):
    comment_type = request.GET.get('type')
    if comment_type == 'common':
        comment = get_object_or_404(Comment, post=post_pk, id=comment_pk)
    else:
        comment = get_object_or_404(ReplyComment, id=comment_pk)

    if comment.liked_by.filter(id=request.user.id).exists():
        comment.liked_by.remove(request.user)
    else:
        comment.liked_by.add(request.user)

        if request.user != comment.user:
            post = get_object_or_404(Post, id=post_pk)

            notification = Notifications.objects.create(
                user=comment.user,
                message=f'Пользователь <a href="/users/profile/{request.user}/">{request.user}</a> поставил лайк под вашим <a href="/home/post/{post.id}/#comment-item-{comment.id}">комментарием</a>'
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


def set_post_like(request, pk):
    post = get_object_or_404(Post, id=pk)
    if post.liked_by.filter(id=request.user.id).exists():
        post.liked_by.remove(request.user)
    else:
        post.liked_by.add(request.user)

        notification = Notifications.objects.create(
            user=post.user,
            message=f'Пользователь <a href="/users/profile/{request.user}/">{request.user}</a> поставил лайк под вашим <a href="/home/post/{post.id}/">постом</a>'
        )

    post.save()


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

    notification = Notifications.objects.create(
        user=parent.user,
        message=f'Пользователь <a href="/users/profile/{request.user}/">{request.user}</a> поставил лайк под вашим комментарием',
    )

    return reply_comment

def delete_reply_comment(request, comment_pk, post_pk):
    comment = get_object_or_404(ReplyComment, id=comment_pk)
    if request.user != comment.user:
        return Response({'detail': 'Вы не являетесь автором комментария.'},
                        status=status.HTTP_403_FORBIDDEN)
    comment.delete()




def add_user_subscription(request, pk):
    follower_on = User.objects.get(id=pk)

    subscription, created = Subscription.objects.get_or_create(
        user=follower_on,
    )

    if request.user not in subscription.followers.all():
        subscription.followers.add(request.user)

        my_subscription, created = Subscription.objects.get_or_create(
            user=request.user,
        )
        my_subscription.followings.add(follower_on)

        notification = Notifications.objects.create(
            user=follower_on,
            message=f'Пользователь <a href="/users/profile/{request.user}/">{request.user}</a> подписался на вас',
        )

        return 'add'

    else:
        subscription.followers.remove(request.user)

        my_subscription, created = Subscription.objects.get_or_create(
            user=request.user,
        )
        my_subscription.followings.remove(follower_on)

        return 'remove'


def add_bookmark(request):
    post_id = request.GET.get('id')
    post = get_object_or_404(Post, id=post_id)
    if post.bookmark_user.filter(id=request.user.id).exists():
        post.bookmark_user.remove(request.user)
    else:
        post.bookmark_user.add(request.user)
    post.save()


def get_filter_posts(request):
    filter_name = request.GET.get('filter')
    if filter_name == 'Свежее':
        filter_name = '-pub_date'
    elif filter_name == 'Популярное':
        filter_name = '-views_count'
    elif filter_name == 'Обсуждаемое':
        filter_name = '-comment_count'

    posts = Post.objects.filter(status__icontains='draft').order_by(filter_name)

    return posts