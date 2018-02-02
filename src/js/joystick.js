/*
  JOYSTICK
	name
	color
  Updated v 1.1
*/

var options = new Array();
var joysticks = new Array();

function Joystick(name, color = "red") {
  var item = new Item(name);
  item.setType("JOYSTICK");
  var div_id = item.div_id;
  var color = color;
  var unique = item.unique;
  var overall_div = document.getElementById(div_id);
  var holder;
  var stick;
  var joystick;
  var stats;
  var moded = "static";
  var holder = item.container;
  var initJoystick = function() {
    stick = document.createElement("div");
    holder.appendChild(stick);
    stick.setAttribute("id", div_id + unique + "stick");
    stick.setAttribute("class", "stick_holder");
    joystick = nipplejs.create({
      zone: stick,
      mode: moded,
      position: {
        left: "100px",
        top: "80px"
      },
      color: color
    });
    joystick.on('start end', function(evt, data) {
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
  var setup = function() {
    item.setSize(width = 200, height = 200);
    stats = document.createElement("p");
    holder.appendChild(stats);
    initJoystick();
    item.itemDidMove = function() {
      if (stick != null) {
        holder.removeChild(stick);
        initJoystick();
      }
    };
  }

  // Print data into elements
  var debug = function(obj) {
    setTimeout(function() {
      // console.log(obj);
      if (obj.angle) {
        stats.innerHTML = "<p>Angle: " + Math.floor(obj.angle.radian * 10000) / 10000 + "<br/>Force: " + Math.floor(obj.force * 10000) / 10000 + "</p>";
				item.log(LOG.DATA,Math.floor(obj.force * 10000) / 10000 +  " @ " + Math.floor(obj.angle.radian * 10000));
      }
    }, 0);
  }
  setup();

  return item;
}
