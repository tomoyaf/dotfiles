!function(){"use strict";function e(e,r,n,t,i,o,s,u){function l(e,o,s,u){3===arguments.length&&"[object Function]"===Object.prototype.toString.call(s)?(u=s,s=null):2===arguments.length&&"[object Function]"===Object.prototype.toString.call(o)&&(u=o,o=null);var l=p(e);if(Utilities.isUndefinedOrNull(l))return r.error("userService.acquireToken - Invalid type"),void u(null);var c=l.getConfig();c.params.grant_type=t.OAUTH.REFRESH_TOKEN,4!==arguments.length&&3!==arguments.length||l.type!==t.USER_TYPE.O365||(Utilities.isUndefinedOrNull(s)?c.resource=l.getResourceForEndpoint(o):c.resource=s,c.params.resource=c.resource),I(c.resource,function(e){return Utilities.isNotUndefinedOrNull(e)?void u(e):void g(l.type,function(e){if(Utilities.isUndefinedOrNull(e)||Utilities.isUndefinedOrNull(e))return void u(null);c.params.refresh_token=e;var r=n.get("$http"),t={method:"POST",url:c.url,headers:{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"},data:$.param(c.params)};r(t).success(function(e){h(c.resource,e),O(l.type,e),i.set({userType:l.type}),u(e.access_token)}).error(function(){a(),u(null)})})})}function c(e,o,s){var u=e.getConfig();if(Utilities.isUndefinedOrNull(e))return r.error("userService.acquireTokenFromCode - Invalid type"),void s(null);u.params.grant_type=t.OAUTH.AUTH_CODE,u.params.code=o;var l=n.get("$http"),c={method:"POST",url:u.url,headers:{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"},data:$.param(u.params)};l(c).success(function(r){h(u.resource,r),O(e.type,r),i.set({userType:e.type}),_(e.type,r),s(r.access_token)}).error(function(){s(null)})}function f(e,n){var i=p(e);return Utilities.isUndefinedOrNull(i)?void r.error("userService.authenticate - Invalid type"):void c(i,n,function(e){return Utilities.isUndefinedOrNull(e)?void(i.type===t.USER_TYPE.O365&&o.show(t.NOTIFICATION.INVALIDSUBSCRIPTION)):void r.trackEvent(String.format("Authorization_Success_{0}",i.type))})}function a(){i.remove("accessToken"),i.remove("refreshToken"),i.remove("userInfo"),i.remove("userType")}function d(e){i.get("userType").then(function(r){return Utilities.isUndefinedOrNull(r.userType)?void e(!1):void l(r.userType,function(r){e(Utilities.isNotUndefinedOrNull(r))})})}function U(){var r=e.defer();return d(function(e){return e?void i.get("userType").then(function(e){Utilities.isUndefinedOrNull(e.userType)?r.resolve(t.USER_TYPE.NONE):r.resolve(e.userType)}):(r.resolve(t.USER_TYPE.NONE),r.promise)}),r.promise}function v(e){var n=p(e);return Utilities.isUndefinedOrNull(n)?void r.error("userService.login - Invalid type"):void BrowserHandler.tabs.create({url:n.getConfig().loginUrl},function(e){i.set({loginTabId:e.id})})}function T(e){a();var t=p(e);if(Utilities.isUndefinedOrNull(t))return void r.error("userService.logout - Invalid type");var i=n.get("$http"),o={method:"GET",url:t.getConfig().logoutUrl};i(o).success(function(){r.debug(String.format("userService.logout - {0}",e))})}function p(e){var n=null;switch(e){case t.USER_TYPE.MSA:n=s;break;case t.USER_TYPE.O365:n=u;break;default:r.error(String.format("userService.getUserServiceProvider - Invalid type - {0}",e))}return n}function g(e,r){i.get("refreshToken").then(function(n){return Utilities.isUndefinedOrNull(n.refreshToken)||Utilities.isUndefinedOrNull(n.refreshToken[e])?void r(null):void r(n.refreshToken[e])})}function O(e,r){i.get("refreshToken").then(function(n){Utilities.isUndefinedOrNull(n.refreshToken)&&(n.refreshToken={}),n.refreshToken[e]=r.refresh_token,i.set(n)})}function I(e,r){i.get("accessToken").then(function(n){return Utilities.isUndefinedOrNull(n.accessToken)||Utilities.isUndefinedOrNull(n.accessToken[e])?void r(null):E(n.accessToken[e].expires_on)?void r(null):void r(n.accessToken[e].access_token)})}function h(e,r){Utilities.isUndefinedOrNull(r.expires_on)&&(r.expires_on=Utilities.getCurrentTime()+r.expires_in),i.get("accessToken").then(function(n){Utilities.isUndefinedOrNull(n.accessToken)&&(n.accessToken={}),n.accessToken[e]=r,i.set(n)})}function m(e,r){i.get("userInfo").then(function(n){return Utilities.isUndefinedOrNull(n.userInfo)||Utilities.isUndefinedOrNull(n.userInfo[e])?void r(null):void r(n.userInfo[e])})}function N(n){var i=e.defer();return P.getUserInfo(n,function(e){function o(e){e.activity===t.ACTIVITY.USERINFO_AVAILABLE.NAME&&(BrowserHandler.runtime.onMessage.removeListener(o),clearTimeout(u),i.resolve(e.data))}if(Utilities.isNotUndefinedOrNull(e))return i.resolve(e),i.promise;BrowserHandler.runtime.onMessage.addListener(o);var s=Utilities.isExtensionInTestingMode()?t.TIMEOUT.USER_INFO_LOOKUP_TEST:t.TIMEOUT.USER_INFO_LOOKUP,u=setTimeout(function(){r.warn(String.format("userService.waitForUserInfo timed out after {0} ms - {1}",t.TIMEOUT.USER_INFO_LOOKUP,n)),BrowserHandler.runtime.onMessage.removeListener(o),i.resolve(e)},s)}),i.promise}function S(r,n){var t=e.defer();return i.get("userInfo").then(function(e){Utilities.isUndefinedOrNull(e.userInfo)&&(e.userInfo={}),e.userInfo[r]={},e.userInfo[r].email=n.email,e.userInfo[r].puid=n.puid,e.userInfo[r].cid=n.cid,e.userInfo[r].serviceInfo=n.serviceInfo,e.userInfo[r].flights=n.flights,e.userInfo[r].features=n.features,e.userInfo[r].photo=n.photo,e.userInfo[r].sharePointUrl=n.sharePointUrl,i.set(e),t.resolve(e.userInfo[r])}),t.promise}function E(e){var r=Utilities.getCurrentTime(),n=120;return!(e&&e>r+n)}function _(e,r){var n=p(e);n.lookupUserInfo(r,function(r){BrowserHandler.runtime.sendMessage({activity:t.ACTIVITY.USERINFO_AVAILABLE.NAME,data:r}),S(e,r),k(e,r)})}function y(){var n=e.defer();return P.getUserType().then(function(e){return e===t.USER_TYPE.NONE?(r.warn("UserService.getUserPhoto: no signed-in user"),n.reject(t.RECENTS.ERROR.UNSUPPORTED_USER_TYPE),n.promise):void P.getUserInfo(e,function(t){return Utilities.isNotUndefinedOrNull(t)&&Utilities.isNotUndefinedOrNull(t.photo)?(r.trackEvent(String.format("UserService_GotLocalPhoto_{0}",e)),n.resolve(t.photo),n.promise):void P.getPhotoFromServer(e,t).then(function(e){n.resolve(e)},function(e){n.reject(e)})})}),n.promise}function k(i,o){var s=e.defer(),u=n.get("$http");if(i===t.USER_TYPE.O365&&(Utilities.isUndefinedOrNull(o)||Utilities.isUndefinedOrNull(o.email)))return s.reject(),s.promise;var l=i===t.USER_TYPE.MSA?t.MSACONFIG.PHOTO_URL:String.format(t.O365CONFIG.PHOTO_URL,o.email),c={method:"GET",url:l,responseType:"blob",headers:{"X-UserType":i}};return u(c).success(function(e){r.trackEvent(String.format("UserService_GotServerPhoto_{0}",i));var n=new FileReader;n.onload=function(){m(i,function(e){Utilities.isNotUndefinedOrNull(e)&&(e.photo=n.result,S(i,e))}),s.resolve(n.result)},n.readAsDataURL(e)}).error(function(e){s.reject(e)}),s.promise}var P={acquireToken:l,authenticate:f,clearToken:a,getLoginStatus:d,getUserType:U,getUserInfo:m,waitForUserInfo:N,saveUserInfo:S,login:v,logout:T,getUserPhoto:y,getPhotoFromServer:k,lookupUserInfo:_};return P}angular.module("app.user",[]).factory("userService",["$q","$log","$injector","constants","storage","notification","msaUserService","o365UserService",e])}();