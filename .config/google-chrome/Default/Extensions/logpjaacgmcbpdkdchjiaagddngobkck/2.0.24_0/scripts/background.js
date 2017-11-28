"use strict";var copyToClipboard=function(e){var o=document.createElement("div");o.contentEditable=!0,document.body.appendChild(o),o.innerHTML=e,o.unselectable="off",o.focus(),document.execCommand("SelectAll"),document.execCommand("Copy",!1,null),document.body.removeChild(o)},selectTab=function(e){chrome.tabs.query({currentWindow:!0},function(o){o.length<=1||chrome.tabs.query({currentWindow:!0,active:!0},function(t){var r,c=t[0];switch(e){case"next":r=o[(c.index+1+o.length)%o.length];break;case"previous":r=o[(c.index-1+o.length)%o.length];break;case"first":r=o[0];break;case"last":r=o[o.length-1]}chrome.tabs.update(r.id,{highlighted:!0}),chrome.tabs.update(c.id,{highlighted:!1})})})},globToRegex=function(e){if(/^\/.*\/$/.test(e))return new RegExp(e.replace(/^\/(.*)\/$/,"$1"));for(var o="\\^$*+?.()|{}[]",t=["^"],r=0;r<e.length;++r){var c=e.charAt(r);"*"===c?t.push(".*"):(o.indexOf(c)>=0&&t.push("\\"),t.push(c))}return t.push("$"),new RegExp(t.join(""))},isAllowedSite=function(e,o){if("true"!==e.blacklist&&"whitelist"!==e.blacklist)return!0;var t="true"===e.blacklist;return e.sitesArray.forEach(function(e){o.match(globToRegex(e))&&(t=!t)}),t},handleAction=function(e){var o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("cleardownloads"===e)chrome.browsingData.remove({since:0},{downloads:!0});else if("nexttab"===e)selectTab("next");else if("prevtab"===e)selectTab("previous");else if("firsttab"===e)selectTab("first");else if("lasttab"===e)selectTab("last");else if("newtab"===e)chrome.tabs.create({});else if("reopentab"===e)chrome.sessions.getRecentlyClosed({maxResults:1},function(e){var o=e[0];chrome.sessions.restore(o.sessionsId)});else if("closetab"===e)chrome.tabs.query({currentWindow:!0,active:!0},function(e){chrome.tabs.remove(e[0].id)});else if("clonetab"===e)chrome.tabs.query({currentWindow:!0,active:!0},function(e){chrome.tabs.duplicate(e[0].id)});else if("onlytab"===e)chrome.tabs.query({currentWindow:!0,pinned:!1,active:!1},function(e){var o=[];e.forEach(function(e){o.push(e.id)}),chrome.tabs.remove(o)});else if("closelefttabs"===e||"closerighttabs"===e)chrome.tabs.query({currentWindow:!0,active:!0},function(o){var t=o[0].index;chrome.tabs.query({currentWindow:!0,pinned:!1,active:!1},function(o){var r=[];o.forEach(function(o){("closelefttabs"===e&&o.index<t||"closerighttabs"===e&&o.index>t)&&r.push(o.id)}),chrome.tabs.remove(r)})});else if("togglepin"===e)chrome.tabs.query({active:!0,currentWindow:!0},function(e){var o=!e[0].pinned;chrome.tabs.update(e[0].id,{pinned:o})});else if("copyurl"===e)chrome.tabs.query({currentWindow:!0,active:!0},function(e){copyToClipboard(e[0].url)});else if("movetableft"===e)chrome.tabs.query({currentWindow:!0,active:!0},function(e){e[0].index>0&&chrome.tabs.move(e[0].id,{index:e[0].index-1})});else if("movetabright"===e)chrome.tabs.query({currentWindow:!0,active:!0},function(e){chrome.tabs.move(e[0].id,{index:e[0].index+1})});else if("gototab"===e){var t=function(){chrome.tabs.create({url:o.openurl})};if(o.matchurl){var r={url:o.matchurl};o.currentWindow&&(r.currentWindow=!0),chrome.tabs.query(r,function(e){e.length>0?(chrome.tabs.update(e[0].id,{selected:!0}),chrome.windows.update(e[0].windowId,{focused:!0})):t()})}else t()}else if("newwindow"===e)chrome.windows.create();else if("newprivatewindow"===e)chrome.windows.create({incognito:!0});else if("closewindow"===e)chrome.tabs.query({currentWindow:!0,active:!0},function(e){chrome.windows.remove(e[0].windowId)});else if("zoomin"===e)chrome.tabs.query({currentWindow:!0,active:!0},function(e){chrome.tabs.getZoom(e[0].id,function(o){console.log(o),chrome.tabs.setZoom(e[0].id,o+.1)})});else if("zoomout"===e)chrome.tabs.query({currentWindow:!0,active:!0},function(e){chrome.tabs.getZoom(e[0].id,function(o){chrome.tabs.setZoom(e[0].id,o-.1)})});else if("zoomreset"===e)chrome.tabs.query({currentWindow:!0,active:!0},function(e){chrome.tabs.setZoom(e[0].id,0)});else if("back"===e)chrome.tabs.executeScript(null,{code:"window.history.back()"});else if("forward"===e)chrome.tabs.executeScript(null,{code:"window.history.forward()"});else if("reload"===e)chrome.tabs.executeScript(null,{code:"window.location.reload()"});else if("top"===e)chrome.tabs.executeScript(null,{code:"window.scrollTo(0, 0)"});else if("bottom"===e)chrome.tabs.executeScript(null,{code:"window.scrollTo(0, document.body.scrollHeight)"});else if("scrollup"===e)chrome.tabs.executeScript(null,{code:"window.scrollBy(0,-50)"});else if("scrollupmore"===e)chrome.tabs.executeScript(null,{code:"window.scrollBy(0,-500)"});else if("scrolldown"===e)chrome.tabs.executeScript(null,{code:"window.scrollBy(0,50)"});else if("scrolldownmore"===e)chrome.tabs.executeScript(null,{code:"window.scrollBy(0,500)"});else if("scrollleft"===e)chrome.tabs.executeScript(null,{code:"window.scrollBy(-50,0)"});else if("scrollleftmore"===e)chrome.tabs.executeScript(null,{code:"window.scrollBy(-500,0)"});else if("scrollright"===e)chrome.tabs.executeScript(null,{code:"window.scrollBy(50,0)"});else if("scrollrightmore"===e)chrome.tabs.executeScript(null,{code:"window.scrollBy(500,0)"});else{if("openbookmark"!==e&&"openbookmarknewtab"!==e&&"openbookmarkbackgroundtab"!==e)return!1;chrome.bookmarks.search({title:o.bookmark},function(t){for(var r=void 0,c=t.length;c-- >0;){var n=t[c];if(n.url&&n.title===o.bookmark){r=n;break}}"openbookmark"===e?chrome.tabs.query({currentWindow:!0,active:!0},function(e){chrome.tabs.update(e[0].id,{url:decodeURI(r.url)})}):"openbookmarkbackgroundtab"===e?chrome.tabs.create({url:decodeURI(r.url),active:!1}):chrome.tabs.create({url:decodeURI(r.url)})})}return!0};chrome.commands.onCommand.addListener(function(e){handleAction(e)}),chrome.runtime.onMessage.addListener(function(e,o,t){var r=e.action;if("getKeys"===r){var c=e.url,n=JSON.parse(localStorage.shortkeys),i=[];n.keys.length>0&&n.keys.forEach(function(e){isAllowedSite(e,c)&&i.push(e)}),t(i)}handleAction(r,e)});
//# sourceMappingURL=background.js.map
