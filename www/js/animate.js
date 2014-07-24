function open_forwards(){
  if(current_folder_open !== my_root_folder && current_folder_open !== "shared"){
    levels_above_root++;

    $("#open-back").fadeIn();
  }

  var current_open = "#open-" + open_open;
  var current_close = "";
  if(open_open === 1){
    current_close = "#open-2";
  }
  else{
    current_close = "#open-1";
  }


  $(current_open).css("z-index","1");
  $(current_close).css("z-index","2");

  $(current_close).css("left","100%");
  $(current_close).css("display","block");

  $(current_close).animate({
    left: "0"
  }, 800, function(){

      $(current_open).css("display","none");
      $(current_close).css("z-index","1");
      //at the end, switch them
      if(open_open === 1){
        open_open = 2;
        $("#open-1").html("");
      }
      else{
        open_open = 1;
        $("#open-2").html("");
      }
  });
}

function open_backwards(){
  levels_above_root--;
  if(levels_above_root === 0){
    $("#open-back").fadeOut();
  }

  var current_open = "#open-" + open_open;
  var current_close = "";
  if(open_open === 1){
    current_close = "#open-2";
  }
  else{
    current_close = "#open-1";
  }


  $(current_open).css("z-index","2");
  $(current_close).css("z-index","1");

  $(current_close).css("left","0%");
  $(current_close).css("display","block");

  $(current_open).animate({
    left: "100%"
  }, 800, function(){

      $(current_open).css("display","none");
      $(current_close).css("z-index","1");
      //at the end, switch them
      if(open_open === 1){
        open_open = 2;
        $("#open-1").html("");
      }
      else{
        open_open = 1;
        $("#open-2").html("");
      }
  });
}

function slide_up(sheet){
  var detect = sheet+"-detect";
  $(sheet).css("bottom","-200px");
  $(sheet).css("display","block");

  $(detect).fadeIn();
  $(sheet).animate({
    bottom:"0px"
  },800,function(){

  });
}

function slide_down(sheet){
  var detect = sheet+"-detect";

  $(detect).fadeOut();
  $(sheet).animate({
    bottom:"-200px"
  },800,function(){
    $(sheet).css("display","none");
  });
}

$("#open-sheet-detect").click(function(){
  slide_down("#open-sheet");
});


function lower_screen(){
  $(".screen").css("top","-100%");
  $(".screen").css("display","block");
  $(".screen").animate({
    top: "0%"
  }, 400, function(){

  });
}

function lift_screen(){
  $(".screen").animate({
    top: "-100%"
  }, 400, function(){
    $(".screen").css("display","none");
  });
}

function about_in(){
  $(".about-modal").css("top","-100%");
  $(".about-modal").css("display","block");
  $(".about-modal").animate({
    top: "0%"
  }, 400, function(){

  });
}

function about_out(){
  $(".about-modal").animate({
    top: "-100%"
  }, 400, function(){
    $(".about-modal").css("display","none");
  });
}

function show_file(){
  if($(".file-container").css("display") === "none"){
    file_open = true;
    $(".file-container").css("left","100%");
    $(".file-container").css("display","block");
    $(".file-container").animate({
      left: "0%"
    },500,function(){
      editor.refresh();
      editor.setOption("lineNumbers",document.getElementById("num-toggle").checked);
    });
  }
}

function hide_file(){
  if($(".file-container").css("display") !== "none"){
    file_open = false;
    $(".file-container").animate({
      left: "100%"
    },500,function(){
      $(".file-container").css("display","none");
      $(".file-container").css("left","0%");
      editor.refresh();
    });
  }
}


function show_side(){
  if($("#side").css("display") === "none"){
    file_open = true;
    $("#side").css("left","-85%");
    $("#side").css("display","block");
    $("#side").animate({
      left: "0%"
    },500,function(){
      $("#side-detect").fadeIn();
    });
  }
}

function hide_side(){
  if($("#side").css("display") !== "none"){
    file_open = false;
    $("#side").animate({
      left: "-85%"
    },500,function(){
      $("#side").css("display","none");
      $("#side").css("left","0%");
      $("#side-detect").fadeOut();
    });
  }
}

function show_modal(modal_id){
  var d = "#" + modal_id + "-modal";
  if($(d).css("display") === "none"){
    $(d).css("right","-100%");
    $(d).css("display","block");
    $(d).animate({
      right: "0%"
    },400,function(){
    });
  }
}

function hide_modal(modal_id){
  var d = "#" + modal_id + "-modal";
  if($(d).css("display") !== "none"){
    $(d).animate({
      right: "-100%"
    },400,function(){
      $(d).css("display","none");
      $(d).css("right","0%");
    });
  }
}
