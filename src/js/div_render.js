function Div_Render(title,width=300,height=300, socket=null){
  var item = new Item(title);
  var div_id = item.div_id;
  var unique = item.unique;
  var socket = socket;
  var width = width;
  var height = height;

  var container = item.container;

  item.update = function(data) {
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
