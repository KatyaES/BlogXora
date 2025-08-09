from django.urls import include, path

from apps.posts import views

urlpatterns = [
    path("add_post/", views.add_post, name="add_post"),
    path("category/", views.category_page, name="category"),
    path("post/<int:pk>/", views.post_detail, name="post_detail"),
    path('ckeditor/', include('ckeditor_uploader.urls')),
]