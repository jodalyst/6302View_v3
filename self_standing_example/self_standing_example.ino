#include <Six302.h>
#include <math.h>
#include "mpu9250_esp32.h"



#define MOTOR_MAX 50
#define STEP_LIMIT 15

#define MOTOR_POLE 0.99

#define stp1 32 //PWM
#define dir1 33
#define stp2 25 //PWM
#define dir2 26
// use 13 bit precission for LEDC timer
#define LEDC_TIMER_13_BIT  13
#define LEDC_BASE_FREQ     5000
#define SIGNAL_FREQ 300

#define DIRECT1 false
#define DIRECT2 true


#define STEP_TIME 10000
#define REPORT_TIME 50000


MPU9250 imu;
CommManager cm(STEP_TIME,REPORT_TIME); //create instance of commManager


float alpha = 0.9; //low pass coefficient for angle
float glpha = 0.75; //low pass coefficient for gyro readings (if needed)



float Kp; //proportional gain
float Kd; //derivative gain
float Ki; //"integral gain
float desired_angle; //desired angle
float reset; //reset integral and other stuff
float m_command; //motor command
float mc_command; //actual command (with pole)
float commands[2];
float accels[3];
float gyros[3];

float angle;

float error_derv;
float error_int;

float error;
float old_error;



void setup() {
  delay(500);
  Serial.begin(115200); //for debugging if needed.
  Wire.begin();
  //initialize imu
  char c = imu.readByte(MPU9250_ADDRESS, WHO_AM_I_MPU9250);
  if (c == 0x73){
    imu.MPU9250SelfTest(imu.selfTest);
    imu.initMPU9250();
    imu.calibrateMPU9250(imu.gyroBias, imu.accelBias);
    imu.initMPU9250();
    imu.initAK8963(imu.factoryMagCalibration);
  } // if (c == 0x73)
  else
  {
    while(1) Serial.println("MPU9255 NOT FOUND"); // Loop forever if communication doesn't happen
  }
  imu.getAres(); imu.getGres(); imu.getMres();


  //initialize stepper motor control pins and driver specs
  pinMode(dir1,OUTPUT);
  pinMode(dir2,OUTPUT);
  digitalWrite(dir1,DIRECT1);
  digitalWrite(dir2,DIRECT2);
  ledcSetup(0, SIGNAL_FREQ, LEDC_TIMER_13_BIT); //0 here links below
  ledcAttachPin(stp1, 0); //the "0" here is the ledc channel
  ledcWriteTone(0,SIGNAL_FREQ);
  ledcSetup(1, SIGNAL_FREQ, LEDC_TIMER_13_BIT); //0 here links below
  ledcAttachPin(stp2, 1); //the "0" here is the ledc channel
  ledcWriteTone(1,SIGNAL_FREQ);


  
  cm.connect("Hercules_Mulligan","comcastsucks99");
  cm.addSlider("Kp",-5,5,0.1,false, &Kp); //add a slider called Kp and link it to variable Kp
  cm.addSlider("Kd",-5,5,0.1,false, &Kd); //add a slider called Kd and link to Kd
  cm.addSlider("Ki",-5,10,0.1,false, &Ki);
  cm.addToggle("Reset", &reset); 
  cm.addPlot("Angle",-3,3,100, &angle); //plot of current angle
  cm.addPlot("Error",-5,5,100, &error);
  cm.addPlot("Error Derv",-100,100,100, &error_derv); //plot of angle derivative
  cm.addPlot("Error Int",-100,100,100, &error_int); //plot of angle integral
  cm.addPlot("Commands",-5,5,100, commands, 2); //plot of motor commands!


}

void loop() {
  //acceleration data for angle, error, and integral of error:
  imu.readAccelData(imu.accelCount);
  for (int i=0;i<3;i++) accels[i] = imu.accelCount[i]*imu.aRes;
  angle = angle*alpha + (atan2(-accels[2],accels[0])*180/3.14159+90)*(1-alpha);
  error = desired_angle-angle;

  //error integral calculations:
  error_int += error*0.001*STEP_TIME;
  if(reset) error_int = 0;
  old_error = error;

  //gyro readings to determine derivative:
  imu.readGyroData(imu.gyroCount);
  for (int i=0;i<3;i++) gyros[i]=imu.gyroCount[i]*imu.gRes;
  error_derv = error_derv*glpha + gyros[1]*(1-glpha);

  m_command = Kp*error + Kd*error_derv+Ki*error_int;

  if (mc_command <0){
    digitalWrite(dir1,HIGH);
    digitalWrite(dir2,LOW);
  }else{
    digitalWrite(dir1,LOW);
    digitalWrite(dir2,HIGH);
  }
  mc_command = MOTOR_POLE*mc_command + (1-MOTOR_POLE)*m_command;
  mc_command = mc_command>MOTOR_MAX?MOTOR_MAX:mc_command<-1*MOTOR_MAX?-MOTOR_MAX:mc_command;
  int to_write = abs(100*int(mc_command));
  ledcWriteTone(0,to_write);
  ledcWriteTone(1,to_write);
  commands[0]=mc_command; commands[1]=m_command;
  cm.step(); //call once per loop, ideally at end of loop after everything has been done for current iteration. Blocks until step duration has occurred.

}




