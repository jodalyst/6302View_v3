/*
  Video Frame
  Updated v 1.1
*/
function VideoFrame(title,size,feedurl){
  var item = new Item(title);
  item.setType("VIDEO_FRAME");
  var div_id = item.div_id;
  var unique = item.unique;
  var overall = item.container;
  item.setSize(size[0]+50,size[1]);
  var videofeed = document.createElement("img");
  videofeed.src = feedurl;
  videofeed.width = size[0];
  overall.appendChild(videofeed);
  item.update = function(url) {
    videofeed.src = url;
  }
  return item;
}
