from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openai import OpenAI
import json

class AnalyzeStyleView(APIView):
    def post(self, request, *args, **kwargs):
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
            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)