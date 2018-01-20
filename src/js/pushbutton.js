function PushButton(title,label,color=null,bg_color=null,socket=null){
  var item = new Item(title);
	var div_id = item.div_id;
  var unique = item.unique; //unique identifying number
    var label = String(label);
    var color = color;
    var bg_color = bg_color;
    var value; //holds toggle value right now
    var socket = socket;
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
        //$("#"+div_id+unique+"_holder").trigger("create");
    }
    setup();

    if (socket != null){
        button_element.addEventListener("mousedown",function(){
            console.log("PUSH");
            socket.emit('reporting', {'unique':unique, 'data':"Push"});
        });
        //off(clicking not working...is fine for now')
        button_element.addEventListener('mouseup',function(){
            console.log("UNPUSH");
            socket.emit('reporting', {'unique':unique, 'data':"Unpush"});
            socket.emit("THING");
        });
        socket.on("update_"+unique,function(val){
            button_element.style.backgroundColor = val['bgcolor'];
            button_element.style.color = val['color'];
            button_element.innerHTML = val['text'];
            console.log(val)


        });
    };
};
