import json
from django.contrib import auth, messages
from django.contrib.auth.forms import SetPasswordForm
from django.contrib.auth.views import PasswordResetConfirmView
from django.db.models import Count
from django.core.files.base import ContentFile
from PIL import Image, ImageDraw, ImageFont
import random
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from posts.models import Post
from users.forms import UserRegistrationForm, UserLoginForm,  UserUpdateForm, \
    CustomPasswordChangeForm
from django.contrib.auth import logout, update_session_auth_hash, get_user_model
# from django.contrib.auth.models import User
from users.models import CustomUser
from django.core.files import File
from io import BytesIO

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
            return JsonResponse({'status': 204})
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
            return JsonResponse({'status': 204})
        else:
            return JsonResponse({'status': 400})
    else:
        form = UserLoginForm()
    context = {'form': form}
    return render(request, 'users/login.html', context)

@login_required
def profile_page(request):
    user = request.user
    datas = {"Горячее": "hot", "Все посты": "index", "Темы": "all_categories", "Мой профиль": "profile"}
    popular_categories = Post.objects.filter(status__icontains="draft").values("category").annotate(
        count=Count("category")).order_by("-count")[:10]

    if request.method == "POST":
        form = CustomPasswordChangeForm(user=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Пароль успешно изменен")
            return redirect("login")
        else:
            return render(request, 'users/login.html', {"form": form})
    else:
        form = CustomPasswordChangeForm(user=request.user)
        user = CustomUser.objects.filter(username=request.user).first()
        return render(request, 'users/profile.html', {'user': user,
                                                      'form': form,
                                                      'datas': datas,
                                                      'popular_categories': popular_categories})

def logout_page(request):
    logout(request)
    return redirect('/')