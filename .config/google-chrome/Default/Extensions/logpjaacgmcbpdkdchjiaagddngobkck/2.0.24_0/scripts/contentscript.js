"use strict";var Shortkeys={};Shortkeys.keys=[],Shortkeys.fetchConfig=function(t){var e=!1;return Shortkeys.keys.length>0&&Shortkeys.keys.forEach(function(o){o.key===t&&(e=o)}),e},Shortkeys.doAction=function(t){var e=t.action,o={};for(var n in t)o[n]=t[n];if("javascript"===e){var r=document.createElement("script");return r.textContent=t.code,document.body.appendChild(r),void document.body.removeChild(r)}"buttonnexttab"===e&&(t.button&&document.querySelector(t.button).click(),o.action="nexttab"),chrome.runtime.sendMessage(o)},Shortkeys.activateKey=function(t){var e=function(){return Shortkeys.doAction(t),!1};Mousetrap.bind(t.key,e)},Mousetrap.prototype.stopCallback=function(t,e,o){var n=Shortkeys.fetchConfig(o);return!!e.classList.contains("mousetrap")||!n.activeInInputs&&("INPUT"===e.tagName||"SELECT"===e.tagName||"TEXTAREA"===e.tagName||e.isContentEditable)},chrome.runtime.sendMessage({action:"getKeys",url:document.URL},function(t){t&&(Shortkeys.keys=t,Shortkeys.keys.length>0&&Shortkeys.keys.forEach(function(t){Shortkeys.activateKey(t)}))});
//# sourceMappingURL=contentscript.js.map