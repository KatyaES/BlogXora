from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from apps.users.models import Notifications
from .models import Post, Category
from .services import create_post, add_comment


def index(request):
    random_posts = Post.objects.all().order_by('?')[:5]
    notification_count = Notifications.notification_count(request.user)
    posts = Post.objects.filter(status__icontains="draft").order_by("-pub_date")
    return render(request, "posts/index.html", {"posts": posts,
                                                "random_posts": random_posts,
                                                "notification_count": notification_count})

@login_required
def add_post(request):
    return create_post(request)

def category_page(request):
    cat = request.GET.get("theme")
    category = Category.objects.filter(name=cat).first()
    posts = Post.objects.filter(category=category, status__icontains="draft")
    return render(request, "posts/category.html", {"posts": posts,
                                                   "category": category})

def post_detail(request, pk):
    return add_comment(request, pk)