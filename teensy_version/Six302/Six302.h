#ifndef _Six302_H_
#define _Six302_H_

#include <stdio.h>
#include <string.h>


#define INCOMING_LIMIT 20
#define OUTGOING_LIMIT 10
#define VERBOSE false

#define IDLE 0
#define NEW_CLIENT 1
#define CONNECTED 2
#define BUILDING 3
#define UPDATING 4
#define RUNNING 5

class CommManager
{
  public:
    CommManager(int sp=1000, int rp=20000);
    bool step();
    bool addSlider(char*,float,float,float,bool,float*);
    bool addToggle(char*,float*);
    bool addPlot(char*,float,float,int,float*,int plots=1);
    bool addCSV();
    int overhead();
    float* incoming_data [INCOMING_LIMIT]; //no more than 20 params supported at this moment
    float* outgoing_data [OUTGOING_LIMIT]; //no more than 10 params supported
    int outgoing_size[OUTGOING_LIMIT]; //for knowing if single/multiple plots;
    
  private:
    bool handshake;
    bool client_connected;
    long unsigned int timeo;
    int overhead_meas;
    int incoming_count; //number of data values that are coming in
    int outgoing_count; //number of data points to send out
    bool csv;
    char build_strings[INCOMING_LIMIT+OUTGOING_LIMIT+1][40];//40 char limit
    int step_period; //in microseconds
    int report_period; //in microseconds
    int report_count; //in steps
    int report_num_iter; //number of steps before each reporting of data
    char data_to_send[200];
    int connection_status;
    int build_iterator;
    String in_messages[5];
    int in_message_index;
    
};

#endif

