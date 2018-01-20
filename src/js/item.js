var unique = 0;
var world = document.getElementById("gui_land");
function setGlobals(world_name_in) {
  world_name = world_name_in;
}

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

    drag.addEventListener('item-didMove',function() {self.itemDidMove(self)});
    this.object.appendChild(bar);
    this.object.appendChild(container);

    //Event add
    return; //Doesn't return anything
  };
  this.setSize = function(width=300,height=150) {
    this.object.style.width = width + 'px';
    this.object.style.height = (height+30) + 'px';//Caz header
  }
  this.step = function() {
    console.log("Step Function Defaults");
  }
  this.update = function() {
    console.log("Update Function Defaults");
  }
  this.init();
  this.setSize();

  this.itemDidMove= function() {
    // console.log(this);
    console.log("Did Move Function Defaults");
  }
  unique += 1;
}
