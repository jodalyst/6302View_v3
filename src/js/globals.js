/*
  GLOBAL functions for creating elements
  Updated v 1.1
*/

function setupDragableWindow(element) {
  var bar = document.createElement("div");
  bar.setAttribute("class","cp-drag");
  element.appendChild(bar);
}
function createDiv_centered() {
  var centered = document.createElement("div");
  centered.style=  "text-align:center";
  return centered;
}

function createElementWithIdClassHTML(type,id,cla,html) {
  var ele = document.createElement(type);
  ele.setAttribute("id",id);
  ele.setAttribute('class',cla);
  ele.innerHTML = html;
  return ele;
}

//
// var imported = document.createElement('script');
// imported.src = 'https://d3js.org/d3.v3.min.js';
// imported.charset = 'utf-8';
// document.head.appendChild(imported);
// scripts = ["/src/js/packery.pkgd.min.js",
// "/src/js/draggabilly.pkgd.min.js",
// "/src/js/nouislider.min.js",
// "/src/js/nipplejs.min.js",
// "/src/js/item.js",
// "/src/js/jinstr.js",
// "/src/js/pushbutton.js",
// "/src/js/div_render.js",
// "/src/js/toggle.js",
// "/src/js/slider.js","/src/js/joystick.js","/src/js/parallel.js" ,"/src/js/wNumb.js","/src/js/numerical_reporter.js" ,"/src/js/time_series.js" ]
//
// for(var i =0;i<scripts.length;i++) {
//   var imported = document.createElement('script');
//   imported.src = scripts[i];
//   document.head.appendChild(imported);
// }
