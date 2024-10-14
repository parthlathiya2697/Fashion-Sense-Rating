from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openai import OpenAI
import json
from backend import settings



class RequestCountView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            return Response({'request_count': settings.request_count, 'max_request_count': settings.request_count_max}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class AnalyzeStyleView(APIView):
    def post(self, request, *args, **kwargs):
        if settings.request_count >= settings.request_count_max:
            return Response({'error': 'Request limit exceeded'}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        try:
            data = request.data
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
                            {"type": "text", "text": "Analyze this image and provide a rating from 1-5 for the person's clothing style, along with a brief description of the style. Additionally, suggest potential improvements to the current clothing style, including color adjustments and minor manipulations. Format the response as JSON with 'rating', 'description', and 'improvements' fields."},
                            {"type": "image_url", "image_url": {"url": image}},
                        ],
                    },
                ],
            )

            first_choice = completion.choices[0]
            if not first_choice or not first_choice.message or not first_choice.message.content:
                raise ValueError('Invalid response structure')

            result = json.loads(first_choice.message.content.replace('```json\n', '').replace('\n```', '') or '{}')
            settings.request_count += 1  # Increment the request count
            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)