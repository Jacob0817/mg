# Generated by Django 2.1.5 on 2019-04-04 09:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MgForSchool', '0002_auto_20190404_1600'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderrecord',
            name='date_last',
            field=models.DurationField(verbose_name='订购时长user'),
        ),
        migrations.AlterField(
            model_name='orderrecord',
            name='date_start',
            field=models.DateField(verbose_name='开始日期'),
        ),
    ]