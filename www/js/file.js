editor = CodeMirror(document.getElementById("editor"),{
  lineNumbers: true,
  mode: "text",
  theme: "code-your-cloud",
  lineWrapping: true,
  indentUnit: 4,
  indentWithTabs: true
});
$(".CodeMirror").css("height","100%");
$(".CodeMirror").css("line-height", "1");
editor.refresh();

editor.on("change", function(cm, change) {
  
  if(!ignore){
	   send_text(editor.getValue());
  }
  else{
    //ignore = true right now
    ignore = false;
  }
});


function go_file_back(){
  refresh_folder();
  hide_file();
  //make sure to reset everything here
  current = "";
  the_title = "";
  $("#chat-list").html("");
  $("#chat-text").val("");
  //editor.setValue("");
}

function set_id(id){
  current = id;
  $("#file-back").fadeIn();
  $("#chat-list").html("");
  $("#chat-text").val("");
	 var url = "https://codeyourcloud.com/mobile/mobile.html?id=" + id;
	 document.getElementById("iframe").src = url;
}

function save(){
  sendData({
    type: "save"
  });
}

function newFile(){
  if(current_folder_open !== "shared"){
    sendData({
      type: "save_as",
      data: "",
      title: "Untitled.txt",
      folder: current_folder_open
    });
  }
  else{
    sendData({
      type: "save_as",
      data: "",
      title: "Untitled.txt",
      folder: my_root_folder
    });
  }
}

function okRename(){
  the_title = $("#rename-input").val();
  check_mode($("#rename-input").val());
  $("#title-elem").html($("#rename-input").val());
  send_title($("#rename-input").val());
}

function send_title(title){
  sendData({
    type: "title",
    title: title
  });
}

function setMode(mode){

  editor.setOption("extraKeys", {});
  editor.setOption("gutters",["CodeMirror-linenumbers"]);
  editor.setOption("lint",false);


  /*
  RUN
  */
   if(mode === "text/javascript"){
    editor.setOption("gutters",["CodeMirror-lint-markers"]);
    editor.setOption("lint",CodeMirror.lint.javascript);
   }
   else if(mode === "text/x-coffeescript"){
   }

  /*
  END RUN
  */
  
  /*
  PUBLISH
  */
   else if(mode === "text/html"){
   }
   else if(mode === "text/x-markdown" || mode === "gfm"){
   }
  /*
  END PUBLISH
  */
     
   else if(mode === "text/css"){

    editor.setOption("gutters",["CodeMirror-lint-markers"]);
    editor.setOption("lint",CodeMirror.lint.css);
   }

   else if(mode === "application/json"){

    editor.setOption("gutters",["CodeMirror-lint-markers"]);
    editor.setOption("lint",CodeMirror.lint.json);
   }

   else if(mode === "text/x-python"){

   }

   else if(mode === "text/x-sql"){

   }

   editor.setOption("mode", mode);
  }


  function check_mode(fileName){
   var ext = "";
   if(fileName.charAt(0) === "."){
    ext = fileName.replace(".","");
   }
   else if(fileName.indexOf(".") !== -1){
    ext = fileName.split(".")[1];
   }

   var mode_to_use = "";

   for(var i = 0; i < modes.length; i++){
    if(modes[i][2] !== ""){
     var possible = modes[i][2].split("|");
     for(var j = 0; j < possible.length; j++){
      if(possible[j] === ext){

            var n = modes[i][0];

            $("#mode-list .core-selected").prop("checked",false);
            $("#mode-list .core-selected").removeClass("core-selected");

            $("#mode-list [data-name='"+n+"']").addClass("core-selected");
            $("#mode-list [data-name='"+n+"']").prop("checked",true);

       mode_to_use = modes[i][1];
      }
     }
    }
   }

   setMode(mode_to_use);
}

function insert_chat(message, you, photo, name){
  var push = "<div class=\"chat-item\"><paper-shadow z=\"1\"></paper-shadow>";
  push = push + "<div class=\"header-item\">";
  push = push + "<img height=\"50px\" width=\"50px\" src=\""+ photo +"\">";
  push = push + "<h4>" + name + "</h4></div><div class=\"message-item\"><pre>";
  push = push + message + "</pre></div></div>";
  $("#chat-list").html($("#chat-list").html() + push);
  
  $("#chat-list").animate({ scrollTop: $('#chat-list')[0].scrollHeight}, 500);
}

document.addEventListener('polymer-ready', function() {
  get_prefs();
});