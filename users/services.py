from users.forms import UserLoginForm
from django.contrib import auth, messages


def auth_and_login(username, password):
    form = UserLoginForm ({
            'username':username,
            'password':password,
        })
    if form.is_valid():
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        user = auth.authenticate(username=username, password=password)
        return user
