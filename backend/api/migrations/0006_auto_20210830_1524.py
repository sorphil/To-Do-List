# Generated by Django 3.1 on 2021-08-30 11:24

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20210830_1523'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='pub_date',
            field=models.DateField(default=datetime.datetime(2021, 8, 30, 15, 24, 25, 16189)),
        ),
    ]
