#include "Six302.h"

CommManager::CommManager(int sp, int rp) {
  WiFiServer server(80);
  WebSocketServer webSocketServer;
  WiFiClient client;
  incoming_count = 0; //set these to 0
  outgoing_count = 0;
  csv = false;
  step_period = sp;
  report_period = rp;
  report_count = 0;
  report_num_iter = rp/sp;
  handshake = false;
  client_connected = false;
  connection_status = IDLE;
}


bool CommManager::connect(char* ssid,char* password){
    if(VERBOSE){
      Serial.print("Connecting to ");
      Serial.println(ssid);
    }
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        if (VERBOSE)Serial.print(".");
    }
    if (VERBOSE){
      Serial.println("");
      Serial.println("WiFi connected.");
      Serial.println("IP address: ");
      Serial.println(WiFi.localIP());
    }
    server.begin();
}

bool CommManager::addSlider(char* name,float low,float high,float step_size, float* linker){
  int n = sprintf(build_strings[incoming_count+outgoing_count],"S&%s&%.3g&%.3g&%.3g",name,low,high,step_size);
  if(VERBOSE)Serial.print(" Buildstring for Slider: "); Serial.print(n); Serial.println(" characters long");
  incoming_data[incoming_count] = linker; //remember linked-to-variable
  incoming_count ++; //incrememnt the known amount of outgoing data
}

bool CommManager::addPlot(char* name,float v_low,float v_high,int steps_displayed, float* linker, int plots){
  int n = sprintf(build_strings[incoming_count+outgoing_count],"P&%s&%d&%.3g&%.3g&%d",name,plots,v_low,v_high,steps_displayed);
  if(VERBOSE)Serial.print(" Buildstring for Plot: "); Serial.print(n); Serial.println(" characters long");
  outgoing_data[outgoing_count] = linker; //store and remember address to tied variable
  outgoing_size[outgoing_count] = plots; //store and remember if single/multiple plot
  outgoing_count ++;
}

bool CommManager::addToggle(char* name, float* linker){
  int n = sprintf(build_strings[incoming_count+outgoing_count],"T&%s",name);
  if(VERBOSE)Serial.print(" Buildstring for Slider: "); Serial.print(n); Serial.println(" characters long");
  incoming_data[incoming_count] = linker; //remember linked-to-variable
  incoming_count ++; //incrememnt the known amount of outgoing data 
}

/*Checks if CSV has been added yet...if not it adds to build string
 */
bool CommManager::addCSV(){
  if (!csv){
    csv=true;
  } 
}

/*Calling this function: 
 (1) Checks to see if there are any GUI-originating commands, and extracts them, updating variables embedded in main code
 (2) Updates the reporting counter and if needed, transmits the data currently existing in the system variables
 */
bool CommManager::step(){
  if (client_connected && handshake && client.available()) { // if there's bytes to read from the client (but only if it ,
    String data = webSocketServer.getData();
    int current_index=0;
    for (int count=0; count<incoming_count;count++){
      int new_index = data.indexOf("~",current_index);
      String raw;
      if (new_index==-1) raw = data.substring(current_index);
      else raw = data.substring(current_index,new_index);
      *incoming_data[count] = raw.toFloat(); //convert to float and assign to appropriate user variable
      current_index = new_index; 
    }
  }
  if(report_count >= report_num_iter){ //time to check connection and/or report data
    report_count =0; //reset
    switch (connection_status){
      case IDLE:
        client = server.available();
        if (client){ //found a new one...reset everything
          client_connected = false; //reset
          handshake = false; //reset
          connection_status = NEW_CLIENT;
        }
      case NEW_CLIENT:
        if (client.connected()){
          client_connected = true;
          connection_status = CONNECTED;
        }else{
          connection_status = IDLE; //failure
        }
      case CONNECTED:
        if (webSocketServer.handshake(client)){
          handshake = true;
          connection_status = HANDSHOOK;
          build_iterator = -1;
        } else{
          connection_status = IDLE; //failure
        }
      case BUILDING:
        if (build_iterator==-1){
          webSocketServer.sendData("BUILDING");
        }else if (build_iterator == incoming_count+outgoing_count){
          // Will remove CSV choice for now...just hardcode it
          //if (csv) webSocketServer.sendData("END~CSV"); //end build but tack on csv option
//        //else 
          webSocketServer.sendData("END"); //end build with no csv option
          connection_status = RUNNING; //we're done and into running mode.
        }else if (build_iterator){
          webSocketServer.sendData(build_strings[build_iterator]); //send each build string separately
        }
        build_iterator++;
      case RUNNING:
        if (client.connected()){ //check if we're still connected!
          sprintf(data_to_send,"[");
          for (int i=0;i<outgoing_count; i++){
            sprintf(data_to_send+strlen(data_to_send),"[");
            for (int j=0;j<outgoing_size[i];j++){
              sprintf(data_to_send+strlen(data_to_send),"[%.2f],",*(outgoing_data[i]+j));
            }
            sprintf(data_to_send+strlen(data_to_send),"],");
          }
          webSocketServer.sendData(data_to_send);
        }else{ //lost our connection
          client_connected = false; //done
          handshake = false; //done
          connection_status = IDLE;
        }  
    }
  }else{
    report_count++;
  }
  while (micros()-timeo<step_period);
  timeo = micros(); //update time
}

