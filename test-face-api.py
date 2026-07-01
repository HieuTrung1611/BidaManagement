import requests

url = "http://localhost:8080/face/embedding"
files = {'file': open('frontend/public/image/main.png', 'rb')}
try:
    response = requests.post(url, files=files)
    print("Status code:", response.status_code)
    print("Response text:", response.text)
except Exception as e:
    print("Request failed:", str(e))
