import requests

url = "http://localhost:8000/upload"
files = {'file': ('test.png', b'fake data', 'image/png')}
try:
    response = requests.post(url, files=files)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
