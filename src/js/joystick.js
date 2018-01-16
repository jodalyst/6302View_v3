// Storage array for joysticks
var options = new Array();
var joysticks = new Array();

function Joystick(div_id,name,mode,size,color,unique,catchdistance=null,config=false,static=false,socket=null){
	// If you're building your joystick using main.js from the config.json, it builds here

	var div_id = String(div_id);
	var color = color;
	var title = String(name);
	var bg_color = bg_color;
	var value; //holds toggle value right now
	var unique = String(unique); //unique identifying number
	var socket = socket;
	var overall_div = document.getElementById(div_id);
	var holder;
	var stick;
	var joystick;
	var setup = function(){
			var button_title = document.createElement("div");
			button_title.innerHTML=title;
			var handle = document.createElement("div");
			handle.setAttribute("class","handle");
			holder = document.createElement("div");
			holder.setAttribute("id", div_id+unique+"_holder");
			holder.setAttribute("class", "stick_holder handle");
			holder.appendChild(button_title);
			overall_div.appendChild(handle);
			overall_div.appendChild(holder);
			stick = document.createElement("div");
			holder.appendChild(stick);
			stick.setAttribute("id",div_id+unique+"stick");
			stick.setAttribute("class", "stick_holder");
			joystick = nipplejs.create({
		        zone: stick,
		        mode: 'static',
		        position: {left: '50%', top: '50%'},
		        color: 'red'
		  });
		  joystick.on('start end', function(evt, data) {
		    dump(evt.type);
		    debug(data);
		  }).on('move', function(evt, data) {
		    debug(data);
		  }).on('dir:up plain:up dir:left plain:left dir:down ' +
		        'plain:down dir:right plain:right',
		        function(evt, data) {
		    dump(evt.type);
		  }
		       ).on('pressure', function(evt, data) {
		    debug({
		      pressure: data
		    });
		  });
			setupDragableWindow(holder);

			if (bg_color===null || color===null){
					console.log("no color");
			}else{
					stick.setAttribute("style","background-color:"+bg_color+";color: "+color);
			}
			//$("#"+div_id+unique+"_holder").trigger("create");
	}
	setup();

}
// Print data into elements
function debug(obj) {
  setTimeout(function() {
    console.log(obj);
  }, 0);
}
