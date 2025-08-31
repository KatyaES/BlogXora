from django.urls import path

from . import views
from django.contrib.auth import views as auth_views

from .views import ThemeFollows, ChangePasswordView, ChangeDataView

urlpatterns = [
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('profile_settings/', views.profile_settings, name='settings'),
    path('change-settings-data/', ChangeDataView.as_view()),
    path('change-settings-password/', ChangePasswordView.as_view()),
    path('reset_password/', auth_views.PasswordResetView.as_view(template_name='users/password_reset_form.html'), name='password_reset'),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name='users/password_reset_done.html'), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='users/password_reset_confirm.html'), name='password_reset_confirm'),
    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name='users/password_reset_complete.html'), name='password_reset_complete'),
    path('theme_follows/', ThemeFollows.as_view()),
    path('<str:username>/', views.profile_page, name='profile'),
]