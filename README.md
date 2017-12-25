# 6302View Version 3

Development Branch for the 2018 release of 6302View (using jinstr front-end components)

## Installation Instructions

Currently the browser interface for this setup is served using Flask for local CORS suppression.  For deployment on a local computer you need to do:

```
pip install flask flask-cors
```

This has only been tested on Python3, so make sure you are installing it for Python3.

On the microcontroller side:

* First have the ESP32 Arduino core installed properly.
* Add `ESP32-Websocket` library to your Arduino libraries folder
* Inside the `examples` folder there is the `ESP32_Streaming` example.  That needs to be put onto the ESP32.  Before you do that, make sure you enter the SSID and password for the network you are using your computer on at the top.


When the code is flashed to the ESP32, open up the serial monitor. It will print the IP address it was assigned by your local router.   If you missed it/opened the Serial Monitor up too late, just reset the ESP32 (no danger like with Teensy)

Before or after you upload, feel free to start the minimal server:

```
python3 base.py
```

Then go to `localhost:5000`

A plot of two things (mouse x/y for testing purposes) and what will be data from the ESP is present. No data will be plotting from the ESP32 since you need to establish connection.  To do that, enter the IP address of your ESP32 in the field at top...so if it is 192.168.0.105 enter:

```
192.168.0.105
```

for example...no spaces and must include the `.`.  

Data should immediately start streaming (this was designed using a three axis analog-out accelerometer on it, but even without, random values will be getting plotted)


*Note the ESP32-Websocket Library is a lightly-modified version of the ESP8266 Websocket Library (found <a href="https://github.com/morrissinger/ESP8266-Websocket" target="_blank">here</a>)



## Things to Do:


* Persistent values on user inputs between loads (Done)
* CSV implementation (Done)...still some weird bugs
* Draggablility Fix
* Remove needless console.log (Done)

* Toggle persistence needs to be fixed
* CSV initial bug needs to be fixed.

