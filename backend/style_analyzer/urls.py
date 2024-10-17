from django.urls import path
from .views import AnalyzeStyleView, RequestCountView, WriteStyleView, ReadStyleView

urlpatterns = [
    path('api/analyzeStyle/', AnalyzeStyleView.as_view(), name='analyze-style'),
    path('api/requestCount/', RequestCountView.as_view(), name='request-count'),
    path('api/writeStyle/', WriteStyleView.as_view(), name='write-style'),
    path('api/readStyles/', ReadStyleView.as_view(), name='read-styles'),

]