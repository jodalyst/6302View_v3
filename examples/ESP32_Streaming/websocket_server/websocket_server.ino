#include "Six302.h"
#include <math.h>


CommManager cm; //create instance of commManager

//Create incoming control variables, parameters, etc...
float Kp;
float Kd;
float Ki;

//Create outgoing variables for control and plotting...
float angle;
float omega;
float dwdt;
float vms[2];

void setup()
{
    delay(500); //initial wait for safety
    Serial.begin(115200);//set up serial
    cm.connect("Hercules_Mulligan","comcastsucks99");
    cm.addSlider("Kp",-5,5,0.1, &Kp); //add a slider called Kp and link it to variable Kp
    cm.addSlider("Kd",-5,5,0.1, &Kd); //add a slider called Kd and link it to variable Kd
    cm.addSlider("KI",-5,5,0.1, &Ki); // similar...
    cm.addPlot("Angle",-3,3,100, &angle); //add a plotter called "Angle" and link it to variable angle
    cm.addPlot("Omega",-50,50,100, &omega); //similar...
    cm.addPlot("dwdt",-10,10,100, &dwdt); //similar...
    cm.addPlot("Voltages",0,3,100, vms,2); //add a plotter (two plots in same window) called "Voltages" and link to vms array
}

void loop(){

  //User code here!  take in readings, update values, etc...should be all good.
  
  cm.step(); //call once per loop. Blocks until step duration has occurred.
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
