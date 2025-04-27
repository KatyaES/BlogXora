from datetime import timedelta
import random
import json
from itertools import count
from PIL import Image
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Count
from django.http import Http404, JsonResponse, HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin

from .forms import PostForm, CommentForm
from .models import Post, Comment, User, ReplyComment


def all_categories(request):
    datas = {"Горячее": "hot", "Все посты": "index", "Темы": "all_categories", "Мой профиль": "profile"}

    all_categories = Post.objects.filter(status__icontains="draft").values("category").annotate(count=Count("category")).order_by("-count")
    paginator = Paginator(all_categories, 15)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    return render(request, "posts/all_categories.html", {"all_categories": page_obj,
                                                                                "datas": datas,
                                                                                "page_obj": page_obj})

def index(request):
    one_day_ago = timezone.now() - timedelta(days=3)
    random_posts = Post.objects.filter(status__icontains="draft", pub_date__gte=one_day_ago).order_by('?')[:5]
    posts = Post.objects.filter(status__icontains="draft").order_by("-pub_date")
    user = request.user
    datas = {"Горячее": "hot", "Все посты":"index", "Темы": "all_categories", "Мой профиль": "profile"}
    return render(request, "posts/index.html", {"posts": posts,
                                                "user": user,
                                                "datas": datas,
                                                "random_posts": random_posts,
                                                })

@login_required
def add_post(request):
    print('request.FILES:', request.FILES)
    popular_categories = Post.objects.filter(status__icontains="draft").values("category").annotate(count=Count("category")).order_by("-count")[:10]
    if request.method == "POST":
        print(request.POST)
        title = request.POST.get('title')
        content = request.POST.get('content')
        category = request.POST.get('theme')
        wrapp_img = request.FILES.get('wrapp_img')
        pub_date = timezone.now()
        cut_img = request.POST.get('cut_img')
        print('before form')
        print(wrapp_img)


        form = PostForm(
            data= {
            'title': title,
            'content': content,
            'category': category,
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
            print('final')
            return JsonResponse({'status': 'ok'})
        else:
            print('form invalid')
            return JsonResponse({'status': 'bad', 'errors': form.errors})
    else:

        form = PostForm()
        return render(request, "posts/add_post.html", {"form": form,
                                                       "popular_categories": popular_categories,})

def category_page(request):
    user = request.user
    datas = {"Горячее": "hot", "Все посты": "index", "Темы": "all_categories", "Мой профиль": "profile"}
    popular_categories = Post.objects.filter(status__icontains="draft").values("category").annotate(
        count=Count("category")).order_by("-count")[:10]


    category = request.GET.get("filter")
    print(category)
    if category:
        categories = Post.objects.filter(category__iexact=category, status__icontains="draft")
    else:
        categories = _get_queryset(Post)
    return render(request, "posts/category.html", {"categories": categories,
                                                "datas": datas,
                                                 "user": user,
                                                 "popular_categories": popular_categories,
                                                   "category": category,})

def search(request):
    user = request.user
    datas = {"Горячее": "hot", "Все посты": "index", "Темы": "all_categories", "Мой профиль": "profile"}
    popular_categories = Post.objects.filter(status__icontains="draft").values("category").annotate(count=Count("category")).order_by("-count")[:10]

    query = request.GET.get("q")
    if query:
        all_posts = Post.objects.filter(title__icontains=query, status__icontains="draft")
        count = all_posts.count()
    else:
        count = 0
        all_posts = Post.objects.none()

    return render(request, "posts/search.html", {"all_posts": all_posts,
                                                 "count": count,
                                                 "datas": datas,
                                                 "user": user,
                                                 "popular_categories": popular_categories,})

def post_detail(request, pk):
    user = request.user
    popular_categories = Post.objects.filter(status__icontains="draft").values("category").annotate(
        count=Count("category")).order_by("-count")[:10]
    post = get_object_or_404(Post, id=pk)
    comments = Comment.objects.filter(post=post)
    reply_comments = ReplyComment.objects.all()
    print(f"comments: {comments}")
    post.views_count += 1
    post.save()
    print("count: ", post.comment_count)


    if request.method == "POST":
        if request.body:
            try:
                data = json.loads(request.body)
                print('data: ', data)
                comment_text = data.get('description')
                comment_user = data.get('user')
                user_instance = get_user_model().objects.get(username=comment_user)
                print('data: ', data)
                print('comment: ', f'{comment_text}')
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
                                                          "popular_categories": popular_categories,
                                                          "user": user,
                                                          "form": form,
                                                          "comments": comments,
                                                          'reply_comments': reply_comments})




def hot(request):
    user = request.user
    datas = {"Горячее": "hot", "Все посты": "index", "Темы": "all_categories", "Мой профиль": "profile"}
    popular_categories = Post.objects.filter(status__icontains="draft").values("category").annotate(
        count=Count("category")).order_by("-count")[:10]

    posts = Post.objects.filter(status__icontains="draft").order_by("-views_count")
    return render(request, "posts/hot.html", {"posts": posts,
                                                                            "datas": datas,
                                                                            "popular_categories": popular_categories,
                                                                            "user": user,
                                                                            })
