from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import HttpResponse
from .serializers import CallSerializer, CallParticipantSerializer, UserSerializer

def index(request):
    return HttpResponse("<!DOCTYPE html><html><head><meta name='_globalsign-domain-verification' content='5OJ5Ej2gjZZYxqNXdQ2D0_Cmsw5AY_bG7dEgj99F1R' /><title>Avito-1</title></head><body><p>Hello World!</p></body></html>")


class UserCreate(generics.CreateAPIView):
    authentication_classes = ()
    permission_classes = ()
    serializer_class = UserSerializer


class LoginView(APIView):
    permission_classes = ()

    def post(self, request,):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            return Response({"token": user.auth_token.key})
        else:
            return Response({"error": "Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all().values("username", "email", "first_name")
    serializer_class = UserSerializer