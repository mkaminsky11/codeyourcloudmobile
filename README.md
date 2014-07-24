##Code Your Cloud: Mobile##
This is the iOS version of the <a href="https://codeyourcloud.com">code your cloud</a> editor.

###How it works###
<pre>
native application (Objective-C)
|
|-> local html, css, javascript
	|
	|->iframe hosted at codeyourcloud.com
</pre>

<b> Native application: </b> This is just a regular iOS application. However, the content is just a webview, containing the <b>local html</b>. 

This is generatred automatically with <a href="http://cordova.apache.org/">Cordova</a>. 

<b> Local HTML: </b> This contains the main user interface, and is what the user actually sees. It does not require an internet connection to load this because it is hosted locally (contained within the project). 

The user interface is created using Polymer.

<b>Iframe: </b> The local html cannot access the Google APIs itself. Therefore, there is a hidden iframe, hosted at <a href="https://codeyourcloudcom/mobile/mobile.html">codeyourcloud.com/mobile/mobile.html</a> which can.

If communicates with the local html using <code>parent.postMessage()</code>. 

###iOS8###
There are some problems with iOS8 which I am trying to iron out.

<b>1. Polymer woes</b>
because of the way Apple build Safari (and webviews) for iOS8, polymer doesn't work,

<a href="https://github.com/Polymer/platform/issues/66">More information</a>

<b>2. InAppBrowser</b> Some actions (signing in, signing out) are accomplished using a plugin called <code>InAppBrowser</code>. Because of the switch from <code>UIWebView</code> to <code>WKWebView</code>, this doesn't work in iOS 8.

<a href="http://ilee.co.uk/Cordova-PhoneGap-iOS-8-Beta/">More information</a>