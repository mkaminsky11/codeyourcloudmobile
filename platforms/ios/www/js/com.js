window.addEventListener("message", receiveMessage, false);
function receiveMessage(event){
  if(event.data !== "!_{h:''}"){
  	var json = JSON.parse(event.data);
  	console.log(json);

    if(json.type === "welcome"){

    }
    else if(json.type === "login"){
      if(json.value === "true"){
        $("#on").attr("onclick","");
        if($(".screen").css("display") !== "none"){
          //screen is down
          $(".spinner").css("display","block");
        }
        else{

        }
      }
      else{
        //if screen is down
        $("#on").attr("onclick","signIn()");
        $(".spinner").css("display","none");
        if($(".screen").css("display") !== "none"){
            //do nothing
        }
        else{
          //bring it down
          lower_screen();
        }
      }
    }
    else if(json.type === "info_drive"){
      my_root_folder = json.folder;
      my_mail = json.mail;
      my_name = json.name;
      
      my_photo = json.photo;
      if(my_photo.indexOf("https://") === -1){
        my_photo = "https:" + my_photo;
      }
      
      $("#profile_pic").attr("src", my_photo);
      
      my_user_id = json.id;

      if(!file_open){
        current_folder_open = my_root_folder;
        sendData({
      		type: "folder",
      		id: my_root_folder
      	});
      }
    }
    else if(json.type === "folder"){
      if($(".screen").css("display") !== "none"){
          //if down
          $(".spinner").css("display","none");
          lift_screen();
      }
      if(!file_open){
        waiting = false;
        current_folder_open = json.id;
        if(next_open === "still"){
          insert_still(json.folder);
        }
        else if(next_open === "next"){
          insert_forwards(json.folder);
        }
        else if(next_open === "back"){
          insert_backwards(json.folder);
        }
      }
    }
    else if(json.type === "shared"){
        waiting = false;
        current_folder_open = "shared";
        if(next_open === "still"){
          insert_still(json.data);
        }
        else if(next_open === "next"){
          insert_forwards(json.data);
        }
        else if(next_open === "back"){
          insert_backwards(json.data);
        }
    }
    else if(json.type === "text"){
        show_file();
        editor.setValue(json.value);
    }
    else if(json.type === "insert_text"){
      editor.replaceRange(json.text, editor.posFromIndex(json.point));
  	}
  	else if(json.type === "delete_text"){
      editor.replaceRange("",editor.posFromIndex(json.back),editor.posFromIndex(json.front));
  	}
    else if(json.type === "new"){
      file_open = true;
      waiting = false;
      set_id(json.id);
    }
    else if(json.type === "title"){
      the_title = json.title;
      check_mode(json.title);
      $("#title-elem").html(json.title);
      $("#rename-input").val(json.title);
    }
    else if(json.type === "insert_chat"){
      var temp_p = json.photo;
      if(temp_p.indexOf("https://") === -1){
        temp_p = "https:" + temp_p; 
      }
      insert_chat(json.message, json.you, temp_p, json.name); 
    }
    else if(json.type === "insert_user"){
      var temp_p = json.photo;
      if(temp_p.indexOf("https://") === -1){
       temp_p = "https:" + temp_p; 
      }
      insert_user(json.name, temp_p, json.session); 
    }
    else if(json.type === "delete_user"){
      //by data-id
      $(".col-item[data-id='"+json.id+"']").remove();
    }
    else if(json.type === "permissions"){
      permissions(json.p);
    }
    else if(json.type === "new_p"){
      checkP();
    }
  }
}

function sendData(data){
	document.getElementById("iframe").contentWindow.postMessage(JSON.stringify(data), "*");
}

function send_text(val){
  sendData({
    type: "text",
    text: val
  });
}
