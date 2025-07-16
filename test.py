import json

import requests
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5ODQ4NjY4LCJpYXQiOjE3NDk4NDUwNjgsImp0aSI6Ijg4YWY1YTc4N2ZmYjRlZDM5OTNhYzQwMGUwMWFiOWZlIiwidXNlcl9pZCI6NH0.btC6-k2a0ECVp2WS467slifFxgQanhn4AOLVJCg-CeQ'
request = 'http://127.0.0.1:8000/public_api/v1/comments/'
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'
}
body = {
    'login': 'Denis',
    'password': 'o2d6sh8vv4'
}

response = requests.get(request, headers=headers).json()
for i in response:
    for k, v in i.items():
        print(f'{k}: {v}')
    print()