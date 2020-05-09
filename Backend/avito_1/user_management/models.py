from django.db import models
from django.contrib.auth.models import User


class Call(models.Model):
    """
    Call entity needed for call history
    """
    call_id = models.CharField(max_length=100)
    call_name = models.CharField(max_length=255)
    call_start_time = models.DateTimeField(auto_now=True)
    call_end_time = models.DateTimeField(auto_now=True)
    call_text_url = models.CharField(max_length=25)
    call_video_url = models.CharField(max_length=25)

    def __str__(self):
        return self.call_name

class CallParticipant(models.Model):
    """
    Entity that depicts the call participants
    """
    call_id = models.ForeignKey(Call, on_delete=models.CASCADE)
    room_id = models.CharField(max_length=100)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    user_sid = models.CharField(max_length=25)
    
    def __str__(self):
        return self.call_name

