#include <Six302.h>
#include <math.h>
#include "mpu9250_esp32.h"

CommManager cm(10000,30000); //create instance of commManager

const int BIT_DEPTH = 16;
unsigned long primary_timer;
#define LOOP_SPEED 100

MPU9250 imu;


float Kp;
float Kd;
float Ki;
float desired;
float accels[3];
float gyros[3];


void setup() {
  delay(500);
  Serial.begin(115200); //for debugging if needed.
  Wire.begin();
  setup_imu();
  cm.connect("J2","18611865");
  cm.addSlider("Kp",-5,5,0.1,false, &Kp); //add a slider called Kp and link it to variable Kp
  cm.addSlider("Kd",-5,5,0.1,false, &Kd); //add a slider called Kd and link to Kd
  cm.addSlider("Ki",-5,10,0.1,false, &Ki);
  cm.addSlider("Desired",-1,1,0.01,false, &desired);
  cm.addPlot("Accelerations",-3,3,100, accels,3); //add a plotter (two plots in same window) called "Voltages" and link to vms array
  cm.addPlot("Gyros",-100,100,100, gyros,3); //add a plotter (two plots in same window) called "Voltages" and link to vms array
}

void loop() {
  float x,y,z;
  imu.readAccelData(imu.accelCount);
  x = imu.accelCount[0]*imu.aRes;
  y = imu.accelCount[1]*imu.aRes;
  z = imu.accelCount[2]*imu.aRes;
  accels[0] = x;accels[1]=y;accels[2]=z;
  imu.readGyroData(imu.gyroCount);
  x = imu.gyroCount[0]*imu.gRes;
  y = imu.gyroCount[1]*imu.gRes;
  z = imu.gyroCount[2]*imu.gRes;
  gyros[0]=x;gyros[1]=y;gyros[2]=z;
  
  cm.step(); //call once per loop, ideally at end of loop after everything has been done for current iteration. Blocks until step duration has occurred.

}



void setup_imu(){
  char c = imu.readByte(MPU9250_ADDRESS, WHO_AM_I_MPU9250);
  Serial.print("MPU9250: "); Serial.print("I AM "); Serial.print(c, HEX);
  Serial.print(" I should be "); Serial.println(0x73, HEX);
  if (c == 0x73){
    imu.MPU9250SelfTest(imu.selfTest);
    imu.initMPU9250();
    imu.calibrateMPU9250(imu.gyroBias, imu.accelBias);
    imu.initMPU9250();
    imu.initAK8963(imu.factoryMagCalibration);
  } // if (c == 0x73)
  else
  {
    while(1) Serial.println("NOT FOUND"); // Loop forever if communication doesn't happen
  }
  imu.getAres();
  imu.getGres();
  imu.getMres();
}


