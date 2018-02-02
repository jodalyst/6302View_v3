
#Copyright (c) 2017 Joseph D. Steinmeyer (jodalyst) and Kevin Fang (thereddking)
#Permission is hereby granted, free of charge, to any person obtaining a copy
#  of this software and associated documentation files (the "Software"), to deal
#  in the Software without restriction, including without limitation the rights to use,
#  copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
#  Software, and to permit persons to whom the Software is furnished to do so, subject
#  to the following conditions:

# The above copyright notice and this permission notice shall be included in all copies
# or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
# INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
# PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
# TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
# OR OTHER DEALINGS IN THE SOFTWARE.

#questions? email me at jodalyst@mit.edu
from importlib import import_module
import time
import math
import os
from flask import Response
from flask import Flask, render_template, session, request
from flask_cors import CORS, cross_origin

#Install pip install opencv-python
# CAMERA=OPENCV python base.py

# import camera driver
if os.environ.get('CAMERA'):
    Camera = import_module('camera_' + os.environ['CAMERA']).Camera
else:
    from camera import Camera
# Raspberry Pi camera module (requires picamera package)
# from camera_pi import Camera


#Start up Flask server:
app = Flask(__name__, template_folder = './',static_folder='../../src')
#app.config['SECRET_KEY'] = 'secret!' #shhh don't tell anyone. Is a secret
#socketio = SocketIO(app, async_mode = async_mode)
CORS(app,resources={
    r'/*/*': {
        'origins': '*',
        'allow_headers': ['Content-Type', 'Authorization']
    }
})

@app.route('/')
def index():
    print ("A user connected")
    #if thread is None:
    #    thread = Thread(target=dataThread)
    #    thread.daemon = True
    #    thread.start()
    return render_template('index.html')

def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
