from django.db import models
from users.models import User
from django.conf import settings
from django.utils import timezone
# Create your models here.
class OrderRecord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='orders', on_delete=models.SET_NULL, null=True)
    date_add = models.DateTimeField('订单时间', auto_now_add=True)
    date_start = models.DateField('开始日期', default=timezone.now)
    date_end = models.DateField('结束日期', default=timezone.now)
    SOM = models.PositiveSmallIntegerField('订单金额', default=0)
    is_val = models.BooleanField('is_valid', default=True)
    class Meta:
        abstract=False
