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
