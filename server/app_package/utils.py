import requests
import uuid
import time
import random
import string
import mimetypes
from .config import Config

def generate_random_image_name(extension):
    random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=6))

    timestamp = int(time.time())

    random_name = f"{timestamp}_{random_string}_{uuid.uuid4().hex}.{extension}"

    return random_name

def extract_text(image_file):

    image_filename = image_file.filename

    image_data = image_file.read()

    mime_type, _ = mimetypes.guess_type(image_filename)

    image_name = generate_random_image_name(mime_type.split("/")[1])

    files = {'file': (image_name, image_data, mime_type)}

    payload = {}
    headers = {
        'apikey': 'helloworld'
    }
    uploadResponse = upload_image_to_bucket(image_data, image_name)

    response = requests.post(Config.OCR_API, files=files, data=payload,headers=headers)

    if response.status_code == 200:
        result = response.json()
        relevant_fields = {
            'parsed_text': result['ParsedResults'][0]['ParsedText'],
            'image_url': uploadResponse
        }
        return relevant_fields
    else:
        return None

def upload_image_to_bucket(image_data, image_name):
    endpoint = Config.IMGBB_URL
    client_api_key = Config.IMGBB_SECRET

    payload = {
        'key': client_api_key
    }

    files = {
        'image': (image_name, image_data)
    }

    response = requests.post(endpoint, files=files, data=payload)

    if response.status_code == 200:
        data = response.json()
        return data['data']['image']['url']
    else:
        print('Response:', response.text)