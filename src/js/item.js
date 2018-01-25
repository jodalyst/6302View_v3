var unique = 0;
var world = document.getElementById("gui_land");
function setGlobals(world_name_in) {
  world_name = world_name_in;
}

const LOG = new Enum('SYSTEM', 'WARNING','ACTION','DATA');
function Logger() {
  /*

  */
  this.csvContent = "data:text/csv;charset=utf-8,";
  this.initialize = function() {
    this.csvContent = "data:text/csv;charset=utf-8,";
    var timestamp = Date.now();
    let row = [timestamp,"-1",LOG.SYSTEM.toString(),"Logger Initalized"].join(",");
    this.csvContent += row + "\r\n";
  }
  this.initialize();

  this.download = function() {
    var encodedUri = encodeURI(this.csvContent);
    // window.open(encodedUri);
    link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', new Date().toLocaleString(););
    link.click();
  }
  this.log = function(unique,type,message) {
    var timestamp = Date.now();
    let row = [timestamp,unique,type.toString(),message].join(",");
    this.csvContent += row + "\r\n";
  }
  return this;
}

var logger = Logger();

/* ITEM class

  UPDATE and STEP

*/

function Item(name) {
  this.name = String(name);
  this.unique = unique;

  this.div_id = String("pos_" + this.unique);
  this.container = document.createElement("div");
  this.windowbar = document.createElement("div");
  this.windowbar_title = document.createElement("div");
  this.object = document.createElement("div");
  this.object.setAttribute("class","cp-item");
  this.object.id = this.div_id;
  this.object.item = this;

  world.appendChild(this.object);

  this.init = function () {
    var container = this.container;
    this.container.setAttribute("class","item-container");
    var bar = this.windowbar;
    this.windowbar.setAttribute("class","item-header");
		this.windowbar_title.innerHTML = this.name;
		this.windowbar_title.setAttribute("id", this.div_id+this.unique+"_holder");
		this.windowbar_title.setAttribute("class", "handle item-label");
    var drag = document.createElement("div");
    drag.setAttribute("class","cp-drag");
    bar.appendChild(drag);
    bar.appendChild(this.windowbar_title);
    var self = this;

    this.object.addEventListener('item-didMove',function() {self.itemDidMove(self)});
    this.object.appendChild(bar);
    this.object.appendChild(container);

    return; //Doesn't return anything
  };
  this.setSize = function(width=300,height=150) {
    this.object.style.width = width + 'px';
    this.object.style.height = (height+30) + 'px';//Caz header
  }
  this.step = function() {
    console.log("Step Function Defaults");
    item.logCall("step");
  }
  this.update = function() {
    console.log("Update Function Defaults");
    item.logCall("update");
  }

  this.init();
  this.setSize();

  this.itemDidMove = function() {
    console.log("Did Move Function Defaults");
  }

  this.log = function(type,data) {
    logger.log(this.unique,type,data);
  }
  this.logCall = function(funcname) {
    this.log(LOG.ACTION,funcname);
  }
  unique += 1;
}

// State anything
//JSON? keyvalues (widget names, state values) Timestamps?
