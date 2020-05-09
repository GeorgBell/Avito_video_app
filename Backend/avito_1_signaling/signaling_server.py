# Import packages
from aiohttp import web
import socketio

# Create dictionaries for user and room management
room_dict = {}
user_dict = {}

# Initiate socketio server and attach to aiohttp web application
sio = socketio.AsyncServer(cors_allowed_origins='*', ping_timeout=35)
app = web.Application()
sio.attach(app)

def get_key(dictionary, val):
    '''
    Function for getting the key by value from dictionaries
    Required for deleting users from dictionary
    '''
    for key, value in dictionary.items():
        if isinstance(value, list):
            if val in value:
                return key
        else:
            if val == value:
                return key
    return "key doesn't exist"

# EVENT SECTION
# Event on connecting to the socket
@sio.event
async def connect(sid, environ):
    print('Connected', sid)
    # Return back user sid
    await sio.emit('getSid', sid)

# Event on online user list request
@sio.event
async def userListReq(sid):
    print(user_dict)
    # Send back user list in form of a dictionary
    await sio.emit('userListRes', user_dict)

# Event on user adding
@sio.event
async def useradd(sid, username):
    user_dict[username] = sid
    print("Added user: ", username)

# Event on user invitation
@sio.event
async def inviteUsr(sid, data):
    data["Sid1"] = sid
    # Send communication data to the opponent
    await sio.emit('inviteUsr', data, to=data["Sid2"])

# Event on user decline
@sio.event
async def declineUsr(sid, op_sid):
    # Send to the opponent decline event
    await sio.emit('declineUsr', to=op_sid)

# Event on user acceptance
@sio.event
async def acceptUsr(sid, data):
    # Form communication data
    room = data["Room"]
    sio.enter_room(data["Sid1"], room)
    sio.enter_room(data["Sid2"], room)
    # Send acceptance to the opponent along with communication data
    await sio.emit('acceptUsr', data,  room=room, skip_sid=sid)
    # Start peer connection process
    await sio.emit('ready', room=room, skip_sid=sid)

# Event on call ending
@sio.event
async def endCall(sid, room):
    # Send endCall event to the opponent
    await sio.emit('endCall', room=room, skip_sid=sid)
    # Close room
    await sio.close_room(room)

# Event on data management required for peer connection setup
@sio.event
async def data(sid, data):
    print('Message from {}'.format(sid))
    # Data exchange between users
    await sio.emit('data', data["main_data"], room=data["room"], skip_sid=sid)

# Socket disconnet
@sio.event
async def disconnect(sid):
    user_dict.pop(get_key(user_dict, sid))
    print('Disconnected', sid)

# Launching the aiohttp application
web.run_app(app, port=9997)
