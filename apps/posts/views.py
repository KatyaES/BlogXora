from datetime import timedelta

from django.utils import timezone

from django.contrib.auth.decorators import login_required
from django.core.cache import cache
from django.core.paginator import Paginator
from django.shortcuts import render, get_object_or_404

from apps.users.models import Notifications
from .models import Post, Category
from .services import create_post, add_comment


def index(request):
    one_day_ago = timezone.now() - timedelta(days=1)
    news_posts = Post.objects.filter(post_type='Новость').order_by('?')[:5]
    cache_key = f'random_posts_ids'
    cached_ids = cache.get(cache_key)
    if cached_ids:
        random_posts = Post.objects.filter(id__in=cached_ids)
    else:
        random_posts = Post.objects.all().order_by('?')[:5]
        random_posts_ids = list(random_posts.values_list('id', flat=True))
        cache.set(cache_key, random_posts_ids, 1)
    return render(request, "posts/index.html", {
                                                "random_posts": random_posts,
                                                "news_posts": news_posts,
                                                })

@login_required
def add_post(request):
    return render(request, "posts/add_post.html")

def category_page(request, tag):
    category_first = Category.objects.filter(tag=tag).first()
    context = {'category': category_first}
    return render(request, "posts/category.html", context)

def post_detail(request, pk):
    return add_comment(request, pk)