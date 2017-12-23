/*
Default Slider module:
div_id: The div_id to which you want to attach the slider
label: The label (title) of the slider
min: The minimum value you want the slider to be able to output
max: The maximum value you want the slider to be able to output
resolution: The resolution/granularity of the output values
toggle: do you want toggling capabilities (will add two additional range limiting sliders, and a period input and toggle toggle
unique: A unique (for the GUI) phrase used in DOM construction to prevent cross-talk between event handling
color: (default null): Unsupported right now
socket: (default null): a standard websocket object for outside communication emission
*/

function Slider(div_id,label,min, max, resolution,toggle,unique,color=null,socket=null){
    var div_id = String(div_id);
    var label = String(label);
    var color = color;
    var unique = String(unique); //unique identifying number
    var socket = socket;
    var overall_div = document.getElementById(div_id);
    var holder;
    var min = parseFloat(min);
    var max = parseFloat(max);
    var slider_element;
    var toggle_element;
    var is_toggling = false;
    var spec_input;
    var total_element;
    var toggle_timer;
    var bott_lim; 
    var top_lim;
    var low_label; //will contain text of "Lower Limit:"
    var low_input; //will contain value of lower limit
    var high_label; //will contain 
    var high_input;
    var val_holder;
    var current_period; //currently used period!
    var toggling; //holds the state of toggling

    var setup = function(){
        //var handle = document.createElement("div");
        //handle.setAttribute("class","handle");
        holder = document.createElement("div");
        holder.setAttribute("id", div_id+unique+"_holder");
        holder.setAttribute("class", "slider_holder");
        //holder.appendChild(handle);
        overall_div.appendChild(holder);
        var label_element = document.createElement("div");
        label_element.setAttribute("class","slider_label handle");
        label_element.innerHTML = label;
        holder.appendChild(label_element);
        slider_element = document.createElement("div");
        slider_element.setAttribute("id", div_id+unique+"slider");
        holder.appendChild(slider_element); 
        val_holder = document.createElement("div");
        spec_input = document.createElement("input");
        spec_input.setAttribute("type","number");
        spec_input.setAttribute("step",resolution);
        spec_input.setAttribute("min",min);
        spec_input.setAttribute("max",max);
        spec_input.setAttribute("id",div_id+unique+"manual_input");
        spec_input.setAttribute("class","numerical_input");
        //var inlabel = document.createElement("span");
        //inlabel.innerHTML= "Value:";
        //holder.appendChild(inlabel);
        holder.appendChild(val_holder); 
        if (toggle){
            noUiSlider.create(slider_element, {
                start: [min,min,max],
                connect: [true,false,false,true],
                tooltips: [false, false, false],
                range: {
                    'min': min,
                    'max': max
                }
            });
            low_label = document.createElement("div"); 
            low_input = document.createElement("input");
            low_input.setAttribute("type","number");
            low_input.setAttribute("step",resolution);
            low_input.setAttribute("min",min);
            low_input.setAttribute("max",max);
            low_input.setAttribute("id",div_id+unique+"low_input");
            low_input.setAttribute("class","numerical_input");
    
            high_input = document.createElement("input");
            high_input.setAttribute("type","number");
            high_input.setAttribute("step",resolution);
            high_input.setAttribute("min",min);
            high_input.setAttribute("max",max);
            high_input.setAttribute("id",div_id+unique+"high_input");
            high_input.setAttribute("class","numerical_input");

            val_holder.appendChild(low_input);
            val_holder.appendChild(spec_input);
            val_holder.appendChild(high_input);
            var period_container = document.createElement("span");
            var period_label = document.createElement("span");
            period_label.innerHTML = "Period(s):";
            period_container.appendChild(period_label);
            var period_input = document.createElement("input");
            period_input.setAttribute("type","number");
            period_input.setAttribute("step",1);
            period_input.setAttribute("min",0);
            period_input.setAttribute("value",1);
            period_input.setAttribute("max",100); //anything more is stupid
            period_input.setAttribute("id",div_id+unique+"period_input");
            period_input.setAttribute("class","numerical_input");
            period_container.appendChild(period_input);
            //Build toggle part
            toggle_element = document.createElement("div");
            toggle_element.setAttribute("id", div_id+unique+"toggler");
            toggle_element.setAttribute("class","ckbx-style-8");
            var toggle_in = document.createElement("input");
            toggle_in.setAttribute("type","checkbox");
            toggle_in.setAttribute("id", div_id+unique+"checkbox");
            toggle_in.setAttribute("value","1");
            var toggle_lab = document.createElement("label");
            toggle_lab.setAttribute("for",div_id+unique+"checkbox");
            toggle_element.appendChild(toggle_in);
            toggle_element.appendChild(toggle_lab);
            holder.appendChild(toggle_element);
            holder.appendChild(period_container);
            slider_element.noUiSlider.on('update',function(value) {
                console.log(value);
                spec_input.value = value[1];
                bott_lim = parseFloat(value[0]);
                low_input.value = value[0];
                top_lim = parseFloat(value[2]);
                high_input.value = value[2];
            });
            toggle_in.addEventListener("change",function(){
                if (toggle_in.checked){
                    toggling = true;
                    var period_value = parseFloat(period_input.value);
                    console.log(period_value);
                    if (period_value===0 || period_value == null){
                        alert("Period must be greater than 0 seconds, child.");
                    }else{
                        toggle_timer = setInterval(function(){
                            if (parseFloat(spec_input.value) === top_lim){
                                slider_element.noUiSlider.set([null,bott_lim,null]);
                            }else{
                                slider_element.noUiSlider.set([null,top_lim,null]);
                            } 
                    },1000*period_value);
                    }
                }else{
                    toggling = false;
                    clearInterval(toggle_timer);
                }
            });

            //listeners for manual typed changes:
            /*
            period_input.addEventListener('click', function(){
                if (toggling){
                    period_input.value = current_period;
                    alert("Can't change period during active toggling!");
                }else{
                    current_period = parseFloat(period_input.value);
                }
            });
            */
            low_input.addEventListener('click', function(){
                slider_element.noUiSlider.set([this.value,null,null]);
            });
            high_input.addEventListener('click', function(){
                slider_element.noUiSlider.set([null,null,this.value]);
            });
        }else{

            val_holder.appendChild(spec_input);
            noUiSlider.create(slider_element, {
                start: min,
                connect: true,
                range: {
                    'min': min,
                    'max': max
                }
            });
            slider_element.noUiSlider.on('update',function(value) {
                console.log(value);
                spec_input.value = value;
            });
        }

    }
    setup();

    spec_input.addEventListener('click', function(){
        if (toggle) slider_element.noUiSlider.set([null,this.value,null]);
        else  slider_element.noUiSlider.set([this.value]);
    });
};





