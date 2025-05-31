from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.serializers import serialize
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.serializers import CommentSerializer, PostSerializer, ReplyCommentSerializer, SearchPostSerializer, \
    UserSerializer
from posts.models import Comment, Post, ReplyComment, Category
from users.models import Subscription, Notifications

User = get_user_model()


class CommentApiView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        elif self.request.method == 'DELETE':
            return [IsAuthenticated()]
        return super().get_permissions()

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
        if request.user != comment.user:
            return Response({'detail': 'Вы не являетесь автором комментария.'},
                            status=status.HTTP_403_FORBIDDEN)
        comment.delete()
        post = get_object_or_404(Post, id=post_pk)
        post.update_comment_count()
        for comment in post.comments.all():
            comment.update_reply_count()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

    def get(self, request, comment_pk):
        comments = get_object_or_404(Comment, id=comment_pk)
        serializer = CommentSerializer(comments, context={'request': request})
        print(serializer.data)
        return Response(serializer.data)



class CommentToggleApiView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        return super().get_permissions()

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
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        return super().get_permissions()

    def post(self, request, pk):
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

        return Response(status=status.HTTP_204_NO_CONTENT)

    def get(self, request, pk):
        post = get_object_or_404(Post, id=pk)
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)

class ReplyCommentApiView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        return super().get_permissions()

    def post(self, request):
        comment = request.data.get('comment')
        id = request.data.get('id')
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

        notification = Notifications.objects.create(
            user=parent.user,
            message=f'Пользователь <a href="/users/profile/{request.user}/">{request.user}</a> поставил лайк под вашим комментарием',
        )

        serializer = ReplyCommentSerializer(reply_comment, context={'request': request})
        return Response(serializer.data)

    def get(self, request, pk):
        reply_comment = get_object_or_404(ReplyComment, id=pk)
        serializer = ReplyCommentSerializer(reply_comment, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk):


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

            notification = Notifications.objects.create(
                user=follower_on,
                message=f'Пользователь <a href="/users/profile/{request.user}/">{request.user}</a> подписался на вас',
            )

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


class BookmarkApiView(APIView):
    def post(self, request):
        post_id = request.GET.get('id')
        post = get_object_or_404(Post, id=post_id)
        if post.bookmark_user.filter(id=request.user.id).exists():
            post.bookmark_user.remove(request.user)
            print('remove')
        else:
            post.bookmark_user.add(request.user)
            print('append')
        post.save()

        return HttpResponse(status=204)

    def get(self, request):
        post_id = request.GET.get('id')
        post = get_object_or_404(Post, id=post_id)

        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)


class ChangeDataView(APIView):
    def post(self, request):
        print('start')
        username = request.data.get('username')
        email = request.data.get('email')
        bio = request.data.get('about')
        data = {
            'username': username,
            'email': email,
            'bio': bio
        }
        print(data)
        user_model = get_object_or_404(User, username=request.user.username)
        print('промежуток')
        serializer = UserSerializer(user_model, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            print(204)
            return Response(status=204)
        print(400)
        return Response(status=400)

class ChangePasswordView(APIView):
    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        new_password2 = request.data.get('new_password2')
        user = request.user
        if user.check_password(old_password):
            if new_password == new_password2:
                if validate_password(new_password, user=user) == None:
                    user.set_password(new_password)
                    user.save()
                    return Response(status=204)
                else: return Response(status=400)
            else: return Response(status=400)
        else: return Response(status=400)


class ThemeFollowsApiView(APIView):
    def post(self, request, id):
        print(22)
        follower_on = User.objects.get(id=id)
        theme = request.GET.get('theme')
        print(follower_on.username)

        category = get_object_or_404(Category, name=theme)
        print('category', category)
        print(category.followers)

        if request.user not in category.followers.all():
            category.followers.add(request.user)

            return Response({'status': 'add'})

        else:
            category.followers.remove(request.user)
            return Response({'status': 'remove'})

    def get(self, request, id):
        follower_on = User.objects.get(id=id)
        theme = request.GET.get('theme')
        category = get_object_or_404(Category, name=theme)

        if request.user in category.followers.all():
            return Response({'status': 'subscribed'})
        return Response({'status': 'not subscribed'})

class GetFilterPostsApiView(APIView):
    def get(self, request):
        filter_name = request.GET.get('filter')
        if filter_name == 'Свежее':
            filter_name = '-pub_date'
        elif filter_name == 'Популярное':
            filter_name = '-views_count'
        elif filter_name == 'Обсуждаемое':
            filter_name = '-comment_count'

        posts = Post.objects.filter(status__icontains='draft').order_by(filter_name)
        print(posts)

        serializer = SearchPostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
