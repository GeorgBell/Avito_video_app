# Avito_video_app
Video app project carried out in the course of Yandex Cloud CTO School

## Project presentation
![Slide 1](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/1.PNG)
![Slide 2](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/2.PNG)
![Slide 3](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/3.PNG)
![Slide 4](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/4.PNG)
![Slide 5](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/5.PNG)
![Slide 6](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/6.PNG)
![Slide 7](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/7.PNG)
![Slide 8](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/8.PNG)
![Slide 9](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/9.PNG)
![Slide 10](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/10.PNG)
![Slide 11](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/11.PNG)
![Slide 12](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/12.PNG)
![Slide 13](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/13.PNG)
![Slide 14](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/14.PNG)
![Slide 15](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/15.PNG)
![Slide 16](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/16.PNG)
![Slide 17](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/17.PNG)
![Slide 18](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/18.PNG)
![Slide 19](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/19.PNG)
![Slide 20](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/20.PNG)

## Video call app demo
### The index page
The service is hosted on Yandex Cloud virtual machine. NGINX plays the key role in the project:
- it hosts frontend including htmls and js-files;  
- it proxies requests to the Django REST service and aiohttp + python-socketio signaling server.
![demo 1](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/demo1.png)

## Register page
All the registered users are stored in the database. Ajax and jQuery is used in the frontside to access REST backend
![demo 2](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/demo2.png)

When user registers, alert informs user about successful account creation and offers to log in
![demo 3](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/demo3.png)

## Login page
The login process is carried with token authorization. The pic below demonstrates warning when user enters wrong credentials
![demo 4](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/demo4.png)

## User communication page
After logging in, client gets to the "User communication page". The user list shows:
- all registered user;
- the client (in gray - this option is not clickable);
- online users (in green).  
Web sockets are used to track the online state of users.
![demo 5](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/demo5.png)

## Notifications at the communication page
Notification on calling offline user
![demo 6](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/demo6.png)
    
Notification on calling online user
![demo 7](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/demo7.png)

Notification on incoming call  
![demo 8](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/demo8.png)

## Video connection
![demo 9](https://github.com/GeorgBell/Avito_video_app/blob/master/ppt_images/demo9.png)
