/*
  Just plain HTML
  call the UPDATE function to change HTML
  Updated v 1.1
*/
function Div_Render(title,width=300,height=300){
  var item = new Item(title);
  item.setType("DIV_RENDER");
  var div_id = item.div_id;
  var unique = item.unique;
  var socket = socket;
  var width = width;
  var height = height;

  var container = item.container;

  item.update = function(data) {
    item.logCall("update");
    item.log(LOG.DATA,data);
    container.innerHTML = data;
    evalScriptInHTML(container);
  }
  return item;
};
function evalScriptInHTML(div) {
    var scripts = div.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; ++i) {
        var script = scripts[i];
        eval(script.innerHTML);
    }
};
