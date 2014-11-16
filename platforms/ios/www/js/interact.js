$(".file-content").on('swipeleft', function(e) {
  //tabs
  show_side();
});

$(".file-content").on('swiperight', function(e) {
  //go back
  go_file_back();
});

$(".open-content").on('swiperight', function(e) {
  //go back
  if($("#open-back").css("display") !== "none"){
    go_back();
  }
});