/*
  PUSHBUTTON
	title
	label
  Updated v 1.1
*/
function PushButton(title,label,color=null,bg_color=null){
  var item = new Item(title);
  item.setType("BUTTON");
	var div_id = item.div_id;
  var unique = item.unique; //unique identifying number
    var label = String(label);
    var color = color;
    var bg_color = bg_color;
    var value; //holds toggle value right now
    var holder = item.container;
    var button_element;
    var setup = function(){
      button_element = document.createElement("button");
      button_element.setAttribute("class","gui_button");
      button_element.setAttribute("id",div_id+unique+"button");
      button_element.innerHTML = label;
      var centered = createDiv_centered();
      centered.appendChild(button_element);
      holder.appendChild(centered);
      item.setSize(height=200,width=100);

      if (bg_color===null || color===null){
          console.log("no color");
      }else{
          button_element.setAttribute("style","background-color:"+bg_color+";color: "+color);
      }
      button_element.addEventListener("mousedown",function(){
        item.logCall("click");
        item.action(1);
      });
      button_element.addEventListener('mouseup',function(){
        item.logCall("click_up");
        item.action(0);
      });
    }
    setup();
};
