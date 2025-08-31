import json
from http.client import responses

from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from apps.posts.models import Post, Comment, ReplyComment, User, Category
from apps.users.forms import UserLoginForm, UserRegistrationForm
from django.contrib import auth

from apps.users.models import Notifications, Subscription
from apps.users.serializers import UserSerializer


def register_user(request, email, login, password1, password2):
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
        response = JsonResponse({'detail': 'Logged in'})
        response.set_cookie('access_token', str(refresh.access_token), httponly=True, secure=True)
        response.set_cookie('refresh_token', str(refresh), httponly=True, secure=True)
        return response
    else:
        return JsonResponse({'error': form.errors}, status=400)


def auth_and_login(username, password):
    form = UserLoginForm ({
        'username': username,
        'password': password,
    })
    if form.is_valid():
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        user = auth.authenticate(username=username, password=password)
        if user:
            return user
        return {'error': 'Неправильный логин или пароль.'}

    else:
        return {'error': form.errors}


def login_user(request):
    data = json.loads(request.body)
    username = data.get('login')
    password = data.get('password')
    user = auth_and_login(username, password)
    if isinstance(user, User):
        auth.login(request, user)
        refresh = RefreshToken.for_user(user)
        response = JsonResponse({'detail':'Logged in'})
        response.set_cookie('access_token', str(refresh.access_token), httponly=True, secure=True)
        response.set_cookie('refresh_token', str(refresh), httponly=True, secure=True)
        return response
    elif isinstance(user, dict):
        return JsonResponse(user, status=400)
    return HttpResponse(status=204)


def get_profile_user_data(profile_user):
    return {
        'profile_user': profile_user,
        'notifications': Notifications.objects.filter(user=profile_user),
        'posts': Post.objects.filter(bookmark_user=profile_user),
        'comments': Comment.objects.filter(user=profile_user),
        'reply_comments': ReplyComment.objects.all(),
        'bookmarks': Post.objects.filter(bookmark_user=profile_user),
        'random_posts': Post.objects.all().order_by('?')[:5],
        'notification_count': Notifications.notification_count(profile_user)
    }


def change_password(request):
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    new_password2 = request.data.get('new_password2')
    user = request.user
    if not user.check_password(old_password):
        return Response({'error': 'Incorrect old password'}, status=400)
    if new_password != new_password2:
        return Response({'error': 'Passwords not equal'}, status=400)

    try:
        validate_password(new_password, user=user)
    except ValidationError as e:
        return Response({'error': e}, status=400)

    user.set_password(new_password)
    user.save()
    return Response({'status': 'success'}, status=204)


def change_data(request, username, email, bio):
    data = {
        'username': username,
        'email': email,
        'bio': bio
    }
    user_model = get_object_or_404(User, username=request.user.username)
    serializer = UserSerializer(user_model, data=data, partial=True)

    if serializer.is_valid():
        try:
            serializer.save()
            return Response(status=204)
        except IntegrityError as e:
            return Response({"error": "Данный username или email уже занят."}, status=400)
    return Response({"error": "Данный username или email уже занят."}, status=400)



def add_or_remove_followers(request, theme):
    category = get_object_or_404(Category, cat_title=theme)

    if request.user not in category.followers.all():
        category.followers.add(request.user)

        return Response({'status': 'add'})

    else:
        category.followers.remove(request.user)
        return Response({'status': 'remove'})
