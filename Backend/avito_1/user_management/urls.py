from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('hello_world', views.HelloWorld.as_view()),
    path('register/', views.UserCreate.as_view(), name="user_create"),
    path('login/', views.LoginView.as_view(), name="login"),
    path('user_list/', views.UserList.as_view(), name="user_list"),

    
    #path('register', views.Register.as_view()),
]
