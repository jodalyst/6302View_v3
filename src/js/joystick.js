//Reset function when remove
//Number offset (magnitude)


// Storage array for joysticks

//ITEM REVAMP DONE

var options = new Array();
var joysticks = new Array();

function Joystick(name,moded="static",color="red",catchdistance=null,config=false,static=false,socket=null){
	// If you're building your joystick using main.js from the config.json, it builds here
	var item = new Item(name);
	var div_id = item.div_id;
	var color = color;
	var bg_color = bg_color;
	var value; //holds toggle value right now
	var unique = item.unique;
	var socket = socket;
	var overall_div = document.getElementById(div_id);
	var holder;
	var stick;
	var joystick;
	var stats;
	var moded = moded;
	var holder = item.container;
	var initJoystick = function() {
		stick = document.createElement("div");
		holder.appendChild(stick);
		stick.setAttribute("id",div_id+unique+"stick");
		stick.setAttribute("class", "stick_holder");
		joystick = nipplejs.create({
					zone: stick,
					mode: moded,
					position: {left: "100px", top:  "80px"},
					color: color
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
	}
	var setup = function(){
			item.setSize(width=200,height=200);
			stats = document.createElement("p");
			holder.appendChild(stats);
			initJoystick();
			item.itemDidMove = function() {
				if (stick != null) {
					holder.removeChild(stick);
					initJoystick();
				}
			};


			if (bg_color===null || color===null){
					console.log("no color");
			}else{
					stick.setAttribute("style","background-color:"+bg_color+";color: "+color);
			}
			//$("#"+div_id+unique+"_holder").trigger("create");
	}

	// Print data into elements
	var debug = function(obj) {
	  setTimeout(function() {
	    // console.log(obj);
			if(obj.angle) {
				stats.innerHTML = "Angle: " + obj.angle.radian + "<br/>Force: " + obj.force;
			}
	  }, 0);
	}
	setup();
	return item;
}
