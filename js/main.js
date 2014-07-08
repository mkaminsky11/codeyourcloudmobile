for(var i = 0; i < modes.length; i++){
  var name = modes[i][0];
  var m = modes[i][1];

  var push = "<label class=\"item item-radio mode-item\" onclick=\"setMode('"+m+"')\" data-name=\""+name+"\">";
  push = push + "<input type=\"radio\" name=\"mode\">";
  push = push + "<div class=\"item-content\">";
  push = push + name;
  push = push + "</div><i class=\"radio-icon ion-checkmark\"></i></label>";

  $("#mode-list").html($("#mode-list").html() + push);
}


function checkModeSearch(){
  var query = $("#mode-search").val().toLowerCase();
  $(".mode-item").each(function(index){
    var the_name = $(this).attr("data-name").toLowerCase();
    if(query.indexOf(the_name) !== -1 || the_name.indexOf(query) !== -1){
      $(this).removeClass("hide");
    }
    else{
      $(this).addClass("hide");
    }
  });
}

$('#mode-search').keyup(function(e){
	checkModeSearch();
});

$('#theme-search').keyup(function(e){
  checkThemeSearch();
});

function checkThemeSearch(){
  var query = $("#theme-search").val().toLowerCase();
  $(".theme-item").each(function(index){
    var the_name = $(this).attr("data-name").toLowerCase();
    if(query.indexOf(the_name) !== -1 || the_name.indexOf(query) !== -1){
      $(this).removeClass("hide");
    }
    else{
      $(this).addClass("hide");
    }
  });
}

for(var j = 0; j < themes.length; j++){
  var the_name = themes[j];
	var the_theme = the_name.split(" ").join("-").toLowerCase();

  var push = "<label class=\"item item-radio theme-item\" onclick=\"setTheme('"+the_theme+"')\" data-name=\""+the_name+"\">";
  push = push + "<input type=\"radio\" name=\"theme\">";
  push = push + "<div class=\"item-content\">";
  push = push + the_name;
  push = push + "</div><i class=\"radio-icon ion-checkmark\"></i></label>";

  $("#theme-list").html($("#theme-list").html() + push);
}



function setTheme(theme){
	editor.setOption("theme",theme);
}

$("#number").change(function(){
  if($('#number').is(':checked')){
    editor.setOption("lineNumbers",true);
  }
  else{
    editor.setOption("lineNumbers",false);
  }
});

$("#wrap").change(function(){
  if($('#wrap').is(':checked')){
    editor.setOption("lineWrapping",true);
  }
  else{
    editor.setOption("lineWrapping",false);
  }
});

$("#font").change(function(){
  var new_font = $("#font").val() + "px";
  $(".CodeMirror").css("font-size", new_font);
});


function onOffline() {
  $("#screen").fadeIn();
  $("#loading").fadeOut();

  $("#on").slideUp();
  $("#off").slideDown();
  $("#off-label").slideDown();

  $("#screen").css("background-color","#E74C3C");

  $(".new-modal").each(function(index){
    if($(this).css("display") !== "none"){
      $(this).fadeOut();
    }
  });
}

$(".color-input").change(function(){
  var red = Number($("#red").val());
  var green = Number($("#green").val());
  var blue = Number($("#blue").val());

  var hex = rgbToHex(red,green,blue);

  //set hex

  $("#hex-input").val(hex);
  $("#color-test").css("background-color",hex);
});

$('#hex-input').keyup(function(e){
  set_color($("#hex-input").val());
});

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function isHex(hex){
  var isOk  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
  return isOk;
}

function set_color(c){
  var color = hexToRgb(c);

  $("#red").val(color.r);
  $("#green").val(color.g);
  $("#blue").val(color.b );

  $("#color-test").css("background-color",c);

}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$("#chat-input").on("keypress",function(event){
  if(event.keyCode === 13 || event.keyCode === "13"){
    sendChat($("#chat-input").val());
    $("#chat-input").val("");
  }
});

function sendChat(message){
  sendData({
    type: "new_chat",
    message: message,
    photo: my_photo,
    id: my_userid,
    name: my_name
  });
}
