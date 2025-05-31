from django.urls import include, path

from posts import views

urlpatterns = [
    path("add_post/", views.add_post, name="add_post"),
    path("category/", views.category_page, name="category"),
    path("subscribes/", views.subscribes_page, name="subscribes"),
    path("all_categories/", views.all_categories, name="all_categories"),
    path("post/<int:pk>/", views.post_detail, name="post_detail"),
    path("hot/", views.hot, name="hot"),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path('discussion/', views.discussion, name="discussion"),
    path('new/', views.new, name="new"),
]