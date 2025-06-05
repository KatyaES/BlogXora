import json

import requests

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ4NjkxOTY4LCJpYXQiOjE3NDg2ODgzNjgsImp0aSI6IjhjNWNjNTg3ZDc5YzRjMDk4ZTIyMDk1YmZkNzk0NzE5IiwidXNlcl9pZCI6MX0.AqtKXdFtzcs0SUWx3l4Cl3pxymjR4QyWfahHeTity0E'
request = 'http://127.0.0.1:8000/api/filters/?filter=Свежее'
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'
}
body = {
    'comment': 'new comment',
    'id': 7
}

response = requests.get(request, headers=headers)

if __name__ == '__main__':
    print(response.json())