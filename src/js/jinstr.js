var ui_change = new CustomEvent('ui_change');
var field_built = new CustomEvent('field_built');

//These two lines are used in conjunction with the ui_change event to make sure we don't fire hundreds off in a second for no reason(limits to ten max a second
var ready_to_fire = true;


var isActive = true;


//Use these when laying out colors!
var standard_colors = ["blue","red","green","yellow","purple"];
var mouseX=0;
var mouseY = 0;
document.addEventListener("mousemove",function(e){
        mouseX = e.pageX;
        mouseY = e.pageY;
});

//constants used for plot sizing:
var PLOT_HEIGHT = 200;
var PLOT_WIDTH = 300;


//constants used for WS state machine:
var IDLE = 0;
var BUILDING = 1;
var UPDATE =2;
var RUNNING = 3;
//system state variable for WS state machine
var system_state = IDLE;

//data for building up csv logs:
var data_for_csv=[];
var recording_csv = false;
var csv_header_inputs = []; //headers of inputs in order
var csv_header_outputs = []; //headers of outputs in order

var csv_dom;

//
var toggle_sliders = []; //array of hooks for toggle and slider objects
var data_depth = []; //1 for 1-plots, n for n-plots
var div_list = [];
var unique_counter = 0;
var plots = []; //array of hooks for plot objects

var old_input = [];

var current_inputs = [];

var ws;

var gui_land = document.getElementById("gui_land"); //where draggables end up!



window.onfocus = function () {
  console.log("IN FOCUS");
  isActive = true;
  document.body.style.background = "#fcfff4";
};

window.onblur = function () {
  console.log("OUT OF FOCUS");
  isActive = false;
  document.body.style.background = "red";
};

window.onload = function(){
    /*
    plot = new Time_Series("plotbox",'Accelerations',PLOT_WIDTH, PLOT_HEIGHT,60,[-100,100],3,["green","yellow","blue"],unique);
    plot2 = new Time_Series("plotbox2",'Mouse Moves',PLOT_WIDTH, PLOT_HEIGHT,60,[0,1000],2,["red","blue"],unique+1);
    toggle_sliders.push(new Slider("sliderbox1","Things",0,10,0.1,true,unique+2));
    toggle_sliders.push(new Slider("sliderbox2","Kp",0,10,0.1,false,unique+3));
    toggle_sliders.push(new Toggle("togglebox1","Cat",unique+4));
    toggle_sliders.push(new Toggle("togglebox2","Large Fire Trigger", unique+5));
    timer = setInterval(function(){
        plot2.step([[mouseX],[mouseY]]);
    }, 10);
    */

    document.addEventListener("ui_change", inputEmit);
}

document.getElementById("csv_enable").addEventListener("change",function() {
    if (document.getElementById("csv_enable").checked){
        recording_csv = true;
    }else{ //when you shut it off
        recording_csv = false;
        var nameo = document.getElementById("csv_name").value+"_"+String(Date.now()); //bingo was his nameo
        var header = [csv_header_inputs.concat(csv_header_outputs)];
        var to_out = header.concat(data_for_csv);
        exportCSV(nameo, to_out);
    }
});


document.getElementById("ipsubmit").addEventListener("mousedown",function(){
    var ip = document.getElementById("ipaddress").value; //collect the ip address
    //Should add in some checker/an alert that comes up if you can't actually connect.
    ws = new WebSocket("ws://"+ip); //create new websocket to the ip of interest
    ws.onopen = function(){
      // Web Socket is connected, send data using send()
      console.log("web socket established");
    };
    ws.onmessage = function (evt) {
        MessageParser(evt);
    };

    ws.onclose = function(){
      // websocket is closed.
      console.log("Connection is closed...");
    };
});


var MessageParser = function(evt){
    var received_msg = evt.data;
    //console.log(received_msg);
    switch (system_state){
        case IDLE:
            if (received_msg==="BUILDING"){
                system_state = BUILDING;
                toggle_sliders = [];
                plots = [];
                WipeGUI();
                unique_counter = 0;
                csv_header_inputs = [];
                csv_header_outputs = [];
            }
            break;
        case BUILDING:
            if (received_msg==="END"){
                system_state = UPDATE;
                document.dispatchEvent(field_built);
            }else{
                var newdiv = document.createElement("div"); //new div to house new widget
                newdiv.setAttribute("id","box_"+String(unique_counter)); //give it unique identifier
                div_list.push(newdiv); //push to div list (for overall DOM management
                newdiv.setAttribute("class","cp-item");
                gui_land.appendChild(newdiv);
                console.log(received_msg);
                var build_array = received_msg.split("&"); //chop up the build string
                switch (build_array[0]){ //check the first part of build array for type of widget to build
                    case "S": //slider
                        console.log("adding slider");
                        var title = build_array[1];
                        var low = parseFloat(build_array[2]);
                        var high = parseFloat(build_array[3]);
                        var res = parseFloat(build_array[4]);
                        var toggle = build_array[5]==="1"?true:false;
                        toggle_sliders.push(new Slider("box_"+String(unique_counter),title,low,high,res,toggle,unique_counter));
                        csv_header_inputs.push(title);
                        break;
                    case "T": //toggle
                        console.log("adding toggle");
                        var title = build_array[1];
                        csv_header_inputs.push(title);
                        toggle_sliders.push(new Toggle("box_"+String(unique_counter),title,unique_counter));
                        break;
                    case "P": //plot:
                        console.log("adding plot");
                        var title = build_array[1];
                        var trace_count = parseFloat(build_array[2]);
                        data_depth.push(trace_count);
                        var v_low = parseFloat(build_array[3]);
                        var v_high = parseFloat(build_array[4]);
                        var h_count = parseInt(build_array[5]);
                        if (trace_count ===1){
                            plots.push(new Time_Series("box_"+String(unique_counter),title,PLOT_WIDTH,PLOT_HEIGHT,h_count,[v_low,v_high],1,["blue"],unique_counter));
                            csv_header_outputs.push(title);
                        }else{
                            var colors = standard_colors.slice(0,trace_count+1);
                            plots.push(new Time_Series("box_"+String(unique_counter),title,PLOT_WIDTH,PLOT_HEIGHT,h_count,[v_low,v_high],trace_count,colors,unique_counter));
                            for (i = 0; i<trace_count;i++) csv_header_outputs.push(title+"_"+String(i));
                        }
                        break;
                }
                unique_counter+=1;
            }
            break;
        case UPDATE:
            var data_array = received_msg.split("&"); //chop up the data string;
            if (data_array[0]==="I"){
                var update_data = eval(data_array[1]);
                current_inputs = [];
                for (var i=0; i<toggle_sliders.length;i++){
                    toggle_sliders[i].update(update_data[i]);
                    current_inputs.push(toggle_sliders[i].value());
                }
            }else if(data_array[0]==="O"){
                var actual = eval(data_array[1]);
                var count=0;
                for (i=0;i<plots.length;i++){
                    var to_push = [];
                    for(j=0;j<data_depth[i];j++){
                        to_push.push([actual[count]]);
                        count+=1;
                    }
                    if(isActive){
                        plots[i].step(to_push);
                    }
                }
                if(recording_csv){
                    var fcsv = current_inputs.concat(actual);
                    data_for_csv.push(fcsv);
                }
            }
            break;
    }
};

var WipeGUI = function(){
    var len = div_list.length;
    for (var i = 0; i<len; i++){
        var to_junk = div_list.pop();
        to_junk.remove();
    }
};

var inputEmit = function(){
    var input = "U";
    current_inputs = [];
    for (i=0; i<toggle_sliders.length; i++){
        input += String(toggle_sliders[i].value());
        current_inputs.push(toggle_sliders[i].value());
        if (i!=toggle_sliders.length-1) input+=",";
    }
    if (!array_equals(input,old_input) && ready_to_fire){
    old_input = input.slice(); //copy of array for next time.
    //ready_to_fire = false;
    ws.send(input);
    }
}



//var rate_limit = setInterval(function(){ready_to_fire = true;},100); //leading to disconnects in slider and what gets sent down

/* Based off of code from here:
https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
*/
var exportCSV = function(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

var array_equals = function (array1,array2) {
    // if the other array is a falsy value, return
    if (!array1||!array2)
        return false;

    // compare lengths - can save a lot of time
    if (array1.length != array2.length)
        return false;

    for (var i = 0, l=array1.length; i < l; i++) {
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            if(!array_equals(array1[i],array2[i])){
                return false;
            }
        }
        else if (array1[i] != array2[i]) {
            return false;
        }
    }
    return true;
}


// external js: packery.pkgd.js, draggabilly.pkgd.js

var pckry;
var draggies = [];
var isDrag = false;

document.addEventListener("field_built",function(){
  console.log("we did it!");
  // external js: packery.pkgd.js, draggabilly.pkgd.js
  pckry = new Packery( '.cp', {
    itemSelector: '.cp-item',
    columnWidth: 1
  });
  // collection of Draggabillies
  pckry.getItemElements().forEach( function( itemElem ) {
    var draggie = new Draggabilly(itemElem,{handle:'.cp-drag'});
    draggies.push(draggie);

    draggie.on( 'dragEnd', function( event, pointer ) {
      event.originalTarget.dispatchEvent(new Event("item-didMove"));
    });

    pckry.bindDraggabillyEvents( draggie );
    draggie['disable']();
  });
});

document.getElementById("grid_lock").addEventListener("change",function() {
    // check if checkbox is checked
    // console.log(pckry);
    // console.log(draggies);
    console.log(document.getElementById("grid_lock").checked);
    console.log(isDrag);
    var method = isDrag ? 'disable' : 'enable';
    draggies.forEach( function( draggie ) {
        draggie[ method ]();
    });
    // switch flag
    isDrag = !isDrag;
    if (isDrag){
        document.getElementById("grid_status").innerHTML = "Grid UnLocked";
        document.getElementById("gui_land").className = "cp cp-dragging";
    } else{
        document.getElementById("grid_status").innerHTML = "Grid Locked";
        document.getElementById("gui_land").className = "cp";
    }
  });
