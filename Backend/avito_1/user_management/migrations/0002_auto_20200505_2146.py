# Generated by Django 3.0.6 on 2020-05-05 18:46

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('user_management', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Calls',
            new_name='Call',
        ),
        migrations.RenameModel(
            old_name='CallParticipants',
            new_name='CallParticipant',
        ),
    ]
