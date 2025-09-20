from django.core.cache import cache
from django.shortcuts import get_object_or_404
from apps.posts.models import Post
from apps.users.models import Notifications


def set_post_like(request, pk):
    post = get_object_or_404(Post, id=pk)
    if post.liked_by.filter(id=request.user.id).exists():
        post.liked_by.remove(request.user)
    else:
        post.liked_by.add(request.user)
        notification = Notifications.objects.create(
            user=post.user,
            message=f'Пользователь <a href="/users/profile/{request.user}/">{request.user}</a> поставил лайк под вашим <a href="/home/post/{post.id}/">постом</a>'
        )
    post.save()
    return post


def get_filter_posts(request):
    filter_name = request.GET.get('filter')
    if filter_name == 'Свежее':
        filter_name = '-pub_date'
    elif filter_name == 'Популярное':
        filter_name = '-views_count'
    elif filter_name == 'Обсуждаемое':
        filter_name = '-comment_count'

    posts = Post.objects.filter(status__icontains='draft').order_by(filter_name)[:2]

    return posts
