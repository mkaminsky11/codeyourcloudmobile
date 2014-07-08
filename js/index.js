window.addEventListener("message", receiveMessage, false);
var sss;
function receiveMessage(event){
  if(event.data !== "!_{h:''}"){
  	var json = JSON.parse(event.data);
  	console.log(json);

    if(json.type === "welcome"){
      if(json.value === "true"){
        welcome();
      }
      else{
        file();
      }
    }

  	if(json.type === "login"){
      if(json.value === "false"){
        logged_in = false;
        //if waiting, and false, then canceled
        if($("#loading").css("display") !== "none"){
          //loading is there, canceled
          $("#loading").fadeOut();
        }
      }
      else if(json.value === "true"){
        logged_in = true;
        $("#screen").fadeOut();
        $("#loading").fadeOut();
      }
  	}
  	else if(json.type === "text"){
      editor.setValue(json.value);
  	}
  	else if(json.type === "delete_user"){
      deleteUser(json.id);
  	}
  	else if(json.type === "insert_user"){
      insertUser(json.name,json.photo,json.session);
  	}
  	else if(json.type === "insert_chat"){
      insertChat(json.name, json.message, json.photo);
  	}
  	else if(json.type === "insert_text"){
      editor.replaceRange(json.text, editor.posFromIndex(json.point));
  	}
  	else if(json.type === "delete_text"){
      editor.replaceRange("",editor.posFromIndex(json.back),editor.posFromIndex(json.front));
  	}
  	else if(json.type === "info_drive"){
  		if(current_folder_open === ""){
  			current_folder_open = json.folder;
        root_folder = json.folder;
  		}

      my_email = json.mail;
      my_photo = json.photo;
      my_userid = json.id;
      my_name = json.name;
  	}
    else if(json.type === "info_realtime"){
      my_sessionid = json.session;
      my_color = json.color;
    }
  	else if(json.type === "folder"){
      current_folder_open = json.id;
  		display_picker(json.folder);
  	}
    else if(json.type === "title"){
      check_mode(json.title);
      set_title(json.title);
    }
    else if(json.type === "new"){
      set_id(json.id);
    }
    else if(json.type === "permissions"){
      permissions(json.p);
    }
    else if(json.type === "new_p"){
      checkP();
    }
    else if(json.type === "shared"){
      display_picker(json.data);
    }
    else if(json.type === "parent_error"){
      if($(".shared-with-me-check").css("display") === "block"){
        //shared open
        ask_for_shared();
      }
      else{
        show_picker(root_folder);
      }
    }
  }
}

function set_id(id){
  clear_realtime();
  current = id;
  slideOut(".open-modal");
	var url = "https://codeyourcloud.com/mobile/mobile.html?id=" + id;
	document.getElementById("iframe").src = url;
}

function ask_for_shared(){
  sendData({
    type: "shared"
  });
}

function open_picker(){
  //set the open html
	show_picker(current_folder_open);
}

function show_picker(id){
	//ask for it
	sendData({
		type: "folder",
		id: id
	});
}//ion-loading-c

function display_picker(folder){
  //put the stuff you need
  $("#open-list").html("");
  for(var a = 0; a < folder.length; a++){
    var name = folder[a].name;
    var f = folder[a].folder;
    var id = folder[a].id;
    var icon = "<i class=\"icon ion-ios7-paper-outline\"></i>";
    var right = "";
    var icon_right = "";

    if(f === true){
      icon = "<i class=\"icon ion-ios7-folder-outline\"></i>";
      right = " item-icon-right";
      icon_right = "<i class=\"icon ion-ios7-arrow-right\"></i>";
    }

    var push = "<a class=\"item item-icon-left" + right +" open-item\" data-folder=\""+ f +"\" data-id=\""+id+"\" data-name=\""+name+"\">" + icon + trim(name) + icon_right + "</a>";
    $("#open-list").html( $("#open-list").html() + push);
  }

  $(".open-item").each(function(index){
    $(this).click(function(){
      var folder = $(this).attr("data-folder");
      var id = $(this).attr("data-id");
      var t_name = $(this).attr("data-name");

      if(folder === "true"){
        $("#open-list").slideUp();
        current_folder_open = id;
        show_picker(id);
      }
      else{
        open_file(id);
      }
    });
  });
  $("#open-list").slideDown();
  //if you need to, show the picker, set the open html
  slideIn(".open-modal");
}

function open_item(item){
	if(item.is_folder){
		current_folder_open = item.id;
		show_picker(item.id);
	}
	else{
		open_file(item.id);
	}
}

function sendData(data){
	document.getElementById("iframe").contentWindow.postMessage(JSON.stringify(data), "*");
}

function reload_iframe(){
  sendData({
    type: "reload"
  });
}

function open_file(id){
  $("#loading").fadeIn();
  set_id(id);
}

function go_back(){
  if(current_folder_open !== root_folder){
    $("#open-list").slideUp();
    sendData({
      type: "back",
      folder: current_folder_open
    });
  }
}

function set_title(title){
  //20 is the maximum
  the_title = title;
  var new_title = title;
  if(title.length > 20){
    //get the first 17 + "..."
    new_title = title.slice(0, 17) + "...";
  }

  $("#header").html(new_title);
  $("#rename-input").val(title);
}

function send_title(title){
  sendData({
    type: "title",
    title: title
  });
}

function send_save(){
  sendData({
    type: "save"
  });
}

function send_new(){
  sendData({
    type: "new",
    folder: current_folder_open
  });
}

function send_text(val){
  sendData({
    type: "text",
    text: val
  });
}

function go_home(){
  welcome();
  clear_realtime();
  var url = "https://codeyourcloud.com/mobile/mobile.html";
  document.getElementById("iframe").src = url;
  current = "";
  $("#header").html("Code Your Cloud");
  $("#chat-input").val("");
}


function trim(to_trim){
  //max of 24
  var t = to_trim;
  if(to_trim.length > 24){
    t = to_trim.slice(0,21) + "...";
  }
  return t;
}


function checkP(){
  if(current !== ""){
    sendData({
      type: "permissions",
      id: current
    });
  }
}

function permissions(users){
  $("#share-list").html("");
  for(var i = 0; i < users.length; i++){
    addShareUser(users[i].name, users[i].emailAddress, users[i].photoLink,users[i].id);
  }

  slideIn(".share-modal");
}

function clear_realtime(){
  my_color = "";
  my_session = "";
  $("#col-list").html("");
  $("#chat-list").html("");
}

function removeP(userId){
  sendData({
    type: "remove_p",
    id: userId,
    file: current
  });
}

function addP(email){
    sendData({
      type:"command",
      command:'insertPermission("'+current+'", "'+email+'", "user", "writer");'
    });
}

function deleteP(i){
  $("[data-p='"+i+"']").remove();
  removeP(i);
}

function addShareUser(name, email, photo,i){
  var icon = "";
  var img = "<img src='"+photo+"'>";
  var e = "<p>"+email+"</p>";

  if(typeof photo === 'undefined'){
    img = "";
  }
  if(typeof email === 'undefined'){
    e = "";
  }

  if(email !== my_email){
    icon = "<i class='icon ion-ios7-close-outline float-right' onclick='deleteP(\""+i+"\")'></i>";
  }
  var to_push = "<a class='item item-avatar' data-p='"+i+"'>"+img+"<h2>" + name + icon + "</h2>"+ e + "</a>";
  $("#share-list").html($("#share-list").html() + to_push);
}

function insertUser(name, photo, id){
  var img = "<img src='" + photo + "'>";
  if(img.indexOf("https://") === -1){
    img = "<img src='https:" + photo + "'>";
  }
  var to_push = "<a class='item item-avatar' data-id='"+id+"'>" + img + "<h2>" + name + "</h2></a>";
  $("#col-list").html($("#col-list").html() + to_push);
}

function deleteUser(id){
  $("[data-id='"+id+"']").remove();
}

function insertChat(name, message, photo){
  var old = Number($(".badge").html())

  $(".badge").html((old + 1) + "");

  var img = "<img src='" + photo + "'>";
  if(img.indexOf("https://") === -1){
    img = "<img src='https:" + photo + "'>";
  }
  var to_push = "<a class='item item-avatar'>" + img + "<h2>" + name + "</h2><p>"+message+"</p></a>";
  $("#chat-list").html($("#chat-list").html() + to_push);

  var d = $('#chat-list');
  d.scrollTop(d.prop("scrollHeight"));
}
