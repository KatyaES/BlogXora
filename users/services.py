import json

from django.contrib.auth.password_validation import validate_password
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from posts.models import Post, Comment, ReplyComment, User, Category
from users.forms import UserLoginForm, UserRegistrationForm
from django.contrib import auth, messages

from users.models import Notifications, Subscription
from users.serializers import UserSerializer


def auth_and_login(username, password):
    form = UserLoginForm ({
        'username': username,
        'password': password,
    })
    if form.is_valid():
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        user = auth.authenticate(username=username, password=password)
        return user


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
        return JsonResponse({'access': str(refresh.access_token), 'refresh': str(refresh)}, status=200)
    else:
        return JsonResponse({'status': 'bad'}, status=400)

def login_user(request):
    data = json.loads(request.body)
    username = data.get('login')
    password = data.get('password')
    user = auth_and_login(username, password)
    if user:
        auth.login(request, user)
        refresh = RefreshToken.for_user(user)
        return JsonResponse({'access': str(refresh.access_token), 'refresh': str(refresh)}, status=200)
    else:
        return JsonResponse({'status': 'ok'}, status=400)


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
        serializer.save()
        return Response(status=204)
    return Response(status=400)


def add_or_remove_followers(request, theme):
    category = get_object_or_404(Category, name=theme)

    if request.user not in category.followers.all():
        category.followers.add(request.user)

        return Response({'status': 'add'})

    else:
        category.followers.remove(request.user)
        return Response({'status': 'remove'})
