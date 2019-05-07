from django.db import models
from users.models import User
from django.conf import settings
from django.utils import timezone
# Create your models here.
class OrderRecord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='orders', on_delete=models.SET_NULL, null=True)
    date_add = models.DateTimeField('订单时间', auto_now_add=True)
    group_order = models.SmallIntegerField('企业订购', default=1)
    date_start = models.DateTimeField('开始日期', default=timezone.now)
    date_end = models.DateTimeField('结束日期', default=timezone.now)
    date_last = models.PositiveSmallIntegerField('订购时长', default=0)
    SOM = models.PositiveSmallIntegerField('订单金额', default=0)
    is_val = models.BooleanField('is_valid', default=True)
    class Meta:
        abstract=False


class Nresault(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='Nresaults', on_delete=models.SET_NULL, null=True)
    competitionId = models.CharField('赛事', max_length=32, default='unknownComp')
    eventId = models.CharField('项目', max_length=6, default='unknownEvent')
    roundTypeId = models.CharField('轮次', max_length=1, default='unknownRound')
    pos = models.SmallIntegerField('排名', default=0)
    best = models.IntegerField('最好成绩', default='-1')
    average = models.IntegerField('平均成绩', default='-2')
    value1 = models.IntegerField('第一次复原', default='-2')
    value2 = models.IntegerField('第二次复原', default='-2')
    value3 = models.IntegerField('第三次复原', default='-2')
    value4 = models.IntegerField('第四次复原', default='-2')
    value5 = models.IntegerField('第五次复原', default='-2')
    class Meta:
        abstract=False
    