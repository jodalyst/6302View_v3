/*
  Template for new objects
  Updated v 1.1
*/
function Template(title){
  var item = new Item(title);
  item.setType("TEMPLATE");
  var div_id = item.div_id;
  var unique = item.unique;
  var overall = item.container;
  return item;
}
