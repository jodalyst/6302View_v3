// external js: packery.pkgd.js, draggabilly.pkgd.js

window.addEventListener("load", function(){
  //document.addEventListener("load", function(){
  
  // external js: packery.pkgd.js, draggabilly.pkgd.js
  pckry = new Packery( '.cp', {
    itemSelector: '.cp-item',
    columnWidth: 1
  });
  // collection of Draggabillies
  pckry.getItemElements().forEach( function( itemElem ) {
    var draggie = new Draggabilly( itemElem ,{handle:'.handle'});
    draggies.push(draggie);
    pckry.bindDraggabillyEvents( draggie );
    draggie['disable']();
  });

});

var pckry;
var draggies = [];
var isDrag = false;
document.getElementById("grid_lock").addEventListener("change",function() {
    // check if checkbox is checked
    console.log(pckry);
    console.log(draggies);
    var method = isDrag ? 'disable' : 'enable';
    draggies.forEach( function( draggie ) {
        draggie[ method ]();
    });
    // switch flag
    isDrag = !isDrag;
    if (isDrag){
        document.getElementById("grid_status").innerHTML = "Grid UnLocked";
    }else{
        document.getElementById("grid_status").innerHTML = "Grid Locked";
    }
    /*if (document.querySelector('#my-checkbox').checked) {
      // if checked
      console.log('checked');
    } else {
      // if unchecked
      console.log('unchecked');
    }*/
  });
