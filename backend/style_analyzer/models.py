from django.db import models

# Create your models here.
class AnalyzedStyle(models.Model):
    style_name = models.CharField(max_length=255)
    analysis_result = models.TextField()
    image_data = models.TextField(null=True, blank=True)  # New field for base64 image data
    created_at = models.DateTimeField(auto_now_add=True)

    # get dict
    def to_dict(self):
        return {
            'style_name': self.style_name,
            'analysis_result': self.analysis_result,
            'created_at': self.created_at,
            'image_data': self.image_data
        }

    