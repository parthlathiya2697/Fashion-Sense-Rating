from django.urls import path
from .views import analyze_style

urlpatterns = [
    path('api/analyzeStyle/', analyze_style, name='analyze_style'),
]