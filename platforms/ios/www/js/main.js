function string_to_date(string){
  var date_string = string.slice(0,10); //2014-07-10 year, month, day
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var date_array = date_string.split("-");

  var the_month = months[Number(date_array[1]) - 1];
  var the_day = Number(date_array[2]);
  var the_year = date_array[0];

  return the_month + " " + the_day + "," + the_year;
}

function insert_forwards(folder){
  //insert it with insert_all, then move it forwards
  if(open_open === 1){
    insert_all(folder, "#open-2");
  }
  else{
    insert_all(folder, "#open-1");
  }

  open_forwards();
}

function insert_backwards(folder){
  //insert it with insert_all, move backwards
  if(open_open === 1){
    insert_all(folder, "#open-2");
  }
  else{
    insert_all(folder, "#open-1");
  }

  open_backwards();
}

function insert_still(folder){
  insert_all(folder, "#open-" + open_open);
}

function insert_all(folder, d){
  if(folder.length === 0){
    //do something
    var p = "<div class=\"nothing\"><h4>This Folder</h4><core-icon icon=\"explore\"></core-icon><h4>Is Empty</h4></div>";
    $(d).html(p);
    return;
  }
  $(d).html("");
  for(var i = 0; i < folder.length; i++){
    insert_item(folder[i],d);
  }

  //for each, set click
  $(".open-item").each(function(index){
    $(this).click(function(){
      var f = $(this).attr("data-folder");
      var i = $(this).attr("data-id");
      open_touch(f,i);
    });
  });

  next_open = "still";
}

function insert_item(item, dest){
  var the_id = item.id;
  var the_title = item.name;
  var the_date = "";
  try{
    the_date = string_to_date(item.date);
  }
  catch(e){
    the_date = "undefined";
  }

  var the_folder = item.folder;
  var mime = item.mime

  var icon = "folder";
  if(!the_folder){
    if(mime === "application/vnd.google-apps.presentation"){
      icon = "pres";
    }
    else if(mime === "application/vnd.google-apps.spreadsheet "){
      icon = "sheet";
    }
    else if(mime === "application/vnd.google-apps.document "){
      icon = "doc";
    }
    else{
      if(the_title.indexOf(".") === -1){
        icon = "file";
      }
      else{
        var e = exten(the_title).toLowerCase();
        if(e === "js"){
          icon = "js";
        }
        else if(e === "html"){
          icon = "html";
        }
        else if(e === "css"){
          icon = "css";
        }
        else if(e === "jpg" || e === "tiff" || e === "gif" || e === "svg" || e === "png"){
          icon = "img"; 
        }
        else if(e === "zip" || e === "tar" || e === "gz"){
          icon = "zip";
        }
        else if(e === "coffee"){
          icon = "coffee"; 
        }
        else{
          icon = "file";
        }
      }
    }
  }
  var build = "<div data-id=\""+the_id+"\" data-folder=\""+the_folder+"\" class=\"open-item\"><paper-ripple></paper-ripple><div class=\"img-div\">";
  var img = "<img height=\"40px\" src=\"img/drive/" + icon + ".png\">";
  build = build + img + "</div><div class=\"desc-div\"><h4>";
  build = build + the_title + "</h4><h6>" + the_date + "</h6></div></div>";

  $(dest).html($(dest).html() + build);
}

function exten(string){
  var ext = "";
	if(string.charAt(0) === "."){
		ext = string.replace(".","");
	}
	else if(string.indexOf(".") !== -1){
		ext = string.split(".")[string.split(".").length - 1];
	}

  return ext;
}

function open_touch(folder, id){
  if(!waiting){
    waiting = true;
    if(folder === "true"){
      next_open = "next";
      sendData({
        type: "folder",
        id: id
      });
    }
    else{
      //a file
      file_open = true;
      waiting = false;
      set_id(id);
    }
  }
}

function go_back(){
  if(levels_above_root === 1 && $('#share_toggle').prop('checked')){
    //if sharing + root
    next_open = "back";
    sendData({
      type: "shared"
    });
  }
  else{
    next_open = "back";
    sendData({
      type: "back",
      folder: current_folder_open
    });
  }
}

function signIn(){
  if( navigator.network.connection.type === "none"){
      //onOffline();
  }
  else{
    var ref = window.open(auth_url, '_blank', 'location=no');
    ref.addEventListener('loadstart', function(event) {
      if(event.url.indexOf("https://codeyourcloud.com/#state") !== -1){
        ref.close();
        reload_iframe();
      }
    });
    ref.addEventListener('exit', function(event) {
      reload_iframe();
    });
  }
}

function signOut(){
  var ref = window.open("https://accounts.google.com/logout", '_blank', 'location=no');
  ref.addEventListener('loadstart', function(event){
    setTimeout(function(){
      ref.close();
      lower_screen();
      slide_down("#open-sheet");
      $("#on").attr("onclick","signIn()");
      $("#profile_pic").attr("src","");
    }, 1000);
  });
}


function reload_iframe(){
  sendData({
    type: "reload"
  });
}

function offline(){
  //if in online mode
  if($(".screen").css("background-color") === "rgb(0, 172, 193)"){
    lower_screen();
    $("#on").attr("onclick","");
    $("#info").html("You Are Offline");
    $(".screen").css("background-color","rgb(229, 28, 35)");
  }

  hide_file();
  hide_side();
  file_open = false;
  $("#file-back").fadeOut();
  $(".side-modal").each(function(index){
    if($(this).css("display") !== "none"){
      $(this).css("display","none");
    }
  });
}

function online(){
  if($(".screen").css("background-color","rgb(229, 28, 35)")){
    $(".screen").css("background-color","rgb(0, 172, 193)");
    $("#on").attr("onclick","signIn()")
    $("#info").html("Version 1.0");

    $("#iframe").attr("src","https://codeyourcloud.com/mobile/mobile.html");
  }
}

function shared_change(){
  if(!waiting){
    waiting = true;
    $("#open-back").fadeOut();
    levels_above_root = 0;
    next_open = "next";
    if($('#share_toggle').prop('checked')){
      //mydrive -> shared
      current_folder_open = "shared";
      sendData({
        type: "shared"
      });
    }
    else{
      //shared -> mydrive
      current_folder_open = my_root_folder;
      sendData({
        type: "folder",
        id: my_root_folder
      });
    }
  }
  else{
    //if waiting, switch it back
    //$("#share_toggle").prop("checked", !$("#share_toggle").prop("checked"));
  }
}

function refresh_folder(){
  next_open = "still";
  sendData({
    type: "folder",
    id: current_folder_open
  });
}
