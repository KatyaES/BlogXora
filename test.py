import json

import requests

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ4Njc4MDQxLCJpYXQiOjE3NDg2NzQ0NDEsImp0aSI6Ijc1ZTljYTAzMGI1YTQ5ZDU4N2U0YTcyYWNlM2E3ZGFmIiwidXNlcl9pZCI6MX0.AYXctdh4D9ItDeWPe1ckiMlnsLrMz054fd1ccMNye18'
request = 'http://127.0.0.1:8000/api/reply-comments/'
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'
}
body = {
    'comment': 'new comment',
    'id': 7
}

response = requests.post(request, headers=headers, json=body)

if __name__ == '__main__':
    print(response.json())