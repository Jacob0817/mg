# Generated by Django 2.1.5 on 2019-05-07 04:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MgForSchool', '0013_auto_20190505_2117'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderrecord',
            name='group_order',
            field=models.SmallIntegerField(default=1, verbose_name='企业订购'),
        ),
    ]
