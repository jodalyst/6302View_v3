#include <WiFi.h>
#include <WebSocketServer.h>
#include <math.h>

//Enter your Wifi and Login credentials here:
const char* ssid     = "Hercules_Mulligan";
const char* password = "comcastsucks99";

WiFiServer server(80);
WebSocketServer webSocketServer;
WiFiClient client;

#define REPORT_PERIOD 50


int value;
long unsigned int timeo;
int report_count;
bool handshake;
bool c;

void setup()
{
    delay(500); //initial wait for safety
    Serial.begin(115200);//set up serial
    delay(10); //teensy tiny wait
    //internet hook up try
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected.");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    server.begin();
    timeo = micros();
    report_count = 0;
    handshake = false;
    c = false;
}

void loop(){
  if (!c){
    client = server.available(); //listen for incoming clients
  }
  if (client){
    if (!handshake){
      if (client.connected() && webSocketServer.handshake(client)) handshake = true;
      
    }
  }else{
    handshake=false; //reset for next time
    c = false;
  }

  
}


void loop(){
 client = server.available();   // listen for incoming clients
  if (client) {                             // if you get a client,
    String currentLine = "";                // make a String to hold incoming data from the client
    if (client.connected() && webSocketServer.handshake(client)){
      Serial.println("Handshake happened:");
      while (client.connected() ) {            // loop while the client's connected
        timeo = micros();
        if (client.available()) {             // if there's bytes to read from the client,
          String data = webSocketServer.getData();
        //String z = String(analogRead(A0)*0.01);
        String y = String(analogRead(A3)*0.01);
        String x = String(analogRead(A6)*0.01);
        String z = String(cos(60*micros()*1e-6));
        //String sdata = "42[\"update_456\",[["+x+"],["+y+"],["+z+"]]]";
        String sdata = "[["+x+"],["+y+"],["+z+"]]";
        unsigned long start = micros(); 
        webSocketServer.sendData(sdata);
        Serial.println(micros()-start);
        }
        while (micros()-timeo<1000);//wait
      }
    }
  }
}
