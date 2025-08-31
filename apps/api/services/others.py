from django.core.cache import cache
from django.shortcuts import get_object_or_404
from apps.posts.models import Post, Comment, ReplyComment, User
from apps.users.models import Notifications, Subscription


def add_user_subscription(request, pk):
    follower_on = User.objects.get(id=pk)

    subscription, created = Subscription.objects.get_or_create(
        user=follower_on,
    )

    if request.user not in subscription.followers.all():
        subscription.followers.add(request.user)

        my_subscription, created = Subscription.objects.get_or_create(
            user=request.user,
        )
        my_subscription.followings.add(follower_on)

        notification = Notifications.objects.create(
            user=follower_on,
            message=f'Пользователь <a href="/users/profile/{request.user}/">{request.user}</a> подписался на вас',
        )

        return 'add'

    else:
        subscription.followers.remove(request.user)

        my_subscription, created = Subscription.objects.get_or_create(
            user=request.user,
        )
        my_subscription.followings.remove(follower_on)

        return 'remove'


def add_bookmark(request, pk):
    post = get_object_or_404(Post, id=pk)
    if post.bookmark_user.filter(id=request.user.id).exists():
        post.bookmark_user.remove(request.user)
    else:
        post.bookmark_user.add(request.user)
    cache.delete(f'mark_{pk}')
    post.save()


def get_cached_data(request, prefix, queryset, page, serializer_class, paginated_response):
    cache_key = f'{prefix}{request.get_full_path().replace('/', '_')
                .replace('?', '_')
                .replace('&', '_')
                .replace('=', '_')}'

    keys = cache.get(f'{prefix}_cache_keys') or set()
    keys.add(cache_key)
    cache.set(f'{prefix}_cache_keys', keys, None)
    data = cache.get(cache_key)
    if data:
        print(cache_key)
        return data

    if page is not None:
        serializer = serializer_class(instance=page, many=True, context={'request': request})
        data = paginated_response(serializer.data).data
    else:
        serializer = serializer_class(instance=queryset, many=True, context={'request': request})
        data = serializer.data
    cache.set(cache_key, data, 60 * 2)
    return data


def clear_cache(prefix):
    keys = cache.get(f'{prefix}_cache_keys') or set()
    for key in keys:
        cache.delete(key)
    cache.delete(f'{prefix}_cache_keys')
