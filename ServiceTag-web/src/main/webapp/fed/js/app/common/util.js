define(function(require, exports, module) {
    'use strict';

    var util = {};
    var interfaceUrl = require('./interfaceUrl');
    var ConfirmBox = require('./dialog/confirmbox');
    var $ = require('$');
    var $message = $('#J_Message');
    var $loading = $('#J_Loading');
    var win = window;

    util.queryToJson = function (str, sep, eq) {
        var decode = decodeURIComponent,
            hasOwnProperty = Object.prototype.hasOwnProperty,
            suffix = function (str, suffix) {
                var ind = str.length - suffix.length;
                return ind >= 0 && str.indexOf(suffix, ind) == ind;
            };
        sep = sep || '&';
        eq = eq || '=';
        var ret = {},
            pairs = str.split(sep),
            pair, key, val,
            i = 0, len = pairs.length;

        for (; i < len; ++i) {
            pair = pairs[i].split(eq);
            key = decode(pair[0]);
            try {
                val = decode(pair[1] || '');
            } catch (e) {
                console.log(e + 'decodeURIComponent error : ' + pair[1], 'error');
                val = pair[1] || '';
            }
            val = $.trim(val);
            if (suffix(key, '[]')) {
                key = key.substring(0, key.length - 2);
            }
            if (hasOwnProperty.call(ret, key)) {
                if ($.isArray(ret[key])) {
                    ret[key].push(val);
                } else {
                    ret[key] = [ret[key], val];
                }
            } else {
                ret[key] = val;
            }
        }
        return ret;
    };

    util.urlParams = function() {
        return util.queryToJson( window.location.search.replace(/^\?/, '') );
    };

    util.packForm = function(form, escape) {
        var $form = typeof form === 'string' ? $(form) : form;
        var a = $form.serializeArray();
        var o = {};

        escape = (typeof escape == 'undefined') ? true : false;

        $.each(a, function() {
            var value = this.value;

            // 适应小辉的变态需求
//            this.value = value === 'null' ? null : this.value;

            if (typeof o[this.name] !== 'undefined') {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(escape ? util.escape(this.value) : $.trim(this.value));
            } else {
                o[this.name] = (escape) ? util.escape(this.value) : $.trim(this.value);
            }
        });
        return o;
    };

    util.escape = function(str) {
        return $.trim(str)
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };

    util.getUrl = function(k) {
        var base = ctx ? (ctx + '/') : '/';
        return base + interfaceUrl[k];
    };

    util.showMessage = function (msg, cfg) {
        if (!$message) {
            return;
        }

        var isError = false;
        var top = '0';

        if (cfg) {
            isError = cfg.isError;
            top = cfg.top;
        }

        $message.find('.tit').html(msg);
        $message.find('.pop-close').toggle(isError);

        $message.animate({
            top: top
        });
        if (isError) {
            $message.find('.pop-close').off('click').on('click', function() {
                $message.animate({
                    top: '-9999px'
                });
            });
        } else {
            win.setTimeout(function() {
                $message.animate({
                    top: '-9999px'
                });
            }, 3000);
        }
    };

    util.showError = function(error, cfg) {
        cfg || (cfg = {isError: true, top: '0'});
        return this.showMessage(error, cfg);
    };

//    util.showError = function(msg, cfg) {
//        if (!$message) {
//            return;
//        }
//        cfg || (cfg = {isError: true, top: '0'});
//
//        $message.find('.tit').html(msg);
//        $message.find('.pop-close').show();
//
//        var isError = false;
//        var top = '60px';
//
//        if (cfg) {
//            isError = cfg.isError;
//            top = cfg.top;
//        }
//        $message.animate({
//            top: top
//        });
//        if (isError) {
//            $message.find('.pop-close').off('click').on('click', function() {
//                $message.animate({
//                    top: '-9999px'
//                });
//            });
//        } else {
//            win.setTimeout(function() {
//                $message.animate({
//                    top: '-9999px'
//                });
//            }, 3000);
//        }
//    };

    var timer = null,
        canHide = false;

    util.showLoading = function () {
        if (timer) {
            return;
        }

        canHide = false;
        $loading.show();
        timer = window.setTimeout(function () {
            util.hideLoading();
            timer = null;
        }, 1000);
    };

    util.hideLoading = function () {
        if (canHide) {
            $loading.hide();
            canHide = false;
        } else {
            canHide = true;
        }
    };

    return util;
});