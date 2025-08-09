import json

from django.contrib.auth import get_user_model
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, get_object_or_404
from django.utils import timezone

from apps.posts.forms import PostForm, CommentForm
from apps.posts.models import Category, Comment, ReplyComment, Post


def create_post(request):
    if request.method == "POST":
        title = request.POST.get('title')
        content = request.POST.get('content')
        cat = request.POST.get('theme').strip()
        category = Category.objects.filter(name=cat).first()
        wrapp_img = request.FILES.get('wrapp_img')
        pub_date = timezone.now()
        cut_img = request.POST.get('cut_img')

        form = PostForm(
            data= {
                'title': title,
                'content': content,
                'category': category.id if category else None,
                'pub_date': pub_date,
                'cut_img': cut_img,
                },
                files= {
                    'wrapp_img': wrapp_img,
                }
            )
        if form.is_valid():
            post = form.save(commit=False)
            post.user = request.user
            post.save()
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=400)
    else:
        return render(request, "posts/add_post.html")


def add_comment(request, pk):
    post = get_object_or_404(Post, id=pk)
    comments = Comment.objects.filter(post=post)
    reply_comments = ReplyComment.objects.all()
    post.views_count += 1
    post.save()

    if request.method == "POST":
        if request.body:
            try:
                data = json.loads(request.body)
                comment_text = data.get('description')
                comment_user = data.get('user')
                user_instance = get_user_model().objects.get(username=comment_user)
                form = CommentForm({'description': comment_text})
                if form.is_valid():
                    comment = form.save(commit=False)
                    comment.user = user_instance
                    comment.post = post
                    comment.save()
                    post.comment_count += 1
                    post.save()
                    return HttpResponse(status=204)
            except json.JSONDecodeError as e:
                return JsonResponse({'error': 'invalid JSON format'}, status=400)
        else:
            return JsonResponse({'error': 'Body is empty'}, status=400)

    else:
        form = CommentForm()
        return render(request, "posts/post_detail.html", {"post": post,
                                                          "form": form,
                                                          "comments": comments,
                                                          'reply_comments': reply_comments})