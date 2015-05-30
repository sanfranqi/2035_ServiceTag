define("app/common/validator",["arale/validator/0.9.7/validator","$","arale/widget/1.1.1/widget","arale/base/1.1.1/base","arale/class/1.1.0/class","arale/events/1.1.0/events"],function(a,b){"use strict";var c=a("arale/validator/0.9.7/validator");b.relativeValidator=c.extend({attrs:{explainClass:"help-block",itemClass:"form-group",autoSubmit:!1,stopOnError:!0,autoFocus:!1,itemErrorClass:"has-error",inputClass:"form-control",textareaClass:"form-control",showMessage:function(a,b){a='<i class="ico ico-error"></i>'+a,this.getExplain(b).html(a),this.getItem(b).addClass("has-error")}}}),b.fixedValidator=c.extend({attrs:{explainClass:"help-block",itemClass:"form-group",autoSubmit:!1,stopOnError:!0,autoFocus:!1,itemErrorClass:"has-error",inputClass:"form-control",textareaClass:"form-control",showMessage:function(a,b){a='<i class="ico ico-error"></i>'+a,b=b.closest("form").find(".validatorError"),b.html(a),b.addClass("has-error")},hideMessage:function(a,b){b=b.closest("form").find(".validatorError"),b.html("&nbsp;")}}})}),define("arale/validator/0.9.7/validator",["./core","$","./async","arale/widget/1.1.1/widget","arale/base/1.1.1/base","arale/class/1.1.0/class","arale/events/1.1.0/events","./utils","./rule","./item"],function(a,b,c){var d=a("./core"),e=a("$"),f=d.extend({events:{"mouseenter .{{attrs.inputClass}}":"mouseenter","mouseleave .{{attrs.inputClass}}":"mouseleave","mouseenter .{{attrs.textareaClass}}":"mouseenter","mouseleave .{{attrs.textareaClass}}":"mouseleave","focus .{{attrs.itemClass}} input,textarea,select":"focus","blur .{{attrs.itemClass}} input,textarea,select":"blur"},attrs:{explainClass:"ui-form-explain",itemClass:"ui-form-item",itemHoverClass:"ui-form-item-hover",itemFocusClass:"ui-form-item-focus",itemErrorClass:"ui-form-item-error",inputClass:"ui-input",textareaClass:"ui-textarea",showMessage:function(a,b){this.getExplain(b).html(a),this.getItem(b).addClass(this.get("itemErrorClass"))},hideMessage:function(a,b){this.getExplain(b).html(b.attr("data-explain")||" "),this.getItem(b).removeClass(this.get("itemErrorClass"))}},setup:function(){f.superclass.setup.call(this);var a=this;this.on("autoFocus",function(b){a.set("autoFocusEle",b)})},addItem:function(a){f.superclass.addItem.apply(this,[].slice.call(arguments));var b=this.query(a.element);return b&&this._saveExplainMessage(b),this},_saveExplainMessage:function(a){var b=a.element,c=b.attr("data-explain");void 0!==c||this.getItem(b).hasClass(this.get("itemErrorClass"))||b.attr("data-explain",this.getExplain(b).html())},getExplain:function(a){var b=this.getItem(a),c=b.find("."+this.get("explainClass"));return 0==c.length&&(c=e('<div class="'+this.get("explainClass")+'"></div>').appendTo(b)),c},getItem:function(a){a=e(a);var b=a.parents("."+this.get("itemClass"));return b},mouseenter:function(a){this.getItem(a.target).addClass(this.get("itemHoverClass"))},mouseleave:function(a){this.getItem(a.target).removeClass(this.get("itemHoverClass"))},focus:function(a){var b=a.target,c=this.get("autoFocusEle");if(c&&c.has(b)){var d=this;return void e(b).keyup(function(){d.set("autoFocusEle",null),d.focus({target:b})})}this.getItem(b).removeClass(this.get("itemErrorClass")),this.getItem(b).addClass(this.get("itemFocusClass")),this.getExplain(b).html(e(b).attr("data-explain")||"")},blur:function(a){this.getItem(a.target).removeClass(this.get("itemFocusClass"))}});c.exports=f}),define("arale/validator/0.9.7/core",["$","arale/validator/0.9.7/async","arale/widget/1.1.1/widget","arale/base/1.1.1/base","arale/class/1.1.0/class","arale/events/1.1.0/events","arale/validator/0.9.7/utils","arale/validator/0.9.7/rule","arale/validator/0.9.7/item"],function(a,b,c){function d(a,b){for(var c=0;c<b.length;c++)if(a===b[c])return b.splice(c,1),b}function e(a,b){var c;return f.each(b,function(b,d){return a.get(0)===d.element.get(0)?(c=d,!1):void 0}),c}var f=a("$"),g=a("arale/validator/0.9.7/async"),h=a("arale/widget/1.1.1/widget"),i=a("arale/validator/0.9.7/utils"),j=a("arale/validator/0.9.7/item"),k=[],l={value:f.noop,setter:function(a){return f.isFunction(a)?a:i.helper(a)}},m=h.extend({attrs:{triggerType:"blur",checkOnSubmit:!0,stopOnError:!1,autoSubmit:!0,checkNull:!0,onItemValidate:l,onItemValidated:l,onFormValidate:l,onFormValidated:l,displayHelper:function(a){var b,c,d=a.element.attr("id");return d&&(b=f("label[for="+d+"]").text(),b&&(b=b.replace(/^[\*\s\:\：]*/,"").replace(/[\*\s\:\：]*$/,""))),c=a.element.attr("name"),b||c},showMessage:l,hideMessage:l,autoFocus:!0,failSilently:!1,skipHidden:!1},setup:function(){var a=this;if(a.items=[],a.element.is("form")){a._novalidate_old=a.element.attr("novalidate");try{a.element.attr("novalidate","novalidate")}catch(b){}a.get("checkOnSubmit")&&a.element.on("submit.validator",function(b){b.preventDefault(),a.execute(function(b){!b&&a.get("autoSubmit")&&a.element.get(0).submit()})})}a.on("itemValidated",function(a,b,c,d){this.query(c).get(a?"showMessage":"hideMessage").call(this,b,c,d)}),k.push(a)},Statics:f.extend({helper:i.helper},a("arale/validator/0.9.7/rule"),{autoRender:function(a){var b=new this(a);f("input, textarea, select",b.element).each(function(a,c){c=f(c);var d=c.attr("type");if("button"==d||"submit"==d||"reset"==d)return!0;var e={};if(e.element="radio"==d||"checkbox"==d?f("[type="+d+"][name="+c.attr("name")+"]",b.element):c,!b.query(e.element)){var g=i.parseDom(c);if(!g.rule)return!0;f.extend(e,g),b.addItem(e)}})},query:function(a){return h.query(a)},validate:function(a){var b=f(a.element),c=new m({element:b.parents()});c.addItem(a),c.query(b).execute(),c.destroy()}}),addItem:function(a){var b=this;if(f.isArray(a))return f.each(a,function(a,c){b.addItem(c)}),this;if(a=f.extend({triggerType:b.get("triggerType"),checkNull:b.get("checkNull"),displayHelper:b.get("displayHelper"),showMessage:b.get("showMessage"),hideMessage:b.get("hideMessage"),failSilently:b.get("failSilently"),skipHidden:b.get("skipHidden")},a),"string"==typeof a.element&&(a.element=this.$(a.element)),!f(a.element).length){if(a.failSilently)return b;throw new Error("element does not exist")}var c=new j(a);return b.items.push(c),c._validator=b,c.delegateEvents(c.get("triggerType"),function(a){(this.get("checkNull")||this.element.val())&&this.execute(null,{event:a})}),c.on("all",function(){this.trigger.apply(this,[].slice.call(arguments))},b),b},removeItem:function(a){var b=this,c=a instanceof j?a:b.query(a);return c&&(c.get("hideMessage").call(b,null,c.element),d(c,b.items),c.destroy()),b},execute:function(a){var b=this,c=[],d=!1,e=null;return f.each(b.items,function(a,c){c.get("hideMessage").call(b,null,c.element)}),b.trigger("formValidate",b.element),g[b.get("stopOnError")?"forEachSeries":"forEach"](b.items,function(a,f){a.execute(function(a,g,h){a&&!d&&(d=!0,e=h),c.push([].slice.call(arguments,0)),f(b.get("stopOnError")?a:null)})},function(){b.get("autoFocus")&&d&&(b.trigger("autoFocus",e),e.focus()),b.trigger("formValidated",d,c,b.element),a&&a(d,c,b.element)}),b},destroy:function(){var a=this,b=a.items.length;if(a.element.is("form")){try{void 0==a._novalidate_old?a.element.removeAttr("novalidate"):a.element.attr("novalidate",a._novalidate_old)}catch(c){}a.element.off("submit.validator")}for(var e=b-1;e>=0;e--)a.removeItem(a.items[e]);d(a,k),m.superclass.destroy.call(this)},query:function(a){return e(this.$(a),this.items)}});c.exports=m}),define("arale/validator/0.9.7/async",[],function(a,b,c){var d={};c.exports=d;var e=function(a,b){if(a.forEach)return a.forEach(b);for(var c=0;c<a.length;c+=1)b(a[c],c,a)},f=function(a,b){if(a.map)return a.map(b);var c=[];return e(a,function(a,d,e){c.push(b(a,d,e))}),c},g=function(a){if(Object.keys)return Object.keys(a);var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c);return b};d.nextTick="undefined"!=typeof process&&process.nextTick?process.nextTick:function(a){setTimeout(a,0)},d.forEach=function(a,b,c){if(c=c||function(){},!a.length)return c();var d=0;e(a,function(e){b(e,function(b){b?(c(b),c=function(){}):(d+=1,d===a.length&&c(null))})})},d.forEachSeries=function(a,b,c){if(c=c||function(){},!a.length)return c();var d=0,e=function(){b(a[d],function(b){b?(c(b),c=function(){}):(d+=1,d===a.length?c(null):e())})};e()};var h=function(a){return function(){var b=Array.prototype.slice.call(arguments);return a.apply(null,[d.forEach].concat(b))}},i=function(a){return function(){var b=Array.prototype.slice.call(arguments);return a.apply(null,[d.forEachSeries].concat(b))}},j=function(a,b,c,d){var e=[];b=f(b,function(a,b){return{index:b,value:a}}),a(b,function(a,b){c(a.value,function(c,d){e[a.index]=d,b(c)})},function(a){d(a,e)})};d.map=h(j),d.mapSeries=i(j),d.series=function(a,b){if(b=b||function(){},a.constructor===Array)d.mapSeries(a,function(a,b){a&&a(function(a){var c=Array.prototype.slice.call(arguments,1);c.length<=1&&(c=c[0]),b.call(null,a,c)})},b);else{var c={};d.forEachSeries(g(a),function(b,d){a[b](function(a){var e=Array.prototype.slice.call(arguments,1);e.length<=1&&(e=e[0]),c[b]=e,d(a)})},function(a){b(a,c)})}}}),define("arale/validator/0.9.7/utils",["$","arale/validator/0.9.7/rule"],function(require,exports,module){function unique(){return"__anonymous__"+u_count++}function parseRules(a){return a?a.match(/[a-zA-Z0-9\-\_]+(\{[^\{\}]*\})?/g):null}function parseDom(a){var a=$(a),b={},c=[],d=a.attr("required");d&&(c.push("required"),b.required=!0);var e=a.attr("type");if(e&&"submit"!=e&&"cancel"!=e&&"checkbox"!=e&&"radio"!=e&&"select"!=e&&"select-one"!=e&&"file"!=e&&"hidden"!=e&&"textarea"!=e){if(!Rule.getRule(e))throw new Error('Form field with type "'+e+'" not supported!');c.push(e)}var f=a.attr("min");f&&c.push('min{"min":"'+f+'"}');var g=a.attr("max");g&&c.push("max{max:"+g+"}");var h=a.attr("minlength");h&&c.push("minlength{min:"+h+"}");var i=a.attr("maxlength");i&&c.push("maxlength{max:"+i+"}");var j=a.attr("pattern");if(j){var k=new RegExp(j),l=unique();Rule.addRule(l,k),c.push(l)}var m=a.attr("data-rule");return m=m&&parseRules(m),m&&(c=c.concat(m)),b.rule=0==c.length?null:c.join(" "),b}function parseJSON(str){function getValue(str){return'"'==str.charAt(0)&&'"'==str.charAt(str.length-1)||"'"==str.charAt(0)&&"'"==str.charAt(str.length-1)?eval(str):str}if(!str)return null;var NOTICE='Invalid option object "'+str+'".';str=str.slice(1,-1);var result={},arr=str.split(",");return $.each(arr,function(a,b){if(arr[a]=$.trim(b),!arr[a])throw new Error(NOTICE);var c=arr[a].split(":"),d=$.trim(c[0]),e=$.trim(c[1]);if(!d||!e)throw new Error(NOTICE);result[getValue(d)]=$.trim(getValue(e))}),result}function isHidden(a){var b=a[0].offsetWidth,c=a[0].offsetHeight,d="TR"===a.prop("tagName");return 0!==b||0!==c||d?0===b||0===c||d?"none"===a.css("display"):!1:!0}var $=require("$"),Rule=require("arale/validator/0.9.7/rule"),u_count=0,helpers={};module.exports={parseRule:function(a){var b=a.match(/([^{}:\s]*)(\{[^\{\}]*\})?/);return{name:b[1],param:parseJSON(b[2])}},parseRules:parseRules,parseDom:parseDom,isHidden:isHidden,helper:function(a,b){return b?(helpers[a]=b,this):helpers[a]}}}),define("arale/validator/0.9.7/rule",["$"],function(a,b,c){function d(a,b){var c=this;if(c.name=a,b instanceof RegExp)c.operator=function(a,c){var d=b.test(j(a.element).val());c(d?null:a.rule,f(a,d))};else{if(!j.isFunction(b))throw new Error("The second argument must be a regexp or a function.");c.operator=function(a,c){var d=b.call(this,a,function(b,d){c(b?null:a.rule,d||f(a,b))});void 0!==d&&c(d?null:a.rule,f(a,d))}}}function e(a,b,c){return j.isPlainObject(a)?(j.each(a,function(a,b){j.isArray(b)?e(a,b[0],b[1]):e(a,b)}),this):(k[a]=b instanceof d?new d(a,b.operator):new d(a,b),g(a,c),this)}function f(a,b){var c,d=a.rule;return a.message?j.isPlainObject(a.message)?(c=a.message[b?"success":"failure"],"undefined"==typeof c&&(c=l[d][b?"success":"failure"])):c=b?"":a.message:c=l[d][b?"success":"failure"],c?i(a,c):c}function g(a,b){return j.isPlainObject(a)?(j.each(a,function(a,b){g(a,b)}),this):(l[a]=j.isPlainObject(b)?b:{failure:b},this)}function h(a,b){if(b){var c=k[a];return new d(null,function(a,d){c.operator(j.extend(null,a,b),d)})}return k[a]}function i(a,b){var c=b,d=/\{\{[^\{\}]*\}\}/g,e=/\{\{(.*)\}\}/,f=b.match(d);return f&&j.each(f,function(b,d){var f=d.match(e)[1],g=a[j.trim(f)];c=c.replace(d,g)}),c}var j=a("$"),k={},l={};d.prototype.and=function(a,b){var c=a instanceof d?a:h(a,b);if(!c)throw new Error('No rule with name "'+a+'" found.');var e=this,g=function(a,b){e.operator.call(this,a,function(d){d?b(d,f(a,!d)):c.operator.call(this,a,b)})};return new d(null,g)},d.prototype.or=function(a,b){var c=a instanceof d?a:h(a,b);if(!c)throw new Error('No rule with name "'+a+'" found.');var e=this,g=function(a,b){e.operator.call(this,a,function(d){d?c.operator.call(this,a,b):b(null,f(a,!0))})};return new d(null,g)},d.prototype.not=function(a){var b=h(this.name,a),c=function(a,c){b.operator.call(this,a,function(b){b?c(null,f(a,!0)):c(!0,f(a,!1))})};return new d(null,c)},e("required",function(a){var b=j(a.element),c=b.attr("type");switch(c){case"checkbox":case"radio":var d=!1;return b.each(function(a,b){return j(b).prop("checked")?(d=!0,!1):void 0}),d;default:return Boolean(j.trim(b.val()))}},"请输入{{display}}"),e("email",/^\s*([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,20})\s*$/,"{{display}}的格式不正确"),e("text",/.*/),e("password",/.*/),e("radio",/.*/),e("checkbox",/.*/),e("url",/^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,"{{display}}的格式不正确"),e("number",/^[+-]?[1-9][0-9]*(\.[0-9]+)?([eE][+-][1-9][0-9]*)?$|^[+-]?0?\.[0-9]+([eE][+-][1-9][0-9]*)?$/,"{{display}}的格式不正确"),e("digits",/^\s*\d+\s*$/,"{{display}}的格式不正确"),e("date",/^\d{4}\-[01]?\d\-[0-3]?\d$|^[01]\d\/[0-3]\d\/\d{4}$|^\d{4}年[01]?\d月[0-3]?\d[日号]$/,"{{display}}的格式不正确"),e("min",function(a){var b=a.element,c=a.min;return Number(b.val())>=Number(c)},"{{display}}必须大于或者等于{{min}}"),e("max",function(a){var b=a.element,c=a.max;return Number(b.val())<=Number(c)},"{{display}}必须小于或者等于{{max}}"),e("minlength",function(a){var b=a.element,c=b.val().length;return c>=Number(a.min)},"{{display}}的长度必须大于或等于{{min}}"),e("maxlength",function(a){var b=a.element,c=b.val().length;return c<=Number(a.max)},"{{display}}的长度必须小于或等于{{max}}"),e("mobile",/^1\d{10}$/,"请输入正确的{{display}}"),e("confirmation",function(a){var b=a.element,c=j(a.target);return b.val()==c.val()},"两次输入的{{display}}不一致，请重新输入"),c.exports={addRule:e,setMessage:g,getMessage:function(a,b){return f(a,b)},getRule:h,getOperator:function(a){return k[a].operator}}}),define("arale/validator/0.9.7/item",["$","arale/validator/0.9.7/utils","arale/validator/0.9.7/rule","arale/widget/1.1.1/widget","arale/base/1.1.1/base","arale/class/1.1.0/class","arale/events/1.1.0/events","arale/validator/0.9.7/async"],function(a,b,c){function d(a,b,c){var d=g.extend({},a,{element:c.element,display:a&&a.display||c.get("display"),rule:b}),f=c.get("errormessage")||c.get("errormessage"+e(b));return f&&!d.message&&(d.message={failure:f}),d}function e(a){return a+="",a.charAt(0).toUpperCase()+a.slice(1)}function f(a,b,c){var e=a.element;if(!a.get("required")){var f=!1,i=e.attr("type");switch(i){case"checkbox":case"radio":var l=!1;e.each(function(a,b){return g(b).prop("checked")?(l=!0,!1):void 0}),f=l;break;default:f=!!e.val()}if(!f)return void(c&&c(null,null))}if(!g.isArray(b))throw new Error("No validation rule specified or not specified as an array.");var m=[];g.each(b,function(b,c){var e=h.parseRule(c),f=e.name,g=e.param,i=k.getOperator(f);if(!i)throw new Error('Validation rule with name "'+f+'" cannot be found.');var j=d(g,f,a);m.push(function(b){i.call(a._validator,j,b)})}),j.series(m,function(a,b){c&&c(a,b[b.length-1])})}var g=a("$"),h=a("arale/validator/0.9.7/utils"),i=a("arale/widget/1.1.1/widget"),j=a("arale/validator/0.9.7/async"),k=a("arale/validator/0.9.7/rule"),l={value:g.noop,setter:function(a){return g.isFunction(a)?a:h.helper(a)}},m=i.extend({attrs:{rule:{value:"",getter:function(a){return this.get("required")?(!a||a.indexOf("required")<0)&&(a="required "+a):-1!=a.indexOf("required")&&(a=a.replace("required ")),a}},display:null,displayHelper:null,triggerType:{getter:function(a){if(!a)return a;var b=this.element,c=b.attr("type"),d=b.is("select")||"radio"==c||"checkbox"==c;return d&&(a.indexOf("blur")>-1||a.indexOf("key")>-1)?"change":a}},required:{value:!1,getter:function(a){return g.isFunction(a)?a():a}},checkNull:!0,errormessage:null,onItemValidate:l,onItemValidated:l,showMessage:l,hideMessage:l},setup:function(){!this.get("display")&&g.isFunction(this.get("displayHelper"))&&this.set("display",this.get("displayHelper")(this))},execute:function(a,b){var c=this,d=!!c.element.attr("disabled");if(b=b||{},c.get("skipHidden")&&h.isHidden(c.element)||d)return a&&a(null,"",c.element),c;c.trigger("itemValidate",c.element,b.event);var e=h.parseRules(c.get("rule"));return e?f(c,e,function(d,e){c.trigger("itemValidated",d,e,c.element,b.event),a&&a(d,e,c.element)}):a&&a(null,"",c.element),c},getMessage:function(a,b,c){var e="",f=this,i=h.parseRules(f.get("rule"));return b=!!b,g.each(i,function(i,j){var l=h.parseRule(j),m=l.name,n=l.param;a===m&&(e=k.getMessage(g.extend(c||{},d(n,m,f)),b))}),e}});c.exports=m}),define("arale/widget/1.1.1/widget",["arale/base/1.1.1/base","arale/class/1.1.0/class","arale/events/1.1.0/events","$","./daparser","./auto-render"],function(a,b,c){function d(){return"widget-"+w++}function e(a){return"[object String]"===v.call(a)}function f(a){return"[object Function]"===v.call(a)}function g(a){return x(document.documentElement,a)}function h(a){return a.charAt(0).toUpperCase()+a.substring(1)}function i(a){return f(a.events)&&(a.events=a.events()),a.events}function j(a,b){var c=a.match(y),d=c[1]+q+b.cid,e=c[2]||void 0;return e&&e.indexOf("{{")>-1&&(e=k(e,b)),{type:d,selector:e}}function k(a,b){return a.replace(z,function(a,c){for(var d,f=c.split("."),g=b;d=f.shift();)g=g===b.attrs?b.get(d):g[d];return e(g)?g:A})}function l(a){return null==a||void 0===a}var m=a("arale/base/1.1.1/base"),n=a("$"),o=a("./daparser"),p=a("./auto-render"),q=".delegate-events-",r="_onRender",s="data-widget-cid",t={},u=m.extend({propsInAttrs:["initElement","element","events"],element:null,events:null,attrs:{id:null,className:null,style:null,template:"<div></div>",model:null,parentNode:document.body},initialize:function(a){this.cid=d();var b=this._parseDataAttrsConfig(a);u.superclass.initialize.call(this,a?n.extend(b,a):b),this.parseElement(),this.initProps(),this.delegateEvents(),this.setup(),this._stamp(),this._isTemplate=!(a&&a.element)},_parseDataAttrsConfig:function(a){var b,c;return a&&(b=n(a.initElement?a.initElement:a.element)),b&&b[0]&&!p.isDataApiOff(b)&&(c=o.parseElement(b)),c},parseElement:function(){var a=this.element;if(a?this.element=n(a):this.get("template")&&this.parseElementFromTemplate(),!this.element||!this.element[0])throw new Error("element is invalid")},parseElementFromTemplate:function(){this.element=n(this.get("template"))},initProps:function(){},delegateEvents:function(a,b,c){if(0===arguments.length?(b=i(this),a=this.element):1===arguments.length?(b=a,a=this.element):2===arguments.length?(c=b,b=a,a=this.element):(a||(a=this.element),this._delegateElements||(this._delegateElements=[]),this._delegateElements.push(n(a))),e(b)&&f(c)){var d={};d[b]=c,b=d}for(var g in b)if(b.hasOwnProperty(g)){var h=j(g,this),k=h.type,l=h.selector;!function(b,c){var d=function(a){f(b)?b.call(c,a):c[b](a)};l?n(a).on(k,l,d):n(a).on(k,d)}(b[g],this)}return this},undelegateEvents:function(a,b){if(b||(b=a,a=null),0===arguments.length){var c=q+this.cid;if(this.element&&this.element.off(c),this._delegateElements)for(var d in this._delegateElements)this._delegateElements.hasOwnProperty(d)&&this._delegateElements[d].off(c)}else{var e=j(b,this);a?n(a).off(e.type,e.selector):this.element&&this.element.off(e.type,e.selector)}return this},setup:function(){},render:function(){this.rendered||(this._renderAndBindAttrs(),this.rendered=!0);var a=this.get("parentNode");if(a&&!g(this.element[0])){var b=this.constructor.outerBoxClass;if(b){var c=this._outerBox=n("<div></div>").addClass(b);c.append(this.element).appendTo(a)}else this.element.appendTo(a)}return this},_renderAndBindAttrs:function(){var a=this,b=a.attrs;for(var c in b)if(b.hasOwnProperty(c)){var d=r+h(c);if(this[d]){var e=this.get(c);l(e)||this[d](e,void 0,c),function(b){a.on("change:"+c,function(c,d,e){a[b](c,d,e)})}(d)}}},_onRenderId:function(a){this.element.attr("id",a)},_onRenderClassName:function(a){this.element.addClass(a)},_onRenderStyle:function(a){this.element.css(a)},_stamp:function(){var a=this.cid;(this.initElement||this.element).attr(s,a),t[a]=this},$:function(a){return this.element.find(a)},destroy:function(){this.undelegateEvents(),delete t[this.cid],this.element&&this._isTemplate&&(this.element.off(),this._outerBox?this._outerBox.remove():this.element.remove()),this.element=null,u.superclass.destroy.call(this)}});n(window).unload(function(){for(var a in t)t[a].destroy()}),u.query=function(a){var b,c=n(a).eq(0);return c&&(b=c.attr(s)),t[b]},u.autoRender=p.autoRender,u.autoRenderAll=p.autoRenderAll,u.StaticsWhiteList=["autoRender"],c.exports=u;var v=Object.prototype.toString,w=0,x=n.contains||function(a,b){return!!(16&a.compareDocumentPosition(b))},y=/^(\S+)\s*(.*)$/,z=/{{([^}]+)}}/g,A="INVALID_SELECTOR"}),define("arale/widget/1.1.1/daparser",["$"],function(a,b){function c(a){return a.toLowerCase().replace(g,function(a,b){return(b+"").toUpperCase()})}function d(a){for(var b in a)if(a.hasOwnProperty(b)){var c=a[b];if("string"!=typeof c)continue;h.test(c)?(c=c.replace(/'/g,'"'),a[b]=d(i(c))):a[b]=e(c)}return a}function e(a){if("false"===a.toLowerCase())a=!1;else if("true"===a.toLowerCase())a=!0;else if(/\d/.test(a)&&/[^a-z]/i.test(a)){var b=parseFloat(a);b+""===a&&(a=b)}return a}var f=a("$");b.parseElement=function(a,b){a=f(a)[0];var e={};if(a.dataset)e=f.extend({},a.dataset);else for(var g=a.attributes,h=0,i=g.length;i>h;h++){var j=g[h],k=j.name;0===k.indexOf("data-")&&(k=c(k.substring(5)),e[k]=j.value)}return b===!0?e:d(e)};var g=/-([a-z])/g,h=/^\s*[\[{].*[\]}]\s*$/,i=this.JSON?JSON.parse:f.parseJSON}),define("arale/widget/1.1.1/auto-render",["$"],function(a,b){var c=a("$"),d="data-widget-auto-rendered";b.autoRender=function(a){return new this(a).render()},b.autoRenderAll=function(a,e){"function"==typeof a&&(e=a,a=null),a=c(a||document.body);var f=[],g=[];a.find("[data-widget]").each(function(a,c){b.isDataApiOff(c)||(f.push(c.getAttribute("data-widget").toLowerCase()),g.push(c))}),f.length&&seajs.use(f,function(){for(var a=0;a<arguments.length;a++){var b=arguments[a],f=c(g[a]);if(!f.attr(d)){var h={initElement:f,renderType:"auto"},i=f.attr("data-widget-role");h[i?i:"element"]=f,b.autoRender&&b.autoRender(h),f.attr(d,"true")}}e&&e()})};var e="off"===c(document.body).attr("data-api");b.isDataApiOff=function(a){var b=c(a).attr("data-api");return"off"===b||"on"!==b&&e}}),define("arale/base/1.1.1/base",["arale/class/1.1.0/class","arale/events/1.1.0/events","./aspect","./attribute"],function(a,b,c){function d(a,b){for(var c in b)if(b.hasOwnProperty(c)){var d="_onChange"+e(c);a[d]&&a.on("change:"+c,a[d])}}function e(a){return a.charAt(0).toUpperCase()+a.substring(1)}var f=a("arale/class/1.1.0/class"),g=a("arale/events/1.1.0/events"),h=a("./aspect"),i=a("./attribute");c.exports=f.create({Implements:[g,h,i],initialize:function(a){this.initAttrs(a),d(this,this.attrs)},destroy:function(){this.off();for(var a in this)this.hasOwnProperty(a)&&delete this[a];this.destroy=function(){}}})}),define("arale/base/1.1.1/aspect",[],function(a,b){function c(a,b,c,g){for(var h,i,j=b.split(f);h=j.shift();)i=d(this,h),i.__isAspected||e.call(this,h),this.on(a+":"+h,c,g);return this}function d(a,b){var c=a[b];if(!c)throw new Error("Invalid method name: "+b);return c}function e(a){var b=this[a];this[a]=function(){var c=Array.prototype.slice.call(arguments),d=["before:"+a].concat(c);if(this.trigger.apply(this,d)!==!1){var e=b.apply(this,arguments),f=["after:"+a,e].concat(c);return this.trigger.apply(this,f),e}},this[a].__isAspected=!0}b.before=function(a,b,d){return c.call(this,"before",a,b,d)},b.after=function(a,b,d){return c.call(this,"after",a,b,d)};var f=/\s+/}),define("arale/base/1.1.1/attribute",[],function(a,b){function c(a){return"[object String]"===t.call(a)}function d(a){return"[object Function]"===t.call(a)}function e(a){return null!=a&&a==a.window}function f(a){if(!a||"[object Object]"!==t.call(a)||a.nodeType||e(a))return!1;try{if(a.constructor&&!u.call(a,"constructor")&&!u.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(b){return!1}var c;if(s)for(c in a)return u.call(a,c);for(c in a);return void 0===c||u.call(a,c)}function g(a){if(!a||"[object Object]"!==t.call(a)||a.nodeType||e(a)||!a.hasOwnProperty)return!1;for(var b in a)if(a.hasOwnProperty(b))return!1;return!0}function h(a,b){var c,d;for(c in b)if(b.hasOwnProperty(c)){if(d=b[c],v(d))d=d.slice();else if(f(d)){var e=a[c];f(e)||(e={}),d=h(e,d)}a[c]=d}return a}function i(a,b,c){for(var d=[],e=b.constructor.prototype;e;)e.hasOwnProperty("attrs")||(e.attrs={}),k(c,e.attrs,e),g(e.attrs)||d.unshift(e.attrs),e=e.constructor.superclass;for(var f=0,i=d.length;i>f;f++)h(a,o(d[f]))}function j(a,b){h(a,o(b,!0))}function k(a,b,c,d){for(var e=0,f=a.length;f>e;e++){var g=a[e];c.hasOwnProperty(g)&&(b[g]=d?b.get(g):c[g])}}function l(a,b){for(var c in b)if(b.hasOwnProperty(c)){var e,f=b[c].value;d(f)&&(e=c.match(x))&&(a[e[1]](m(e[2]),f),delete b[c])}}function m(a){var b=a.match(y),c=b[1]?"change:":"";return c+=b[2].toLowerCase()+b[3]}function n(a,b,c){var d={silent:!0};a.__initializingAttrs=!0;for(var e in c)c.hasOwnProperty(e)&&b[e].setter&&a.set(e,c[e],d);delete a.__initializingAttrs}function o(a,b){var c={};for(var d in a){var e=a[d];c[d]=!b&&f(e)&&p(e,z)?e:{value:e}}return c}function p(a,b){for(var c=0,d=b.length;d>c;c++)if(a.hasOwnProperty(b[c]))return!0;return!1}function q(a){return null==a||(c(a)||v(a))&&0===a.length||g(a)}function r(a,b){if(a===b)return!0;if(q(a)&&q(b))return!0;var c=t.call(a);if(c!=t.call(b))return!1;switch(c){case"[object String]":return a==String(b);case"[object Number]":return a!=+a?b!=+b:0==a?1/a==1/b:a==+b;case"[object Date]":case"[object Boolean]":return+a==+b;case"[object RegExp]":return a.source==b.source&&a.global==b.global&&a.multiline==b.multiline&&a.ignoreCase==b.ignoreCase;case"[object Array]":var d=a.toString(),e=b.toString();return-1===d.indexOf("[object")&&-1===e.indexOf("[object")&&d===e}if("object"!=typeof a||"object"!=typeof b)return!1;if(f(a)&&f(b)){if(!r(w(a),w(b)))return!1;for(var g in a)if(a[g]!==b[g])return!1;return!0}return!1}b.initAttrs=function(a){var b=this.attrs={},c=this.propsInAttrs||[];i(b,this,c),a&&j(b,a),n(this,b,a),l(this,b),k(c,this,b,!0)},b.get=function(a){var b=this.attrs[a]||{},c=b.value;return b.getter?b.getter.call(this,c,a):c},b.set=function(a,b,d){var e={};c(a)?e[a]=b:(e=a,d=b),d||(d={});var g=d.silent,i=d.override,j=this.attrs,k=this.__changedAttrs||(this.__changedAttrs={});for(a in e)if(e.hasOwnProperty(a)){var l=j[a]||(j[a]={});if(b=e[a],l.readOnly)throw new Error("This attribute is readOnly: "+a);l.setter&&(b=l.setter.call(this,b,a));var m=this.get(a);!i&&f(m)&&f(b)&&(b=h(h({},m),b)),j[a].value=b,this.__initializingAttrs||r(m,b)||(g?k[a]=[b,m]:this.trigger("change:"+a,b,m,a))}return this},b.change=function(){var a=this.__changedAttrs;if(a){for(var b in a)if(a.hasOwnProperty(b)){var c=a[b];this.trigger("change:"+b,c[0],c[1],b)}delete this.__changedAttrs}return this},b._isPlainObject=f;var s,t=Object.prototype.toString,u=Object.prototype.hasOwnProperty;!function(){function a(){this.x=1}var b=[];a.prototype={valueOf:1,y:1};for(var c in new a)b.push(c);s="x"!==b[0]}();var v=Array.isArray||function(a){return"[object Array]"===t.call(a)},w=Object.keys;w||(w=function(a){var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c);return b});var x=/^(on|before|after)([A-Z].*)$/,y=/^(Change)?([A-Z])(.*)/,z=["value","getter","setter","readOnly"]}),define("arale/class/1.1.0/class",[],function(a,b,c){function d(a){return this instanceof d||!l(a)?void 0:f(a)}function e(a){var b,c;for(b in a)c=a[b],d.Mutators.hasOwnProperty(b)?d.Mutators[b].call(this,c):this.prototype[b]=c}function f(a){return a.extend=d.extend,a.implement=e,a}function g(){}function h(a,b,c){for(var d in b)if(b.hasOwnProperty(d)){if(c&&-1===m(c,d))continue;"prototype"!==d&&(a[d]=b[d])}}c.exports=d,d.create=function(a,b){function c(){a.apply(this,arguments),this.constructor===c&&this.initialize&&this.initialize.apply(this,arguments)}return l(a)||(b=a,a=null),b||(b={}),a||(a=b.Extends||d),b.Extends=a,a!==d&&h(c,a,a.StaticsWhiteList),e.call(c,b),f(c)},d.extend=function(a){return a||(a={}),a.Extends=this,d.create(a)},d.Mutators={Extends:function(a){var b=this.prototype,c=i(a.prototype);h(c,b),c.constructor=this,this.prototype=c,this.superclass=a.prototype},Implements:function(a){k(a)||(a=[a]);for(var b,c=this.prototype;b=a.shift();)h(c,b.prototype||b)},Statics:function(a){h(this,a)}};var i=Object.__proto__?function(a){return{__proto__:a}}:function(a){return g.prototype=a,new g},j=Object.prototype.toString,k=Array.isArray||function(a){return"[object Array]"===j.call(a)},l=function(a){return"[object Function]"===j.call(a)},m=Array.prototype.indexOf?function(a,b){return a.indexOf(b)}:function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1}}),define("arale/events/1.1.0/events",[],function(){function a(){}function b(a,b,c,d){var e;if(a)for(var f=0,g=a.length;g>f;f+=2)e=a[f].apply(a[f+1]||c,b),e===!1&&d.status&&(d.status=!1)}var c=/\s+/;a.prototype.on=function(a,b,d){var e,f,g;if(!b)return this;for(e=this.__events||(this.__events={}),a=a.split(c);f=a.shift();)g=e[f]||(e[f]=[]),g.push(b,d);return this},a.prototype.off=function(a,b,e){var f,g,h,i;if(!(f=this.__events))return this;if(!(a||b||e))return delete this.__events,this;for(a=a?a.split(c):d(f);g=a.shift();)if(h=f[g])if(b||e)for(i=h.length-2;i>=0;i-=2)b&&h[i]!==b||e&&h[i+1]!==e||h.splice(i,2);else delete f[g];return this},a.prototype.trigger=function(a){var d,e,f,g,h,i,j=[],k={status:!0};if(!(d=this.__events))return this;for(a=a.split(c),h=1,i=arguments.length;i>h;h++)j[h-1]=arguments[h];for(;e=a.shift();)(f=d.all)&&(f=f.slice()),(g=d[e])&&(g=g.slice()),b(g,j,this,k),b(f,[e].concat(j),this,k);return k.status},a.mixTo=function(b){b=b.prototype||b;var c=a.prototype;for(var d in c)c.hasOwnProperty(d)&&(b[d]=c[d])};var d=Object.keys;return d||(d=function(a){var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c);return b}),a});