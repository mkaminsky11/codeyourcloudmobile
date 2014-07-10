angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope,$ionicSideMenuDelegate ) {

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };


  $scope.showOpenModal = function(){
	   open_picker();
  };

  $scope.hideOpenModal = function(){
    slideOut(".open-modal");
  };

  $scope.signIn = function(){
    if( navigator.network.connection.type === "none"){
      onOffline();
    }
    else{
      var ref = window.open(auth_url, '_blank', 'location=no');
      ref.addEventListener('loadstart', function(event) {
        if(event.url.indexOf("https://accounts.google.com") === -1){
          ref.close();
          reload_iframe();
        }
      });
      ref.addEventListener('exit', function(event) {
        reload_iframe();
      });
    }
  };

  $scope.signOut = function(){
    var ref = window.open("https://accounts.google.com/logout", '_blank', 'location=no');
    ref.addEventListener('loadstart', function(event){
      setTimeout(function(){
        ref.close();
        $("#screen").fadeIn();
      }, 1000);
    });
  }

  $scope.goBack = function(){
    go_back()
  };

  $scope.toggleRename = function(){
    $(".rename-div").slideToggle();
  };

  $scope.noRename = function(){
    $(".rename-div").slideUp();
    $("#rename-input").val(the_title);
  };

  $scope.okRename = function(){
    $("#header").html($("#rename-input").val());
    set_title($("#rename-input").val());
    send_title($("#rename-input").val());
  };

  $scope.undo = function(){
    editor.getDoc().undo();
  };

  $scope.redo = function(){
    editor.getDoc().redo();
  };

  $scope.save = function(){
    send_save();
  };

  $scope.new = function(){
    send_new();
  };

  $scope.showModeModal = function(){
    slideIn(".mode-modal");
  }
  $scope.hideModeModal = function(){
    slideOut(".mode-modal");
  };

  $scope.showThemeModal = function(){
    slideIn(".theme-modal");
  }
  $scope.hideThemeModal = function(){
    slideOut(".theme-modal");
  };

  $scope.home = function(){
    go_home();
  };

  $scope.showOptionModal = function(){
    slideIn(".option-modal");
  };

  $scope.hideOptionModal = function(){
    slideOut(".option-modal");
  };

  $scope.tryAgain = function(){
    if( navigator.network.connection.type === "none"){
      alert("Nope. Still offline.");
    }
    else{
      $("#loading").fadeOut();

      $("#on").slideDown();
      $("#off").slideUp();
      $("#off-label").slideUp();

      $("#screen").css("background-color","#3498DB");
      //set everything back

      //then, reload
      $("#iframe").attr("src",$("#iframe").attr("src"));
    }
  };

  $scope.showColorModal = function(){
    slideIn(".color-modal");
  };

  $scope.hideColorModal = function(){
    slideOut(".color-modal");
  };

  $scope.showShareModal = function(){
    slideIn(".share-modal");
  };

  $scope.hideShareModal = function(){
    slideOut(".share-modal");
  };

  $scope.showColModal = function(){
    slideIn(".col-modal");
  };

  $scope.showSaveAsModal = function(){
    slideIn(".saveas-modal");
    show_picker(root_folder);
  };

  $scope.saveas = function(){
    saveAs();
  }

  $scope.hideSaveAsModal = function(){
    slideOut(".saveas-modal");
    slideOut(".open-modal");

    save_as_dest = "";
  };

  $scope.ok_saveas = function(){
    slideOut(".input-modal");
    ask_saveas();
  };

  $scope.clearSaveAs = function(){
    slideOut(".input-modal");
    save_as_dest = "";
    $("#saveas-input").val("Untitled.txt");
  };

  $scope.hideColModal = function(){
    slideOut(".col-modal");
  };

  $scope.showChatModal = function(){
    slideIn(".chat-modal");

    var d = $('#chat-list');
    d.scrollTop(d.prop("scrollHeight"));
  };

  $scope.hideChatModal = function(){
    slideOut(".chat-modal");
  };

  $scope.showAboutModal = function(){
    slideIn(".about-modal");

  };

  $scope.hideAboutModal = function(){
    slideOut(".about-modal");
  };

  $scope.showPreviewModal = function(){
    var previewFrame = document.getElementById('preview');
		var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
		preview.open();
		var c = editor.getValue();
		//if(editor.getOption("mode") === "text/x-markdown" || editor.getOption("mode") === "gfm"){
			//c = converter.makeHtml(c);
		//}
		preview.write(c);
		preview.close();

    slideIn(".preview-modal");
  };

  $scope.hidePreviewModal = function(){
    slideOut(".preview-modal");
  };

  $scope.share = function(){
    checkP();
  };

  $scope.newP = function(){
    var v = validateEmail($("#p-input").val());
    if(v){
      var e = $("#p-input").val();
      $("#p-input").val("");

      addP(e);
    }
    else{
      alert("Not a valid email");
    }
  };
})
