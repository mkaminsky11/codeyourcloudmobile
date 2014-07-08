function rotate(id, goal){
	var current = $("#" + id).attr("data-rotate");
  current = Number(current);

  rotateTo(id,current,goal);
}

function rotateTo(id, current, goal){
  if(goal > current){
    var c = current + 1;
    setTimeout(function(){
      $("#"+id).css("-webkit-transform","rotateY(" + c+ "deg)");
      $("#"+id).attr("data-rotate",c);

      rotateTo(id,c,goal);
    }, 5);
  }
  else if(goal < current){
    var c = current - 1;
    setTimeout(function(){
      $("#"+id).css("-webkit-transform","rotateY(" + c+ "deg)");
      $("#"+id).attr("data-rotate",c);

      rotateTo(id,c,goal);
    }, 5);

  }
}


function slideIn(id){
  var t = id;
  if($(t).css("display") === "none"){
    $(t).css("display","block");
    $(t).css("bottom","110%");
    $(t).animate({
      bottom: "0%"
    });
  }
}

function slideOut(id){
  var t = id;
  if($(t).css("display") !== "none"){
    $(t).animate({
      bottom: "110%"
    }, function(){
      $(t).css("display","none");
    });
  }
}
