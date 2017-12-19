#include "Six302.h"
#include <math.h>


CommManager cm;


float Kp;
float Kd;
float Ki;

float angle;
float omega;
float dwdt;

void setup()
{
    delay(500); //initial wait for safety
    Serial.begin(115200);//set up serial
    cm.connect("Hercules_Mulligan","comcastsucks99");
    cm.addSlider("Kp",-5,5,0.1, &Kp);
    cm.addSlider("Kd",-5,5,0.1, &Kd);
    cm.addSlider("KI",-5,5,0.1, &Ki);
    cm.add
    

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
