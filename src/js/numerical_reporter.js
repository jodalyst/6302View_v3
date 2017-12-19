function Numerical_Reporter(div_id,title,range,color,bg_color,unique,precision=null,socket=null){
    var div_id = div_id;
    var color = color;
    var bg_color = bg_color;
    var title = title;
    var precision = precision;
    var range = range; //shape is : [low,high]..saturate otherwise
    var value = 0.0;
    var unique = unique; //unique identifying number
    var socket = socket;

    var format = function(value){
        if (precision==null){
            return value;
        } else{
            return value.toPrecision(precision);
        }

    }
    var overall_div = document.getElementById(div_id);
    var holder = document.createElement('div');
    holder.setAttribute("id", div_id+unique+"_holder");
    holder.setAttribute("class", "number_holder");
    var title_disp = document.createElement('div');
    title_disp.setAttribute("id",div_id+unique+"_title");
    title_disp.setAttribute("class","number_title");
    title_disp.innerHTML=title;
    holder.appendChild(title_disp);
    overall_div.appendChild(holder);
    var reported = document.createElement('div');
    reported.setAttribute('class','reported_number');
    reported.setAttribute('style',"color:"+ color+";background-color:"+bg_color+";");
    reported.setAttribute('id',div_id+unique+"_number");
    reported.innerHTML = format(value);
    holder.appendChild(reported);
    this.step = function(value){ 
        if (range[1] != null && value> range[1]){
            value = range[1];
        }else if (range[0] != null && value <range[0]){
            value= range[0];
        }
        reported.innerHTML = format(value)
    };
    var steppo = this.step;
    if (socket != null){
        socket.on("update_"+unique,function(val){steppo(val);});
    }
};
