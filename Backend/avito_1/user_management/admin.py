from django.contrib import admin
from .models import Call, CallParticipant
# Register your models here.

admin.site.register(Call)
admin.site.register(CallParticipant)