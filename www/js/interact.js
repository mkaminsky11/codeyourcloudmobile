function showNewFile(){
  $("#new-detect").fadeIn();
  
  $("#new-detect-close").fadeIn();
  $("#new-detect-javascript").fadeIn();
  $("#new-detect-html").fadeIn();
  $("#new-detect-css").fadeIn();
  $("#new-detect-php").fadeIn();
  $("#new-detect-text").fadeIn();
  
  //new-detect-javascript
  $("#new-detect-close").animate({
    right: 10,
    bottom: 10
  },{
    duration: 250,
    queue: false,
    complete: function(){
    }
  });
  
  $("#new-detect-javascript").animate({
    left: 50,
    bottom: 60
  },{
    duration: 500,
    queue: false,
    complete: function(){
    }
  });
  
  $("#new-detect-html").animate({
    left: 50,
    bottom: 120
  },{
    duration: 750,
    queue: false,
    complete: function(){
    }
  });
  
  $("#new-detect-css").animate({
    left: 50,
    bottom: 180
  },{
    duration: 1000,
    queue: false,
    complete: function(){
    }
  });
  
  $("#new-detect-php").animate({
    left: 50,
    bottom: 240
  },{
    duration: 1250,
    queue: false,
    complete: function(){
    }
  });
  
  $("#new-detect-text").animate({
    left: 50,
    bottom: 300
  },{
    duration: 1500,
    queue: false,
    complete: function(){
    }
  });
}

function hideNewFile(){
  
  $("#new-detect-close").animate({
    right: -1000,
    bottom: -1000
  },{
    duration: 250,
    queue: false,
    complete: function(){
    }
  });
  
  $("#new-detect-javascript").animate({
    left: 1000,
    bottom: -1000
  },{
    duration: 500,
    queue: false,
    complete: function(){
    }
  });
  
  $("#new-detect-html").animate({
    left: 1000,
    bottom: -1000
  },{
    duration: 750,
    queue: false,
    complete: function(){
    }
  });
  
  $("#new-detect-css").animate({
    left: 1000,
    bottom: -1000
  },{
    duration: 1000,
    queue: false,
    complete: function(){
    }
  });
  
  $("#new-detect-php").animate({
    left: 1000,
    bottom: -1000
  },{
    duration: 1250,
    queue: false,
    complete: function(){
    }
  });
  
  $("#new-detect-text").animate({
    left: 1000,
    bottom: -1000
  },{
    duration: 1500,
    queue: false,
    complete: function(){
        $("#new-detect").fadeOut();
      
        $("#new-detect-close").fadeOut();
        $("#new-detect-html").fadeOut();
        $("#new-detect-javascript").fadeOut();
        $("#new-detect-css").fadeOut();
        $("#new-detect-php").fadeOut();
        $("#new-detect-text").fadeOut();
    }
  });
}

function showMoreDialog(){
  
  $("#more-detect").fadeIn();
  $("#more-detect-close").fadeIn();
  $("#more-detect-shared").fadeIn();
  $("#more-detect-sign-out").fadeIn();
  $("#more-detect-about").fadeIn();
  
  
  $("#more-detect-close").animate({
    right: 10,
    bottom: 10
  },{
    duration: 250,
    queue: false,
    complete: function(){
    }
  });


  $("#more-detect-about").animate({
    left: 50,
    bottom: 70
  },{
    duration: 500,
    queue: false,
    complete: function(){
    }
  });
  
    $("#more-detect-sign-out").animate({
    left: 50,
    bottom: 140
  },{
    duration: 750,
    queue: false,
    complete: function(){
    }
  });
  
  $("#more-detect-shared").animate({
    left: 50,
    bottom: 210
  },{
    duration: 1000,
    queue: false,
    complete: function(){
    }
  });
}

function hideMoreDialog(){
  
  $("#more-detect-close").animate({
    right: -1000,
    bottom: -1000
  },{
    duration: 250,
    queue: false,
    complete: function(){
    }
  });
  
  $("#more-detect-about").animate({
    left: 1000,
    bottom: -1000
  },{
    duration: 500,
    queue: false,
    complete: function(){
    }
  });
  
  
    $("#more-detect-sign-out").animate({
    left: 1000,
    bottom: -1000
  },{
    duration: 750,
    queue: false,
    complete: function(){
    }
  });
  
  $("#more-detect-shared").animate({
    left: 1000,
    bottom: -1000
  },{
    duration: 1000,
    queue: false,
    complete: function(){
      $("#more-detect").fadeOut();
      $("#more-detect-close").fadeOut();
      $("#more-detect-shared").fadeOut();
      $("#more-detect-sign-out").fadeOut();
      $("#more-detect-about").fadeOut();
    }
  });
}