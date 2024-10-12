from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from openai import OpenAI

from dotenv import load_dotenv
load_dotenv()

@csrf_exempt
def analyze_style(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            image = data.get('image')

            # Initialize the OpenAI client
            client = OpenAI()

            # Create a chat completion
            completion = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Analyze this image and provide a rating from 1-5 for the person's clothing style, along with a brief description of the style. Format the response as JSON with 'rating' and 'description' fields."},
                            {"type": "image_url", "image_url": {"url": image}},
                        ],
                    },
                ],
            )

            first_choice = completion.choices[0]
            if not first_choice or not first_choice.message or not first_choice.message.content:
                raise ValueError('Invalid response structure')

            result = json.loads(first_choice.message.content.replace('```json\n', '').replace('\n```', '') or '{}')
            return JsonResponse(result)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=400)