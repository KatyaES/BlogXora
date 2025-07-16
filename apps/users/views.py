from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.template.defaulttags import csrf_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView

from django.contrib.auth import logout, get_user_model

from apps.users.services import *

User = get_user_model()

def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        email, login, password1, password2 = (data.get('email'),
                                              data.get('login'),
                                              data.get('password1'),
                                              data.get('password2'))

        if not all([email, login, password1, password2]):
            return JsonResponse({'error': 'All fields are required'}, status=400)


        return register_user(request, email, login, password1, password2)

@method_decorator(csrf_exempt, name='dispatch')
def login(request):
    if request.method == 'POST':
        return login_user(request)
    return HttpResponse('')


def profile_page(request, username):
    profile_user = get_object_or_404(User, username=username)
    context = get_profile_user_data(profile_user)
    return render(request, 'users/profile.html', context)


def logout_page(request):
    logout(request)
    return redirect('/')

def profile_settings(request):
    user = get_object_or_404(User, username=request.user.username)
    random_posts = Post.objects.all().order_by('?')[:5]
    return render(request, 'users/profile_edit.html',
                  {'user': user,
                          'random_posts': random_posts})


class ThemeFollows(APIView):
    def post(self, request):
        theme = request.GET.get('theme')
        return add_or_remove_followers(request, theme)

    def get(self, request):
        theme = request.GET.get('theme')
        category = get_object_or_404(Category, name=theme)

        if request.user in category.followers.all():
            return Response({'status': 'subscribed'})
        return Response({'status': 'not subscribed'})


class ChangePasswordView(APIView):
    def post(self, request):
        return change_password(request)

class ChangeDataView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        bio = request.data.get('about')
        return change_data(request, username, email, bio)
