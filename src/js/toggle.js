function Toggle(div_id,title,unique,names=["OFF","ON"],socket=null){
    var div_id = String(div_id);
    var title = String(title);
    var names = names; //should be 2-long array of values for when switch is low or high
    var val; //holds toggle value right now at any given moment
    var unique = String(unique); //unique identifying number
    var socket = socket;
    var built = false;
    var title_disp; //title of module
    var slider; //div containing slider
    var holder; //div containing title, value, and slider
    var slider_input; //actual "checkbox"
    var label; //needed for css rendering for=divid of slider_input
    var value;  //value displayed in module
    var setup = function(){
        var overall_div = document.getElementById(div_id);
        holder = document.createElement('div');
        holder.setAttribute("id", div_id+unique+"_holder");
        holder.setAttribute("class", "toggle_holder");
        overall_div.appendChild(holder);
        title_disp = document.createElement('div');
        value = document.createElement('div');
        title_disp.setAttribute("id",div_id+unique+"_title");
        value.setAttribute("id",div_id+unique+"_value");
        title_disp.setAttribute("class","handle toggle_title");
        title_disp.innerHTML=title;
        value.innerHTML = names[0];
        value.setAttribute("class","toggle_value");
        slider = document.createElement('div');
        slider.setAttribute("class","ckbx-style-8");
        slider_input = document.createElement('input');
        slider_input.setAttribute("type","checkbox");
        slider_input.setAttribute("name",div_id+unique+"_checkbox");
        slider_input.setAttribute("id",div_id+unique+"_checkbox");
        slider_input.setAttribute("value",1);
        slider_input.setAttribute("name", div_id+unique+"_checkbox");
        label = document.createElement("label");
        label.setAttribute("for",div_id+unique+"_checkbox"); 
        holder.setAttribute("class", "toggle");
        holder.appendChild(title_disp);
        holder.appendChild(value);
        holder.appendChild(slider);
        slider.appendChild(slider_input);
        slider.appendChild(label);
        built = true;
         
    }
    setup();
    var checko = function(element){
        if (slider_input.checked){
            console.log("on");
        }else{
            console.log("off");
        }
        value.innerHTML = names[slider_input.checked?1:0];
        if (socket != null){
            console.log('reporting', {'unique':unique, 'data':slider_input.checked});
            socket.emit('reporting', {'unique':unique, 'data':slider_input.checked});
        }
    }     
    slider_input.addEventListener('change', checko, false);

    if (socket != null){
        socket.on("update_"+unique,function(va){console.log("hit");if (built){console.log(va); console.log(va==true);slider_input.checked=va;}});
    };
};
