#ifndef _Six302_H_
#define _Six302_H_

#include <WiFi.h>
#include <WebSocketServer.h>
#include <stdio.h>


#define VERBOSE true
#define INCOMING_LIMIT 20
#define OUTGOING_LIMIT 10

#define IDLE 0
#define NEW_CLIENT 1
#define CONNECTED 2
#define HANDSHOOK 3
#define BUILDING 4
#define RUNNING 5

class CommManager
{
  public:
    WiFiServer server;
    WebSocketServer webSocketServer;
    WiFiClient client;
    CommManager(int, int);
    bool step();
    bool connect(const char*, const char*);
    bool addSlider(char*,float,float,float,float*);
    bool addToggle(char*,bool*);
    bool addPlot(char*,float,float,int,float*,int);
    bool addCSV();
    float* incoming_data [INCOMING_LIMIT]; //no more than 20 params supported at this moment
    float* outgoing_data [OUTGOING_LIMIT]; //no more than 10 params supported
    int outgoing_size[OUTGOING_LIMIT]; //for knowing if single/multiple plots;
    
  private:
    bool handshake;
    bool client_connected;
    long unsigned int timeo;
    int incoming_num; //number of data values that are coming in
    int outgoing_num; //number of data points to send out
    bool csv;
    char build_strings[INCOMING_LIMIT+OUTGOING_LIMIT+1][50];//50 char limit
    int step_period; //in microseconds
    int report_period; //in microseconds
    int report_count; //in steps
    int report_num_iter; //number of steps before each reporting of data
    char data_to_send[200];
    int connection_status;
    int build_iterator;
    
}

#endif

