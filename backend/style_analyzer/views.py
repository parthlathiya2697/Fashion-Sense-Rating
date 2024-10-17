from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openai import OpenAI
import json
from backend import settings


from django.shortcuts import render
from .models import AnalyzedStyle

def community_styles(request):
    styles = AnalyzedStyle.objects.all()
    return render(request, 'community_styles.html', {'styles': styles})


class WriteStyleView(APIView):
    def post(self, request, *args, **kwargs):
        style_name = request.data.get('style_name')
        analysis_result = request.data.get('analysis_result')

        if not style_name or not analysis_result:
            return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

        AnalyzedStyle.objects.create(style_name=style_name, analysis_result=analysis_result)
        return Response({'message': 'Style data saved successfully'}, status=status.HTTP_201_CREATED)
    

class ReadStyleView(APIView):
    def get(self, request, *args, **kwargs):
        styles = AnalyzedStyle.objects.all().values('style_name', 'analysis_result', 'created_at', "image_data")
        return Response({'styles': list(styles)}, status=status.HTTP_200_OK)


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
            image_data = data.get('image')

            # Initialize the OpenAI client
            client = OpenAI()

            # Create a chat completion
            completion = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Analyze this image_data and provide a rating from 1-5 for the person's clothing style, along with a brief description of the style. Additionally, suggest potential improvements to the current clothing style, including color adjustments and minor manipulations. Format the response as JSON with 'rating', 'description', and 'improvements' fields with a list of points to reach the styling level of 5/5."},
                            {"type": "image_url", "image_url": {"url": image_data}},
                        ],
                    },
                ],
            )

            # Extract the analysis result from the completion
            analysis_result = completion.choices[0].message.content
            analysis_result = analysis_result.strip('```json').strip('```').strip()
            analysis_result = json.loads(analysis_result)
            # analysis_result = {
            #     "rating": 3,
            #     "description": "Casual summer style featuring a simple black t-shirt paired with white patterned shorts and sunglasses, suitable for a relaxed day out.",
            #     "improvements": [
            #     "Introduce a pop of color with accessories or shoes to enhance the look.",
            #     "Opt for a fitted or slightly tailored t-shirt to improve overall silhouette.",
            #     "Consider swapping shorts for chinos or tailored shorts for a more polished appearance.",
            #     "Add a light jacket or blazer for layering, to elevate the style.",
            #     "Experiment with patterns or textures in clothing to add visual interest."
            #     ],
            # }

            # # Assuming analysis_result is a JSON string, ensure it's parsed correctly
            # try:
            #     analysis_result_dict = json.loads(str(analysis_result).replace("'",'"'))
            # except json.JSONDecodeError as e:
            #     return Response({'error': f'JSON decode error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

            # increease the request count
            settings.request_count += 1

             # # Save the analysis result to the database
            db_obj = AnalyzedStyle.objects.create(style_name="User Style", analysis_result=analysis_result, image_data= image_data)
            db_dict = db_obj.to_dict()
            

            return Response({'data': db_dict}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
