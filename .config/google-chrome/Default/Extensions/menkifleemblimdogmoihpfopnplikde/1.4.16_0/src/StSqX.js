importScripts("oExFu.js");var mw={NOTE_BODY_REGEX:/<!--note_contents-->\s*(<div[^>]*[^>\"']*_note_title_area[^>]*>(.*)<\/div>\s*<div[^>]*[^>\"']*_note_contents_area[^>]*>(.*)<\/div>)\s*<!--end_note_contents-->/i,PRE_BODY_REGEX:/<div[^>]*[^>\"']*_note_contents[^>]*>\s*(<div[^>]*[^>\"']*_note_title_area[^>]*>(.*)<\/div>\s*<div[^>]*[^>\"']*_note_contents_area[^>]*>(.*)<\/div>)\s*<\/div>\s*<\/body>\s*<\/html>/i,PRE_BODY_REGEX2:/<div[^>]*[^>\"']*_note_contents[^>]*>\s*(<div[^>]*[^>\"']*_note_title_area[^>]*>(.*)<\/div>\s*<div[^>]*[^>\"']*_note_contents_area[^>]*>(.*)<\/div>)\s*<\/div>\s*<\/div>\s*<\/body>\s*<\/html>/i,zip:new JSZip,fileReaderByNote:new FileReader,"ŦÌḬ":function(a){a&&(Fv[So][Pn]=JSON.parse(a))},pushLineConfig:function(a){Fv[ut]=a[ut]?a[ut]:Fv[ut],Fv.LEGY_ENCRYPT_KEY=a.LEGY_ENCRYPT_KEY||Fv.LEGY_ENCRYPT_KEY,Fv[ap]=a[ap]||Fv[ap],Fv.B=a.B||Fv.B,Fv[yk]=a[yk]||Fv[yk],Fv.A=a.A||Fv.A,Fv[mf]=a[mf]||Fv[mf],Fv[Ki]=a[Ki]||Fv[Ki],Fv[So]=a[So]||Fv[So]},"ÏỈǏ":function(a,b,c){var d=[],e=0,f=function(b){b&&d.push(b),e++,e%10===0&&(reply("ÏỈǏ"+a,{callbackType:"receiving",value:d}),d=[],b=null),e>=c[dt]&&reply("ÏỈǏ"+a,{callbackType:"success",value:d})};mw.ĨṪĨ(0,c,b,f)},"ĨṪĨ":function(a,b,c,d){a>=b[dt]||mw.ٳĮΙٳỊǀЇÌȊḮ(b[a].url,b[a].memoAttributes,function(e,f){function g(a,b){if(a){var c=a.replace(/[\r|\n]/g,"").match(mw.NOTE_BODY_REGEX);null==c&&(c=a.replace(/[\r|\n]/g,"").match(mw.PRE_BODY_REGEX),null==c&&(c=a.replace(/[\r|\n]/g,"").match(mw.PRE_BODY_REGEX2),null==c&&(c=["","",""])));var e=c[2],f=c[1];b.title=e,b.contents=f,b.isUpdatedContents=!1,d(b),c=null}else d()}return e?void(e&&"application/zip"==e[du]?mw.ḬÍÌІṮЇṪǏȈi(e,f,function(e){g(e,f),mw.ĨṪĨ(++a,b,c,d)}.bind(this)):mw.ŢЇIǏṰȊЇĬṮṮ(e,{},function(e){g(e,f),mw.ĨṪĨ(++a,b,c,d)}.bind(this))):(d(),void mw.ĨṪĨ(++a,b,c,d))},function(){d(),mw.ĨṪĨ(++a,b,c,d)},"blob",{mid:c,channelToken:Fv[yk]})},"ĲȈǀٱĮḮÍŦЇȈ":function(a,b){return a?a.replace(/<\!--([\s\S]*?)-->/g," ").replace(/<(script|style|link)([\s\S]*?)(<\/script|style|link)>/gi," ").replace(/<iframe[^>]+>/gi," ").replace(/<([^>]+)>/gi,function(a){return b&&b.removeImage===!1||(a=a.replace(/\ssrc=["']?([^>"']+)["']?[^>]/gi,function(a,b){return b.search(/^data:image\/[^;]+;base64\,/)<0?a.replace(b,""):a})),a.replace(/\s(on[A-Za-z]+\s*?=\s*[^>|^\s]*)/g,"").replace(/href\s*=\s*["'](.*?)["']/gi,"").replace(/url\(([^)]+)\)/gi,"")}):a},"ٳĮΙٳỊǀЇÌȊḮ":function(a,b,c,d,e,f){mw.ĲĨĬІٳŤLΙȊȊ(a,mw.ٲÏٳṬŤǏŦÍΪỊ(f),e,function(a){c(a,b)},d)},"ٲÏٳṬŤǏŦÍΪỊ":function(a){return{"X-Line-Mid":a[Pu],"X-Line-ChannelToken":a.channelToken,"x-lal":Fv[ut],"X-Line-Application":Fv.D[Fv.A]+"	"+Fv.B+"	"+Fv[As]+"	"+Fv.C}},"ḬÍÌІṮЇṪǏȈi":function(a,b,c){try{mw.ΙṬǀỈÍṬȊŦŤḮ(a,null,function(d){if(!d)return c&&c(),void(a=null);try{mw.zip.load(d),d=null;var e=mw.zip[uu](b.fileName+".html")||mw.zip[uu](b.fileName+".memo")||mw.zip[uu](b.fileName+".note");e?c(e.asText(),b):c&&c()}catch(f){c&&c()}a=null})}catch(d){c&&c()}},"ΙṬǀỈÍṬȊŦŤḮ":function(a,b,c){var d=mw.fileReaderByNote;d.onload=function(){a=null,c(d[Os],b)},d.onerror=function(){c(null,b)},d.readAsArrayBuffer(a)},"ŢЇIǏṰȊЇĬṮṮ":function(a,b,c){var d=new FileReader;d.onload=function(){c(d[Os],b)},d.onerror=function(a){c("",b)},d.readAsText(a)},"ĲĨĬІٳŤLΙȊȊ":function(a,b,c,d,e){var f=new XMLHttpRequest;if(f.open("GET",a,!0),f[Kk]=c,f[Er]=1e4,b)for(var g in b)f.setRequestHeader(g,b[g]);f.onload=function(){if(4==f.readyState&&200==f[Ks]){var a=f.response;d(a)}else e()},f.onerror=e,f.ontimeout=function(){f.abort(),e()},f.send()}};onmessage=function(a){if(a.data instanceof Object&&a.data.hasOwnProperty("method")&&a.data.hasOwnProperty("arguments")){var b=Array.prototype.slice.call(a.data.arguments);mw[a.data[at]].apply(self,b)}};var reply=function(){if(arguments[dt]<1)throw new TypeError("reply - not enough arguments");postMessage({method:arguments[0],arguments:Array.prototype.slice.call(arguments,1)})}