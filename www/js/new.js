function showMoreDialog(){
  
  //tab-modal-more
  if($("#tab-modal-more").css("display") === "none"){
    $("#tab-modal-more").css("top","-400px").css("display","block").velocity({
      top: 60
    });
  }
  else{
    $("#tab-modal-more").velocity({
      top: "-300px"
    },{
      complete: function(){
        $("#tab-modal-more").css("top","0px").css("display","none");
      }
    });
  }
}

function show_side(){
  if($("#tab-modal-side").css("display") === "none"){
    //open it
    $("#tab-modal-side").css("left","100%").css("display","block").velocity({
        left: "0"
    });
  }
  else{
    //close it 
    $("#tab-modal-side").velocity({
      left: "100%"
    },{
      complete: function(){
        $("#tab-modal-side").css("display","none").css("left","0"); 
      }
    });
    
  }
}

function hide_side(){
  if($("#tab-modal-side").css("display") !== "none"){
    $("#tab-modal-side").velocity({
      left: "100%"
    },{
      complete: function(){
        $("#tab-modal-side").css("display","none").css("left","0"); 
      }
    });
  }
}

function modal_side_options(){
  $(".tab-container-active").css("display","none").removeClass("tab-container-active");
    
  $("#modal_side_options_div").css("display","block").addClass("tab-container-active");
}

function modal_side_color(){
  $(".tab-container-active").css("display","none").removeClass("tab-container-active");
    
  $("#modal_side_color_div").css("display","block").addClass("tab-container-active");
}

function modal_side_preview(){
  updatePreview();
  $(".tab-container-active").css("display","none").removeClass("tab-container-active");
    
  $("#modal_side_preview_div").css("display","block").addClass("tab-container-active");
}

function modal_side_share(){
  $(".tab-container-active").css("display","none").removeClass("tab-container-active");
    
  $("#modal_side_share_div").css("display","block").addClass("tab-container-active");
  
  checkP();
}

function modal_side_chat(){
  $(".tab-container-active").css("display","none").removeClass("tab-container-active");
  
  $("#modal_side_chat_div").css("display","block").addClass("tab-container-active");
}