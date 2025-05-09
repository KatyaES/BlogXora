import json

from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import AbstractUser
from django.core.serializers import serialize
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views import View
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from api.serializers import CommentSerializer, PostSerializer, ReplyCommentSerializer, SearchPostSerializer
from posts.models import Comment, Post, ReplyComment
from users.models import Subscription, CustomUser, Notifications

User = get_user_model()


class CommentApiView(APIView):
    def post(self, request, pk):
        comment = request.data.get('comment')
        id = request.data.get('id')
        post = get_object_or_404(Post, id=pk)
        print(comment)
        last_comment = Comment.objects.create(
            post=post,
            description=comment,
            user=request.user,
        )
        post.comment_count += 1
        last_comment.save()
        result = post.update_comment_count()
        print('method:',result)
        post.save()

        if request.user != post.user or request.user != last_comment.user:
            notification = Notifications.objects.create(
                user=post.user,
                message=f'Пользователь <a href="/users/profile/{request.user}/">{request.user}</a> оставил комментарий под вашим <a href="/home/post/{post.id}/">постом</a>'
            )

        serializer = CommentSerializer(last_comment, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, comment_pk, post_pk):
        type = request.GET.get('type')
        if type == 'common':
            comment = get_object_or_404(Comment, id=comment_pk)
        else:
            comment = get_object_or_404(ReplyComment, id=comment_pk)
        comment.delete()
        post = get_object_or_404(Post, id=post_pk)
        post.update_comment_count()
        for comment in post.comments.all():
            comment.update_reply_count()
        return HttpResponse(status=204)

    def update(self, request, comment_pk):
        type = request.GET.get('type')
        if type == 'common':
            comment = get_object_or_404(Comment, id=comment_pk)
        else:
            comment = get_object_or_404(ReplyComment, id=comment_pk)





class CommentToggleApiView(APIView):
    def post(self, request, post_pk, comment_pk):
        comment_type = request.GET.get('type')
        print('post')
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


        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data)

    def get(self, request, post_pk, comment_pk):
        comment_type = request.GET.get('type')
        print(comment_type)
        if comment_type == 'common':
            comment = get_object_or_404(Comment, post=post_pk, id=comment_pk)
        else:
            comment = get_object_or_404(ReplyComment, id=comment_pk)

        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data)


class PostToggleApiView(APIView):
    def post(self, request, pk):
        post = get_object_or_404(Post, id=pk)
        if post.liked_by.filter(id=request.user.id).exists():
            post.liked_by.remove(request.user)
        else:
            post.liked_by.add(request.user)

        post.save()

        return Response({'status': 204})

    def get(self, request, pk):
        post = get_object_or_404(Post, id=pk)

        notification = Notifications.objects.create(
            user=post.user,
            message=f'Пользователь <a href="/users/profile/{request.user}/">{request.user}</a> поставил лайк под вашим <a href="/home/post/{post.id}/">постом</a>'
        )

        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)

class ReplyCommentApiView(APIView):
    def post(self, request):
        comment = request.data.get('comment')
        id = request.data.get('id')
        post_pk = request.data.get('post_pk')
        parent = get_object_or_404(Comment, id=id)
        print(comment)
        reply_comment = ReplyComment.objects.create(
            parent=parent,
            description=comment,
            user=request.user,
        )
        reply_comment.save()
        parent.update_reply_count()
        parent.post.update_comment_count()
        print(f'user: {request.user.is_staff}')

        serializer = ReplyCommentSerializer(reply_comment, context={'request': request})
        return Response(serializer.data)

class SearchPostsApiView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        query = request.GET.get('query')
        print(query)
        posts = Post.objects.filter(status__icontains='draft', title__icontains=query)

        serializer = SearchPostSerializer(posts, many=True)
        return Response(serializer.data)


class FollowsApiView(APIView):
    def post(self, request, id):
        follower_on = User.objects.get(id=id)

        subscription, created = Subscription.objects.get_or_create(
            user=follower_on,
        )

        if request.user not in subscription.followers.all():
            subscription.followers.add(request.user)

            my_subscription, created = Subscription.objects.get_or_create(
                user=request.user,
            )
            my_subscription.followings.add(follower_on)

            return Response({'status': 'add'})

        else:
            subscription.followers.remove(request.user)

            my_subscription, created = Subscription.objects.get_or_create(
                user=request.user,
            )
            my_subscription.followings.remove(follower_on)

            return Response({'status': 'remove'})

    def get(self, request, id):
        follower_on = User.objects.get(id=id)

        subscription, created = Subscription.objects.get_or_create(
            user=follower_on,
        )

        if request.user in subscription.followers.all():
            return Response({'status': 'subscribed'})
        return Response({'status': 'not subscribed'})
