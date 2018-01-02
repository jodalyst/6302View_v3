#include <Six302.h>
#include <math.h>
#include "mpu9250_esp32.h"

CommManager cm(1000,25000); //create instance of commManager

const int BIT_DEPTH = 16;

MPU9250 imu;

void setup_imu(){
  delay(500);
  Serial.begin(115200);
  cm.connect("J2","18611865");

  char c = imu.readByte(MPU9250_ADDRESS, WHO_AM_I_MPU9250);
  Serial.print("MPU9250: "); Serial.print("I AM "); Serial.print(c, HEX);
  Serial.print(" I should be "); Serial.println(0x73, HEX);
  if (c == 0x73){
    //imu.MPU9250SelfTest(imu.selfTest);
    imu.initMPU9250();
    //imu.calibrateMPU9250(imu.gyroBias, imu.accelBias);
    //imu.initMPU9250();
    //imu.initAK8963(imu.factoryMagCalibration);
  } // if (c == 0x73)
  else
  {
    while(1) Serial.println("NOT FOUND"); // Loop forever if communication doesn't happen
  }
  imu.magCalMPU9250(imu.magBias, imu.magScale);
  Serial.println("AK8963 mag biases (mG)");
  Serial.println(imu.magBias[0]);
  Serial.println(imu.magBias[1]);
  Serial.println(imu.magBias[2]);

  Serial.println("AK8963 mag scale (mG)");
  Serial.println(imu.magScale[0]);
  Serial.println(imu.magScale[1]);
  Serial.println(imu.magScale[2]);
  imu.getAres();
  imu.getGres();
  imu.getMres();
}


void setup() {
  Serial.begin(115200); //for debugging if needed.
  Wire.begin();
  randomSeed(analogRead(0));  //initialize random numbers
  primary_timer = millis();
  delay(20); //wait 20 milliseconds
  setup_imu();
}

void loop() {
  float x,y,z;
  imu.readAccelData(imu.accelCount);
  x = imu.accelCount[0]*imu.aRes;
  y = imu.accelCount[1]*imu.aRes;
  z = imu.accelCount[2]*imu.aRes;
  Serial.print("Accel: "); Serial.print(x); Serial.print(" ");Serial.print(y); Serial.print(" ");Serial.println(z);
  imu.readGyroData(imu.gyroCount);
  x = imu.gyroCount[0]*imu.gRes;
  y = imu.gyroCount[1]*imu.gRes;
  z = imu.gyroCount[2]*imu.gRes;
  Serial.print("Gyro: "); Serial.print(x); Serial.print(" ");Serial.print(y); Serial.print(" ");Serial.println(z);
  imu.readMagData(imu.magCount);
  x = imu.magCount[0]*imu.mRes;
  y = imu.magCount[1]*imu.mRes;
  z = imu.magCount[2]*imu.mRes;
  Serial.print("Mag: "); Serial.print(x); Serial.print(" ");Serial.print(y); Serial.print(" ");Serial.println(z);
  while (millis()-primary_timer<LOOP_SPEED); //wait for primary timer to increment
  primary_timer =millis();

}
