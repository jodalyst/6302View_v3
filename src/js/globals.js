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
