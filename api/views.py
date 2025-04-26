import json

from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.serializers import serialize
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views import View
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.serializers import CommentSerializer, PostSerializer, ReplyCommentSerializer
from posts.models import Comment, Post, ReplyComment


class CommentApiView(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class AddCommentApiView(APIView):
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
        post.save()

        serializer = CommentSerializer(last_comment, context={'request': request})
        return Response(serializer.data)


class CommentToggleApiView(APIView):
    def post(self, request, post_pk, comment_pk):
        comment_type = request.GET.get('type')
        print('post')
        if comment_type == 'common':
            comment = get_object_or_404(Comment, post=post_pk, id=comment_pk)
        else: comment = get_object_or_404(ReplyComment, id=comment_pk)

        if comment.liked_by.filter(id=request.user.id).exists():
            comment.liked_by.remove(request.user)
        else:
            comment.liked_by.add(request.user)
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
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)

class ReplyCommentApiView(APIView):
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

        serializer = ReplyCommentSerializer(reply_comment, context={'request': request})
        return Response(serializer.data)