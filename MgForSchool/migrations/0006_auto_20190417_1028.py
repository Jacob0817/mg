# Generated by Django 2.1.5 on 2019-04-17 02:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('MgForSchool', '0005_auto_20190417_0946'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderrecord',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='orders', to=settings.AUTH_USER_MODEL),
        ),
    ]
