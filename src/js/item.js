var unique = 0;
var world = document.getElementById("gui_land");

function setGlobals(world_name_in) {
  world_name = world_name_in;
}

const LOG = new Enum('SYSTEM', 'WARNING', 'ACTION', 'DATA');

function Logger() {
  /*
  */
  this.csvContent = [];
  this.jsonContent = [];
  this.initialize = function() {
    this.csvContent = [];
    var timestamp = Date.now();
    let row = [timestamp,"SYSTEM","-1", "SYSTEM",LOG.getName(LOG.SYSTEM), "Logger Initalized"];
    this.csvContent.push(row);
  }
  this.initialize();

  this.download = function(name,csv) {
    if(csv) {
      if (name.length > 0) {
        exportCSV(name + " " + new Date().toLocaleString(),this.csvContent);
      } else {
        exportCSV(new Date().toLocaleString(),this.csvContent);
      }
    } else {
      if (name.length > 0) {
        exportJSON(name + " " + new Date().toLocaleString(),this.jsonContent);
      } else {
        exportJSON(new Date().toLocaleString(),this.jsonContent);
      }

    }
  }
  this.log = function(item, type, message,extra) {
    var timestamp = Date.now();
    let row = [timestamp,item.type,item.unique, item.name,LOG.getName(type), message];
    if (extra.length > 0) {
      row.push(extra);
    }
    json = {"item":{"type":item.type,"unique":item.unique,"name":item.name},"type":LOG.getName(type),"message":message,"extra":extra,"timestamp":timestamp};
    this.jsonContent.push(json);
    this.csvContent.push(row);
  }
  return this;
}

var logger = Logger();

/* ITEM class

  UPDATE and STEP

*/

function Item(name) {
  this.name = String(name);
  this.type = "ITEM";
  this.unique = unique;

  this.div_id = String("pos_" + this.unique);
  this.container = document.createElement("div");
  this.windowbar = document.createElement("div");
  this.windowbar_title = document.createElement("div");
  this.object = document.createElement("div");
  this.object.setAttribute("class", "cp-item");
  this.object.id = this.div_id;
  this.object.item = this;

  world.appendChild(this.object);

  this.init = function() {
    var container = this.container;
    this.container.setAttribute("class", "item-container");
    var bar = this.windowbar;
    this.windowbar.setAttribute("class", "item-header");
    this.windowbar_title.innerHTML = this.name;
    this.windowbar_title.setAttribute("id", this.div_id + this.unique + "_holder");
    this.windowbar_title.setAttribute("class", "handle item-label");
    var drag = document.createElement("div");
    drag.setAttribute("class", "cp-drag");
    bar.appendChild(drag);
    bar.appendChild(this.windowbar_title);
    var self = this;

    this.object.addEventListener('item-didMove', function() {
      self.itemDidMove(self);
    });
    this.object.appendChild(bar);
    this.object.appendChild(container);

    return; //Doesn't return anything
  };
  this.setType = function(type) {
    this.type = type;
  }
  this.setSize = function(width = 300, height = 150) {
    this.object.style.width = width + 'px';
    this.object.style.height = (height + 30) + 'px'; //Caz header
  }
  this.step = function() {
    console.log("Step Function Defaults");
    item.logCall("step");
  }
  this.update = function() {
    console.log("Update Function Defaults");
    item.logCall("update");
  }
  this.get = function() {
    console.log("Requesting Values");
  }
  this.action = function() {
    console.log("ACTION!");
  }
  this.init();
  this.setSize();

  this.itemDidMove = function() {
    console.log("Did Move Function Defaults");
  }

  this.log = function(type, data,extra="") {
    logger.log(this, type, data,extra);
  }
  this.logCall = function(funcname,message="") {
    this.log(LOG.ACTION, funcname, message);
  }
  unique += 1;
}

/* Based off of code from here:
https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
*/
function exportCSV(filename, rows) {
  filename += ".csv";
  var processRow = function(row) {
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
    return finalVal + '\r\n';
  };

  var csvFile = '';
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], {
    type: 'text/csv;charset=utf-8;'
  });
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
function exportJSON(filename, rows) {
  filename += ".json";
  var processRow = function(row) {
    return JSON.stringify(row) + '\n';
  };

  var jsonFile = '';
  for (var i = 0; i < rows.length; i++) {
    jsonFile += processRow(rows[i]);
  }

  var blob = new Blob([jsonFile], {
    type: 'text/json;charset=utf-8;'
  });
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
// State anything
//JSON? keyvalues (widget names, state values) Timestamps?
