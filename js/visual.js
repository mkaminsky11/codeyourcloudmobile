function setMode(mode){

	editor.setOption("extraKeys", {});
	editor.setOption("gutters",["CodeMirror-linenumbers"]);
	editor.setOption("lint",false);


	if(mode === "text/javascript"){
		editor.setOption("gutters",["CodeMirror-lint-markers"]);
		editor.setOption("lint",CodeMirror.lint.javascript);
	}
	else if(mode === "text/x-coffeescript"){
	}

	else if(mode === "text/html"){

	}

	else if(mode === "text/x-markdown" || mode === "gfm"){
	}

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
					mode_to_use = modes[i][1];
				}
			}
		}
	}

	setMode(mode_to_use);
}


function welcome(){
  $("#title-edit").addClass("hide");
  $(".save-elem").css("display","none");
	$(".share-elem").css("display","none");
	$(".col-elem").css("display","none");
	$(".chat-elem").css("display","none");
  editor.setValue("");
}
function file(){
  $("#title-edit").removeClass("hide");
  $(".save-elem").css("display","block");
	$(".share-elem").css("display","block");
	$(".col-elem").css("display","block");
	$(".chat-elem").css("display","block");

  editor.on("change", function(cm, change) {
		send_text(editor.getValue());
	});
}

function show_my_drive(){

	$(".my-drive").css("background-color","white");
	$(".my-drive").css("color","black");

	$(".shared-with-me").css("background-color","#95A5A6");
	$(".shared-with-me").css("color","white");

	$(".shared-with-me-check").css("display","none");
	$(".my-drive-check").css("display","block");

	$("#open-list").slideUp();

	show_picker(root_folder);
}

function show_shared_with_me(){

	$(".shared-with-me").css("background-color","white");
	$(".shared-with-me").css("color","black");

	$(".my-drive").css("background-color","#95A5A6");
	$(".my-drive").css("color","white");

	$(".my-drive-check").css("display","none");
	$(".shared-with-me-check").css("display","block");

	$("#open-list").slideUp();

	ask_for_shared();
}
