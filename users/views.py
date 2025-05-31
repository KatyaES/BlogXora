import json
from django.contrib import auth
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken

from posts.models import Post, Comment, ReplyComment
from users.forms import UserRegistrationForm, UserLoginForm
from django.contrib.auth import logout, get_user_model
from users.models import Subscription, Notifications


from users.services import auth_and_login

User = get_user_model()

def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        login = data.get('login')
        password1 = data.get('password1')
        password2 = data.get('password2')
        print(f'data:\n{data}')
        form = UserRegistrationForm({
            'username': login,
            'email': email,
            'password1': password1,
            'password2': password2,
        })
        if form.is_valid():
            user = form.save()
            auth.login(request, user)
            refresh = RefreshToken.for_user(user)

            subscription, created = Subscription.objects.get_or_create(
                user=user,
            )
            return JsonResponse({'status': 204,  'access': str(refresh.access_token), 'refresh': str(refresh)})
        else:
            return JsonResponse({'status': 400})
    else:
        form = UserRegistrationForm()
    context = {'form': form}
    return render(request, 'users/register.html', context)

def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('login')
        password = data.get('password')
        user = auth_and_login(username, password)
        if user:
            auth.login(request, user)
            refresh = RefreshToken.for_user(user)
            return JsonResponse({'status': 204, 'access': str(refresh.access_token), 'refresh': str(refresh)})
        else:
            return JsonResponse({'status': 400})
    else:
        form = UserLoginForm()
    context = {'form': form}
    return render(request, 'users/login.html', context)


def profile_page(request, username):
    profile_user = User.objects.get(username=username)
    posts = Post.objects.filter(user=profile_user)
    bookmarks = Post.objects.filter(bookmark_user=profile_user)
    notifications = Notifications.objects.filter(user=profile_user)
    notification_count = Notifications.notification_count(request.user)
    comments = Comment.objects.filter(user=profile_user)
    reply_comments = ReplyComment.objects.all()
    random_posts = Post.objects.all().order_by('?')[:5]
    return render(request, 'users/profile.html',
                  {'profile_user': profile_user,
                          'notifications': notifications,
                          'posts': posts,
                          'comments': comments,
                          'reply_comments': reply_comments,
                          'bookmarks': bookmarks,
                          'random_posts': random_posts,
                          'notification_count': notification_count})


def logout_page(request):
    logout(request)
    return redirect('/')

def settings(request):
    user = get_object_or_404(User, username=request.user.username)
    random_posts = Post.objects.all().order_by('?')[:5]
    return render(request, 'users/profile_edit.html',
                  {'user': user,
                          'random_posts': random_posts})
