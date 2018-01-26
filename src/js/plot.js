/*
  Merged TimeSeries and Parallel PLOTTING DEVICE

  TYPE = "BAR" OR "LINE"
  2 FUNCTIONS = UPDATE or STEP (only works for "LINE")



  Updated v 1.1

*/
function Plot(title, type, width, height, x_range, y_range, num_traces, colors) {
  var item = new Item(title);
  item.setType("PLOT_" + type);
  var div_id = item.div_id;
  var unique = item.unique;
  var overall = item.container;
  var type = type; //LINE OR BAR
  item.setSize(width + 100, height + 30);

  var colors = colors;
  var y_range_orig = y_range.slice(0); //used for reset mechanisms.
  var vals_orig = x_range;
  var y_range = y_range.slice(0);
  var num_traces = num_traces;
  var vals = x_range;
  var total_height = height;
  var xchange = false;
  var margin = {
    top: 5,
    right: 0,
    bottom: 30,
    left: 40
  };
  var data = [];
  for (var i = 0; i < num_traces; i++) {
    data.push(d3.range(vals).map(function() {
      return 0;
    }));
  }
  var height = total_height - margin.top - margin.bottom;
  var total_width = width;
  var width = total_width - margin.right - margin.left;
  overall.setAttribute("id", div_id + unique + "_overall");
  var top_row = document.createElement('div');
  top_row.setAttribute('id', div_id + unique + "top");
  top_row.setAttribute('class', "chart");
  overall.appendChild(top_row);
  var bottom_row = document.createElement('div');
  bottom_row.setAttribute('id', div_id + unique + "bot");
  bottom_row.setAttribute('class', "chart");
  overall.appendChild(bottom_row);
  var line;
  var traces;

  var x_axis;
  var y_axis;
  var x;
  var y;
  var x_grid;
  var y_grid;
  var chart;
  var chartBody;

  var draw_plot_region = function() {
    if (xchange) {
      xchange = false;
      if (vals > data[0].length) { //increasing amount
        for (var i = 0; i < num_traces; i++) {
          var tempdata = d3.range(vals - data[i].length).map(function() {
            return 0;
          });
          data[i] = tempdata.concat(data[i]);
        }
      } else if (vals < data[0].length) {
        var to_remove = data[0].length - vals;
        for (var i = 0; i < num_traces; i++) {
          data[i] = data[i].slice(to_remove);
        }
      }
    }
    chart = d3.select("#" + div_id + unique + "top").append("svg")
      .attr("id", "svg_for_" + div_id + unique).attr("width", total_width).attr("height", total_height).attr('style', "display:inline-block;").attr("class", "gsc");
    y = d3.scale.linear().domain([y_range[0], y_range[1]]).range([height, 0]);
    x = d3.scale.linear().domain([0, vals]).range([0, width]);
    x_axis = d3.svg.axis().scale(x).orient("bottom").ticks(11);
    y_axis = d3.svg.axis().scale(y).orient("left").ticks(11);
    x_grid = d3.svg.axis().scale(x).orient("bottom").ticks(20).tickSize(-height, 0, 0).tickFormat("");
    y_grid = d3.svg.axis().scale(y).orient("left").ticks(11).tickSize(-width, 0, 0).tickFormat("");
    // Grid elements
    chart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    chart.append("g").attr("class", "grid").attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")").call(x_grid);
    chart.append("g").attr("class", "grid").attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(y_grid);
    clippy = chart.append("defs").append("svg:clipPath").attr("id", div_id + unique + "clip").append("svg:rect").attr("id", div_id + unique + "clipRect").attr("x", margin.left).attr("y", margin.top).attr("width", width).attr("height", height);
    chartBody = chart.append("g").attr("clip-path", "url(#" + div_id + unique + "clip" + ")");

    chart.append("g").attr("class", "x axis").attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")").call(x_axis).selectAll("text")
      .attr("y", -5).attr("x", 20).attr("transform", "rotate(90)");
    chart.append("g").attr("class", "y axis").attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(y_axis);


    if (type == "LINE") {
      line = new d3.svg.line().x(function(d, i) {
        return x(i) + margin.left;
      }.bind(this)).y(function(d, i) {
        return y(d) + margin.top;
      }.bind(this));
      traces = [];
      for (var i = 0; i < num_traces; i++) {
        traces.push(chartBody.append("path").datum(data[i]).attr("class", "line").attr("d", line).attr("stroke", colors[i]));
      }
    } else {
      var w = (width / vals);
      var change = Math.min(w / 6, 2);
      if (w < 10) {
        change = 0;
      }
      var pph = height / (y_range[1] - y_range[0]); //Pixel per unit;
      chart.selectAll(".bar")
        .data(data[0])
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) {
          return margin.left + (width / vals) * i + change;
        })
        .attr("y", function(d) {
          var ptop = margin.top + (y_range[1] - d) * pph;
          if (d < 0) {
            ptop = margin.top + y_range[1] * pph;
          }
          return ptop;
        })
        .attr("width", (width / vals - change * 2) + "px")
        .attr("height", function(d) {
          var ptop = margin.top + (y_range[1] - d) * pph;
          if (d < 0) {
            ptop = margin.top + y_range[1] * pph;
          }
          var other = Math.abs(d) * pph;
          if (Math.abs(d) * pph + ptop > height) {
            other = height - ptop;
          }
          return Math.min(Math.abs(d) * pph, other);
        });
    }
  };
  draw_plot_region();

  var createNavigationButtons = function() {
    var div_start = div_id + unique;

    var BC2 = createElementWithIdClassHTML('div', div_start + "BC2", "v_button_container", "");
    top_row.insertBefore(BC2, top_row.firstChild);

    var vp = createElementWithIdClassHTML('button', div_start + "VP", 'scaler', 'Z+');
    var vrs = createElementWithIdClassHTML('button', div_start + "VRS", 'scaler', 'RS');
    var vm = createElementWithIdClassHTML('button', div_start + "VM", 'scaler', 'Z-');
    BC2.appendChild(vp);
    BC2.appendChild(vrs);
    BC2.appendChild(vm);

    var BC1 = createElementWithIdClassHTML('div', div_start + "BC1", "v_button_container", "");
    top_row.insertBefore(BC1, top_row.firstChild);

    var op = createElementWithIdClassHTML('button', div_start + "OI", 'scaler', 'O+');
    var od = createElementWithIdClassHTML('button', div_start + "OD", 'scaler', 'O-');
    BC1.appendChild(op);
    BC1.appendChild(od);

    var BC4 = createElementWithIdClassHTML('div', div_start + "BC1", "h_button_container", "");
    bottom_row.appendChild(BC4);

    var hm = createElementWithIdClassHTML('button', div_start + "HM", 'scaler', 'Z-');
    var hrs = createElementWithIdClassHTML('button', div_start + "HRS", 'scaler', 'RS');
    var hp = createElementWithIdClassHTML('button', div_start + "HP", 'scaler', 'Z+');

    BC4.appendChild(hm);
    BC4.appendChild(hrs);
    BC4.appendChild(hp);
  }
  createNavigationButtons();

  item.step = function(values) {
    for (var i = 0; i < values.length; i++) {
      traces[i].attr("d", line).attr("transform", null);
      for (var j = 0; j < values[i].length; j++) {
        data[i].push(values[i][j]);
        data[i].shift();
      }
    }
    item.logCall("step");
    item.log(LOG.DATA,values);
  };
  item.update = function(values) {
    for (var i = 0; i < values.length; i++) {
      data[i] = [];
      for (var j = 0; j < values[i].length; j++) {
        data[i].push(values[i][j]);
      }
    }
    item.logCall("update");
    item.log(LOG.DATA,values);
    update_scales();
  }
  var update_scales = function() {
    d3.select("#svg_for_" + div_id + unique).remove();
    draw_plot_region();
  };

  document.addEventListener("click", function(event) {
    switch (event.target.id) {
      case div_id + unique + "VM":
        var parent_range = y_range[1] - y_range[0];
        var parent_mid = (y_range[1] - y_range[0]) / 2 + y_range[0];
        y_range[1] = (y_range[1] - parent_mid) * 2 + parent_mid;
        y_range[0] = parent_mid - (parent_mid - y_range[0]) * 2;
        update_scales();
        break;
      case div_id + unique + "VP":
        var parent_range = y_range[1] - y_range[0];
        var parent_mid = (y_range[1] - y_range[0]) / 2 + y_range[0];
        y_range[1] = (y_range[1] - parent_mid) * 0.5 + parent_mid;
        y_range[0] = parent_mid - (parent_mid - y_range[0]) * 0.5;
        update_scales();
        break;
      case div_id + unique + "VRS":
        y_range = y_range_orig.slice(0);
        update_scales();
        break;
      case div_id + unique + "HM":
        if (vals > 4) {
          vals = Math.round(vals / 2);
        }
        xchange = true;
        update_scales();
        break;
      case div_id + unique + "HP":
        vals = vals * 2;
        xchange = true;
        update_scales();
        break;
      case div_id + unique + "HRS":
        vals = vals_orig;
        xchange = true;
        update_scales();
        break;
      case div_id + unique + "OD":
        var diff = y_range[1] - y_range[0];
        var tp = diff * 0.1;
        y_range[1] = y_range[1] + tp;
        y_range[0] = y_range[0] + tp;
        update_scales();
        break;
      case div_id + unique + "OI":
        var diff = y_range[1] - y_range[0];
        var tp = diff * 0.1;
        y_range[1] = y_range[1] - tp;
        y_range[0] = y_range[0] - tp;
        update_scales();
        break;
    }
  });
  return item;
};
