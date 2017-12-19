
#Copyright (c) 2017 Joseph D. Steinmeyer (jodalyst)
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
import time
import math
from flask import Flask, render_template, session, request
from flask_cors import CORS, cross_origin


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
    return render_template('base.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)

