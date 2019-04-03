from django.db import models
from users.models import User
from django.conf import settings
# Create your models here.
class OrderRecord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    date_add = models.DateTimeField(auto_now_add=True)
    date_start = models.DateTimeField('date_start')
    date_last = models.DurationField('date_last')
    is_val = models.BooleanField('is_valid', default=False)
    class Meta:
        abstract=False
