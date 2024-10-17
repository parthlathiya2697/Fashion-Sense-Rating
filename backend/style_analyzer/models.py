from django.db import models

# Create your models here.
class AnalyzedStyle(models.Model):
    style_name = models.CharField(max_length=255)
    analysis_result = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    