from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User


class UserTests(TestCase):

    def setUp(self):
        # Создание пользователя для тестов
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword123',
            email='testuser@example.com'
        )

    def test_register_user(self):
        url = reverse('register')
        data = {
            'username': 'newuser',
            'password1': 'newpassword123',
            'password2': 'newpassword123',
            'email': 'newuser@example.com',
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)  # Проверка редиректа
        self.assertRedirects(response, reverse('profile'))  # Проверка на страницу профиля

        user = User.objects.get(username='newuser')
        self.assertTrue(user)  # Убедись, что новый пользователь создан

    def test_login_user(self):
        url = reverse('login')
        data = {
            'username': 'testuser',
            'password': 'testpassword123',
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)  # Убедись, что редирект на профиль
        self.assertRedirects(response, reverse('profile'))

    def test_profile_page(self):
        # Авторизация пользователя
        self.client.login(username='testuser', password='testpassword123')

        url = reverse('profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)  # Проверка на доступность страницы профиля
        self.assertContains(response, 'testuser')  # Убедись, что имя пользователя отображается на странице

    def test_edit_profile_invalid_data(self):
        # Авторизация пользователя
        self.client.login(username='testuser', password='testpassword123')

        url = reverse('edit_profile')
        data = {
            'username': '',  # Пустое поле для username должно вызвать ошибку
        }
        response = self.client.post(url, data)
        self.assertFormError(response, 'user_form', 'username', 'This field is required.')  # Проверка ошибки формы

    def test_change_password(self):
        # Авторизация пользователя
        self.client.login(username='testuser', password='testpassword123')

        url = reverse('change_password')
        data = {
            'new_password1': 'newpassword123',
            'new_password2': 'newpassword123',
        }
        response = self.client.post(url, data)
        print(response.status_code, response.url)
        self.assertRedirects(response, reverse('profile'))  # Проверка редиректа после изменения пароля
        user = User.objects.get(username='testuser')
        self.assertTrue(user.check_password('newpassword123'))  # Проверка нового пароля

    def test_invalid_password_after_change(self):
        # Авторизация пользователя
        self.client.login(username='testuser', password='testpassword123')

        url = reverse('change_password')
        data = {
            'new_password1': 'newpassword123',
            'new_password2': 'newpassword123',
        }
        self.client.post(url, data)

        # Попытка входа с неправильным паролем
        response = self.client.post(reverse('login'), data={
            'username': 'testuser',
            'password': 'wrongpassword',
        })
        self.assertEqual(response.status_code, 200)  # Проверка на ошибку входа с неправильным паролем
        self.assertContains(response, 'Invalid username or password')  # Сообщение об ошибке