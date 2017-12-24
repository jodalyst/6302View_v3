#include "Six302.h"
#include <math.h>


CommManager cm; //create instance of commManager

//Create incoming control variables, parameters, etc...
float Kp;
float Kd;
float desired;
float ct_or_dt;

//Create outgoing variables for control and plotting...
float angle;
float omega;
float dwdt;
float vms[2];
int loop_count;

void setup()
{
    delay(500); //initial wait for safety
    Serial.begin(115200);//set up serial
    cm.connect("Hercules_Mulligan","comcastsucks99");
    cm.addSlider("Kp",-5,5,0.1,false, &Kp); //add a slider called Kp and link it to variable Kp
    cm.addSlider("Kd",-5,5,0.1,false, &Kd); //add a slider called Kd and link it to variable Kd
    cm.addSlider("Desired",-5,5,0.1,true, &desired); // similar...
    cm.addToggle("CT or DT", &ct_or_dt); 
    cm.addPlot("Angle",-3,3,100, &angle); //add a plotter called "Angle" and link it to variable angle
    cm.addPlot("Omega",-50,50,100, &omega); //similar...
    cm.addPlot("dwdt",-10,10,100, &dwdt); //similar...
    cm.addPlot("Voltages",0,3,100, vms,2); //add a plotter (two plots in same window) called "Voltages" and link to vms array
    loop_count = 0;
}

void loop(){

  //User code here!  take in readings, update values, etc...should be all good.

  angle = cos(millis()*0.01);
  omega = Kd;
  dwdt = ct_or_dt?cos(millis()*0.1):1;
  vms[0] = Kd*cos(millis()*0.01);
  vms[1] = -vms[0];

  if(loop_count%1000==0){
    Serial.print(Kp);Serial.print(" ");Serial.print(Kd);Serial.print(" ");Serial.print(desired);Serial.print(" ");Serial.println(ct_or_dt);
  }
  loop_count++;
  cm.step(); //call once per loop, ideally at end of loop after everything has been done for current iteration. Blocks until step duration has occurred.
}



