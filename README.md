##CODEYOURCLOUD Mobile App##

This is the mobile app for <a href="https://codeyourcloud.com">codeyourcloud.com</a>, a code editor for Google Drive.

It is built using Apache Phonegap (Cordova) and the Ionic Framework.

It works by running a hidden iframe hosted at codeyourcloud.com, which handles all Google Drive functions. The parent frame (what you see) and the iframe communicate using <code>window.postMessage()</code>.
