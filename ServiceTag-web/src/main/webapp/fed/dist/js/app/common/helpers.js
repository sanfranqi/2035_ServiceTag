define("app/common/helpers",["gallery/moment/2.8.1/moment"],function(a){var b=a("gallery/moment/2.8.1/moment");return{fDate:function(a){var c="";return a&&(c=b(a).format("YYYY-MM-DD HH:mm")),c},fShortDate:function(a){var c="";return a&&(c=b(a).format("YYYY-MM-DD")),c},fTime:function(a){var c="",d=+a;return(d||0===d)&&(c=b(d+946656e6).format("HH:mm")),c},judge:function(a,b,c){return a===b?c.fn(this):c.inverse(this)},contrast:function(a,b,c){return a>b?c.fn(this):c.inverse(this)},getImage:function(a){return imageURL+"/"+a},getAvatars:function(a){return userImagePath+"/m_"+a+"/head_pic/small.jpg"},now:function(){return b().format("HH:mm")},getFileIcon:function(a){var b,c=a.split("."),d=c[c.length-1].toString().toLowerCase(),e="http://ue1.17173cdn.com/a/2035/open/2014/img/";switch(d){case"jpg":case"jpeg":case"png":case"gif":case"bmp":b=a;break;case"doc":b=e+"f1.jpg";break;case"txt":b=e+"f2.jpg";break;case"xls":b=e+"f3.jpg";break;case"pdf":b=e+"f4.jpg";break;case"ppt":b=e+"f5.jpg";break;case"rar":b=e+"f6.jpg";break;case"zip":b=e+"f7.jpg";break;case"mp3":b=e+"f8.jpg";break;default:b=e+"f9.jpg"}return b}}}),define("gallery/moment/2.8.1/moment",[],function(a,b,c){!function(b){function d(a,b,c){switch(arguments.length){case 2:return null!=a?a:b;case 3:return null!=a?a:null!=b?b:c;default:throw new Error("Implement me")}}function e(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function f(a){tb.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+a)}function g(a,b){var c=!0;return n(function(){return c&&(f(a),c=!1),b.apply(this,arguments)},b)}function h(a,b){pc[a]||(f(b),pc[a]=!0)}function i(a,b){return function(c){return q(a.call(this,c),b)}}function j(a,b){return function(c){return this.localeData().ordinal(a.call(this,c),b)}}function k(){}function l(a,b){b!==!1&&G(a),o(this,a),this._d=new Date(+a._d)}function m(a){var b=z(a),c=b.year||0,d=b.quarter||0,e=b.month||0,f=b.week||0,g=b.day||0,h=b.hour||0,i=b.minute||0,j=b.second||0,k=b.millisecond||0;this._milliseconds=+k+1e3*j+6e4*i+36e5*h,this._days=+g+7*f,this._months=+e+3*d+12*c,this._data={},this._locale=tb.localeData(),this._bubble()}function n(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return b.hasOwnProperty("toString")&&(a.toString=b.toString),b.hasOwnProperty("valueOf")&&(a.valueOf=b.valueOf),a}function o(a,b){var c,d,e;if("undefined"!=typeof b._isAMomentObject&&(a._isAMomentObject=b._isAMomentObject),"undefined"!=typeof b._i&&(a._i=b._i),"undefined"!=typeof b._f&&(a._f=b._f),"undefined"!=typeof b._l&&(a._l=b._l),"undefined"!=typeof b._strict&&(a._strict=b._strict),"undefined"!=typeof b._tzm&&(a._tzm=b._tzm),"undefined"!=typeof b._isUTC&&(a._isUTC=b._isUTC),"undefined"!=typeof b._offset&&(a._offset=b._offset),"undefined"!=typeof b._pf&&(a._pf=b._pf),"undefined"!=typeof b._locale&&(a._locale=b._locale),Hb.length>0)for(c in Hb)d=Hb[c],e=b[d],"undefined"!=typeof e&&(a[d]=e);return a}function p(a){return 0>a?Math.ceil(a):Math.floor(a)}function q(a,b,c){for(var d=""+Math.abs(a),e=a>=0;d.length<b;)d="0"+d;return(e?c?"+":"":"-")+d}function r(a,b){var c={milliseconds:0,months:0};return c.months=b.month()-a.month()+12*(b.year()-a.year()),a.clone().add(c.months,"M").isAfter(b)&&--c.months,c.milliseconds=+b-+a.clone().add(c.months,"M"),c}function s(a,b){var c;return b=L(b,a),a.isBefore(b)?c=r(a,b):(c=r(b,a),c.milliseconds=-c.milliseconds,c.months=-c.months),c}function t(a,b){return function(c,d){var e,f;return null===d||isNaN(+d)||(h(b,"moment()."+b+"(period, number) is deprecated. Please use moment()."+b+"(number, period)."),f=c,c=d,d=f),c="string"==typeof c?+c:c,e=tb.duration(c,d),u(this,e,a),this}}function u(a,b,c,d){var e=b._milliseconds,f=b._days,g=b._months;d=null==d?!0:d,e&&a._d.setTime(+a._d+e*c),f&&nb(a,"Date",mb(a,"Date")+f*c),g&&lb(a,mb(a,"Month")+g*c),d&&tb.updateOffset(a,f||g)}function v(a){return"[object Array]"===Object.prototype.toString.call(a)}function w(a){return"[object Date]"===Object.prototype.toString.call(a)||a instanceof Date}function x(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;e>d;d++)(c&&a[d]!==b[d]||!c&&B(a[d])!==B(b[d]))&&g++;return g+f}function y(a){if(a){var b=a.toLowerCase().replace(/(.)s$/,"$1");a=ic[a]||jc[b]||b}return a}function z(a){var b,c,d={};for(c in a)a.hasOwnProperty(c)&&(b=y(c),b&&(d[b]=a[c]));return d}function A(a){var c,d;if(0===a.indexOf("week"))c=7,d="day";else{if(0!==a.indexOf("month"))return;c=12,d="month"}tb[a]=function(e,f){var g,h,i=tb._locale[a],j=[];if("number"==typeof e&&(f=e,e=b),h=function(a){var b=tb().utc().set(d,a);return i.call(tb._locale,b,e||"")},null!=f)return h(f);for(g=0;c>g;g++)j.push(h(g));return j}}function B(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=b>=0?Math.floor(b):Math.ceil(b)),c}function C(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function D(a,b,c){return hb(tb([a,11,31+b-c]),b,c).week}function E(a){return F(a)?366:365}function F(a){return 0===a%4&&0!==a%100||0===a%400}function G(a){var b;a._a&&-2===a._pf.overflow&&(b=a._a[Ab]<0||a._a[Ab]>11?Ab:a._a[Bb]<1||a._a[Bb]>C(a._a[zb],a._a[Ab])?Bb:a._a[Cb]<0||a._a[Cb]>23?Cb:a._a[Db]<0||a._a[Db]>59?Db:a._a[Eb]<0||a._a[Eb]>59?Eb:a._a[Fb]<0||a._a[Fb]>999?Fb:-1,a._pf._overflowDayOfYear&&(zb>b||b>Bb)&&(b=Bb),a._pf.overflow=b)}function H(a){return null==a._isValid&&(a._isValid=!isNaN(a._d.getTime())&&a._pf.overflow<0&&!a._pf.empty&&!a._pf.invalidMonth&&!a._pf.nullInput&&!a._pf.invalidFormat&&!a._pf.userInvalidated,a._strict&&(a._isValid=a._isValid&&0===a._pf.charsLeftOver&&0===a._pf.unusedTokens.length)),a._isValid}function I(a){return a?a.toLowerCase().replace("_","-"):a}function J(a){for(var b,c,d,e,f=0;f<a.length;){for(e=I(a[f]).split("-"),b=e.length,c=I(a[f+1]),c=c?c.split("-"):null;b>0;){if(d=K(e.slice(0,b).join("-")))return d;if(c&&c.length>=b&&x(e,c,!0)>=b-1)break;b--}f++}return null}function K(b){var c=null;if(!Gb[b]&&Ib)try{c=tb.locale(),a("./locale/"+b),tb.locale(c)}catch(d){}return Gb[b]}function L(a,b){return b._isUTC?tb(a).zone(b._offset||0):tb(a).local()}function M(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function N(a){var b,c,d=a.match(Mb);for(b=0,c=d.length;c>b;b++)d[b]=oc[d[b]]?oc[d[b]]:M(d[b]);return function(e){var f="";for(b=0;c>b;b++)f+=d[b]instanceof Function?d[b].call(e,a):d[b];return f}}function O(a,b){return a.isValid()?(b=P(b,a.localeData()),kc[b]||(kc[b]=N(b)),kc[b](a)):a.localeData().invalidDate()}function P(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(Nb.lastIndex=0;d>=0&&Nb.test(a);)a=a.replace(Nb,c),Nb.lastIndex=0,d-=1;return a}function Q(a,b){var c,d=b._strict;switch(a){case"Q":return Yb;case"DDDD":return $b;case"YYYY":case"GGGG":case"gggg":return d?_b:Qb;case"Y":case"G":case"g":return bc;case"YYYYYY":case"YYYYY":case"GGGGG":case"ggggg":return d?ac:Rb;case"S":if(d)return Yb;case"SS":if(d)return Zb;case"SSS":if(d)return $b;case"DDD":return Pb;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":return Tb;case"a":case"A":return b._locale._meridiemParse;case"X":return Wb;case"Z":case"ZZ":return Ub;case"T":return Vb;case"SSSS":return Sb;case"MM":case"DD":case"YY":case"GG":case"gg":case"HH":case"hh":case"mm":case"ss":case"ww":case"WW":return d?Zb:Ob;case"M":case"D":case"d":case"H":case"h":case"m":case"s":case"w":case"W":case"e":case"E":return Ob;case"Do":return Xb;default:return c=new RegExp(Z(Y(a.replace("\\","")),"i"))}}function R(a){a=a||"";var b=a.match(Ub)||[],c=b[b.length-1]||[],d=(c+"").match(gc)||["-",0,0],e=+(60*d[1])+B(d[2]);return"+"===d[0]?-e:e}function S(a,b,c){var d,e=c._a;switch(a){case"Q":null!=b&&(e[Ab]=3*(B(b)-1));break;case"M":case"MM":null!=b&&(e[Ab]=B(b)-1);break;case"MMM":case"MMMM":d=c._locale.monthsParse(b),null!=d?e[Ab]=d:c._pf.invalidMonth=b;break;case"D":case"DD":null!=b&&(e[Bb]=B(b));break;case"Do":null!=b&&(e[Bb]=B(parseInt(b,10)));break;case"DDD":case"DDDD":null!=b&&(c._dayOfYear=B(b));break;case"YY":e[zb]=tb.parseTwoDigitYear(b);break;case"YYYY":case"YYYYY":case"YYYYYY":e[zb]=B(b);break;case"a":case"A":c._isPm=c._locale.isPM(b);break;case"H":case"HH":case"h":case"hh":e[Cb]=B(b);break;case"m":case"mm":e[Db]=B(b);break;case"s":case"ss":e[Eb]=B(b);break;case"S":case"SS":case"SSS":case"SSSS":e[Fb]=B(1e3*("0."+b));break;case"X":c._d=new Date(1e3*parseFloat(b));break;case"Z":case"ZZ":c._useUTC=!0,c._tzm=R(b);break;case"dd":case"ddd":case"dddd":d=c._locale.weekdaysParse(b),null!=d?(c._w=c._w||{},c._w.d=d):c._pf.invalidWeekday=b;break;case"w":case"ww":case"W":case"WW":case"d":case"e":case"E":a=a.substr(0,1);case"gggg":case"GGGG":case"GGGGG":a=a.substr(0,2),b&&(c._w=c._w||{},c._w[a]=B(b));break;case"gg":case"GG":c._w=c._w||{},c._w[a]=tb.parseTwoDigitYear(b)}}function T(a){var b,c,e,f,g,h,i;b=a._w,null!=b.GG||null!=b.W||null!=b.E?(g=1,h=4,c=d(b.GG,a._a[zb],hb(tb(),1,4).year),e=d(b.W,1),f=d(b.E,1)):(g=a._locale._week.dow,h=a._locale._week.doy,c=d(b.gg,a._a[zb],hb(tb(),g,h).year),e=d(b.w,1),null!=b.d?(f=b.d,g>f&&++e):f=null!=b.e?b.e+g:g),i=ib(c,e,f,h,g),a._a[zb]=i.year,a._dayOfYear=i.dayOfYear}function U(a){var b,c,e,f,g=[];if(!a._d){for(e=W(a),a._w&&null==a._a[Bb]&&null==a._a[Ab]&&T(a),a._dayOfYear&&(f=d(a._a[zb],e[zb]),a._dayOfYear>E(f)&&(a._pf._overflowDayOfYear=!0),c=db(f,0,a._dayOfYear),a._a[Ab]=c.getUTCMonth(),a._a[Bb]=c.getUTCDate()),b=0;3>b&&null==a._a[b];++b)a._a[b]=g[b]=e[b];for(;7>b;b++)a._a[b]=g[b]=null==a._a[b]?2===b?1:0:a._a[b];a._d=(a._useUTC?db:cb).apply(null,g),null!=a._tzm&&a._d.setUTCMinutes(a._d.getUTCMinutes()+a._tzm)}}function V(a){var b;a._d||(b=z(a._i),a._a=[b.year,b.month,b.day,b.hour,b.minute,b.second,b.millisecond],U(a))}function W(a){var b=new Date;return a._useUTC?[b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate()]:[b.getFullYear(),b.getMonth(),b.getDate()]}function X(a){if(a._f===tb.ISO_8601)return void _(a);a._a=[],a._pf.empty=!0;var b,c,d,e,f,g=""+a._i,h=g.length,i=0;for(d=P(a._f,a._locale).match(Mb)||[],b=0;b<d.length;b++)e=d[b],c=(g.match(Q(e,a))||[])[0],c&&(f=g.substr(0,g.indexOf(c)),f.length>0&&a._pf.unusedInput.push(f),g=g.slice(g.indexOf(c)+c.length),i+=c.length),oc[e]?(c?a._pf.empty=!1:a._pf.unusedTokens.push(e),S(e,c,a)):a._strict&&!c&&a._pf.unusedTokens.push(e);a._pf.charsLeftOver=h-i,g.length>0&&a._pf.unusedInput.push(g),a._isPm&&a._a[Cb]<12&&(a._a[Cb]+=12),a._isPm===!1&&12===a._a[Cb]&&(a._a[Cb]=0),U(a),G(a)}function Y(a){return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e})}function Z(a){return a.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function $(a){var b,c,d,f,g;if(0===a._f.length)return a._pf.invalidFormat=!0,void(a._d=new Date(0/0));for(f=0;f<a._f.length;f++)g=0,b=o({},a),b._pf=e(),b._f=a._f[f],X(b),H(b)&&(g+=b._pf.charsLeftOver,g+=10*b._pf.unusedTokens.length,b._pf.score=g,(null==d||d>g)&&(d=g,c=b));n(a,c||b)}function _(a){var b,c,d=a._i,e=cc.exec(d);if(e){for(a._pf.iso=!0,b=0,c=ec.length;c>b;b++)if(ec[b][1].exec(d)){a._f=ec[b][0]+(e[6]||" ");break}for(b=0,c=fc.length;c>b;b++)if(fc[b][1].exec(d)){a._f+=fc[b][0];break}d.match(Ub)&&(a._f+="Z"),X(a)}else a._isValid=!1}function ab(a){_(a),a._isValid===!1&&(delete a._isValid,tb.createFromInputFallback(a))}function bb(a){var c,d=a._i;d===b?a._d=new Date:w(d)?a._d=new Date(+d):null!==(c=Jb.exec(d))?a._d=new Date(+c[1]):"string"==typeof d?ab(a):v(d)?(a._a=d.slice(0),U(a)):"object"==typeof d?V(a):"number"==typeof d?a._d=new Date(d):tb.createFromInputFallback(a)}function cb(a,b,c,d,e,f,g){var h=new Date(a,b,c,d,e,f,g);return 1970>a&&h.setFullYear(a),h}function db(a){var b=new Date(Date.UTC.apply(null,arguments));return 1970>a&&b.setUTCFullYear(a),b}function eb(a,b){if("string"==typeof a)if(isNaN(a)){if(a=b.weekdaysParse(a),"number"!=typeof a)return null}else a=parseInt(a,10);return a}function fb(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function gb(a,b,c){var d=tb.duration(a).abs(),e=yb(d.as("s")),f=yb(d.as("m")),g=yb(d.as("h")),h=yb(d.as("d")),i=yb(d.as("M")),j=yb(d.as("y")),k=e<lc.s&&["s",e]||1===f&&["m"]||f<lc.m&&["mm",f]||1===g&&["h"]||g<lc.h&&["hh",g]||1===h&&["d"]||h<lc.d&&["dd",h]||1===i&&["M"]||i<lc.M&&["MM",i]||1===j&&["y"]||["yy",j];return k[2]=b,k[3]=+a>0,k[4]=c,fb.apply({},k)}function hb(a,b,c){var d,e=c-b,f=c-a.day();return f>e&&(f-=7),e-7>f&&(f+=7),d=tb(a).add(f,"d"),{week:Math.ceil(d.dayOfYear()/7),year:d.year()}}function ib(a,b,c,d,e){var f,g,h=db(a,0,1).getUTCDay();return h=0===h?7:h,c=null!=c?c:e,f=e-h+(h>d?7:0)-(e>h?7:0),g=7*(b-1)+(c-e)+f+1,{year:g>0?a:a-1,dayOfYear:g>0?g:E(a-1)+g}}function jb(a){var c=a._i,d=a._f;return a._locale=a._locale||tb.localeData(a._l),null===c||d===b&&""===c?tb.invalid({nullInput:!0}):("string"==typeof c&&(a._i=c=a._locale.preparse(c)),tb.isMoment(c)?new l(c,!0):(d?v(d)?$(a):X(a):bb(a),new l(a)))}function kb(a,b){var c,d;if(1===b.length&&v(b[0])&&(b=b[0]),!b.length)return tb();for(c=b[0],d=1;d<b.length;++d)b[d][a](c)&&(c=b[d]);return c}function lb(a,b){var c;return"string"==typeof b&&(b=a.localeData().monthsParse(b),"number"!=typeof b)?a:(c=Math.min(a.date(),C(a.year(),b)),a._d["set"+(a._isUTC?"UTC":"")+"Month"](b,c),a)}function mb(a,b){return a._d["get"+(a._isUTC?"UTC":"")+b]()}function nb(a,b,c){return"Month"===b?lb(a,c):a._d["set"+(a._isUTC?"UTC":"")+b](c)}function ob(a,b){return function(c){return null!=c?(nb(this,a,c),tb.updateOffset(this,b),this):mb(this,a)}}function pb(a){return 400*a/146097}function qb(a){return 146097*a/400}function rb(a){tb.duration.fn[a]=function(){return this._data[a]}}function sb(a){"undefined"==typeof ender&&(ub=xb.moment,xb.moment=a?g("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.",tb):tb)}for(var tb,ub,vb,wb="2.8.1",xb="undefined"!=typeof global?global:this,yb=Math.round,zb=0,Ab=1,Bb=2,Cb=3,Db=4,Eb=5,Fb=6,Gb={},Hb=[],Ib="undefined"!=typeof c&&c.exports,Jb=/^\/?Date\((\-?\d+)/i,Kb=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,Lb=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,Mb=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,Nb=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,Ob=/\d\d?/,Pb=/\d{1,3}/,Qb=/\d{1,4}/,Rb=/[+\-]?\d{1,6}/,Sb=/\d+/,Tb=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,Ub=/Z|[\+\-]\d\d:?\d\d/gi,Vb=/T/i,Wb=/[\+\-]?\d+(\.\d{1,3})?/,Xb=/\d{1,2}/,Yb=/\d/,Zb=/\d\d/,$b=/\d{3}/,_b=/\d{4}/,ac=/[+-]?\d{6}/,bc=/[+-]?\d+/,cc=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,dc="YYYY-MM-DDTHH:mm:ssZ",ec=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],fc=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],gc=/([\+\-]|\d\d)/gi,hc=("Date|Hours|Minutes|Seconds|Milliseconds".split("|"),{Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6}),ic={ms:"millisecond",s:"second",m:"minute",h:"hour",d:"day",D:"date",w:"week",W:"isoWeek",M:"month",Q:"quarter",y:"year",DDD:"dayOfYear",e:"weekday",E:"isoWeekday",gg:"weekYear",GG:"isoWeekYear"},jc={dayofyear:"dayOfYear",isoweekday:"isoWeekday",isoweek:"isoWeek",weekyear:"weekYear",isoweekyear:"isoWeekYear"},kc={},lc={s:45,m:45,h:22,d:26,M:11},mc="DDD w W M D d".split(" "),nc="M D H h m s w W".split(" "),oc={M:function(){return this.month()+1},MMM:function(a){return this.localeData().monthsShort(this,a)},MMMM:function(a){return this.localeData().months(this,a)},D:function(){return this.date()},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(a){return this.localeData().weekdaysMin(this,a)},ddd:function(a){return this.localeData().weekdaysShort(this,a)},dddd:function(a){return this.localeData().weekdays(this,a)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return q(this.year()%100,2)},YYYY:function(){return q(this.year(),4)},YYYYY:function(){return q(this.year(),5)},YYYYYY:function(){var a=this.year(),b=a>=0?"+":"-";return b+q(Math.abs(a),6)},gg:function(){return q(this.weekYear()%100,2)},gggg:function(){return q(this.weekYear(),4)},ggggg:function(){return q(this.weekYear(),5)},GG:function(){return q(this.isoWeekYear()%100,2)},GGGG:function(){return q(this.isoWeekYear(),4)},GGGGG:function(){return q(this.isoWeekYear(),5)},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.localeData().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.localeData().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return B(this.milliseconds()/100)},SS:function(){return q(B(this.milliseconds()/10),2)},SSS:function(){return q(this.milliseconds(),3)},SSSS:function(){return q(this.milliseconds(),3)},Z:function(){var a=-this.zone(),b="+";return 0>a&&(a=-a,b="-"),b+q(B(a/60),2)+":"+q(B(a)%60,2)},ZZ:function(){var a=-this.zone(),b="+";return 0>a&&(a=-a,b="-"),b+q(B(a/60),2)+q(B(a)%60,2)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()},X:function(){return this.unix()},Q:function(){return this.quarter()}},pc={},qc=["months","monthsShort","weekdays","weekdaysShort","weekdaysMin"];mc.length;)vb=mc.pop(),oc[vb+"o"]=j(oc[vb],vb);for(;nc.length;)vb=nc.pop(),oc[vb+vb]=i(oc[vb],2);oc.DDDD=i(oc.DDD,3),n(k.prototype,{set:function(a){var b,c;for(c in a)b=a[c],"function"==typeof b?this[c]=b:this["_"+c]=b},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(a){return this._months[a.month()]},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(a){return this._monthsShort[a.month()]},monthsParse:function(a){var b,c,d;for(this._monthsParse||(this._monthsParse=[]),b=0;12>b;b++)if(this._monthsParse[b]||(c=tb.utc([2e3,b]),d="^"+this.months(c,"")+"|^"+this.monthsShort(c,""),this._monthsParse[b]=new RegExp(d.replace(".",""),"i")),this._monthsParse[b].test(a))return b},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(a){return this._weekdays[a.day()]},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(a){return this._weekdaysShort[a.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(a){return this._weekdaysMin[a.day()]},weekdaysParse:function(a){var b,c,d;for(this._weekdaysParse||(this._weekdaysParse=[]),b=0;7>b;b++)if(this._weekdaysParse[b]||(c=tb([2e3,1]).day(b),d="^"+this.weekdays(c,"")+"|^"+this.weekdaysShort(c,"")+"|^"+this.weekdaysMin(c,""),this._weekdaysParse[b]=new RegExp(d.replace(".",""),"i")),this._weekdaysParse[b].test(a))return b},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY LT",LLLL:"dddd, MMMM D, YYYY LT"},longDateFormat:function(a){var b=this._longDateFormat[a];return!b&&this._longDateFormat[a.toUpperCase()]&&(b=this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a]=b),b},isPM:function(a){return"p"===(a+"").toLowerCase().charAt(0)},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(a,b){var c=this._calendar[a];return"function"==typeof c?c.apply(b):c},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(a,b,c,d){var e=this._relativeTime[c];return"function"==typeof e?e(a,b,c,d):e.replace(/%d/i,a)},pastFuture:function(a,b){var c=this._relativeTime[a>0?"future":"past"];return"function"==typeof c?c(b):c.replace(/%s/i,b)},ordinal:function(a){return this._ordinal.replace("%d",a)},_ordinal:"%d",preparse:function(a){return a},postformat:function(a){return a},week:function(a){return hb(a,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6},_invalidDate:"Invalid date",invalidDate:function(){return this._invalidDate}}),tb=function(a,c,d,f){var g;return"boolean"==typeof d&&(f=d,d=b),g={},g._isAMomentObject=!0,g._i=a,g._f=c,g._l=d,g._strict=f,g._isUTC=!1,g._pf=e(),jb(g)},tb.suppressDeprecationWarnings=!1,tb.createFromInputFallback=g("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.",function(a){a._d=new Date(a._i)}),tb.min=function(){var a=[].slice.call(arguments,0);return kb("isBefore",a)},tb.max=function(){var a=[].slice.call(arguments,0);return kb("isAfter",a)},tb.utc=function(a,c,d,f){var g;return"boolean"==typeof d&&(f=d,d=b),g={},g._isAMomentObject=!0,g._useUTC=!0,g._isUTC=!0,g._l=d,g._i=a,g._f=c,g._strict=f,g._pf=e(),jb(g).utc()},tb.unix=function(a){return tb(1e3*a)},tb.duration=function(a,b){var c,d,e,f,g=a,h=null;return tb.isDuration(a)?g={ms:a._milliseconds,d:a._days,M:a._months}:"number"==typeof a?(g={},b?g[b]=a:g.milliseconds=a):(h=Kb.exec(a))?(c="-"===h[1]?-1:1,g={y:0,d:B(h[Bb])*c,h:B(h[Cb])*c,m:B(h[Db])*c,s:B(h[Eb])*c,ms:B(h[Fb])*c}):(h=Lb.exec(a))?(c="-"===h[1]?-1:1,e=function(a){var b=a&&parseFloat(a.replace(",","."));return(isNaN(b)?0:b)*c},g={y:e(h[2]),M:e(h[3]),d:e(h[4]),h:e(h[5]),m:e(h[6]),s:e(h[7]),w:e(h[8])}):"object"==typeof g&&("from"in g||"to"in g)&&(f=s(tb(g.from),tb(g.to)),g={},g.ms=f.milliseconds,g.M=f.months),d=new m(g),tb.isDuration(a)&&a.hasOwnProperty("_locale")&&(d._locale=a._locale),d},tb.version=wb,tb.defaultFormat=dc,tb.ISO_8601=function(){},tb.momentProperties=Hb,tb.updateOffset=function(){},tb.relativeTimeThreshold=function(a,c){return lc[a]===b?!1:c===b?lc[a]:(lc[a]=c,!0)},tb.lang=g("moment.lang is deprecated. Use moment.locale instead.",function(a,b){return tb.locale(a,b)}),tb.locale=function(a,b){var c;return a&&(c="undefined"!=typeof b?tb.defineLocale(a,b):tb.localeData(a),c&&(tb.duration._locale=tb._locale=c)),tb._locale._abbr},tb.defineLocale=function(a,b){return null!==b?(b.abbr=a,Gb[a]||(Gb[a]=new k),Gb[a].set(b),tb.locale(a),Gb[a]):(delete Gb[a],null)},tb.langData=g("moment.langData is deprecated. Use moment.localeData instead.",function(a){return tb.localeData(a)}),tb.localeData=function(a){var b;if(a&&a._locale&&a._locale._abbr&&(a=a._locale._abbr),!a)return tb._locale;if(!v(a)){if(b=K(a))return b;a=[a]}return J(a)},tb.isMoment=function(a){return a instanceof l||null!=a&&a.hasOwnProperty("_isAMomentObject")},tb.isDuration=function(a){return a instanceof m};for(vb=qc.length-1;vb>=0;--vb)A(qc[vb]);tb.normalizeUnits=function(a){return y(a)},tb.invalid=function(a){var b=tb.utc(0/0);return null!=a?n(b._pf,a):b._pf.userInvalidated=!0,b},tb.parseZone=function(){return tb.apply(null,arguments).parseZone()},tb.parseTwoDigitYear=function(a){return B(a)+(B(a)>68?1900:2e3)},n(tb.fn=l.prototype,{clone:function(){return tb(this)},valueOf:function(){return+this._d+6e4*(this._offset||0)},unix:function(){return Math.floor(+this/1e3)},toString:function(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){var a=tb(this).utc();return 0<a.year()&&a.year()<=9999?O(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):O(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){var a=this;return[a.year(),a.month(),a.date(),a.hours(),a.minutes(),a.seconds(),a.milliseconds()]},isValid:function(){return H(this)},isDSTShifted:function(){return this._a?this.isValid()&&x(this._a,(this._isUTC?tb.utc(this._a):tb(this._a)).toArray())>0:!1},parsingFlags:function(){return n({},this._pf)},invalidAt:function(){return this._pf.overflow},utc:function(a){return this.zone(0,a)},local:function(a){return this._isUTC&&(this.zone(0,a),this._isUTC=!1,a&&this.add(this._d.getTimezoneOffset(),"m")),this},format:function(a){var b=O(this,a||tb.defaultFormat);return this.localeData().postformat(b)},add:t(1,"add"),subtract:t(-1,"subtract"),diff:function(a,b,c){var d,e,f=L(a,this),g=6e4*(this.zone()-f.zone());return b=y(b),"year"===b||"month"===b?(d=432e5*(this.daysInMonth()+f.daysInMonth()),e=12*(this.year()-f.year())+(this.month()-f.month()),e+=(this-tb(this).startOf("month")-(f-tb(f).startOf("month")))/d,e-=6e4*(this.zone()-tb(this).startOf("month").zone()-(f.zone()-tb(f).startOf("month").zone()))/d,"year"===b&&(e/=12)):(d=this-f,e="second"===b?d/1e3:"minute"===b?d/6e4:"hour"===b?d/36e5:"day"===b?(d-g)/864e5:"week"===b?(d-g)/6048e5:d),c?e:p(e)},from:function(a,b){return tb.duration({to:this,from:a}).locale(this.locale()).humanize(!b)},fromNow:function(a){return this.from(tb(),a)},calendar:function(a){var b=a||tb(),c=L(b,this).startOf("day"),d=this.diff(c,"days",!0),e=-6>d?"sameElse":-1>d?"lastWeek":0>d?"lastDay":1>d?"sameDay":2>d?"nextDay":7>d?"nextWeek":"sameElse";return this.format(this.localeData().calendar(e,this))},isLeapYear:function(){return F(this.year())},isDST:function(){return this.zone()<this.clone().month(0).zone()||this.zone()<this.clone().month(5).zone()},day:function(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=eb(a,this.localeData()),this.add(a-b,"d")):b},month:ob("Month",!0),startOf:function(a){switch(a=y(a)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a?this.weekday(0):"isoWeek"===a&&this.isoWeekday(1),"quarter"===a&&this.month(3*Math.floor(this.month()/3)),this},endOf:function(a){return a=y(a),this.startOf(a).add(1,"isoWeek"===a?"week":a).subtract(1,"ms")},isAfter:function(a,b){return b="undefined"!=typeof b?b:"millisecond",+this.clone().startOf(b)>+tb(a).startOf(b)},isBefore:function(a,b){return b="undefined"!=typeof b?b:"millisecond",+this.clone().startOf(b)<+tb(a).startOf(b)},isSame:function(a,b){return b=b||"ms",+this.clone().startOf(b)===+L(a,this).startOf(b)},min:g("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(a){return a=tb.apply(null,arguments),this>a?this:a}),max:g("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(a){return a=tb.apply(null,arguments),a>this?this:a}),zone:function(a,b){var c,d=this._offset||0;return null==a?this._isUTC?d:this._d.getTimezoneOffset():("string"==typeof a&&(a=R(a)),Math.abs(a)<16&&(a=60*a),!this._isUTC&&b&&(c=this._d.getTimezoneOffset()),this._offset=a,this._isUTC=!0,null!=c&&this.subtract(c,"m"),d!==a&&(!b||this._changeInProgress?u(this,tb.duration(d-a,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,tb.updateOffset(this,!0),this._changeInProgress=null)),this)},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""},parseZone:function(){return this._tzm?this.zone(this._tzm):"string"==typeof this._i&&this.zone(this._i),this},hasAlignedHourOffset:function(a){return a=a?tb(a).zone():0,0===(this.zone()-a)%60},daysInMonth:function(){return C(this.year(),this.month())},dayOfYear:function(a){var b=yb((tb(this).startOf("day")-tb(this).startOf("year"))/864e5)+1;return null==a?b:this.add(a-b,"d")},quarter:function(a){return null==a?Math.ceil((this.month()+1)/3):this.month(3*(a-1)+this.month()%3)},weekYear:function(a){var b=hb(this,this.localeData()._week.dow,this.localeData()._week.doy).year;return null==a?b:this.add(a-b,"y")},isoWeekYear:function(a){var b=hb(this,1,4).year;return null==a?b:this.add(a-b,"y")},week:function(a){var b=this.localeData().week(this);return null==a?b:this.add(7*(a-b),"d")},isoWeek:function(a){var b=hb(this,1,4).week;return null==a?b:this.add(7*(a-b),"d")},weekday:function(a){var b=(this.day()+7-this.localeData()._week.dow)%7;return null==a?b:this.add(a-b,"d")},isoWeekday:function(a){return null==a?this.day()||7:this.day(this.day()%7?a:a-7)},isoWeeksInYear:function(){return D(this.year(),1,4)},weeksInYear:function(){var a=this.localeData()._week;return D(this.year(),a.dow,a.doy)},get:function(a){return a=y(a),this[a]()},set:function(a,b){return a=y(a),"function"==typeof this[a]&&this[a](b),this},locale:function(a){return a===b?this._locale._abbr:(this._locale=tb.localeData(a),this)},lang:g("moment().lang() is deprecated. Use moment().localeData() instead.",function(a){return a===b?this.localeData():(this._locale=tb.localeData(a),this)}),localeData:function(){return this._locale}}),tb.fn.millisecond=tb.fn.milliseconds=ob("Milliseconds",!1),tb.fn.second=tb.fn.seconds=ob("Seconds",!1),tb.fn.minute=tb.fn.minutes=ob("Minutes",!1),tb.fn.hour=tb.fn.hours=ob("Hours",!0),tb.fn.date=ob("Date",!0),tb.fn.dates=g("dates accessor is deprecated. Use date instead.",ob("Date",!0)),tb.fn.year=ob("FullYear",!0),tb.fn.years=g("years accessor is deprecated. Use year instead.",ob("FullYear",!0)),tb.fn.days=tb.fn.day,tb.fn.months=tb.fn.month,tb.fn.weeks=tb.fn.week,tb.fn.isoWeeks=tb.fn.isoWeek,tb.fn.quarters=tb.fn.quarter,tb.fn.toJSON=tb.fn.toISOString,n(tb.duration.fn=m.prototype,{_bubble:function(){var a,b,c,d=this._milliseconds,e=this._days,f=this._months,g=this._data,h=0;g.milliseconds=d%1e3,a=p(d/1e3),g.seconds=a%60,b=p(a/60),g.minutes=b%60,c=p(b/60),g.hours=c%24,e+=p(c/24),h=p(pb(e)),e-=p(qb(h)),f+=p(e/30),e%=30,h+=p(f/12),f%=12,g.days=e,g.months=f,g.years=h},abs:function(){return this._milliseconds=Math.abs(this._milliseconds),this._days=Math.abs(this._days),this._months=Math.abs(this._months),this._data.milliseconds=Math.abs(this._data.milliseconds),this._data.seconds=Math.abs(this._data.seconds),this._data.minutes=Math.abs(this._data.minutes),this._data.hours=Math.abs(this._data.hours),this._data.months=Math.abs(this._data.months),this._data.years=Math.abs(this._data.years),this},weeks:function(){return p(this.days()/7)},valueOf:function(){return this._milliseconds+864e5*this._days+2592e6*(this._months%12)+31536e6*B(this._months/12)},humanize:function(a){var b=gb(this,!a,this.localeData());return a&&(b=this.localeData().pastFuture(+this,b)),this.localeData().postformat(b)},add:function(a,b){var c=tb.duration(a,b);return this._milliseconds+=c._milliseconds,this._days+=c._days,this._months+=c._months,this._bubble(),this},subtract:function(a,b){var c=tb.duration(a,b);return this._milliseconds-=c._milliseconds,this._days-=c._days,this._months-=c._months,this._bubble(),this},get:function(a){return a=y(a),this[a.toLowerCase()+"s"]()},as:function(a){var b,c;if(a=y(a),b=this._days+this._milliseconds/864e5,"month"===a||"year"===a)return c=this._months+12*pb(b),"month"===a?c:c/12;switch(b+=qb(this._months/12),a){case"week":return b/7;case"day":return b;case"hour":return 24*b;case"minute":return 1440*b;case"second":return 86400*b;case"millisecond":return 864e5*b;default:throw new Error("Unknown unit "+a)}},lang:tb.fn.lang,locale:tb.fn.locale,toIsoString:g("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",function(){return this.toISOString()}),toISOString:function(){var a=Math.abs(this.years()),b=Math.abs(this.months()),c=Math.abs(this.days()),d=Math.abs(this.hours()),e=Math.abs(this.minutes()),f=Math.abs(this.seconds()+this.milliseconds()/1e3);return this.asSeconds()?(this.asSeconds()<0?"-":"")+"P"+(a?a+"Y":"")+(b?b+"M":"")+(c?c+"D":"")+(d||e||f?"T":"")+(d?d+"H":"")+(e?e+"M":"")+(f?f+"S":""):"P0D"},localeData:function(){return this._locale}});for(vb in hc)hc.hasOwnProperty(vb)&&rb(vb.toLowerCase());
tb.duration.fn.asMilliseconds=function(){return this.as("ms")},tb.duration.fn.asSeconds=function(){return this.as("s")},tb.duration.fn.asMinutes=function(){return this.as("m")},tb.duration.fn.asHours=function(){return this.as("h")},tb.duration.fn.asDays=function(){return this.as("d")},tb.duration.fn.asWeeks=function(){return this.as("weeks")},tb.duration.fn.asMonths=function(){return this.as("M")},tb.duration.fn.asYears=function(){return this.as("y")},tb.locale("en",{ordinal:function(a){var b=a%10,c=1===B(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),Ib?c.exports=tb:"function"==typeof define&&define.amd?(define("moment",function(a,b,c){return c.config&&c.config()&&c.config().noGlobal===!0&&(xb.moment=ub),tb}),sb(!0)):sb()}.call(this)});