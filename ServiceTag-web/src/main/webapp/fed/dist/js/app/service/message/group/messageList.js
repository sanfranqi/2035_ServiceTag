define("app/service/message/group/messageList.handlebars",["gallery/handlebars/1.0.2/runtime"],function(a,b,c){var d=a("gallery/handlebars/1.0.2/runtime"),e=d.template;c.exports=e(function(a,b,c,d,e){function f(){return'\r\n    <div class="nodata-box">\r\n        <img src="http://ue1.17173cdn.com/a/2035/open/2014/img/nodata.jpg" alt="暂无数据" width="84" height="90">\r\n        <div class="tit">暂无数据...</div>\r\n    </div>\r\n'}function g(a,b){var d,e="";return e+='\r\n    <div class="comm-mod">\r\n        <div class="mod-hd">\r\n            <div class="tit tit-name w-72">消息内容</div>\r\n            <div class="tit">发送时间</div>\r\n        </div>\r\n        <div class="comm-bd">\r\n            <ul class="comm-list">\r\n                ',d=c.each.call(a,a.listData,{hash:{},inverse:p.noop,fn:p.program(4,h,b),data:b}),(d||0===d)&&(e+=d),e+='\r\n            </ul>\r\n            <ul class="pagination" id="J_Page"></ul>\r\n        </div>\r\n    </div>\r\n'}function h(a,b){var d,e,f="";return f+='\r\n                <li class="list-item" data-id="',(d=c.id)?d=d.call(a,{hash:{},data:b}):(d=a.id,d=typeof d===m?d.apply(a):d),f+=n(d)+'">\r\n                    <a href="javascript:;" class="info name comm-link w-7" data-role="get" title="',(d=c.content)?d=d.call(a,{hash:{},data:b}):(d=a.content,d=typeof d===m?d.apply(a):d),f+=n(d)+'">',(d=c.content)?d=d.call(a,{hash:{},data:b}):(d=a.content,d=typeof d===m?d.apply(a):d),f+=n(d)+'</a>\r\n                    <div class="info">',e={hash:{},data:b},f+=n((d=c.fDate,d?d.call(a,a.sendTime,e):o.call(a,"fDate",a.sendTime,e)))+'</div>\r\n                    <a href="javascript:;" class="btn comm-btn2" data-role="get">查看</a>\r\n                </li>\r\n                '}this.compilerInfo=[3,">= 1.0.0-rc.4"],c=c||{};for(var i in a.helpers)c[i]=c[i]||a.helpers[i];e=e||{};var j,k,l,m="function",n=this.escapeExpression,o=c.helperMissing,p=this;return l={hash:{},inverse:p.program(3,g,e),fn:p.program(1,f,e),data:e},j=c.judge,k=j?j.call(b,(j=b.listData,null==j||j===!1?j:j.length),0,l):o.call(b,"judge",(j=b.listData,null==j||j===!1?j:j.length),0,l),k||0===k?k:""})}),define("gallery/handlebars/1.0.2/runtime",[],function(a,b,c){var d={};!function(a,b){a.VERSION="1.0.0-rc.4",a.COMPILER_REVISION=3,a.REVISION_CHANGES={1:"<= 1.0.rc.2",2:"== 1.0.0-rc.3",3:">= 1.0.0-rc.4"},a.helpers={},a.partials={};var c=Object.prototype.toString,d="[object Function]",e="[object Object]";a.registerHelper=function(b,d,f){if(c.call(b)===e){if(f||d)throw new a.Exception("Arg not supported with multiple helpers");a.Utils.extend(this.helpers,b)}else f&&(d.not=f),this.helpers[b]=d},a.registerPartial=function(b,d){c.call(b)===e?a.Utils.extend(this.partials,b):this.partials[b]=d},a.registerHelper("helperMissing",function(a){if(2===arguments.length)return b;throw Error("Could not find property '"+a+"'")}),a.registerHelper("blockHelperMissing",function(b,e){var f=e.inverse||function(){},g=e.fn,h=c.call(b);return h===d&&(b=b.call(this)),b===!0?g(this):b===!1||null==b?f(this):"[object Array]"===h?b.length>0?a.helpers.each(b,e):f(this):g(b)}),a.K=function(){},a.createFrame=Object.create||function(b){a.K.prototype=b;var c=new a.K;return a.K.prototype=null,c},a.logger={DEBUG:0,INFO:1,WARN:2,ERROR:3,level:3,methodMap:{0:"debug",1:"info",2:"warn",3:"error"},log:function(b,c){if(b>=a.logger.level){var d=a.logger.methodMap[b];"undefined"!=typeof console&&console[d]&&console[d].call(console,c)}}},a.log=function(b,c){a.logger.log(b,c)},a.registerHelper("each",function(b,c){var d,e=c.fn,f=c.inverse,g=0,h="";if(c.data&&(d=a.createFrame(c.data)),b&&"object"==typeof b)if(b instanceof Array)for(var i=b.length;i>g;g++)d&&(d.index=g),h+=e(b[g],{data:d});else for(var j in b)b.hasOwnProperty(j)&&(d&&(d.key=j),h+=e(b[j],{data:d}),g++);return 0===g&&(h=f(this)),h}),a.registerHelper("if",function(b,e){var f=c.call(b);return f===d&&(b=b.call(this)),!b||a.Utils.isEmpty(b)?e.inverse(this):e.fn(this)}),a.registerHelper("unless",function(b,c){return a.helpers["if"].call(this,b,{fn:c.inverse,inverse:c.fn})}),a.registerHelper("with",function(c,d){return a.Utils.isEmpty(c)?b:d.fn(c)}),a.registerHelper("log",function(b,c){var d=c.data&&null!=c.data.level?parseInt(c.data.level,10):1;a.log(d,b)});var f=["description","fileName","lineNumber","message","name","number","stack"];a.Exception=function(){for(var a=Error.prototype.constructor.apply(this,arguments),b=0;f.length>b;b++)this[f[b]]=a[f[b]]},a.Exception.prototype=Error(),a.SafeString=function(a){this.string=a},a.SafeString.prototype.toString=function(){return""+this.string};var g={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},h=/[&<>"'`]/g,i=/[&<>"'`]/,j=function(a){return g[a]||"&amp;"};a.Utils={extend:function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c])},escapeExpression:function(b){return b instanceof a.SafeString?""+b:null==b||b===!1?"":(b=""+b,i.test(b)?b.replace(h,j):b)},isEmpty:function(a){return a||0===a?"[object Array]"===c.call(a)&&0===a.length?!0:!1:!0}},a.VM={template:function(b){var c={escapeExpression:a.Utils.escapeExpression,invokePartial:a.VM.invokePartial,programs:[],program:function(b,c,d){var e=this.programs[b];return d?e=a.VM.program(b,c,d):e||(e=this.programs[b]=a.VM.program(b,c)),e},programWithDepth:a.VM.programWithDepth,noop:a.VM.noop,compilerInfo:null};return function(d,e){e=e||{};var f=b.call(c,a,d,e.helpers,e.partials,e.data),g=c.compilerInfo||[],h=g[0]||1,i=a.COMPILER_REVISION;if(h!==i){if(i>h){var j=a.REVISION_CHANGES[i],k=a.REVISION_CHANGES[h];throw"Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version ("+j+") or downgrade your runtime to an older version ("+k+")."}throw"Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version ("+g[1]+")."}return f}},programWithDepth:function(a,b,c){var d=Array.prototype.slice.call(arguments,3),e=function(a,e){return e=e||{},b.apply(this,[a,e.data||c].concat(d))};return e.program=a,e.depth=d.length,e},program:function(a,b,c){var d=function(a,d){return d=d||{},b(a,d.data||c)};return d.program=a,d.depth=0,d},noop:function(){return""},invokePartial:function(c,d,e,f,g,h){var i={helpers:f,partials:g,data:h};if(c===b)throw new a.Exception("The partial "+d+" could not be found");if(c instanceof Function)return c(e,i);if(a.compile)return g[d]=a.compile(c,{data:h!==b}),g[d](e,i);throw new a.Exception("The partial "+d+" could not be compiled when running in runtime-only mode")}},a.template=a.VM.template}(d),c.exports=d});