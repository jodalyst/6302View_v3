function Numerical_Reporter(title,range,color,bg_color,precision=null,socket=null){
  var item = new Item(title);
  var div_id = item.div_id;
  var unique = item.unique;
  var holder = item.container;
  var color = color;
  var bg_color = bg_color;
  var precision = precision;
  var range = range; //shape is : [low,high]..saturate otherwise
  var value = 0.0;
  var socket = socket;

  var format = function(value){
    if (precision==null){
      return value;
    } else {
      return value.toPrecision(precision);
    }
  }
  var reported = document.createElement('div');
  reported.setAttribute('class','reported_number');
  reported.setAttribute('style',"color:"+ color+";background-color:"+bg_color+";");
  reported.setAttribute('id',div_id+unique+"_number");
  reported.innerHTML = format(value);
  holder.appendChild(reported);
  
  item.step = function(value){
    if (range[1] != null && value> range[1]){
        value = range[1];
    }else if (range[0] != null && value <range[0]){
        value= range[0];
    }
    reported.innerHTML = format(value)
  };

};
