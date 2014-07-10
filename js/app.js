// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


    /*==========
    ===========*/
    editor = CodeMirror.fromTextArea(document.getElementById("editor"),{
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

    all_ripple();
    /*========
    =========*/

    document.addEventListener("offline", onOffline, false);
  });
})

.config(function($stateProvider, $urlRouterProvider) {

});
