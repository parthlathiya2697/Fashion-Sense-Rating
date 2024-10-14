from django.urls import path
from .views import AnalyzeStyleView, RequestCountView

urlpatterns = [
    path('api/analyzeStyle/', AnalyzeStyleView.as_view(), name='analyze-style'),
    path('api/requestCount/', RequestCountView.as_view(), name='request-count'),
]