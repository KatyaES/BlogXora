"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('config/', include('config.urls'))
"""
from debug_toolbar.toolbar import debug_toolbar_urls
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

import config
from apps.users import views
from apps.users.views import profile_page
from config import settings
from apps.posts.views import index, add_post, category_page, post_detail

urlpatterns = [
    path('', index, name='index'),
    path('admin/', admin.site.urls),
    path('users/', include('apps.users.urls')),
    path('settings/', views.profile_settings, name='settings'),
    path("add-post/", add_post, name="add_post"),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path("<str:tag>/", category_page, name="category"),
    path("post/<int:pk>/", post_detail, name="post_detail"),
    path('frontend-api/v1/', include('apps.api.v1.frontend_urls')),
    path('api/v1/', include('apps.api.v1.public_urls')),
]

if config.settings.dev.DEBUG:
    urlpatterns += static(config.settings.base.MEDIA_URL, document_root=config.settings.base.MEDIA_ROOT)
    urlpatterns += debug_toolbar_urls()
