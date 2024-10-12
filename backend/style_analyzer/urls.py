from django.urls import path
from .views import AnalyzeStyleView

urlpatterns = [
    path('api/analyzeStyle/', AnalyzeStyleView.as_view(), name='analyze-style'),
]