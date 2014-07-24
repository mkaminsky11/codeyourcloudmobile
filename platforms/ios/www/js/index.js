var app = {
    initialize: function() {
        this.bindEvents();
    },
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('offline', this.onOffline, false);
        document.addEventListener('online', this.onOnline, false);
    },
    onDeviceReady: function() {
      //get_prefs();
    },
    onOffline: function(){
      offline();
    },
    onOnline: function(){
      online();
    }
};

app.initialize();
