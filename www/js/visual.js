function get_prefs(){
  
  var nums = "";
  var wrap = "";
  var font = "";

  if(localStorage.getItem("nums") === null){
    nums = true;
  }
  else{
    nums = localStorage.getItem("nums") == "true"; 
  }
  
  if(localStorage.getItem("wrap") === null){
    wrap = true;
  }
  else{
    wrap = localStorage.getItem("wrap") == "true"; 
  }
  
  if(localStorage.getItem("font") === null){
    font = 12; //should be in this form
  }
  else{
    font = Number(localStorage.getItem("font"));
  }
  
  document.getElementById("num-toggle").checked = nums;
  editor.setOption("lineNumbers",document.getElementById("num-toggle").checked);
  
  document.getElementById("wrap-toggle").checked = nums;
  editor.setOption("lineWrapping",document.getElementById("wrap-toggle").checked);

  document.getElementById("font-slider").value = font;
  $(".CodeMirror").css("fontSize", font +"px");
}

document.getElementById("num-toggle").addEventListener('change',function(){
  line_nums();
});

document.getElementById("wrap-toggle").addEventListener('change',function(){
  line_wrap();
});


function line_nums() {
  if(local_load_nums){
	   editor.setOption("lineNumbers",document.getElementById("num-toggle").checked);
  
  
    localStorage.setItem("nums", document.getElementById("num-toggle").checked);
  }
  else{
   local_load_nums = true; 
  }
}

function line_wrap() {
	if(local_load_wrap){
	   editor.setOption("lineWrapping",document.getElementById("wrap-toggle").checked);
  
  
    localStorage.setItem("wrap", document.getElementById("wrap-toggle").checked);
  }
  else{
   local_load_wrap = true; 
  }
}

function font_size(){
  if(local_load_font){
    
    $(".CodeMirror").css("font-size", document.getElementById("font-slider").value + "px");
    localStorage.setItem("font", document.getElementById("font-slider").value);
  }
  else{
    local_load_font = true;
  }
}

document.getElementById("font-slider").addEventListener('change',function(){
  font_size();
});



for(var i = 0; i < modes.length; i++){
  var name = modes[i][0];
  var m = modes[i][1];
  var push = "<paper-radio-button name=\""+name+"\" data-name=\""+name+"\" label=\""+name+"\" class=\"mode-item\" onclick=\"setMode('"+m+"')\"></paper-radio-button>";

  $("#mode-list").html($("#mode-list").html() + push);
}

function checkModeSearch(){
  var query = $("#mode-input").val().toLowerCase();
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

function checkThemeSearch(){
  var query = $("#theme-input").val().toLowerCase();
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


$('#mode-input').keyup(function(e){
	checkModeSearch();
});

$('#theme-input').keyup(function(e){
	checkThemeSearch();
});


for(var j = 0; j < themes.length; j++){
  var the_name = themes[j];
	 var the_theme = the_name.split(" ").join("-").toLowerCase();
  
  var push = "<paper-radio-button name=\""+the_theme+"\" data-name=\""+the_name+"\" label=\""+the_name+"\" class=\"theme-item\" onclick=\"setTheme('"+the_theme+"')\"></paper-radio-button>";
  
  $("#theme-list").html($("#theme-list").html() + push);
}

function setTheme(theme){
  editor.setOption("theme",theme);
}

$("#chat-text").focus(function(){
 $("#chat-text").animate({
    height: "150px"
  },300);
});
$("#chat-text").blur(function(){
 $("#chat-text").animate({
    height: "40px"
  },300);
});



function sendChat(){
  var message = $("#chat-text").val();
  $("#chat-text").val("");
  sendData({
    type: "new_chat",
    message: message,
    photo: my_photo,
    id: my_user_id,
    name: my_name
  });
}

function insert_user(name, photo, id){
  var push = "<div class=\"col-item\" data-id=\""+id+"\"><paper-shadow z=\"1\"></paper-shadow>";
  push = push + "<div class=\"header-item\"><img src=\""+photo+"\" height=\"50px\" width=\"50px\">";
  push = push + "<h4>" + name+ "</h4></div></div>";
  
  $("#col-list").html($("#col-list").html() + push);
}

function updatePreview(){
  var previewFrame = document.getElementById('preview');
		var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
		preview.open();
		var c = editor.getValue();
		preview.write(c);
		preview.close();
}

function goLorem(){
  var inp = $("#lorem-input").val();
  if(!isNaN(inp)){
     //ok
    $("#lorem").html("");
    var lorem = new Lorem;
    lorem.type = Lorem.TEXT;
    lorem.query = inp + "s";
    lorem.createLorem(document.getElementById('lorem'));
  }
}

document.getElementById("red").addEventListener('change',function(){
	adjustColorRgb();
});
document.getElementById("green").addEventListener('change',function(){
	adjustColorRgb();
});
document.getElementById("blue").addEventListener('change',function(){
	adjustColorRgb();
});

function adjustColorRgb(){
  var red = Number($("#red").val());
  var green = Number($("#green").val());
  var blue = Number($("#blue").val());
  
  var hex = rgbToHex(red,green,blue);
  if(hex !== $("#color-preview").css("background-color")){
   $("#color-preview").css("background-color",hex); 
  }
  
  if(hex !== $("#color-hex").val()){
   $("#color-hex").val(hex); 
  }
}

function adjustColorHex(){
  if($("#color-hex").val() !== $("#color-preview").css("background-color")){
   $("#color-preview").css("background-color",$("#color-hex").val()); 
  }
  
  var rgb = hexToRgb($("#color-hex").val());
  var red = Number($("#red").val());
  var green = Number($("#green").val());
  var blue = Number($("#blue").val());
  
  if(rgb.r !== red || rgb.b !== blue || rgb.g !== green){
    $("#red").val(rgb.r);
    $("#blue").val(rgb.b);
    $("#green").val(rgb.g);
  }
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

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function checkP(){
  sendData({
    type: "permissions",
    id: current
  });
}

function permissions(users){
  $("#share-list").html("");
  for(var i = 0; i < users.length; i++){
    addShareUser(users[i].name, users[i].emailAddress, users[i].photoLink,users[i].id);
  }
  
  show_modal('share');
}


function removeP(userId){
  sendData({
    type: "remove_p",
    id: userId,
    file: current
  });
}

function addP(){
    var email = $('#share-input').val();
    $('#share-input').val("");
    sendData({
      type:"command",
      command:'insertPermission("'+current+'", "'+email+'", "user", "writer");'
    });
}

function deleteP(i){
  $(".share-item[data-p='"+i+"']").remove();
  removeP(i);
}

function addShareUser(name, email, photo,i){
  var icon = "";
  
  var temp_p = photo;
  if(typeof temp_p === 'undefined'){
   temp_p = "http://4.bp.blogspot.com/-6Y8blNYlkdo/UlXn4Xik9-I/AAAAAAAAvfQ/NpqSuXYD8Zg/s1600/profile.png"; 
  }
  else if(temp_p.indexOf("https://") === -1){
    temp_p = "https:" + temp_p; 
  }
  
  

  if(email !== my_mail){
    icon = "<paper-icon-button icon=\"remove\" class=\"remove-share\" onclick=\"deleteP('"+i+"')\"><paper-shadow z='1'></paper-shadow></paper-icon-button>";
  }
  
  var message = "<div class=\"message-item\"><pre>" + email + "</pre></div>";
  if(typeof email === 'undefined'){
    message= "";
  }
  
  var push = "<div class=\"share-item\" data-p=\""+i+"\"><paper-shadow z=\"1\"></paper-shadow>";
  push = push + "<div class=\"header-item\">";
  push = push + "<img height=\"50px\" width=\"50px\" src=\""+ temp_p +"\">";
  push = push + "<h4>" + name + "</h4>"+icon+"</div>";
  push = push + message + "</div>";

  $("#share-list").html($("#share-list").html() + push);
}