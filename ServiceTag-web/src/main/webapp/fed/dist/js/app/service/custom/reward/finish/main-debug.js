define("app/service/custom/reward/finish/main-debug", [ "$-debug", "../../../../common/util-debug", "../../../../common/interfaceUrl-debug", "../../../../common/dialog/confirmbox-debug", "arale/dialog/1.3.0/dialog-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/overlay/1.1.4/mask-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "gallery/handlebars/1.0.2/runtime-debug", "../../../../common/dialog/confirmbox-debug.handlebars", "../../../../common/io-debug", "../../../../common/helpers-debug", "gallery/moment/2.8.1/moment-debug", "../../../../common/paginator-debug", "keenwon/jqPaginator/1.1.0/jqPaginator-debug", "./reward-debug.handlebars", "./list-debug.handlebars", "../../../../common/logout-debug", "../../../../common/sidebar-debug" ], function(require) {
    "use strict";
    var $ = require("$-debug"), util = require("../../../../common/util-debug"), io = require("../../../../common/io-debug"), helpers = require("../../../../common/helpers-debug"), ConfirmBox = require("../../../../common/dialog/confirmbox-debug"), paginator = require("../../../../common/paginator-debug"), rewardTemplate = require("./reward-debug.handlebars"), listTemplate = require("./list-debug.handlebars");
    require("../../../../common/logout-debug");
    require("gallery/handlebars/1.0.2/handlebars-debug");
    require("../../../../common/sidebar-debug");
    helpers = $.extend({}, helpers, {
        toHtml: function(str) {
            if (!str) {
                return "";
            }
            return str.replace(/\n/g, "<br/>").replace(/\s/g, "&nbsp;");
        },
        isPic: function(fileName, options) {
            var dotIndex, type;
            if (!fileName) {
                return options.inverse(this);
            }
            dotIndex = fileName.indexOf(".");
            if (dotIndex === -1) {
                return options.inverse(this);
            } else {
                type = fileName.substring(dotIndex + 1, fileName.length).toLowerCase();
                if (type === "jpg" || type === "jpeg" || type === "png" || type === "gif" || type === "bmp") {
                    return options.fn(this);
                }
            }
            return options.inverse(this);
        },
        notEmptyArray: function(ary, options) {
            if (ary && ary.length > 0) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    });
    var app = {
        serviceBaseId: -1,
        model: {
            rewardId: -1,
            pageNo: 1,
            pageSize: 10
        },
        init: function() {
            var self = this;
            self.urlParams();
            self.cacheElements();
            self.getDetail();
            self.getList();
            self.bindEvents();
        },
        urlParams: function() {
            var self = this, obj = util.urlParams();
            self.serviceBaseId = obj.serviceBaseId;
            self.model.rewardId = obj.rewardId;
        },
        cacheElements: function() {
            var self = this;
            self.$main = $("#J_Main");
            self.$reward = $("#J_Reward");
            self.$list = $("#J_List");
            self.$page = $("#J_Page");
        },
        getDetail: function() {
            var self = this, result;
            io.get(util.getUrl("getServiceDetail"), {
                serviceBaseId: self.serviceBaseId
            }, function() {
                result = this.data;
                for (var i = 0, j = result.additionFiles.length; i < j; i++) {
                    result.additionFiles[i].fileUrl = rewardDomainUrl + result.additionFiles[i].fileUrl;
                }
                self.$reward.html(rewardTemplate(result, {
                    helpers: helpers
                }));
                self.$reward.show();
            });
        },
        getList: function() {
            var self = this;
            io.get(util.getUrl("queryAllIdeasAtEnd"), self.model, function() {
                var result = this.data, listHtml = listTemplate(result, {
                    helpers: helpers
                });
                self.$list.html(listHtml);
                paginator({
                    obj: $("#J_Page"),
                    pageNo: result.pageNo,
                    pageSize: result.pageSize,
                    totalHit: result.totalHit,
                    callback: function(num, type) {
                        if (type === "change" && self.model.pageNo != num) {
                            self.model.pageNo = num;
                            self.getList();
                        }
                    }
                });
                self.$list.closest(".mod-comment").show();
            });
        },
        preview: function(e) {
            var self = this, url = $(e.currentTarget).data("url"), width, winWidth = $(window).width(), img = new Image();
            img.onload = function() {
                if (img.width > winWidth - 100) {
                    width = winWidth - 100;
                    img.width = width - 40;
                } else {
                    width = img.width + 40;
                }
                var cb = new ConfirmBox({
                    title: "图片预览",
                    width: width < 200 ? 200 : width,
                    message: '<div id="preview"></div>',
                    confirmTpl: ""
                }).after("show", function() {
                    $("#preview").append(img);
                }).after("hide", function() {
                    cb.destroy();
                }).show();
            };
            img.src = url;
        },
        bindEvents: function() {
            var self = this;
            self.$main.on("click", "[data-role=preview]", $.proxy(self.preview, self));
        }
    };
    app.init();
});

define("app/common/util-debug", [ "app/common/interfaceUrl-debug", "app/common/dialog/confirmbox-debug", "$-debug", "arale/dialog/1.3.0/dialog-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/overlay/1.1.4/mask-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    "use strict";
    var util = {};
    var interfaceUrl = require("app/common/interfaceUrl-debug");
    var ConfirmBox = require("app/common/dialog/confirmbox-debug");
    var $ = require("$-debug");
    var $message = $("#J_Message");
    var $loading = $("#J_Loading");
    var win = window;
    util.queryToJson = function(str, sep, eq) {
        var decode = decodeURIComponent, hasOwnProperty = Object.prototype.hasOwnProperty, suffix = function(str, suffix) {
            var ind = str.length - suffix.length;
            return ind >= 0 && str.indexOf(suffix, ind) == ind;
        };
        sep = sep || "&";
        eq = eq || "=";
        var ret = {}, pairs = str.split(sep), pair, key, val, i = 0, len = pairs.length;
        for (;i < len; ++i) {
            pair = pairs[i].split(eq);
            key = decode(pair[0]);
            try {
                val = decode(pair[1] || "");
            } catch (e) {
                console.log(e + "decodeURIComponent error : " + pair[1], "error");
                val = pair[1] || "";
            }
            val = $.trim(val);
            if (suffix(key, "[]")) {
                key = key.substring(0, key.length - 2);
            }
            if (hasOwnProperty.call(ret, key)) {
                if ($.isArray(ret[key])) {
                    ret[key].push(val);
                } else {
                    ret[key] = [ ret[key], val ];
                }
            } else {
                ret[key] = val;
            }
        }
        return ret;
    };
    util.urlParams = function() {
        return util.queryToJson(window.location.search.replace(/^\?/, ""));
    };
    util.packForm = function(form, escape) {
        var $form = typeof form === "string" ? $(form) : form;
        var a = $form.serializeArray();
        var o = {};
        escape = typeof escape == "undefined" ? true : false;
        $.each(a, function() {
            var value = this.value;
            // 适应小辉的变态需求
            //            this.value = value === 'null' ? null : this.value;
            if (typeof o[this.name] !== "undefined") {
                if (!o[this.name].push) {
                    o[this.name] = [ o[this.name] ];
                }
                o[this.name].push(escape ? util.escape(this.value) : $.trim(this.value));
            } else {
                o[this.name] = escape ? util.escape(this.value) : $.trim(this.value);
            }
        });
        return o;
    };
    util.escape = function(str) {
        return $.trim(str).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    };
    util.getUrl = function(k) {
        var base = ctx ? ctx + "/" : "/";
        return base + interfaceUrl[k];
    };
    util.showMessage = function(msg, cfg) {
        if (!$message) {
            return;
        }
        var isError = false;
        var top = "0";
        if (cfg) {
            isError = cfg.isError;
            top = cfg.top;
        }
        $message.find(".tit").html(msg);
        $message.find(".pop-close").toggle(isError);
        $message.animate({
            top: top
        });
        if (isError) {
            $message.find(".pop-close").off("click").on("click", function() {
                $message.animate({
                    top: "-9999px"
                });
            });
        } else {
            win.setTimeout(function() {
                $message.animate({
                    top: "-9999px"
                });
            }, 3e3);
        }
    };
    util.showError = function(error, cfg) {
        cfg || (cfg = {
            isError: true,
            top: "0"
        });
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
    var timer = null, canHide = false;
    util.showLoading = function() {
        if (timer) {
            return;
        }
        canHide = false;
        $loading.show();
        timer = window.setTimeout(function() {
            util.hideLoading();
            timer = null;
        }, 1e3);
    };
    util.hideLoading = function() {
        if (canHide) {
            $loading.hide();
            canHide = false;
        } else {
            canHide = true;
        }
    };
    return util;
});

define("app/common/interfaceUrl-debug", [], {
    /**
     * /index
     */
    queryServiceTag: "admin/serviceTag/query.do",
    queryAuditServiceTags: "admin/serviceTag/queryAuditServiceTags.do",
    uodateServiceTag: "admin/serviceTag/update.do",
    removeServiceTag: "admin/serviceTag/remove.do",
    addServiceTag: "admin/serviceTag/add.do",
    uoloadServiceTagImage: "admin/serviceTag/uploadServiceTagImage.do",
    getAuditById: "admin/serviceTag/getAuditById.do",
    checkAuditServiceTag: "admin/serviceTag/checkAuditServiceTag.do",
    unCheckAuditServiceTag: "admin/serviceTag/unCheckAuditServiceTag.do",
    getAuditByServiceTagId: "admin/serviceTag/getAuditByServiceTagId.do",
    updateAuditServiceTag: "admin/serviceTag/updateAuditServiceTag.do",
    getAuditVoDetails: "admin/serviceTag/getAuditVoDetails.do",
    /**
     * /service/user
     */
    queryUserGroupList: "admin/userGroup/queryGroupList.do",
    queryUserList: "admin/userGroupRelUser/queryUserList.do",
    createUserGroup: "admin/userGroup/addGroup.do",
    editUserGroup: "admin/userGroup/editGroup.do",
    delUserGroup: "admin/userGroup/delGroup.do",
    moveToBlack: "admin/userGroupRelUser/moveToBlack.do",
    moveOutBlack: "admin/userGroupRelUser/moveOutBlack.do",
    addUserToGroup: "admin/userGroupRelUser/addUserToGroup.do",
    /**
     * /service/message
     */
    queryMessageList: "admin/messageBox/queryMessageList.do",
    replyMessage: "admin/replyMessage/replyMessage.do",
    queryGroupMessageList: "admin/groupMessage/queryGroupMessageList.do",
    getMessageDetail: "admin/groupMessage/getMessageDetail.do",
    sendGroupMessage: "admin/groupMessage/sendGroupMessage.do",
    queryGroupListExceptBlack: "admin/userGroup/queryGroupListExceptBlack.do",
    /**
     * /service/custom/survey
     */
    getQuestClassList: "admin/quest/getQuestClassList.do",
    addQuest: "admin/quest/addQuest.do",
    delQuest: "admin/quest/delQuest.do",
    publishQuest: "admin/quest/publishQuest.do",
    queryQuestPageList: "admin/quest/queryQuestPageList.do",
    /**
     * /service/custom/article
     */
    uploadTeletextImage: "admin/service/uploadTeletextImage.do",
    /**
     * /service/custom/reward
     */
    uploadRewardFiles: "admin/service/uploadRewardFiles.do",
    saveServiceReward: "admin/service/saveServiceReward.do",
    publishServiceReward: "admin/service/publishServiceReward.do",
    republishServiceReward: "admin/service/republishServiceReward.do",
    queryRewardIdeas: "admin/service/queryRewardIdeas.do",
    queryAllIdeasAtEnd: "admin/service/queryAllIdeasAtEnd.do",
    setCreative: "admin/service/setCreative.do",
    closeReward: "admin/service/closeReward.do",
    /**
     * /service/custom
     */
    queryService: "admin/service/query.do",
    endService: "admin/service/endService.do",
    getServiceDetail: "admin/service/getServiceDetail.do",
    publishServiceById: "admin/service/publishServiceById.do",
    saveService: "admin/service/saveServiceDetail.do",
    publishService: "admin/service/publishService.do",
    republishService: "admin/service/republishService.do",
    uploadAddtionFiles: "admin/service/uploadAddtionFiles.do",
    /**
     * /login
     */
    login: "admin/login.do",
    logout: "admin/logout.do"
});

define("app/common/dialog/confirmbox-debug", [ "$-debug", "arale/dialog/1.3.0/dialog-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/overlay/1.1.4/mask-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var Dialog = require("arale/dialog/1.3.0/dialog-debug");
    var template = require("app/common/dialog/confirmbox-debug.handlebars");
    var ConfirmBox = Dialog.extend({
        attrs: {
            title: "提示",
            classPrefix: "dialog",
            width: "400px",
            hasPadding: true,
            confirmTpl: '<a class="comm-btn" href="javascript:;">确定</a>',
            cancelTpl: "",
            align: {
                selfXY: [ "50%", "-100px" ],
                baseXY: [ "50%", 0 ]
            },
            message: ""
        },
        setup: function() {
            ConfirmBox.superclass.setup.call(this);
            var model = {
                classPrefix: this.get("classPrefix"),
                message: this.get("message"),
                title: this.get("title"),
                confirmTpl: this.get("confirmTpl"),
                cancelTpl: this.get("cancelTpl"),
                hasPadding: this.get("hasPadding"),
                hasFoot: this.get("confirmTpl") || this.get("cancelTpl")
            };
            this.set("content", template(model));
        },
        events: {
            "click [data-role=confirm]": function(e) {
                e.preventDefault();
                this.trigger("confirm");
            },
            "click [data-role=cancel]": function(e) {
                e.preventDefault();
                this.trigger("cancel");
            }
        },
        _onChangeMessage: function(val) {
            this.$("[data-role=message]").html(val);
        },
        _onChangeTitle: function(val) {
            this.$("[data-role=title]").html(val);
        },
        _onChangeConfirmTpl: function(val) {
            this.$("[data-role=confirm]").html(val);
        },
        _onChangeCancelTpl: function(val) {
            this.$("[data-role=cancel]").html(val);
        }
    });
    ConfirmBox.alert = function(message, callback, options) {
        message = '<div style="padding:10px">' + message + "</div>";
        var defaults = {
            message: message,
            width: "400px",
            onConfirm: function() {
                typeof callback == "function" && callback();
                this.hide();
            }
        };
        new ConfirmBox($.extend(null, defaults, options)).show().after("hide", function() {
            this.destroy();
        });
    };
    module.exports = ConfirmBox;
    module.exports.outerBoxClass = "arale-dialog-1_2_5";
});

define("arale/dialog/1.3.0/dialog-debug", [ "$-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/overlay/1.1.4/mask-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), Overlay = require("arale/overlay/1.1.4/overlay-debug"), mask = require("arale/overlay/1.1.4/mask-debug"), Events = require("arale/events/1.1.0/events-debug"), Templatable = require("arale/templatable/0.9.2/templatable-debug");
    // Dialog
    // ---
    // Dialog 是通用对话框组件，提供显隐关闭、遮罩层、内嵌iframe、内容区域自定义功能。
    // 是所有对话框类型组件的基类。
    var Dialog = Overlay.extend({
        Implements: Templatable,
        attrs: {
            // 模板
            template: require("./dialog-debug.handlebars"),
            // 对话框触发点
            trigger: {
                value: null,
                getter: function(val) {
                    return $(val);
                }
            },
            // 统一样式前缀
            classPrefix: "ui-dialog",
            // 指定内容元素，可以是 url 地址
            content: {
                value: null,
                setter: function(val) {
                    // 判断是否是 url 地址
                    if (/^(https?:\/\/|\/|\.\/|\.\.\/)/.test(val)) {
                        this._type = "iframe";
                        // 用 ajax 的方式而不是 iframe 进行载入
                        if (val.indexOf("?ajax") > 0 || val.indexOf("&ajax") > 0) {
                            this._ajax = true;
                        }
                    }
                    return val;
                }
            },
            // 是否有背景遮罩层
            hasMask: true,
            // 关闭按钮可以自定义
            closeTpl: "×",
            // 默认宽度
            width: 500,
            // 默认高度
            height: null,
            // iframe 类型时，dialog 的最初高度
            initialHeight: 300,
            // 简单的动画效果 none | fade
            effect: "none",
            // 不用解释了吧
            zIndex: 999,
            // 是否自适应高度
            autoFit: true,
            // 默认定位居中
            align: {
                value: {
                    selfXY: [ "50%", "50%" ],
                    baseXY: [ "50%", "42%" ]
                },
                getter: function(val) {
                    // 高度超过一屏的情况
                    // https://github.com/aralejs/dialog/issues/41
                    if (this.element.height() > $(window).height()) {
                        return {
                            selfXY: [ "50%", "0" ],
                            baseXY: [ "50%", "0" ]
                        };
                    }
                    return val;
                }
            }
        },
        parseElement: function() {
            this.set("model", {
                classPrefix: this.get("classPrefix")
            });
            Dialog.superclass.parseElement.call(this);
            this.contentElement = this.$("[data-role=content]");
            // 必要的样式
            this.contentElement.css({
                height: "100%",
                zoom: 1
            });
            // 关闭按钮先隐藏
            // 后面当 onRenderCloseTpl 时，如果 closeTpl 不为空，会显示出来
            // 这样写是为了回避 arale.base 的一个问题：
            // 当属性初始值为''时，不会进入 onRender 方法
            // https://github.com/aralejs/base/issues/7
            this.$("[data-role=close]").hide();
        },
        events: {
            "click [data-role=close]": function(e) {
                e.preventDefault();
                this.hide();
            }
        },
        show: function() {
            // iframe 要在载入完成才显示
            if (this._type === "iframe") {
                // ajax 读入内容并 append 到容器中
                if (this._ajax) {
                    this._ajaxHtml();
                } else {
                    // iframe 还未请求完，先设置一个固定高度
                    !this.get("height") && this.contentElement.css("height", this.get("initialHeight"));
                    this._showIframe();
                }
            }
            Dialog.superclass.show.call(this);
            return this;
        },
        hide: function() {
            // 把 iframe 状态复原
            if (this._type === "iframe" && this.iframe) {
                this.iframe.attr({
                    src: "javascript:'';"
                });
                // 原来只是将 iframe 的状态复原
                // 但是发现在 IE6 下，将 src 置为 javascript:''; 会出现 404 页面
                this.iframe.remove();
                this.iframe = null;
            }
            Dialog.superclass.hide.call(this);
            clearInterval(this._interval);
            delete this._interval;
            return this;
        },
        destroy: function() {
            this.element.remove();
            this._hideMask();
            clearInterval(this._interval);
            return Dialog.superclass.destroy.call(this);
        },
        setup: function() {
            Dialog.superclass.setup.call(this);
            this._setupTrigger();
            this._setupMask();
            this._setupKeyEvents();
            this._setupFocus();
            toTabed(this.element);
            toTabed(this.get("trigger"));
            // 默认当前触发器
            this.activeTrigger = this.get("trigger").eq(0);
        },
        // onRender
        // ---
        _onRenderContent: function(val) {
            if (this._type !== "iframe") {
                var value;
                // 有些情况会报错
                try {
                    value = $(val);
                } catch (e) {
                    value = [];
                }
                if (value[0]) {
                    this.contentElement.empty().append(value);
                } else {
                    this.contentElement.empty().html(val);
                }
                // #38 #44
                this._setPosition();
            }
        },
        _onRenderCloseTpl: function(val) {
            if (val === "") {
                this.$("[data-role=close]").html(val).hide();
            } else {
                this.$("[data-role=close]").html(val).show();
            }
        },
        // 覆盖 overlay，提供动画
        _onRenderVisible: function(val) {
            if (val) {
                if (this.get("effect") === "fade") {
                    // 固定 300 的动画时长，暂不可定制
                    this.element.fadeIn(300);
                } else {
                    this.element.show();
                }
            } else {
                this.element.hide();
            }
        },
        // 私有方法
        // ---
        // 绑定触发对话框出现的事件
        _setupTrigger: function() {
            this.delegateEvents(this.get("trigger"), "click", function(e) {
                e.preventDefault();
                // 标识当前点击的元素
                this.activeTrigger = $(e.currentTarget);
                this.show();
            });
        },
        // 绑定遮罩层事件
        _setupMask: function() {
            var that = this;
            // 存放 mask 对应的对话框
            mask._dialogs = mask._dialogs || [];
            this.after("show", function() {
                if (!this.get("hasMask")) {
                    return;
                }
                // not using the z-index
                // because multiable dialogs may share same mask
                mask.set("zIndex", that.get("zIndex")).show();
                mask.element.insertBefore(that.element);
                // 避免重复存放
                var existed = false;
                for (var i = 0; i < mask._dialogs.length; i++) {
                    if (mask._dialogs[i] === that) {
                        existed = true;
                    }
                }
                // 依次存放对应的对话框
                if (!existed) {
                    mask._dialogs.push(that);
                }
            });
            this.after("hide", this._hideMask);
        },
        // 隐藏 mask
        _hideMask: function() {
            if (!this.get("hasMask")) {
                return;
            }
            mask._dialogs && mask._dialogs.pop();
            if (mask._dialogs && mask._dialogs.length > 0) {
                var last = mask._dialogs[mask._dialogs.length - 1];
                mask.set("zIndex", last.get("zIndex"));
                mask.element.insertBefore(last.element);
            } else {
                mask.hide();
            }
        },
        // 绑定元素聚焦状态
        _setupFocus: function() {
            this.after("show", function() {
                this.element.focus();
            });
            this.after("hide", function() {
                // 关于网页中浮层消失后的焦点处理
                // http://www.qt06.com/post/280/
                this.activeTrigger && this.activeTrigger.focus();
            });
        },
        // 绑定键盘事件，ESC关闭窗口
        _setupKeyEvents: function() {
            this.delegateEvents($(document), "keyup.esc", function(e) {
                if (e.keyCode === 27) {
                    this.get("visible") && this.hide();
                }
            });
        },
        _showIframe: function() {
            var that = this;
            // 若未创建则新建一个
            if (!this.iframe) {
                this._createIframe();
            }
            // 开始请求 iframe
            this.iframe.attr({
                src: this._fixUrl(),
                name: "dialog-iframe" + new Date().getTime()
            });
            // 因为在 IE 下 onload 无法触发
            // http://my.oschina.net/liangrockman/blog/24015
            // 所以使用 jquery 的 one 函数来代替 onload
            // one 比 on 好，因为它只执行一次，并在执行后自动销毁
            this.iframe.one("load", function() {
                // 如果 dialog 已经隐藏了，就不需要触发 onload
                if (!that.get("visible")) {
                    return;
                }
                // 绑定自动处理高度的事件
                if (that.get("autoFit")) {
                    clearInterval(that._interval);
                    that._interval = setInterval(function() {
                        that._syncHeight();
                    }, 300);
                }
                that._syncHeight();
                that._setPosition();
                that.trigger("complete:show");
            });
        },
        _fixUrl: function() {
            var s = this.get("content").match(/([^?#]*)(\?[^#]*)?(#.*)?/);
            s.shift();
            s[1] = (s[1] && s[1] !== "?" ? s[1] + "&" : "?") + "t=" + new Date().getTime();
            return s.join("");
        },
        _createIframe: function() {
            var that = this;
            this.iframe = $("<iframe>", {
                src: "javascript:'';",
                scrolling: "no",
                frameborder: "no",
                allowTransparency: "true",
                css: {
                    border: "none",
                    width: "100%",
                    display: "block",
                    height: "100%",
                    overflow: "hidden"
                }
            }).appendTo(this.contentElement);
            // 给 iframe 绑一个 close 事件
            // iframe 内部可通过 window.frameElement.trigger('close') 关闭
            Events.mixTo(this.iframe[0]);
            this.iframe[0].on("close", function() {
                that.hide();
            });
        },
        _syncHeight: function() {
            var h;
            // 如果未传 height，才会自动获取
            if (!this.get("height")) {
                try {
                    this._errCount = 0;
                    h = getIframeHeight(this.iframe) + "px";
                } catch (err) {
                    // 页面跳转也会抛错，最多失败6次
                    this._errCount = (this._errCount || 0) + 1;
                    if (this._errCount >= 6) {
                        // 获取失败则给默认高度 300px
                        // 跨域会抛错进入这个流程
                        h = this.get("initialHeight");
                        clearInterval(this._interval);
                        delete this._interval;
                    }
                }
                this.contentElement.css("height", h);
                // force to reflow in ie6
                // http://44ux.com/blog/2011/08/24/ie67-reflow-bug/
                this.element[0].className = this.element[0].className;
            } else {
                clearInterval(this._interval);
                delete this._interval;
            }
        },
        _ajaxHtml: function() {
            var that = this;
            this.contentElement.css("height", this.get("initialHeight"));
            this.contentElement.load(this.get("content"), function() {
                that._setPosition();
                that.contentElement.css("height", "");
                that.trigger("complete:show");
            });
        }
    });
    module.exports = Dialog;
    // Helpers
    // ----
    // 让目标节点可以被 Tab
    function toTabed(element) {
        if (element.attr("tabindex") == null) {
            element.attr("tabindex", "-1");
        }
    }
    // 获取 iframe 内部的高度
    function getIframeHeight(iframe) {
        var D = iframe[0].contentWindow.document;
        if (D.body.scrollHeight && D.documentElement.scrollHeight) {
            return Math.min(D.body.scrollHeight, D.documentElement.scrollHeight);
        } else if (D.documentElement.scrollHeight) {
            return D.documentElement.scrollHeight;
        } else if (D.body.scrollHeight) {
            return D.body.scrollHeight;
        }
    }
    module.exports.outerBoxClass = "arale-dialog-1_3_0";
});

define("arale/dialog/1.3.0/dialog-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression;
        buffer += '<div class="';
        if (stack1 = helpers.classPrefix) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.classPrefix;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '">\n    <a class="';
        if (stack1 = helpers.classPrefix) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.classPrefix;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '-close" title="Close" href="javascript:;" data-role="close"></a>\n    <div class="';
        if (stack1 = helpers.classPrefix) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.classPrefix;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '-content" data-role="content"></div>\n</div>\n';
        return buffer;
    });
});

define("arale/overlay/1.1.4/overlay-debug", [ "$-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), Position = require("arale/position/1.0.1/position-debug"), Shim = require("arale/iframe-shim/1.0.2/iframe-shim-debug"), Widget = require("arale/widget/1.1.1/widget-debug");
    // Overlay
    // -------
    // Overlay 组件的核心特点是可定位（Positionable）和可层叠（Stackable）
    // 是一切悬浮类 UI 组件的基类
    var Overlay = Widget.extend({
        attrs: {
            // 基本属性
            width: null,
            height: null,
            zIndex: 99,
            visible: false,
            // 定位配置
            align: {
                // element 的定位点，默认为左上角
                selfXY: [ 0, 0 ],
                // 基准定位元素，默认为当前可视区域
                baseElement: Position.VIEWPORT,
                // 基准定位元素的定位点，默认为左上角
                baseXY: [ 0, 0 ]
            },
            // 父元素
            parentNode: document.body
        },
        show: function() {
            // 若从未渲染，则调用 render
            if (!this.rendered) {
                this.render();
            }
            this.set("visible", true);
            return this;
        },
        hide: function() {
            this.set("visible", false);
            return this;
        },
        setup: function() {
            var that = this;
            // 加载 iframe 遮罩层并与 overlay 保持同步
            this._setupShim();
            // 窗口resize时，重新定位浮层
            this._setupResize();
            this.after("render", function() {
                var _pos = this.element.css("position");
                if (_pos === "static" || _pos === "relative") {
                    this.element.css({
                        position: "absolute",
                        left: "-9999px",
                        top: "-9999px"
                    });
                }
            });
            // 统一在显示之后重新设定位置
            this.after("show", function() {
                that._setPosition();
            });
        },
        destroy: function() {
            // 销毁两个静态数组中的实例
            erase(this, Overlay.allOverlays);
            erase(this, Overlay.blurOverlays);
            return Overlay.superclass.destroy.call(this);
        },
        // 进行定位
        _setPosition: function(align) {
            // 不在文档流中，定位无效
            if (!isInDocument(this.element[0])) return;
            align || (align = this.get("align"));
            // 如果align为空，表示不需要使用js对齐
            if (!align) return;
            var isHidden = this.element.css("display") === "none";
            // 在定位时，为避免元素高度不定，先显示出来
            if (isHidden) {
                this.element.css({
                    visibility: "hidden",
                    display: "block"
                });
            }
            Position.pin({
                element: this.element,
                x: align.selfXY[0],
                y: align.selfXY[1]
            }, {
                element: align.baseElement,
                x: align.baseXY[0],
                y: align.baseXY[1]
            });
            // 定位完成后，还原
            if (isHidden) {
                this.element.css({
                    visibility: "",
                    display: "none"
                });
            }
            return this;
        },
        // 加载 iframe 遮罩层并与 overlay 保持同步
        _setupShim: function() {
            var shim = new Shim(this.element);
            // 在隐藏和设置位置后，要重新定位
            // 显示后会设置位置，所以不用绑定 shim.sync
            this.after("hide _setPosition", shim.sync, shim);
            // 除了 parentNode 之外的其他属性发生变化时，都触发 shim 同步
            var attrs = [ "width", "height" ];
            for (var attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    this.on("change:" + attr, shim.sync, shim);
                }
            }
            // 在销魂自身前要销毁 shim
            this.before("destroy", shim.destroy, shim);
        },
        // resize窗口时重新定位浮层，用这个方法收集所有浮层实例
        _setupResize: function() {
            Overlay.allOverlays.push(this);
        },
        // 除了 element 和 relativeElements，点击 body 后都会隐藏 element
        _blurHide: function(arr) {
            arr = $.makeArray(arr);
            arr.push(this.element);
            this._relativeElements = arr;
            Overlay.blurOverlays.push(this);
        },
        // 用于 set 属性后的界面更新
        _onRenderWidth: function(val) {
            this.element.css("width", val);
        },
        _onRenderHeight: function(val) {
            this.element.css("height", val);
        },
        _onRenderZIndex: function(val) {
            this.element.css("zIndex", val);
        },
        _onRenderAlign: function(val) {
            this._setPosition(val);
        },
        _onRenderVisible: function(val) {
            this.element[val ? "show" : "hide"]();
        }
    });
    // 绑定 blur 隐藏事件
    Overlay.blurOverlays = [];
    $(document).on("click", function(e) {
        hideBlurOverlays(e);
    });
    // 绑定 resize 重新定位事件
    var timeout;
    var winWidth = $(window).width();
    var winHeight = $(window).height();
    Overlay.allOverlays = [];
    $(window).resize(function() {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(function() {
            var winNewWidth = $(window).width();
            var winNewHeight = $(window).height();
            // IE678 莫名其妙触发 resize
            // http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer
            if (winWidth !== winNewWidth || winHeight !== winNewHeight) {
                $(Overlay.allOverlays).each(function(i, item) {
                    // 当实例为空或隐藏时，不处理
                    if (!item || !item.get("visible")) {
                        return;
                    }
                    item._setPosition();
                });
            }
            winWidth = winNewWidth;
            winHeight = winNewHeight;
        }, 80);
    });
    module.exports = Overlay;
    // Helpers
    // -------
    function isInDocument(element) {
        return $.contains(document.documentElement, element);
    }
    function hideBlurOverlays(e) {
        $(Overlay.blurOverlays).each(function(index, item) {
            // 当实例为空或隐藏时，不处理
            if (!item || !item.get("visible")) {
                return;
            }
            // 遍历 _relativeElements ，当点击的元素落在这些元素上时，不处理
            for (var i = 0; i < item._relativeElements.length; i++) {
                var el = $(item._relativeElements[i])[0];
                if (el === e.target || $.contains(el, e.target)) {
                    return;
                }
            }
            // 到这里，判断触发了元素的 blur 事件，隐藏元素
            item.hide();
        });
    }
    // 从数组中删除对应元素
    function erase(target, array) {
        for (var i = 0; i < array.length; i++) {
            if (target === array[i]) {
                array.splice(i, 1);
                return array;
            }
        }
    }
});

define("arale/position/1.0.1/position-debug", [ "$-debug" ], function(require, exports) {
    // Position
    // --------
    // 定位工具组件，将一个 DOM 节点相对对另一个 DOM 节点进行定位操作。
    // 代码易改，人生难得
    var Position = exports, VIEWPORT = {
        _id: "VIEWPORT",
        nodeType: 1
    }, $ = require("$-debug"), isPinFixed = false, ua = (window.navigator.userAgent || "").toLowerCase(), isIE6 = ua.indexOf("msie 6") !== -1;
    // 将目标元素相对于基准元素进行定位
    // 这是 Position 的基础方法，接收两个参数，分别描述了目标元素和基准元素的定位点
    Position.pin = function(pinObject, baseObject) {
        // 将两个参数转换成标准定位对象 { element: a, x: 0, y: 0 }
        pinObject = normalize(pinObject);
        baseObject = normalize(baseObject);
        // 设定目标元素的 position 为绝对定位
        // 若元素的初始 position 不为 absolute，会影响元素的 display、宽高等属性
        var pinElement = $(pinObject.element);
        if (pinElement.css("position") !== "fixed" || isIE6) {
            pinElement.css("position", "absolute");
            isPinFixed = false;
        } else {
            // 定位 fixed 元素的标志位，下面有特殊处理
            isPinFixed = true;
        }
        // 将位置属性归一化为数值
        // 注：必须放在上面这句 `css('position', 'absolute')` 之后，
        //    否则获取的宽高有可能不对
        posConverter(pinObject);
        posConverter(baseObject);
        var parentOffset = getParentOffset(pinElement);
        var baseOffset = baseObject.offset();
        // 计算目标元素的位置
        var top = baseOffset.top + baseObject.y - pinObject.y - parentOffset.top;
        var left = baseOffset.left + baseObject.x - pinObject.x - parentOffset.left;
        // 定位目标元素
        pinElement.css({
            left: left,
            top: top
        });
    };
    // 将目标元素相对于基准元素进行居中定位
    // 接受两个参数，分别为目标元素和定位的基准元素，都是 DOM 节点类型
    Position.center = function(pinElement, baseElement) {
        Position.pin({
            element: pinElement,
            x: "50%",
            y: "50%"
        }, {
            element: baseElement,
            x: "50%",
            y: "50%"
        });
    };
    // 这是当前可视区域的伪 DOM 节点
    // 需要相对于当前可视区域定位时，可传入此对象作为 element 参数
    Position.VIEWPORT = VIEWPORT;
    // Helpers
    // -------
    // 将参数包装成标准的定位对象，形似 { element: a, x: 0, y: 0 }
    function normalize(posObject) {
        posObject = toElement(posObject) || {};
        if (posObject.nodeType) {
            posObject = {
                element: posObject
            };
        }
        var element = toElement(posObject.element) || VIEWPORT;
        if (element.nodeType !== 1) {
            throw new Error("posObject.element is invalid.");
        }
        var result = {
            element: element,
            x: posObject.x || 0,
            y: posObject.y || 0
        };
        // config 的深度克隆会替换掉 Position.VIEWPORT, 导致直接比较为 false
        var isVIEWPORT = element === VIEWPORT || element._id === "VIEWPORT";
        // 归一化 offset
        result.offset = function() {
            // 若定位 fixed 元素，则父元素的 offset 没有意义
            if (isPinFixed) {
                return {
                    left: 0,
                    top: 0
                };
            } else if (isVIEWPORT) {
                return {
                    left: $(document).scrollLeft(),
                    top: $(document).scrollTop()
                };
            } else {
                return getOffset($(element)[0]);
            }
        };
        // 归一化 size, 含 padding 和 border
        result.size = function() {
            var el = isVIEWPORT ? $(window) : $(element);
            return {
                width: el.outerWidth(),
                height: el.outerHeight()
            };
        };
        return result;
    }
    // 对 x, y 两个参数为 left|center|right|%|px 时的处理，全部处理为纯数字
    function posConverter(pinObject) {
        pinObject.x = xyConverter(pinObject.x, pinObject, "width");
        pinObject.y = xyConverter(pinObject.y, pinObject, "height");
    }
    // 处理 x, y 值，都转化为数字
    function xyConverter(x, pinObject, type) {
        // 先转成字符串再说！好处理
        x = x + "";
        // 处理 px
        x = x.replace(/px/gi, "");
        // 处理 alias
        if (/\D/.test(x)) {
            x = x.replace(/(?:top|left)/gi, "0%").replace(/center/gi, "50%").replace(/(?:bottom|right)/gi, "100%");
        }
        // 将百分比转为像素值
        if (x.indexOf("%") !== -1) {
            //支持小数
            x = x.replace(/(\d+(?:\.\d+)?)%/gi, function(m, d) {
                return pinObject.size()[type] * (d / 100);
            });
        }
        // 处理类似 100%+20px 的情况
        if (/[+\-*\/]/.test(x)) {
            try {
                // eval 会影响压缩
                // new Function 方法效率高于 for 循环拆字符串的方法
                // 参照：http://jsperf.com/eval-newfunction-for
                x = new Function("return " + x)();
            } catch (e) {
                throw new Error("Invalid position value: " + x);
            }
        }
        // 转回为数字
        return numberize(x);
    }
    // 获取 offsetParent 的位置
    function getParentOffset(element) {
        var parent = element.offsetParent();
        // IE7 下，body 子节点的 offsetParent 为 html 元素，其 offset 为
        // { top: 2, left: 2 }，会导致定位差 2 像素，所以这里将 parent
        // 转为 document.body
        if (parent[0] === document.documentElement) {
            parent = $(document.body);
        }
        // 修正 ie6 下 absolute 定位不准的 bug
        if (isIE6) {
            parent.css("zoom", 1);
        }
        // 获取 offsetParent 的 offset
        var offset;
        // 当 offsetParent 为 body，
        // 而且 body 的 position 是 static 时
        // 元素并不按照 body 来定位，而是按 document 定位
        // http://jsfiddle.net/afc163/hN9Tc/2/
        // 因此这里的偏移值直接设为 0 0
        if (parent[0] === document.body && parent.css("position") === "static") {
            offset = {
                top: 0,
                left: 0
            };
        } else {
            offset = getOffset(parent[0]);
        }
        // 根据基准元素 offsetParent 的 border 宽度，来修正 offsetParent 的基准位置
        offset.top += numberize(parent.css("border-top-width"));
        offset.left += numberize(parent.css("border-left-width"));
        return offset;
    }
    function numberize(s) {
        return parseFloat(s, 10) || 0;
    }
    function toElement(element) {
        return $(element)[0];
    }
    // fix jQuery 1.7.2 offset
    // document.body 的 position 是 absolute 或 relative 时
    // jQuery.offset 方法无法正确获取 body 的偏移值
    //   -> http://jsfiddle.net/afc163/gMAcp/
    // jQuery 1.9.1 已经修正了这个问题
    //   -> http://jsfiddle.net/afc163/gMAcp/1/
    // 这里先实现一份
    // 参照 kissy 和 jquery 1.9.1
    //   -> https://github.com/kissyteam/kissy/blob/master/src/dom/sub-modules/base/src/base/offset.js#L366 
    //   -> https://github.com/jquery/jquery/blob/1.9.1/src/offset.js#L28
    function getOffset(element) {
        var box = element.getBoundingClientRect(), docElem = document.documentElement;
        // < ie8 不支持 win.pageXOffset, 则使用 docElem.scrollLeft
        return {
            left: box.left + (window.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || document.body.clientLeft || 0),
            top: box.top + (window.pageYOffset || docElem.scrollTop) - (docElem.clientTop || document.body.clientTop || 0)
        };
    }
});

define("arale/iframe-shim/1.0.2/iframe-shim-debug", [ "$-debug", "arale/position/1.0.1/position-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var Position = require("arale/position/1.0.1/position-debug");
    var isIE6 = (window.navigator.userAgent || "").toLowerCase().indexOf("msie 6") !== -1;
    // target 是需要添加垫片的目标元素，可以传 `DOM Element` 或 `Selector`
    function Shim(target) {
        // 如果选择器选了多个 DOM，则只取第一个
        this.target = $(target).eq(0);
    }
    // 根据目标元素计算 iframe 的显隐、宽高、定位
    Shim.prototype.sync = function() {
        var target = this.target;
        var iframe = this.iframe;
        // 如果未传 target 则不处理
        if (!target.length) return this;
        var height = target.outerHeight();
        var width = target.outerWidth();
        // 如果目标元素隐藏，则 iframe 也隐藏
        // jquery 判断宽高同时为 0 才算隐藏，这里判断宽高其中一个为 0 就隐藏
        // http://api.jquery.com/hidden-selector/
        if (!height || !width || target.is(":hidden")) {
            iframe && iframe.hide();
        } else {
            // 第一次显示时才创建：as lazy as possible
            iframe || (iframe = this.iframe = createIframe(target));
            iframe.css({
                height: height,
                width: width
            });
            Position.pin(iframe[0], target[0]);
            iframe.show();
        }
        return this;
    };
    // 销毁 iframe 等
    Shim.prototype.destroy = function() {
        if (this.iframe) {
            this.iframe.remove();
            delete this.iframe;
        }
        delete this.target;
    };
    if (isIE6) {
        module.exports = Shim;
    } else {
        // 除了 IE6 都返回空函数
        function Noop() {}
        Noop.prototype.sync = function() {
            return this;
        };
        Noop.prototype.destroy = Noop;
        module.exports = Noop;
    }
    // Helpers
    // 在 target 之前创建 iframe，这样就没有 z-index 问题
    // iframe 永远在 target 下方
    function createIframe(target) {
        var css = {
            display: "none",
            border: "none",
            opacity: 0,
            position: "absolute"
        };
        // 如果 target 存在 zIndex 则设置
        var zIndex = target.css("zIndex");
        if (zIndex && zIndex > 0) {
            css.zIndex = zIndex - 1;
        }
        return $("<iframe>", {
            src: "javascript:''",
            // 不加的话，https 下会弹警告
            frameborder: 0,
            css: css
        }).insertBefore(target);
    }
});

define("arale/widget/1.1.1/widget-debug", [ "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "$-debug", "./daparser-debug", "./auto-render-debug" ], function(require, exports, module) {
    // Widget
    // ---------
    // Widget 是与 DOM 元素相关联的非工具类组件，主要负责 View 层的管理。
    // Widget 组件具有四个要素：描述状态的 attributes 和 properties，描述行为的 events
    // 和 methods。Widget 基类约定了这四要素创建时的基本流程和最佳实践。
    var Base = require("arale/base/1.1.1/base-debug");
    var $ = require("$-debug");
    var DAParser = require("./daparser-debug");
    var AutoRender = require("./auto-render-debug");
    var DELEGATE_EVENT_NS = ".delegate-events-";
    var ON_RENDER = "_onRender";
    var DATA_WIDGET_CID = "data-widget-cid";
    // 所有初始化过的 Widget 实例
    var cachedInstances = {};
    var Widget = Base.extend({
        // config 中的这些键值会直接添加到实例上，转换成 properties
        propsInAttrs: [ "initElement", "element", "events" ],
        // 与 widget 关联的 DOM 元素
        element: null,
        // 事件代理，格式为：
        //   {
        //     'mousedown .title': 'edit',
        //     'click {{attrs.saveButton}}': 'save'
        //     'click .open': function(ev) { ... }
        //   }
        events: null,
        // 属性列表
        attrs: {
            // 基本属性
            id: null,
            className: null,
            style: null,
            // 默认模板
            template: "<div></div>",
            // 默认数据模型
            model: null,
            // 组件的默认父节点
            parentNode: document.body
        },
        // 初始化方法，确定组件创建时的基本流程：
        // 初始化 attrs --》 初始化 props --》 初始化 events --》 子类的初始化
        initialize: function(config) {
            this.cid = uniqueCid();
            // 初始化 attrs
            var dataAttrsConfig = this._parseDataAttrsConfig(config);
            Widget.superclass.initialize.call(this, config ? $.extend(dataAttrsConfig, config) : dataAttrsConfig);
            // 初始化 props
            this.parseElement();
            this.initProps();
            // 初始化 events
            this.delegateEvents();
            // 子类自定义的初始化
            this.setup();
            // 保存实例信息
            this._stamp();
            // 是否由 template 初始化
            this._isTemplate = !(config && config.element);
        },
        // 解析通过 data-attr 设置的 api
        _parseDataAttrsConfig: function(config) {
            var element, dataAttrsConfig;
            if (config) {
                element = config.initElement ? $(config.initElement) : $(config.element);
            }
            // 解析 data-api 时，只考虑用户传入的 element，不考虑来自继承或从模板构建的
            if (element && element[0] && !AutoRender.isDataApiOff(element)) {
                dataAttrsConfig = DAParser.parseElement(element);
            }
            return dataAttrsConfig;
        },
        // 构建 this.element
        parseElement: function() {
            var element = this.element;
            if (element) {
                this.element = $(element);
            } else if (this.get("template")) {
                this.parseElementFromTemplate();
            }
            // 如果对应的 DOM 元素不存在，则报错
            if (!this.element || !this.element[0]) {
                throw new Error("element is invalid");
            }
        },
        // 从模板中构建 this.element
        parseElementFromTemplate: function() {
            this.element = $(this.get("template"));
        },
        // 负责 properties 的初始化，提供给子类覆盖
        initProps: function() {},
        // 注册事件代理
        delegateEvents: function(element, events, handler) {
            // widget.delegateEvents()
            if (arguments.length === 0) {
                events = getEvents(this);
                element = this.element;
            } else if (arguments.length === 1) {
                events = element;
                element = this.element;
            } else if (arguments.length === 2) {
                handler = events;
                events = element;
                element = this.element;
            } else {
                element || (element = this.element);
                this._delegateElements || (this._delegateElements = []);
                this._delegateElements.push($(element));
            }
            // 'click p' => {'click p': handler}
            if (isString(events) && isFunction(handler)) {
                var o = {};
                o[events] = handler;
                events = o;
            }
            // key 为 'event selector'
            for (var key in events) {
                if (!events.hasOwnProperty(key)) continue;
                var args = parseEventKey(key, this);
                var eventType = args.type;
                var selector = args.selector;
                (function(handler, widget) {
                    var callback = function(ev) {
                        if (isFunction(handler)) {
                            handler.call(widget, ev);
                        } else {
                            widget[handler](ev);
                        }
                    };
                    // delegate
                    if (selector) {
                        $(element).on(eventType, selector, callback);
                    } else {
                        $(element).on(eventType, callback);
                    }
                })(events[key], this);
            }
            return this;
        },
        // 卸载事件代理
        undelegateEvents: function(element, eventKey) {
            if (!eventKey) {
                eventKey = element;
                element = null;
            }
            // 卸载所有
            // .undelegateEvents()
            if (arguments.length === 0) {
                var type = DELEGATE_EVENT_NS + this.cid;
                this.element && this.element.off(type);
                // 卸载所有外部传入的 element
                if (this._delegateElements) {
                    for (var de in this._delegateElements) {
                        if (!this._delegateElements.hasOwnProperty(de)) continue;
                        this._delegateElements[de].off(type);
                    }
                }
            } else {
                var args = parseEventKey(eventKey, this);
                // 卸载 this.element
                // .undelegateEvents(events)
                if (!element) {
                    this.element && this.element.off(args.type, args.selector);
                } else {
                    $(element).off(args.type, args.selector);
                }
            }
            return this;
        },
        // 提供给子类覆盖的初始化方法
        setup: function() {},
        // 将 widget 渲染到页面上
        // 渲染不仅仅包括插入到 DOM 树中，还包括样式渲染等
        // 约定：子类覆盖时，需保持 `return this`
        render: function() {
            // 让渲染相关属性的初始值生效，并绑定到 change 事件
            if (!this.rendered) {
                this._renderAndBindAttrs();
                this.rendered = true;
            }
            // 插入到文档流中
            var parentNode = this.get("parentNode");
            if (parentNode && !isInDocument(this.element[0])) {
                // 隔离样式，添加统一的命名空间
                // https://github.com/aliceui/aliceui.org/issues/9
                var outerBoxClass = this.constructor.outerBoxClass;
                if (outerBoxClass) {
                    var outerBox = this._outerBox = $("<div></div>").addClass(outerBoxClass);
                    outerBox.append(this.element).appendTo(parentNode);
                } else {
                    this.element.appendTo(parentNode);
                }
            }
            return this;
        },
        // 让属性的初始值生效，并绑定到 change:attr 事件上
        _renderAndBindAttrs: function() {
            var widget = this;
            var attrs = widget.attrs;
            for (var attr in attrs) {
                if (!attrs.hasOwnProperty(attr)) continue;
                var m = ON_RENDER + ucfirst(attr);
                if (this[m]) {
                    var val = this.get(attr);
                    // 让属性的初始值生效。注：默认空值不触发
                    if (!isEmptyAttrValue(val)) {
                        this[m](val, undefined, attr);
                    }
                    // 将 _onRenderXx 自动绑定到 change:xx 事件上
                    (function(m) {
                        widget.on("change:" + attr, function(val, prev, key) {
                            widget[m](val, prev, key);
                        });
                    })(m);
                }
            }
        },
        _onRenderId: function(val) {
            this.element.attr("id", val);
        },
        _onRenderClassName: function(val) {
            this.element.addClass(val);
        },
        _onRenderStyle: function(val) {
            this.element.css(val);
        },
        // 让 element 与 Widget 实例建立关联
        _stamp: function() {
            var cid = this.cid;
            (this.initElement || this.element).attr(DATA_WIDGET_CID, cid);
            cachedInstances[cid] = this;
        },
        // 在 this.element 内寻找匹配节点
        $: function(selector) {
            return this.element.find(selector);
        },
        destroy: function() {
            this.undelegateEvents();
            delete cachedInstances[this.cid];
            // For memory leak
            if (this.element && this._isTemplate) {
                this.element.off();
                // 如果是 widget 生成的 element 则去除
                if (this._outerBox) {
                    this._outerBox.remove();
                } else {
                    this.element.remove();
                }
            }
            this.element = null;
            Widget.superclass.destroy.call(this);
        }
    });
    // For memory leak
    $(window).unload(function() {
        for (var cid in cachedInstances) {
            cachedInstances[cid].destroy();
        }
    });
    // 查询与 selector 匹配的第一个 DOM 节点，得到与该 DOM 节点相关联的 Widget 实例
    Widget.query = function(selector) {
        var element = $(selector).eq(0);
        var cid;
        element && (cid = element.attr(DATA_WIDGET_CID));
        return cachedInstances[cid];
    };
    Widget.autoRender = AutoRender.autoRender;
    Widget.autoRenderAll = AutoRender.autoRenderAll;
    Widget.StaticsWhiteList = [ "autoRender" ];
    module.exports = Widget;
    // Helpers
    // ------
    var toString = Object.prototype.toString;
    var cidCounter = 0;
    function uniqueCid() {
        return "widget-" + cidCounter++;
    }
    function isString(val) {
        return toString.call(val) === "[object String]";
    }
    function isFunction(val) {
        return toString.call(val) === "[object Function]";
    }
    // Zepto 上没有 contains 方法
    var contains = $.contains || function(a, b) {
        //noinspection JSBitwiseOperatorUsage
        return !!(a.compareDocumentPosition(b) & 16);
    };
    function isInDocument(element) {
        return contains(document.documentElement, element);
    }
    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }
    var EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/;
    var EXPRESSION_FLAG = /{{([^}]+)}}/g;
    var INVALID_SELECTOR = "INVALID_SELECTOR";
    function getEvents(widget) {
        if (isFunction(widget.events)) {
            widget.events = widget.events();
        }
        return widget.events;
    }
    function parseEventKey(eventKey, widget) {
        var match = eventKey.match(EVENT_KEY_SPLITTER);
        var eventType = match[1] + DELEGATE_EVENT_NS + widget.cid;
        // 当没有 selector 时，需要设置为 undefined，以使得 zepto 能正确转换为 bind
        var selector = match[2] || undefined;
        if (selector && selector.indexOf("{{") > -1) {
            selector = parseExpressionInEventKey(selector, widget);
        }
        return {
            type: eventType,
            selector: selector
        };
    }
    // 解析 eventKey 中的 {{xx}}, {{yy}}
    function parseExpressionInEventKey(selector, widget) {
        return selector.replace(EXPRESSION_FLAG, function(m, name) {
            var parts = name.split(".");
            var point = widget, part;
            while (part = parts.shift()) {
                if (point === widget.attrs) {
                    point = widget.get(part);
                } else {
                    point = point[part];
                }
            }
            // 已经是 className，比如来自 dataset 的
            if (isString(point)) {
                return point;
            }
            // 不能识别的，返回无效标识
            return INVALID_SELECTOR;
        });
    }
    // 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined
    function isEmptyAttrValue(o) {
        return o == null || o === undefined;
    }
});

define("arale/widget/1.1.1/daparser-debug", [ "$-debug" ], function(require, exports) {
    // DAParser
    // --------
    // data api 解析器，提供对单个 element 的解析，可用来初始化页面中的所有 Widget 组件。
    var $ = require("$-debug");
    // 得到某个 DOM 元素的 dataset
    exports.parseElement = function(element, raw) {
        element = $(element)[0];
        var dataset = {};
        // ref: https://developer.mozilla.org/en/DOM/element.dataset
        if (element.dataset) {
            // 转换成普通对象
            dataset = $.extend({}, element.dataset);
        } else {
            var attrs = element.attributes;
            for (var i = 0, len = attrs.length; i < len; i++) {
                var attr = attrs[i];
                var name = attr.name;
                if (name.indexOf("data-") === 0) {
                    name = camelCase(name.substring(5));
                    dataset[name] = attr.value;
                }
            }
        }
        return raw === true ? dataset : normalizeValues(dataset);
    };
    // Helpers
    // ------
    var RE_DASH_WORD = /-([a-z])/g;
    var JSON_LITERAL_PATTERN = /^\s*[\[{].*[\]}]\s*$/;
    var parseJSON = this.JSON ? JSON.parse : $.parseJSON;
    // 仅处理字母开头的，其他情况转换为小写："data-x-y-123-_A" --> xY-123-_a
    function camelCase(str) {
        return str.toLowerCase().replace(RE_DASH_WORD, function(all, letter) {
            return (letter + "").toUpperCase();
        });
    }
    // 解析并归一化配置中的值
    function normalizeValues(data) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var val = data[key];
                if (typeof val !== "string") continue;
                if (JSON_LITERAL_PATTERN.test(val)) {
                    val = val.replace(/'/g, '"');
                    data[key] = normalizeValues(parseJSON(val));
                } else {
                    data[key] = normalizeValue(val);
                }
            }
        }
        return data;
    }
    // 将 'false' 转换为 false
    // 'true' 转换为 true
    // '3253.34' 转换为 3253.34
    function normalizeValue(val) {
        if (val.toLowerCase() === "false") {
            val = false;
        } else if (val.toLowerCase() === "true") {
            val = true;
        } else if (/\d/.test(val) && /[^a-z]/i.test(val)) {
            var number = parseFloat(val);
            if (number + "" === val) {
                val = number;
            }
        }
        return val;
    }
});

define("arale/widget/1.1.1/auto-render-debug", [ "$-debug" ], function(require, exports) {
    var $ = require("$-debug");
    var DATA_WIDGET_AUTO_RENDERED = "data-widget-auto-rendered";
    // 自动渲染接口，子类可根据自己的初始化逻辑进行覆盖
    exports.autoRender = function(config) {
        return new this(config).render();
    };
    // 根据 data-widget 属性，自动渲染所有开启了 data-api 的 widget 组件
    exports.autoRenderAll = function(root, callback) {
        if (typeof root === "function") {
            callback = root;
            root = null;
        }
        root = $(root || document.body);
        var modules = [];
        var elements = [];
        root.find("[data-widget]").each(function(i, element) {
            if (!exports.isDataApiOff(element)) {
                modules.push(element.getAttribute("data-widget").toLowerCase());
                elements.push(element);
            }
        });
        if (modules.length) {
            seajs.use(modules, function() {
                for (var i = 0; i < arguments.length; i++) {
                    var SubWidget = arguments[i];
                    var element = $(elements[i]);
                    // 已经渲染过
                    if (element.attr(DATA_WIDGET_AUTO_RENDERED)) continue;
                    var config = {
                        initElement: element,
                        renderType: "auto"
                    };
                    // data-widget-role 是指将当前的 DOM 作为 role 的属性去实例化，默认的 role 为 element
                    var role = element.attr("data-widget-role");
                    config[role ? role : "element"] = element;
                    // 调用自动渲染接口
                    SubWidget.autoRender && SubWidget.autoRender(config);
                    // 标记已经渲染过
                    element.attr(DATA_WIDGET_AUTO_RENDERED, "true");
                }
                // 在所有自动渲染完成后，执行回调
                callback && callback();
            });
        }
    };
    var isDefaultOff = $(document.body).attr("data-api") === "off";
    // 是否没开启 data-api
    exports.isDataApiOff = function(element) {
        var elementDataApi = $(element).attr("data-api");
        // data-api 默认开启，关闭只有两种方式：
        //  1. element 上有 data-api="off"，表示关闭单个
        //  2. document.body 上有 data-api="off"，表示关闭所有
        return elementDataApi === "off" || elementDataApi !== "on" && isDefaultOff;
    };
});

define("arale/base/1.1.1/base-debug", [ "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./aspect-debug", "./attribute-debug" ], function(require, exports, module) {
    // Base
    // ---------
    // Base 是一个基础类，提供 Class、Events、Attrs 和 Aspect 支持。
    var Class = require("arale/class/1.1.0/class-debug");
    var Events = require("arale/events/1.1.0/events-debug");
    var Aspect = require("./aspect-debug");
    var Attribute = require("./attribute-debug");
    module.exports = Class.create({
        Implements: [ Events, Aspect, Attribute ],
        initialize: function(config) {
            this.initAttrs(config);
            // Automatically register `this._onChangeAttr` method as
            // a `change:attr` event handler.
            parseEventsFromInstance(this, this.attrs);
        },
        destroy: function() {
            this.off();
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
            // Destroy should be called only once, generate a fake destroy after called
            // https://github.com/aralejs/widget/issues/50
            this.destroy = function() {};
        }
    });
    function parseEventsFromInstance(host, attrs) {
        for (var attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                var m = "_onChange" + ucfirst(attr);
                if (host[m]) {
                    host.on("change:" + attr, host[m]);
                }
            }
        }
    }
    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }
});

define("arale/base/1.1.1/aspect-debug", [], function(require, exports) {
    // Aspect
    // ---------------------
    // Thanks to:
    //  - http://yuilibrary.com/yui/docs/api/classes/Do.html
    //  - http://code.google.com/p/jquery-aop/
    //  - http://lazutkin.com/blog/2008/may/18/aop-aspect-javascript-dojo/
    // 在指定方法执行前，先执行 callback
    exports.before = function(methodName, callback, context) {
        return weave.call(this, "before", methodName, callback, context);
    };
    // 在指定方法执行后，再执行 callback
    exports.after = function(methodName, callback, context) {
        return weave.call(this, "after", methodName, callback, context);
    };
    // Helpers
    // -------
    var eventSplitter = /\s+/;
    function weave(when, methodName, callback, context) {
        var names = methodName.split(eventSplitter);
        var name, method;
        while (name = names.shift()) {
            method = getMethod(this, name);
            if (!method.__isAspected) {
                wrap.call(this, name);
            }
            this.on(when + ":" + name, callback, context);
        }
        return this;
    }
    function getMethod(host, methodName) {
        var method = host[methodName];
        if (!method) {
            throw new Error("Invalid method name: " + methodName);
        }
        return method;
    }
    function wrap(methodName) {
        var old = this[methodName];
        this[methodName] = function() {
            var args = Array.prototype.slice.call(arguments);
            var beforeArgs = [ "before:" + methodName ].concat(args);
            // prevent if trigger return false
            if (this.trigger.apply(this, beforeArgs) === false) return;
            var ret = old.apply(this, arguments);
            var afterArgs = [ "after:" + methodName, ret ].concat(args);
            this.trigger.apply(this, afterArgs);
            return ret;
        };
        this[methodName].__isAspected = true;
    }
});

define("arale/base/1.1.1/attribute-debug", [], function(require, exports) {
    // Attribute
    // -----------------
    // Thanks to:
    //  - http://documentcloud.github.com/backbone/#Model
    //  - http://yuilibrary.com/yui/docs/api/classes/AttributeCore.html
    //  - https://github.com/berzniz/backbone.getters.setters
    // 负责 attributes 的初始化
    // attributes 是与实例相关的状态信息，可读可写，发生变化时，会自动触发相关事件
    exports.initAttrs = function(config) {
        // initAttrs 是在初始化时调用的，默认情况下实例上肯定没有 attrs，不存在覆盖问题
        var attrs = this.attrs = {};
        // Get all inherited attributes.
        var specialProps = this.propsInAttrs || [];
        mergeInheritedAttrs(attrs, this, specialProps);
        // Merge user-specific attributes from config.
        if (config) {
            mergeUserValue(attrs, config);
        }
        // 对于有 setter 的属性，要用初始值 set 一下，以保证关联属性也一同初始化
        setSetterAttrs(this, attrs, config);
        // Convert `on/before/afterXxx` config to event handler.
        parseEventsFromAttrs(this, attrs);
        // 将 this.attrs 上的 special properties 放回 this 上
        copySpecialProps(specialProps, this, attrs, true);
    };
    // Get the value of an attribute.
    exports.get = function(key) {
        var attr = this.attrs[key] || {};
        var val = attr.value;
        return attr.getter ? attr.getter.call(this, val, key) : val;
    };
    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    exports.set = function(key, val, options) {
        var attrs = {};
        // set("key", val, options)
        if (isString(key)) {
            attrs[key] = val;
        } else {
            attrs = key;
            options = val;
        }
        options || (options = {});
        var silent = options.silent;
        var override = options.override;
        var now = this.attrs;
        var changed = this.__changedAttrs || (this.__changedAttrs = {});
        for (key in attrs) {
            if (!attrs.hasOwnProperty(key)) continue;
            var attr = now[key] || (now[key] = {});
            val = attrs[key];
            if (attr.readOnly) {
                throw new Error("This attribute is readOnly: " + key);
            }
            // invoke setter
            if (attr.setter) {
                val = attr.setter.call(this, val, key);
            }
            // 获取设置前的 prev 值
            var prev = this.get(key);
            // 获取需要设置的 val 值
            // 如果设置了 override 为 true，表示要强制覆盖，就不去 merge 了
            // 都为对象时，做 merge 操作，以保留 prev 上没有覆盖的值
            if (!override && isPlainObject(prev) && isPlainObject(val)) {
                val = merge(merge({}, prev), val);
            }
            // set finally
            now[key].value = val;
            // invoke change event
            // 初始化时对 set 的调用，不触发任何事件
            if (!this.__initializingAttrs && !isEqual(prev, val)) {
                if (silent) {
                    changed[key] = [ val, prev ];
                } else {
                    this.trigger("change:" + key, val, prev, key);
                }
            }
        }
        return this;
    };
    // Call this method to manually fire a `"change"` event for triggering
    // a `"change:attribute"` event for each changed attribute.
    exports.change = function() {
        var changed = this.__changedAttrs;
        if (changed) {
            for (var key in changed) {
                if (changed.hasOwnProperty(key)) {
                    var args = changed[key];
                    this.trigger("change:" + key, args[0], args[1], key);
                }
            }
            delete this.__changedAttrs;
        }
        return this;
    };
    // for test
    exports._isPlainObject = isPlainObject;
    // Helpers
    // -------
    var toString = Object.prototype.toString;
    var hasOwn = Object.prototype.hasOwnProperty;
    /**
   * Detect the JScript [[DontEnum]] bug:
   * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
   * made non-enumerable as well.
   * https://github.com/bestiejs/lodash/blob/7520066fc916e205ef84cb97fbfe630d7c154158/lodash.js#L134-L144
   */
    /** Detect if own properties are iterated after inherited properties (IE < 9) */
    var iteratesOwnLast;
    (function() {
        var props = [];
        function Ctor() {
            this.x = 1;
        }
        Ctor.prototype = {
            valueOf: 1,
            y: 1
        };
        for (var prop in new Ctor()) {
            props.push(prop);
        }
        iteratesOwnLast = props[0] !== "x";
    })();
    var isArray = Array.isArray || function(val) {
        return toString.call(val) === "[object Array]";
    };
    function isString(val) {
        return toString.call(val) === "[object String]";
    }
    function isFunction(val) {
        return toString.call(val) === "[object Function]";
    }
    function isWindow(o) {
        return o != null && o == o.window;
    }
    function isPlainObject(o) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor
        // property. Make sure that DOM nodes and window objects don't
        // pass through, as well
        if (!o || toString.call(o) !== "[object Object]" || o.nodeType || isWindow(o)) {
            return false;
        }
        try {
            // Not own constructor property must be Object
            if (o.constructor && !hasOwn.call(o, "constructor") && !hasOwn.call(o.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }
        var key;
        // Support: IE<9
        // Handle iteration over inherited properties before own properties.
        // http://bugs.jquery.com/ticket/12199
        if (iteratesOwnLast) {
            for (key in o) {
                return hasOwn.call(o, key);
            }
        }
        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        for (key in o) {}
        return key === undefined || hasOwn.call(o, key);
    }
    function isEmptyObject(o) {
        if (!o || toString.call(o) !== "[object Object]" || o.nodeType || isWindow(o) || !o.hasOwnProperty) {
            return false;
        }
        for (var p in o) {
            if (o.hasOwnProperty(p)) return false;
        }
        return true;
    }
    function merge(receiver, supplier) {
        var key, value;
        for (key in supplier) {
            if (supplier.hasOwnProperty(key)) {
                value = supplier[key];
                // 只 clone 数组和 plain object，其他的保持不变
                if (isArray(value)) {
                    value = value.slice();
                } else if (isPlainObject(value)) {
                    var prev = receiver[key];
                    isPlainObject(prev) || (prev = {});
                    value = merge(prev, value);
                }
                receiver[key] = value;
            }
        }
        return receiver;
    }
    var keys = Object.keys;
    if (!keys) {
        keys = function(o) {
            var result = [];
            for (var name in o) {
                if (o.hasOwnProperty(name)) {
                    result.push(name);
                }
            }
            return result;
        };
    }
    function mergeInheritedAttrs(attrs, instance, specialProps) {
        var inherited = [];
        var proto = instance.constructor.prototype;
        while (proto) {
            // 不要拿到 prototype 上的
            if (!proto.hasOwnProperty("attrs")) {
                proto.attrs = {};
            }
            // 将 proto 上的特殊 properties 放到 proto.attrs 上，以便合并
            copySpecialProps(specialProps, proto.attrs, proto);
            // 为空时不添加
            if (!isEmptyObject(proto.attrs)) {
                inherited.unshift(proto.attrs);
            }
            // 向上回溯一级
            proto = proto.constructor.superclass;
        }
        // Merge and clone default values to instance.
        for (var i = 0, len = inherited.length; i < len; i++) {
            merge(attrs, normalize(inherited[i]));
        }
    }
    function mergeUserValue(attrs, config) {
        merge(attrs, normalize(config, true));
    }
    function copySpecialProps(specialProps, receiver, supplier, isAttr2Prop) {
        for (var i = 0, len = specialProps.length; i < len; i++) {
            var key = specialProps[i];
            if (supplier.hasOwnProperty(key)) {
                receiver[key] = isAttr2Prop ? receiver.get(key) : supplier[key];
            }
        }
    }
    var EVENT_PATTERN = /^(on|before|after)([A-Z].*)$/;
    var EVENT_NAME_PATTERN = /^(Change)?([A-Z])(.*)/;
    function parseEventsFromAttrs(host, attrs) {
        for (var key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                var value = attrs[key].value, m;
                if (isFunction(value) && (m = key.match(EVENT_PATTERN))) {
                    host[m[1]](getEventName(m[2]), value);
                    delete attrs[key];
                }
            }
        }
    }
    // Converts `Show` to `show` and `ChangeTitle` to `change:title`
    function getEventName(name) {
        var m = name.match(EVENT_NAME_PATTERN);
        var ret = m[1] ? "change:" : "";
        ret += m[2].toLowerCase() + m[3];
        return ret;
    }
    function setSetterAttrs(host, attrs, config) {
        var options = {
            silent: true
        };
        host.__initializingAttrs = true;
        for (var key in config) {
            if (config.hasOwnProperty(key)) {
                if (attrs[key].setter) {
                    host.set(key, config[key], options);
                }
            }
        }
        delete host.__initializingAttrs;
    }
    var ATTR_SPECIAL_KEYS = [ "value", "getter", "setter", "readOnly" ];
    // normalize `attrs` to
    //
    //   {
    //      value: 'xx',
    //      getter: fn,
    //      setter: fn,
    //      readOnly: boolean
    //   }
    //
    function normalize(attrs, isUserValue) {
        var newAttrs = {};
        for (var key in attrs) {
            var attr = attrs[key];
            if (!isUserValue && isPlainObject(attr) && hasOwnProperties(attr, ATTR_SPECIAL_KEYS)) {
                newAttrs[key] = attr;
                continue;
            }
            newAttrs[key] = {
                value: attr
            };
        }
        return newAttrs;
    }
    function hasOwnProperties(object, properties) {
        for (var i = 0, len = properties.length; i < len; i++) {
            if (object.hasOwnProperty(properties[i])) {
                return true;
            }
        }
        return false;
    }
    // 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined, '', [], {}
    function isEmptyAttrValue(o) {
        return o == null || // null, undefined
        (isString(o) || isArray(o)) && o.length === 0 || // '', []
        isEmptyObject(o);
    }
    // 判断属性值 a 和 b 是否相等，注意仅适用于属性值的判断，非普适的 === 或 == 判断。
    function isEqual(a, b) {
        if (a === b) return true;
        if (isEmptyAttrValue(a) && isEmptyAttrValue(b)) return true;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className != toString.call(b)) return false;
        switch (className) {
          // Strings, numbers, dates, and booleans are compared by value.
            case "[object String]":
            // Primitives and their corresponding object wrappers are
            // equivalent; thus, `"5"` is equivalent to `new String("5")`.
            return a == String(b);

          case "[object Number]":
            // `NaN`s are equivalent, but non-reflexive. An `equal`
            // comparison is performed for other numeric values.
            return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;

          case "[object Date]":
          case "[object Boolean]":
            // Coerce dates and booleans to numeric primitive values.
            // Dates are compared by their millisecond representations.
            // Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a == +b;

          // RegExps are compared by their source patterns and flags.
            case "[object RegExp]":
            return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;

          // 简单判断数组包含的 primitive 值是否相等
            case "[object Array]":
            var aString = a.toString();
            var bString = b.toString();
            // 只要包含非 primitive 值，为了稳妥起见，都返回 false
            return aString.indexOf("[object") === -1 && bString.indexOf("[object") === -1 && aString === bString;
        }
        if (typeof a != "object" || typeof b != "object") return false;
        // 简单判断两个对象是否相等，只判断第一层
        if (isPlainObject(a) && isPlainObject(b)) {
            // 键值不相等，立刻返回 false
            if (!isEqual(keys(a), keys(b))) {
                return false;
            }
            // 键相同，但有值不等，立刻返回 false
            for (var p in a) {
                if (a[p] !== b[p]) return false;
            }
            return true;
        }
        // 其他情况返回 false, 以避免误判导致 change 事件没发生
        return false;
    }
});

define("arale/class/1.1.0/class-debug", [], function(require, exports, module) {
    // Class
    // -----------------
    // Thanks to:
    //  - http://mootools.net/docs/core/Class/Class
    //  - http://ejohn.org/blog/simple-javascript-inheritance/
    //  - https://github.com/ded/klass
    //  - http://documentcloud.github.com/backbone/#Model-extend
    //  - https://github.com/joyent/node/blob/master/lib/util.js
    //  - https://github.com/kissyteam/kissy/blob/master/src/seed/src/kissy.js
    // The base Class implementation.
    function Class(o) {
        // Convert existed function to Class.
        if (!(this instanceof Class) && isFunction(o)) {
            return classify(o);
        }
    }
    module.exports = Class;
    // Create a new Class.
    //
    //  var SuperPig = Class.create({
    //    Extends: Animal,
    //    Implements: Flyable,
    //    initialize: function() {
    //      SuperPig.superclass.initialize.apply(this, arguments)
    //    },
    //    Statics: {
    //      COLOR: 'red'
    //    }
    // })
    //
    Class.create = function(parent, properties) {
        if (!isFunction(parent)) {
            properties = parent;
            parent = null;
        }
        properties || (properties = {});
        parent || (parent = properties.Extends || Class);
        properties.Extends = parent;
        // The created class constructor
        function SubClass() {
            // Call the parent constructor.
            parent.apply(this, arguments);
            // Only call initialize in self constructor.
            if (this.constructor === SubClass && this.initialize) {
                this.initialize.apply(this, arguments);
            }
        }
        // Inherit class (static) properties from parent.
        if (parent !== Class) {
            mix(SubClass, parent, parent.StaticsWhiteList);
        }
        // Add instance properties to the subclass.
        implement.call(SubClass, properties);
        // Make subclass extendable.
        return classify(SubClass);
    };
    function implement(properties) {
        var key, value;
        for (key in properties) {
            value = properties[key];
            if (Class.Mutators.hasOwnProperty(key)) {
                Class.Mutators[key].call(this, value);
            } else {
                this.prototype[key] = value;
            }
        }
    }
    // Create a sub Class based on `Class`.
    Class.extend = function(properties) {
        properties || (properties = {});
        properties.Extends = this;
        return Class.create(properties);
    };
    function classify(cls) {
        cls.extend = Class.extend;
        cls.implement = implement;
        return cls;
    }
    // Mutators define special properties.
    Class.Mutators = {
        Extends: function(parent) {
            var existed = this.prototype;
            var proto = createProto(parent.prototype);
            // Keep existed properties.
            mix(proto, existed);
            // Enforce the constructor to be what we expect.
            proto.constructor = this;
            // Set the prototype chain to inherit from `parent`.
            this.prototype = proto;
            // Set a convenience property in case the parent's prototype is
            // needed later.
            this.superclass = parent.prototype;
        },
        Implements: function(items) {
            isArray(items) || (items = [ items ]);
            var proto = this.prototype, item;
            while (item = items.shift()) {
                mix(proto, item.prototype || item);
            }
        },
        Statics: function(staticProperties) {
            mix(this, staticProperties);
        }
    };
    // Shared empty constructor function to aid in prototype-chain creation.
    function Ctor() {}
    // See: http://jsperf.com/object-create-vs-new-ctor
    var createProto = Object.__proto__ ? function(proto) {
        return {
            __proto__: proto
        };
    } : function(proto) {
        Ctor.prototype = proto;
        return new Ctor();
    };
    // Helpers
    // ------------
    function mix(r, s, wl) {
        // Copy "all" properties including inherited ones.
        for (var p in s) {
            if (s.hasOwnProperty(p)) {
                if (wl && indexOf(wl, p) === -1) continue;
                // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
                if (p !== "prototype") {
                    r[p] = s[p];
                }
            }
        }
    }
    var toString = Object.prototype.toString;
    var isArray = Array.isArray || function(val) {
        return toString.call(val) === "[object Array]";
    };
    var isFunction = function(val) {
        return toString.call(val) === "[object Function]";
    };
    var indexOf = Array.prototype.indexOf ? function(arr, item) {
        return arr.indexOf(item);
    } : function(arr, item) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item) {
                return i;
            }
        }
        return -1;
    };
});

define("arale/events/1.1.0/events-debug", [], function() {
    // Events
    // -----------------
    // Thanks to:
    //  - https://github.com/documentcloud/backbone/blob/master/backbone.js
    //  - https://github.com/joyent/node/blob/master/lib/events.js
    // Regular expression used to split event strings
    var eventSplitter = /\s+/;
    // A module that can be mixed in to *any object* in order to provide it
    // with custom events. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = new Events();
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    function Events() {}
    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    Events.prototype.on = function(events, callback, context) {
        var cache, event, list;
        if (!callback) return this;
        cache = this.__events || (this.__events = {});
        events = events.split(eventSplitter);
        while (event = events.shift()) {
            list = cache[event] || (cache[event] = []);
            list.push(callback, context);
        }
        return this;
    };
    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    Events.prototype.off = function(events, callback, context) {
        var cache, event, list, i;
        // No events, or removing *all* events.
        if (!(cache = this.__events)) return this;
        if (!(events || callback || context)) {
            delete this.__events;
            return this;
        }
        events = events ? events.split(eventSplitter) : keys(cache);
        // Loop through the callback list, splicing where appropriate.
        while (event = events.shift()) {
            list = cache[event];
            if (!list) continue;
            if (!(callback || context)) {
                delete cache[event];
                continue;
            }
            for (i = list.length - 2; i >= 0; i -= 2) {
                if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                    list.splice(i, 2);
                }
            }
        }
        return this;
    };
    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    Events.prototype.trigger = function(events) {
        var cache, event, all, list, i, len, rest = [], args, returned = {
            status: true
        };
        if (!(cache = this.__events)) return this;
        events = events.split(eventSplitter);
        // Fill up `rest` with the callback arguments.  Since we're only copying
        // the tail of `arguments`, a loop is much faster than Array#slice.
        for (i = 1, len = arguments.length; i < len; i++) {
            rest[i - 1] = arguments[i];
        }
        // For each event, walk through the list of callbacks twice, first to
        // trigger the event, then to trigger any `"all"` callbacks.
        while (event = events.shift()) {
            // Copy callback lists to prevent modification.
            if (all = cache.all) all = all.slice();
            if (list = cache[event]) list = list.slice();
            // Execute event callbacks.
            callEach(list, rest, this, returned);
            // Execute "all" callbacks.
            callEach(all, [ event ].concat(rest), this, returned);
        }
        return returned.status;
    };
    // Mix `Events` to object instance or Class function.
    Events.mixTo = function(receiver) {
        receiver = receiver.prototype || receiver;
        var proto = Events.prototype;
        for (var p in proto) {
            if (proto.hasOwnProperty(p)) {
                receiver[p] = proto[p];
            }
        }
    };
    // Helpers
    // -------
    var keys = Object.keys;
    if (!keys) {
        keys = function(o) {
            var result = [];
            for (var name in o) {
                if (o.hasOwnProperty(name)) {
                    result.push(name);
                }
            }
            return result;
        };
    }
    // Execute callbacks
    function callEach(list, args, context, returned) {
        var r;
        if (list) {
            for (var i = 0, len = list.length; i < len; i += 2) {
                r = list[i].apply(list[i + 1] || context, args);
                // trigger will return false if one of the callbacks return false
                r === false && returned.status && (returned.status = false);
            }
        }
    }
    return Events;
});

define("arale/overlay/1.1.4/mask-debug", [ "$-debug", "./overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), Overlay = require("./overlay-debug"), ua = (window.navigator.userAgent || "").toLowerCase(), isIE6 = ua.indexOf("msie 6") !== -1, body = $(document.body), doc = $(document);
    // Mask
    // ----------
    // 全屏遮罩层组件
    var Mask = Overlay.extend({
        attrs: {
            width: isIE6 ? doc.outerWidth(true) : "100%",
            height: isIE6 ? doc.outerHeight(true) : "100%",
            className: "ui-mask",
            opacity: .2,
            backgroundColor: "#000",
            style: {
                position: isIE6 ? "absolute" : "fixed",
                top: 0,
                left: 0
            },
            align: {
                // undefined 表示相对于当前可视范围定位
                baseElement: isIE6 ? body : undefined
            }
        },
        show: function() {
            if (isIE6) {
                this.set("width", doc.outerWidth(true));
                this.set("height", doc.outerHeight(true));
            }
            return Mask.superclass.show.call(this);
        },
        _onRenderBackgroundColor: function(val) {
            this.element.css("backgroundColor", val);
        },
        _onRenderOpacity: function(val) {
            this.element.css("opacity", val);
        }
    });
    // 单例
    module.exports = new Mask();
});

define("arale/overlay/1.1.4/overlay-debug", [ "$-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), Position = require("arale/position/1.0.1/position-debug"), Shim = require("arale/iframe-shim/1.0.2/iframe-shim-debug"), Widget = require("arale/widget/1.1.1/widget-debug");
    // Overlay
    // -------
    // Overlay 组件的核心特点是可定位（Positionable）和可层叠（Stackable）
    // 是一切悬浮类 UI 组件的基类
    var Overlay = Widget.extend({
        attrs: {
            // 基本属性
            width: null,
            height: null,
            zIndex: 99,
            visible: false,
            // 定位配置
            align: {
                // element 的定位点，默认为左上角
                selfXY: [ 0, 0 ],
                // 基准定位元素，默认为当前可视区域
                baseElement: Position.VIEWPORT,
                // 基准定位元素的定位点，默认为左上角
                baseXY: [ 0, 0 ]
            },
            // 父元素
            parentNode: document.body
        },
        show: function() {
            // 若从未渲染，则调用 render
            if (!this.rendered) {
                this.render();
            }
            this.set("visible", true);
            return this;
        },
        hide: function() {
            this.set("visible", false);
            return this;
        },
        setup: function() {
            var that = this;
            // 加载 iframe 遮罩层并与 overlay 保持同步
            this._setupShim();
            // 窗口resize时，重新定位浮层
            this._setupResize();
            this.after("render", function() {
                var _pos = this.element.css("position");
                if (_pos === "static" || _pos === "relative") {
                    this.element.css({
                        position: "absolute",
                        left: "-9999px",
                        top: "-9999px"
                    });
                }
            });
            // 统一在显示之后重新设定位置
            this.after("show", function() {
                that._setPosition();
            });
        },
        destroy: function() {
            // 销毁两个静态数组中的实例
            erase(this, Overlay.allOverlays);
            erase(this, Overlay.blurOverlays);
            return Overlay.superclass.destroy.call(this);
        },
        // 进行定位
        _setPosition: function(align) {
            // 不在文档流中，定位无效
            if (!isInDocument(this.element[0])) return;
            align || (align = this.get("align"));
            // 如果align为空，表示不需要使用js对齐
            if (!align) return;
            var isHidden = this.element.css("display") === "none";
            // 在定位时，为避免元素高度不定，先显示出来
            if (isHidden) {
                this.element.css({
                    visibility: "hidden",
                    display: "block"
                });
            }
            Position.pin({
                element: this.element,
                x: align.selfXY[0],
                y: align.selfXY[1]
            }, {
                element: align.baseElement,
                x: align.baseXY[0],
                y: align.baseXY[1]
            });
            // 定位完成后，还原
            if (isHidden) {
                this.element.css({
                    visibility: "",
                    display: "none"
                });
            }
            return this;
        },
        // 加载 iframe 遮罩层并与 overlay 保持同步
        _setupShim: function() {
            var shim = new Shim(this.element);
            // 在隐藏和设置位置后，要重新定位
            // 显示后会设置位置，所以不用绑定 shim.sync
            this.after("hide _setPosition", shim.sync, shim);
            // 除了 parentNode 之外的其他属性发生变化时，都触发 shim 同步
            var attrs = [ "width", "height" ];
            for (var attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    this.on("change:" + attr, shim.sync, shim);
                }
            }
            // 在销魂自身前要销毁 shim
            this.before("destroy", shim.destroy, shim);
        },
        // resize窗口时重新定位浮层，用这个方法收集所有浮层实例
        _setupResize: function() {
            Overlay.allOverlays.push(this);
        },
        // 除了 element 和 relativeElements，点击 body 后都会隐藏 element
        _blurHide: function(arr) {
            arr = $.makeArray(arr);
            arr.push(this.element);
            this._relativeElements = arr;
            Overlay.blurOverlays.push(this);
        },
        // 用于 set 属性后的界面更新
        _onRenderWidth: function(val) {
            this.element.css("width", val);
        },
        _onRenderHeight: function(val) {
            this.element.css("height", val);
        },
        _onRenderZIndex: function(val) {
            this.element.css("zIndex", val);
        },
        _onRenderAlign: function(val) {
            this._setPosition(val);
        },
        _onRenderVisible: function(val) {
            this.element[val ? "show" : "hide"]();
        }
    });
    // 绑定 blur 隐藏事件
    Overlay.blurOverlays = [];
    $(document).on("click", function(e) {
        hideBlurOverlays(e);
    });
    // 绑定 resize 重新定位事件
    var timeout;
    var winWidth = $(window).width();
    var winHeight = $(window).height();
    Overlay.allOverlays = [];
    $(window).resize(function() {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(function() {
            var winNewWidth = $(window).width();
            var winNewHeight = $(window).height();
            // IE678 莫名其妙触发 resize
            // http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer
            if (winWidth !== winNewWidth || winHeight !== winNewHeight) {
                $(Overlay.allOverlays).each(function(i, item) {
                    // 当实例为空或隐藏时，不处理
                    if (!item || !item.get("visible")) {
                        return;
                    }
                    item._setPosition();
                });
            }
            winWidth = winNewWidth;
            winHeight = winNewHeight;
        }, 80);
    });
    module.exports = Overlay;
    // Helpers
    // -------
    function isInDocument(element) {
        return $.contains(document.documentElement, element);
    }
    function hideBlurOverlays(e) {
        $(Overlay.blurOverlays).each(function(index, item) {
            // 当实例为空或隐藏时，不处理
            if (!item || !item.get("visible")) {
                return;
            }
            // 遍历 _relativeElements ，当点击的元素落在这些元素上时，不处理
            for (var i = 0; i < item._relativeElements.length; i++) {
                var el = $(item._relativeElements[i])[0];
                if (el === e.target || $.contains(el, e.target)) {
                    return;
                }
            }
            // 到这里，判断触发了元素的 blur 事件，隐藏元素
            item.hide();
        });
    }
    // 从数组中删除对应元素
    function erase(target, array) {
        for (var i = 0; i < array.length; i++) {
            if (target === array[i]) {
                array.splice(i, 1);
                return array;
            }
        }
    }
});

define("arale/templatable/0.9.2/templatable-debug", [ "$-debug", "gallery/handlebars/1.0.2/handlebars-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var Handlebars = require("gallery/handlebars/1.0.2/handlebars-debug");
    var compiledTemplates = {};
    // 提供 Template 模板支持，默认引擎是 Handlebars
    module.exports = {
        // Handlebars 的 helpers
        templateHelpers: null,
        // Handlebars 的 partials
        templatePartials: null,
        // template 对应的 DOM-like object
        templateObject: null,
        // 根据配置的模板和传入的数据，构建 this.element 和 templateElement
        parseElementFromTemplate: function() {
            // template 支持 id 选择器
            var t, template = this.get("template");
            if (/^#/.test(template) && (t = document.getElementById(template.substring(1)))) {
                template = t.innerHTML;
                this.set("template", template);
            }
            this.templateObject = convertTemplateToObject(template);
            this.element = $(this.compile());
        },
        // 编译模板，混入数据，返回 html 结果
        compile: function(template, model) {
            template || (template = this.get("template"));
            model || (model = this.get("model")) || (model = {});
            if (model.toJSON) {
                model = model.toJSON();
            }
            // handlebars runtime，注意 partials 也需要预编译
            if (isFunction(template)) {
                return template(model, {
                    helpers: this.templateHelpers,
                    partials: precompile(this.templatePartials)
                });
            } else {
                var helpers = this.templateHelpers;
                var partials = this.templatePartials;
                var helper, partial;
                // 注册 helpers
                if (helpers) {
                    for (helper in helpers) {
                        if (helpers.hasOwnProperty(helper)) {
                            Handlebars.registerHelper(helper, helpers[helper]);
                        }
                    }
                }
                // 注册 partials
                if (partials) {
                    for (partial in partials) {
                        if (partials.hasOwnProperty(partial)) {
                            Handlebars.registerPartial(partial, partials[partial]);
                        }
                    }
                }
                var compiledTemplate = compiledTemplates[template];
                if (!compiledTemplate) {
                    compiledTemplate = compiledTemplates[template] = Handlebars.compile(template);
                }
                // 生成 html
                var html = compiledTemplate(model);
                // 卸载 helpers
                if (helpers) {
                    for (helper in helpers) {
                        if (helpers.hasOwnProperty(helper)) {
                            delete Handlebars.helpers[helper];
                        }
                    }
                }
                // 卸载 partials
                if (partials) {
                    for (partial in partials) {
                        if (partials.hasOwnProperty(partial)) {
                            delete Handlebars.partials[partial];
                        }
                    }
                }
                return html;
            }
        },
        // 刷新 selector 指定的局部区域
        renderPartial: function(selector) {
            if (this.templateObject) {
                var template = convertObjectToTemplate(this.templateObject, selector);
                if (template) {
                    if (selector) {
                        this.$(selector).html(this.compile(template));
                    } else {
                        this.element.html(this.compile(template));
                    }
                } else {
                    this.element.html(this.compile());
                }
            } else {
                var all = $(this.compile());
                var selected = all.find(selector);
                if (selected.length) {
                    this.$(selector).html(selected.html());
                } else {
                    this.element.html(all.html());
                }
            }
            return this;
        }
    };
    // Helpers
    // -------
    var _compile = Handlebars.compile;
    Handlebars.compile = function(template) {
        return isFunction(template) ? template : _compile.call(Handlebars, template);
    };
    // 将 template 字符串转换成对应的 DOM-like object
    function convertTemplateToObject(template) {
        return isFunction(template) ? null : $(encode(template));
    }
    // 根据 selector 得到 DOM-like template object，并转换为 template 字符串
    function convertObjectToTemplate(templateObject, selector) {
        if (!templateObject) return;
        var element;
        if (selector) {
            element = templateObject.find(selector);
            if (element.length === 0) {
                throw new Error("Invalid template selector: " + selector);
            }
        } else {
            element = templateObject;
        }
        return decode(element.html());
    }
    function encode(template) {
        return template.replace(/({[^}]+}})/g, "<!--$1-->").replace(/\s(src|href)\s*=\s*(['"])(.*?\{.+?)\2/g, " data-templatable-$1=$2$3$2");
    }
    function decode(template) {
        return template.replace(/(?:<|&lt;)!--({{[^}]+}})--(?:>|&gt;)/g, "$1").replace(/data-templatable-/gi, "");
    }
    function isFunction(obj) {
        return typeof obj === "function";
    }
    function precompile(partials) {
        if (!partials) return {};
        var result = {};
        for (var name in partials) {
            var partial = partials[name];
            result[name] = isFunction(partial) ? partial : Handlebars.compile(partial);
        }
        return result;
    }
});

define("gallery/handlebars/1.0.2/handlebars-debug", [], function(require, exports, module) {
    /*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
    // lib/handlebars/browser-prefix.js
    var Handlebars = {};
    (function(Handlebars, undefined) {
        // lib/handlebars/base.js
        Handlebars.VERSION = "1.0.0-rc.4";
        Handlebars.COMPILER_REVISION = 3;
        Handlebars.REVISION_CHANGES = {
            1: "<= 1.0.rc.2",
            // 1.0.rc.2 is actually rev2 but doesn't report it
            2: "== 1.0.0-rc.3",
            3: ">= 1.0.0-rc.4"
        };
        Handlebars.helpers = {};
        Handlebars.partials = {};
        var toString = Object.prototype.toString, functionType = "[object Function]", objectType = "[object Object]";
        Handlebars.registerHelper = function(name, fn, inverse) {
            if (toString.call(name) === objectType) {
                if (inverse || fn) {
                    throw new Handlebars.Exception("Arg not supported with multiple helpers");
                }
                Handlebars.Utils.extend(this.helpers, name);
            } else {
                if (inverse) {
                    fn.not = inverse;
                }
                this.helpers[name] = fn;
            }
        };
        Handlebars.registerPartial = function(name, str) {
            if (toString.call(name) === objectType) {
                Handlebars.Utils.extend(this.partials, name);
            } else {
                this.partials[name] = str;
            }
        };
        Handlebars.registerHelper("helperMissing", function(arg) {
            if (arguments.length === 2) {
                return undefined;
            } else {
                throw new Error("Could not find property '" + arg + "'");
            }
        });
        Handlebars.registerHelper("blockHelperMissing", function(context, options) {
            var inverse = options.inverse || function() {}, fn = options.fn;
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this);
            }
            if (context === true) {
                return fn(this);
            } else if (context === false || context == null) {
                return inverse(this);
            } else if (type === "[object Array]") {
                if (context.length > 0) {
                    return Handlebars.helpers.each(context, options);
                } else {
                    return inverse(this);
                }
            } else {
                return fn(context);
            }
        });
        Handlebars.K = function() {};
        Handlebars.createFrame = Object.create || function(object) {
            Handlebars.K.prototype = object;
            var obj = new Handlebars.K();
            Handlebars.K.prototype = null;
            return obj;
        };
        Handlebars.logger = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            level: 3,
            methodMap: {
                0: "debug",
                1: "info",
                2: "warn",
                3: "error"
            },
            // can be overridden in the host environment
            log: function(level, obj) {
                if (Handlebars.logger.level <= level) {
                    var method = Handlebars.logger.methodMap[level];
                    if (typeof console !== "undefined" && console[method]) {
                        console[method].call(console, obj);
                    }
                }
            }
        };
        Handlebars.log = function(level, obj) {
            Handlebars.logger.log(level, obj);
        };
        Handlebars.registerHelper("each", function(context, options) {
            var fn = options.fn, inverse = options.inverse;
            var i = 0, ret = "", data;
            if (options.data) {
                data = Handlebars.createFrame(options.data);
            }
            if (context && typeof context === "object") {
                if (context instanceof Array) {
                    for (var j = context.length; i < j; i++) {
                        if (data) {
                            data.index = i;
                        }
                        ret = ret + fn(context[i], {
                            data: data
                        });
                    }
                } else {
                    for (var key in context) {
                        if (context.hasOwnProperty(key)) {
                            if (data) {
                                data.key = key;
                            }
                            ret = ret + fn(context[key], {
                                data: data
                            });
                            i++;
                        }
                    }
                }
            }
            if (i === 0) {
                ret = inverse(this);
            }
            return ret;
        });
        Handlebars.registerHelper("if", function(context, options) {
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this);
            }
            if (!context || Handlebars.Utils.isEmpty(context)) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        });
        Handlebars.registerHelper("unless", function(context, options) {
            return Handlebars.helpers["if"].call(this, context, {
                fn: options.inverse,
                inverse: options.fn
            });
        });
        Handlebars.registerHelper("with", function(context, options) {
            if (!Handlebars.Utils.isEmpty(context)) return options.fn(context);
        });
        Handlebars.registerHelper("log", function(context, options) {
            var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
            Handlebars.log(level, context);
        });
        // lib/handlebars/compiler/parser.js
        /* Jison generated parser */
        var handlebars = function() {
            var parser = {
                trace: function trace() {},
                yy: {},
                symbols_: {
                    error: 2,
                    root: 3,
                    program: 4,
                    EOF: 5,
                    simpleInverse: 6,
                    statements: 7,
                    statement: 8,
                    openInverse: 9,
                    closeBlock: 10,
                    openBlock: 11,
                    mustache: 12,
                    partial: 13,
                    CONTENT: 14,
                    COMMENT: 15,
                    OPEN_BLOCK: 16,
                    inMustache: 17,
                    CLOSE: 18,
                    OPEN_INVERSE: 19,
                    OPEN_ENDBLOCK: 20,
                    path: 21,
                    OPEN: 22,
                    OPEN_UNESCAPED: 23,
                    OPEN_PARTIAL: 24,
                    partialName: 25,
                    params: 26,
                    hash: 27,
                    DATA: 28,
                    param: 29,
                    STRING: 30,
                    INTEGER: 31,
                    BOOLEAN: 32,
                    hashSegments: 33,
                    hashSegment: 34,
                    ID: 35,
                    EQUALS: 36,
                    PARTIAL_NAME: 37,
                    pathSegments: 38,
                    SEP: 39,
                    $accept: 0,
                    $end: 1
                },
                terminals_: {
                    2: "error",
                    5: "EOF",
                    14: "CONTENT",
                    15: "COMMENT",
                    16: "OPEN_BLOCK",
                    18: "CLOSE",
                    19: "OPEN_INVERSE",
                    20: "OPEN_ENDBLOCK",
                    22: "OPEN",
                    23: "OPEN_UNESCAPED",
                    24: "OPEN_PARTIAL",
                    28: "DATA",
                    30: "STRING",
                    31: "INTEGER",
                    32: "BOOLEAN",
                    35: "ID",
                    36: "EQUALS",
                    37: "PARTIAL_NAME",
                    39: "SEP"
                },
                productions_: [ 0, [ 3, 2 ], [ 4, 2 ], [ 4, 3 ], [ 4, 2 ], [ 4, 1 ], [ 4, 1 ], [ 4, 0 ], [ 7, 1 ], [ 7, 2 ], [ 8, 3 ], [ 8, 3 ], [ 8, 1 ], [ 8, 1 ], [ 8, 1 ], [ 8, 1 ], [ 11, 3 ], [ 9, 3 ], [ 10, 3 ], [ 12, 3 ], [ 12, 3 ], [ 13, 3 ], [ 13, 4 ], [ 6, 2 ], [ 17, 3 ], [ 17, 2 ], [ 17, 2 ], [ 17, 1 ], [ 17, 1 ], [ 26, 2 ], [ 26, 1 ], [ 29, 1 ], [ 29, 1 ], [ 29, 1 ], [ 29, 1 ], [ 29, 1 ], [ 27, 1 ], [ 33, 2 ], [ 33, 1 ], [ 34, 3 ], [ 34, 3 ], [ 34, 3 ], [ 34, 3 ], [ 34, 3 ], [ 25, 1 ], [ 21, 1 ], [ 38, 3 ], [ 38, 1 ] ],
                performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
                    var $0 = $$.length - 1;
                    switch (yystate) {
                      case 1:
                        return $$[$0 - 1];
                        break;

                      case 2:
                        this.$ = new yy.ProgramNode([], $$[$0]);
                        break;

                      case 3:
                        this.$ = new yy.ProgramNode($$[$0 - 2], $$[$0]);
                        break;

                      case 4:
                        this.$ = new yy.ProgramNode($$[$0 - 1], []);
                        break;

                      case 5:
                        this.$ = new yy.ProgramNode($$[$0]);
                        break;

                      case 6:
                        this.$ = new yy.ProgramNode([], []);
                        break;

                      case 7:
                        this.$ = new yy.ProgramNode([]);
                        break;

                      case 8:
                        this.$ = [ $$[$0] ];
                        break;

                      case 9:
                        $$[$0 - 1].push($$[$0]);
                        this.$ = $$[$0 - 1];
                        break;

                      case 10:
                        this.$ = new yy.BlockNode($$[$0 - 2], $$[$0 - 1].inverse, $$[$0 - 1], $$[$0]);
                        break;

                      case 11:
                        this.$ = new yy.BlockNode($$[$0 - 2], $$[$0 - 1], $$[$0 - 1].inverse, $$[$0]);
                        break;

                      case 12:
                        this.$ = $$[$0];
                        break;

                      case 13:
                        this.$ = $$[$0];
                        break;

                      case 14:
                        this.$ = new yy.ContentNode($$[$0]);
                        break;

                      case 15:
                        this.$ = new yy.CommentNode($$[$0]);
                        break;

                      case 16:
                        this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
                        break;

                      case 17:
                        this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
                        break;

                      case 18:
                        this.$ = $$[$0 - 1];
                        break;

                      case 19:
                        this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
                        break;

                      case 20:
                        this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1], true);
                        break;

                      case 21:
                        this.$ = new yy.PartialNode($$[$0 - 1]);
                        break;

                      case 22:
                        this.$ = new yy.PartialNode($$[$0 - 2], $$[$0 - 1]);
                        break;

                      case 23:
                        break;

                      case 24:
                        this.$ = [ [ $$[$0 - 2] ].concat($$[$0 - 1]), $$[$0] ];
                        break;

                      case 25:
                        this.$ = [ [ $$[$0 - 1] ].concat($$[$0]), null ];
                        break;

                      case 26:
                        this.$ = [ [ $$[$0 - 1] ], $$[$0] ];
                        break;

                      case 27:
                        this.$ = [ [ $$[$0] ], null ];
                        break;

                      case 28:
                        this.$ = [ [ new yy.DataNode($$[$0]) ], null ];
                        break;

                      case 29:
                        $$[$0 - 1].push($$[$0]);
                        this.$ = $$[$0 - 1];
                        break;

                      case 30:
                        this.$ = [ $$[$0] ];
                        break;

                      case 31:
                        this.$ = $$[$0];
                        break;

                      case 32:
                        this.$ = new yy.StringNode($$[$0]);
                        break;

                      case 33:
                        this.$ = new yy.IntegerNode($$[$0]);
                        break;

                      case 34:
                        this.$ = new yy.BooleanNode($$[$0]);
                        break;

                      case 35:
                        this.$ = new yy.DataNode($$[$0]);
                        break;

                      case 36:
                        this.$ = new yy.HashNode($$[$0]);
                        break;

                      case 37:
                        $$[$0 - 1].push($$[$0]);
                        this.$ = $$[$0 - 1];
                        break;

                      case 38:
                        this.$ = [ $$[$0] ];
                        break;

                      case 39:
                        this.$ = [ $$[$0 - 2], $$[$0] ];
                        break;

                      case 40:
                        this.$ = [ $$[$0 - 2], new yy.StringNode($$[$0]) ];
                        break;

                      case 41:
                        this.$ = [ $$[$0 - 2], new yy.IntegerNode($$[$0]) ];
                        break;

                      case 42:
                        this.$ = [ $$[$0 - 2], new yy.BooleanNode($$[$0]) ];
                        break;

                      case 43:
                        this.$ = [ $$[$0 - 2], new yy.DataNode($$[$0]) ];
                        break;

                      case 44:
                        this.$ = new yy.PartialNameNode($$[$0]);
                        break;

                      case 45:
                        this.$ = new yy.IdNode($$[$0]);
                        break;

                      case 46:
                        $$[$0 - 2].push($$[$0]);
                        this.$ = $$[$0 - 2];
                        break;

                      case 47:
                        this.$ = [ $$[$0] ];
                        break;
                    }
                },
                table: [ {
                    3: 1,
                    4: 2,
                    5: [ 2, 7 ],
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 5 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    1: [ 3 ]
                }, {
                    5: [ 1, 17 ]
                }, {
                    5: [ 2, 6 ],
                    7: 18,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 19 ],
                    20: [ 2, 6 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    5: [ 2, 5 ],
                    6: 20,
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 5 ],
                    20: [ 2, 5 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    17: 23,
                    18: [ 1, 22 ],
                    21: 24,
                    28: [ 1, 25 ],
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    5: [ 2, 8 ],
                    14: [ 2, 8 ],
                    15: [ 2, 8 ],
                    16: [ 2, 8 ],
                    19: [ 2, 8 ],
                    20: [ 2, 8 ],
                    22: [ 2, 8 ],
                    23: [ 2, 8 ],
                    24: [ 2, 8 ]
                }, {
                    4: 28,
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 5 ],
                    20: [ 2, 7 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    4: 29,
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 5 ],
                    20: [ 2, 7 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    5: [ 2, 12 ],
                    14: [ 2, 12 ],
                    15: [ 2, 12 ],
                    16: [ 2, 12 ],
                    19: [ 2, 12 ],
                    20: [ 2, 12 ],
                    22: [ 2, 12 ],
                    23: [ 2, 12 ],
                    24: [ 2, 12 ]
                }, {
                    5: [ 2, 13 ],
                    14: [ 2, 13 ],
                    15: [ 2, 13 ],
                    16: [ 2, 13 ],
                    19: [ 2, 13 ],
                    20: [ 2, 13 ],
                    22: [ 2, 13 ],
                    23: [ 2, 13 ],
                    24: [ 2, 13 ]
                }, {
                    5: [ 2, 14 ],
                    14: [ 2, 14 ],
                    15: [ 2, 14 ],
                    16: [ 2, 14 ],
                    19: [ 2, 14 ],
                    20: [ 2, 14 ],
                    22: [ 2, 14 ],
                    23: [ 2, 14 ],
                    24: [ 2, 14 ]
                }, {
                    5: [ 2, 15 ],
                    14: [ 2, 15 ],
                    15: [ 2, 15 ],
                    16: [ 2, 15 ],
                    19: [ 2, 15 ],
                    20: [ 2, 15 ],
                    22: [ 2, 15 ],
                    23: [ 2, 15 ],
                    24: [ 2, 15 ]
                }, {
                    17: 30,
                    21: 24,
                    28: [ 1, 25 ],
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    17: 31,
                    21: 24,
                    28: [ 1, 25 ],
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    17: 32,
                    21: 24,
                    28: [ 1, 25 ],
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    25: 33,
                    37: [ 1, 34 ]
                }, {
                    1: [ 2, 1 ]
                }, {
                    5: [ 2, 2 ],
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 19 ],
                    20: [ 2, 2 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    17: 23,
                    21: 24,
                    28: [ 1, 25 ],
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    5: [ 2, 4 ],
                    7: 35,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 19 ],
                    20: [ 2, 4 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    5: [ 2, 9 ],
                    14: [ 2, 9 ],
                    15: [ 2, 9 ],
                    16: [ 2, 9 ],
                    19: [ 2, 9 ],
                    20: [ 2, 9 ],
                    22: [ 2, 9 ],
                    23: [ 2, 9 ],
                    24: [ 2, 9 ]
                }, {
                    5: [ 2, 23 ],
                    14: [ 2, 23 ],
                    15: [ 2, 23 ],
                    16: [ 2, 23 ],
                    19: [ 2, 23 ],
                    20: [ 2, 23 ],
                    22: [ 2, 23 ],
                    23: [ 2, 23 ],
                    24: [ 2, 23 ]
                }, {
                    18: [ 1, 36 ]
                }, {
                    18: [ 2, 27 ],
                    21: 41,
                    26: 37,
                    27: 38,
                    28: [ 1, 45 ],
                    29: 39,
                    30: [ 1, 42 ],
                    31: [ 1, 43 ],
                    32: [ 1, 44 ],
                    33: 40,
                    34: 46,
                    35: [ 1, 47 ],
                    38: 26
                }, {
                    18: [ 2, 28 ]
                }, {
                    18: [ 2, 45 ],
                    28: [ 2, 45 ],
                    30: [ 2, 45 ],
                    31: [ 2, 45 ],
                    32: [ 2, 45 ],
                    35: [ 2, 45 ],
                    39: [ 1, 48 ]
                }, {
                    18: [ 2, 47 ],
                    28: [ 2, 47 ],
                    30: [ 2, 47 ],
                    31: [ 2, 47 ],
                    32: [ 2, 47 ],
                    35: [ 2, 47 ],
                    39: [ 2, 47 ]
                }, {
                    10: 49,
                    20: [ 1, 50 ]
                }, {
                    10: 51,
                    20: [ 1, 50 ]
                }, {
                    18: [ 1, 52 ]
                }, {
                    18: [ 1, 53 ]
                }, {
                    18: [ 1, 54 ]
                }, {
                    18: [ 1, 55 ],
                    21: 56,
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    18: [ 2, 44 ],
                    35: [ 2, 44 ]
                }, {
                    5: [ 2, 3 ],
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 19 ],
                    20: [ 2, 3 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    14: [ 2, 17 ],
                    15: [ 2, 17 ],
                    16: [ 2, 17 ],
                    19: [ 2, 17 ],
                    20: [ 2, 17 ],
                    22: [ 2, 17 ],
                    23: [ 2, 17 ],
                    24: [ 2, 17 ]
                }, {
                    18: [ 2, 25 ],
                    21: 41,
                    27: 57,
                    28: [ 1, 45 ],
                    29: 58,
                    30: [ 1, 42 ],
                    31: [ 1, 43 ],
                    32: [ 1, 44 ],
                    33: 40,
                    34: 46,
                    35: [ 1, 47 ],
                    38: 26
                }, {
                    18: [ 2, 26 ]
                }, {
                    18: [ 2, 30 ],
                    28: [ 2, 30 ],
                    30: [ 2, 30 ],
                    31: [ 2, 30 ],
                    32: [ 2, 30 ],
                    35: [ 2, 30 ]
                }, {
                    18: [ 2, 36 ],
                    34: 59,
                    35: [ 1, 60 ]
                }, {
                    18: [ 2, 31 ],
                    28: [ 2, 31 ],
                    30: [ 2, 31 ],
                    31: [ 2, 31 ],
                    32: [ 2, 31 ],
                    35: [ 2, 31 ]
                }, {
                    18: [ 2, 32 ],
                    28: [ 2, 32 ],
                    30: [ 2, 32 ],
                    31: [ 2, 32 ],
                    32: [ 2, 32 ],
                    35: [ 2, 32 ]
                }, {
                    18: [ 2, 33 ],
                    28: [ 2, 33 ],
                    30: [ 2, 33 ],
                    31: [ 2, 33 ],
                    32: [ 2, 33 ],
                    35: [ 2, 33 ]
                }, {
                    18: [ 2, 34 ],
                    28: [ 2, 34 ],
                    30: [ 2, 34 ],
                    31: [ 2, 34 ],
                    32: [ 2, 34 ],
                    35: [ 2, 34 ]
                }, {
                    18: [ 2, 35 ],
                    28: [ 2, 35 ],
                    30: [ 2, 35 ],
                    31: [ 2, 35 ],
                    32: [ 2, 35 ],
                    35: [ 2, 35 ]
                }, {
                    18: [ 2, 38 ],
                    35: [ 2, 38 ]
                }, {
                    18: [ 2, 47 ],
                    28: [ 2, 47 ],
                    30: [ 2, 47 ],
                    31: [ 2, 47 ],
                    32: [ 2, 47 ],
                    35: [ 2, 47 ],
                    36: [ 1, 61 ],
                    39: [ 2, 47 ]
                }, {
                    35: [ 1, 62 ]
                }, {
                    5: [ 2, 10 ],
                    14: [ 2, 10 ],
                    15: [ 2, 10 ],
                    16: [ 2, 10 ],
                    19: [ 2, 10 ],
                    20: [ 2, 10 ],
                    22: [ 2, 10 ],
                    23: [ 2, 10 ],
                    24: [ 2, 10 ]
                }, {
                    21: 63,
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    5: [ 2, 11 ],
                    14: [ 2, 11 ],
                    15: [ 2, 11 ],
                    16: [ 2, 11 ],
                    19: [ 2, 11 ],
                    20: [ 2, 11 ],
                    22: [ 2, 11 ],
                    23: [ 2, 11 ],
                    24: [ 2, 11 ]
                }, {
                    14: [ 2, 16 ],
                    15: [ 2, 16 ],
                    16: [ 2, 16 ],
                    19: [ 2, 16 ],
                    20: [ 2, 16 ],
                    22: [ 2, 16 ],
                    23: [ 2, 16 ],
                    24: [ 2, 16 ]
                }, {
                    5: [ 2, 19 ],
                    14: [ 2, 19 ],
                    15: [ 2, 19 ],
                    16: [ 2, 19 ],
                    19: [ 2, 19 ],
                    20: [ 2, 19 ],
                    22: [ 2, 19 ],
                    23: [ 2, 19 ],
                    24: [ 2, 19 ]
                }, {
                    5: [ 2, 20 ],
                    14: [ 2, 20 ],
                    15: [ 2, 20 ],
                    16: [ 2, 20 ],
                    19: [ 2, 20 ],
                    20: [ 2, 20 ],
                    22: [ 2, 20 ],
                    23: [ 2, 20 ],
                    24: [ 2, 20 ]
                }, {
                    5: [ 2, 21 ],
                    14: [ 2, 21 ],
                    15: [ 2, 21 ],
                    16: [ 2, 21 ],
                    19: [ 2, 21 ],
                    20: [ 2, 21 ],
                    22: [ 2, 21 ],
                    23: [ 2, 21 ],
                    24: [ 2, 21 ]
                }, {
                    18: [ 1, 64 ]
                }, {
                    18: [ 2, 24 ]
                }, {
                    18: [ 2, 29 ],
                    28: [ 2, 29 ],
                    30: [ 2, 29 ],
                    31: [ 2, 29 ],
                    32: [ 2, 29 ],
                    35: [ 2, 29 ]
                }, {
                    18: [ 2, 37 ],
                    35: [ 2, 37 ]
                }, {
                    36: [ 1, 61 ]
                }, {
                    21: 65,
                    28: [ 1, 69 ],
                    30: [ 1, 66 ],
                    31: [ 1, 67 ],
                    32: [ 1, 68 ],
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    18: [ 2, 46 ],
                    28: [ 2, 46 ],
                    30: [ 2, 46 ],
                    31: [ 2, 46 ],
                    32: [ 2, 46 ],
                    35: [ 2, 46 ],
                    39: [ 2, 46 ]
                }, {
                    18: [ 1, 70 ]
                }, {
                    5: [ 2, 22 ],
                    14: [ 2, 22 ],
                    15: [ 2, 22 ],
                    16: [ 2, 22 ],
                    19: [ 2, 22 ],
                    20: [ 2, 22 ],
                    22: [ 2, 22 ],
                    23: [ 2, 22 ],
                    24: [ 2, 22 ]
                }, {
                    18: [ 2, 39 ],
                    35: [ 2, 39 ]
                }, {
                    18: [ 2, 40 ],
                    35: [ 2, 40 ]
                }, {
                    18: [ 2, 41 ],
                    35: [ 2, 41 ]
                }, {
                    18: [ 2, 42 ],
                    35: [ 2, 42 ]
                }, {
                    18: [ 2, 43 ],
                    35: [ 2, 43 ]
                }, {
                    5: [ 2, 18 ],
                    14: [ 2, 18 ],
                    15: [ 2, 18 ],
                    16: [ 2, 18 ],
                    19: [ 2, 18 ],
                    20: [ 2, 18 ],
                    22: [ 2, 18 ],
                    23: [ 2, 18 ],
                    24: [ 2, 18 ]
                } ],
                defaultActions: {
                    17: [ 2, 1 ],
                    25: [ 2, 28 ],
                    38: [ 2, 26 ],
                    57: [ 2, 24 ]
                },
                parseError: function parseError(str, hash) {
                    throw new Error(str);
                },
                parse: function parse(input) {
                    var self = this, stack = [ 0 ], vstack = [ null ], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
                    this.lexer.setInput(input);
                    this.lexer.yy = this.yy;
                    this.yy.lexer = this.lexer;
                    this.yy.parser = this;
                    if (typeof this.lexer.yylloc == "undefined") this.lexer.yylloc = {};
                    var yyloc = this.lexer.yylloc;
                    lstack.push(yyloc);
                    var ranges = this.lexer.options && this.lexer.options.ranges;
                    if (typeof this.yy.parseError === "function") this.parseError = this.yy.parseError;
                    function popStack(n) {
                        stack.length = stack.length - 2 * n;
                        vstack.length = vstack.length - n;
                        lstack.length = lstack.length - n;
                    }
                    function lex() {
                        var token;
                        token = self.lexer.lex() || 1;
                        if (typeof token !== "number") {
                            token = self.symbols_[token] || token;
                        }
                        return token;
                    }
                    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
                    while (true) {
                        state = stack[stack.length - 1];
                        if (this.defaultActions[state]) {
                            action = this.defaultActions[state];
                        } else {
                            if (symbol === null || typeof symbol == "undefined") {
                                symbol = lex();
                            }
                            action = table[state] && table[state][symbol];
                        }
                        if (typeof action === "undefined" || !action.length || !action[0]) {
                            var errStr = "";
                            if (!recovering) {
                                expected = [];
                                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                                    expected.push("'" + this.terminals_[p] + "'");
                                }
                                if (this.lexer.showPosition) {
                                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                                } else {
                                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
                                }
                                this.parseError(errStr, {
                                    text: this.lexer.match,
                                    token: this.terminals_[symbol] || symbol,
                                    line: this.lexer.yylineno,
                                    loc: yyloc,
                                    expected: expected
                                });
                            }
                        }
                        if (action[0] instanceof Array && action.length > 1) {
                            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
                        }
                        switch (action[0]) {
                          case 1:
                            stack.push(symbol);
                            vstack.push(this.lexer.yytext);
                            lstack.push(this.lexer.yylloc);
                            stack.push(action[1]);
                            symbol = null;
                            if (!preErrorSymbol) {
                                yyleng = this.lexer.yyleng;
                                yytext = this.lexer.yytext;
                                yylineno = this.lexer.yylineno;
                                yyloc = this.lexer.yylloc;
                                if (recovering > 0) recovering--;
                            } else {
                                symbol = preErrorSymbol;
                                preErrorSymbol = null;
                            }
                            break;

                          case 2:
                            len = this.productions_[action[1]][1];
                            yyval.$ = vstack[vstack.length - len];
                            yyval._$ = {
                                first_line: lstack[lstack.length - (len || 1)].first_line,
                                last_line: lstack[lstack.length - 1].last_line,
                                first_column: lstack[lstack.length - (len || 1)].first_column,
                                last_column: lstack[lstack.length - 1].last_column
                            };
                            if (ranges) {
                                yyval._$.range = [ lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1] ];
                            }
                            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
                            if (typeof r !== "undefined") {
                                return r;
                            }
                            if (len) {
                                stack = stack.slice(0, -1 * len * 2);
                                vstack = vstack.slice(0, -1 * len);
                                lstack = lstack.slice(0, -1 * len);
                            }
                            stack.push(this.productions_[action[1]][0]);
                            vstack.push(yyval.$);
                            lstack.push(yyval._$);
                            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                            stack.push(newState);
                            break;

                          case 3:
                            return true;
                        }
                    }
                    return true;
                }
            };
            /* Jison generated lexer */
            var lexer = function() {
                var lexer = {
                    EOF: 1,
                    parseError: function parseError(str, hash) {
                        if (this.yy.parser) {
                            this.yy.parser.parseError(str, hash);
                        } else {
                            throw new Error(str);
                        }
                    },
                    setInput: function(input) {
                        this._input = input;
                        this._more = this._less = this.done = false;
                        this.yylineno = this.yyleng = 0;
                        this.yytext = this.matched = this.match = "";
                        this.conditionStack = [ "INITIAL" ];
                        this.yylloc = {
                            first_line: 1,
                            first_column: 0,
                            last_line: 1,
                            last_column: 0
                        };
                        if (this.options.ranges) this.yylloc.range = [ 0, 0 ];
                        this.offset = 0;
                        return this;
                    },
                    input: function() {
                        var ch = this._input[0];
                        this.yytext += ch;
                        this.yyleng++;
                        this.offset++;
                        this.match += ch;
                        this.matched += ch;
                        var lines = ch.match(/(?:\r\n?|\n).*/g);
                        if (lines) {
                            this.yylineno++;
                            this.yylloc.last_line++;
                        } else {
                            this.yylloc.last_column++;
                        }
                        if (this.options.ranges) this.yylloc.range[1]++;
                        this._input = this._input.slice(1);
                        return ch;
                    },
                    unput: function(ch) {
                        var len = ch.length;
                        var lines = ch.split(/(?:\r\n?|\n)/g);
                        this._input = ch + this._input;
                        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
                        //this.yyleng -= len;
                        this.offset -= len;
                        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                        this.match = this.match.substr(0, this.match.length - 1);
                        this.matched = this.matched.substr(0, this.matched.length - 1);
                        if (lines.length - 1) this.yylineno -= lines.length - 1;
                        var r = this.yylloc.range;
                        this.yylloc = {
                            first_line: this.yylloc.first_line,
                            last_line: this.yylineno + 1,
                            first_column: this.yylloc.first_column,
                            last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                        };
                        if (this.options.ranges) {
                            this.yylloc.range = [ r[0], r[0] + this.yyleng - len ];
                        }
                        return this;
                    },
                    more: function() {
                        this._more = true;
                        return this;
                    },
                    less: function(n) {
                        this.unput(this.match.slice(n));
                    },
                    pastInput: function() {
                        var past = this.matched.substr(0, this.matched.length - this.match.length);
                        return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
                    },
                    upcomingInput: function() {
                        var next = this.match;
                        if (next.length < 20) {
                            next += this._input.substr(0, 20 - next.length);
                        }
                        return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
                    },
                    showPosition: function() {
                        var pre = this.pastInput();
                        var c = new Array(pre.length + 1).join("-");
                        return pre + this.upcomingInput() + "\n" + c + "^";
                    },
                    next: function() {
                        if (this.done) {
                            return this.EOF;
                        }
                        if (!this._input) this.done = true;
                        var token, match, tempMatch, index, col, lines;
                        if (!this._more) {
                            this.yytext = "";
                            this.match = "";
                        }
                        var rules = this._currentRules();
                        for (var i = 0; i < rules.length; i++) {
                            tempMatch = this._input.match(this.rules[rules[i]]);
                            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                                match = tempMatch;
                                index = i;
                                if (!this.options.flex) break;
                            }
                        }
                        if (match) {
                            lines = match[0].match(/(?:\r\n?|\n).*/g);
                            if (lines) this.yylineno += lines.length;
                            this.yylloc = {
                                first_line: this.yylloc.last_line,
                                last_line: this.yylineno + 1,
                                first_column: this.yylloc.last_column,
                                last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
                            };
                            this.yytext += match[0];
                            this.match += match[0];
                            this.matches = match;
                            this.yyleng = this.yytext.length;
                            if (this.options.ranges) {
                                this.yylloc.range = [ this.offset, this.offset += this.yyleng ];
                            }
                            this._more = false;
                            this._input = this._input.slice(match[0].length);
                            this.matched += match[0];
                            token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
                            if (this.done && this._input) this.done = false;
                            if (token) return token; else return;
                        }
                        if (this._input === "") {
                            return this.EOF;
                        } else {
                            return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                                text: "",
                                token: null,
                                line: this.yylineno
                            });
                        }
                    },
                    lex: function lex() {
                        var r = this.next();
                        if (typeof r !== "undefined") {
                            return r;
                        } else {
                            return this.lex();
                        }
                    },
                    begin: function begin(condition) {
                        this.conditionStack.push(condition);
                    },
                    popState: function popState() {
                        return this.conditionStack.pop();
                    },
                    _currentRules: function _currentRules() {
                        return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                    },
                    topState: function() {
                        return this.conditionStack[this.conditionStack.length - 2];
                    },
                    pushState: function begin(condition) {
                        this.begin(condition);
                    }
                };
                lexer.options = {};
                lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                    var YYSTATE = YY_START;
                    switch ($avoiding_name_collisions) {
                      case 0:
                        yy_.yytext = "\\";
                        return 14;
                        break;

                      case 1:
                        if (yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                        if (yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 1), 
                        this.begin("emu");
                        if (yy_.yytext) return 14;
                        break;

                      case 2:
                        return 14;
                        break;

                      case 3:
                        if (yy_.yytext.slice(-1) !== "\\") this.popState();
                        if (yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 1);
                        return 14;
                        break;

                      case 4:
                        yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 4);
                        this.popState();
                        return 15;
                        break;

                      case 5:
                        this.begin("par");
                        return 24;
                        break;

                      case 6:
                        return 16;
                        break;

                      case 7:
                        return 20;
                        break;

                      case 8:
                        return 19;
                        break;

                      case 9:
                        return 19;
                        break;

                      case 10:
                        return 23;
                        break;

                      case 11:
                        return 23;
                        break;

                      case 12:
                        this.popState();
                        this.begin("com");
                        break;

                      case 13:
                        yy_.yytext = yy_.yytext.substr(3, yy_.yyleng - 5);
                        this.popState();
                        return 15;
                        break;

                      case 14:
                        return 22;
                        break;

                      case 15:
                        return 36;
                        break;

                      case 16:
                        return 35;
                        break;

                      case 17:
                        return 35;
                        break;

                      case 18:
                        return 39;
                        break;

                      case 19:
                        /*ignore whitespace*/
                        break;

                      case 20:
                        this.popState();
                        return 18;
                        break;

                      case 21:
                        this.popState();
                        return 18;
                        break;

                      case 22:
                        yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2).replace(/\\"/g, '"');
                        return 30;
                        break;

                      case 23:
                        yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2).replace(/\\'/g, "'");
                        return 30;
                        break;

                      case 24:
                        yy_.yytext = yy_.yytext.substr(1);
                        return 28;
                        break;

                      case 25:
                        return 32;
                        break;

                      case 26:
                        return 32;
                        break;

                      case 27:
                        return 31;
                        break;

                      case 28:
                        return 35;
                        break;

                      case 29:
                        yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2);
                        return 35;
                        break;

                      case 30:
                        return "INVALID";
                        break;

                      case 31:
                        /*ignore whitespace*/
                        break;

                      case 32:
                        this.popState();
                        return 37;
                        break;

                      case 33:
                        return 5;
                        break;
                    }
                };
                lexer.rules = [ /^(?:\\\\(?=(\{\{)))/, /^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|$)))/, /^(?:[\s\S]*?--\}\})/, /^(?:\{\{>)/, /^(?:\{\{#)/, /^(?:\{\{\/)/, /^(?:\{\{\^)/, /^(?:\{\{\s*else\b)/, /^(?:\{\{\{)/, /^(?:\{\{&)/, /^(?:\{\{!--)/, /^(?:\{\{![\s\S]*?\}\})/, /^(?:\{\{)/, /^(?:=)/, /^(?:\.(?=[}/ ]))/, /^(?:\.\.)/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}\}\})/, /^(?:\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@[a-zA-Z]+)/, /^(?:true(?=[}\s]))/, /^(?:false(?=[}\s]))/, /^(?:-?[0-9]+(?=[}\s]))/, /^(?:[a-zA-Z0-9_$:\-]+(?=[=}\s\/.]))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:\s+)/, /^(?:[a-zA-Z0-9_$\-\/]+)/, /^(?:$)/ ];
                lexer.conditions = {
                    mu: {
                        rules: [ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 33 ],
                        inclusive: false
                    },
                    emu: {
                        rules: [ 3 ],
                        inclusive: false
                    },
                    com: {
                        rules: [ 4 ],
                        inclusive: false
                    },
                    par: {
                        rules: [ 31, 32 ],
                        inclusive: false
                    },
                    INITIAL: {
                        rules: [ 0, 1, 2, 33 ],
                        inclusive: true
                    }
                };
                return lexer;
            }();
            parser.lexer = lexer;
            function Parser() {
                this.yy = {};
            }
            Parser.prototype = parser;
            parser.Parser = Parser;
            return new Parser();
        }();
        // lib/handlebars/compiler/base.js
        Handlebars.Parser = handlebars;
        Handlebars.parse = function(input) {
            // Just return if an already-compile AST was passed in.
            if (input.constructor === Handlebars.AST.ProgramNode) {
                return input;
            }
            Handlebars.Parser.yy = Handlebars.AST;
            return Handlebars.Parser.parse(input);
        };
        // lib/handlebars/compiler/ast.js
        Handlebars.AST = {};
        Handlebars.AST.ProgramNode = function(statements, inverse) {
            this.type = "program";
            this.statements = statements;
            if (inverse) {
                this.inverse = new Handlebars.AST.ProgramNode(inverse);
            }
        };
        Handlebars.AST.MustacheNode = function(rawParams, hash, unescaped) {
            this.type = "mustache";
            this.escaped = !unescaped;
            this.hash = hash;
            var id = this.id = rawParams[0];
            var params = this.params = rawParams.slice(1);
            // a mustache is an eligible helper if:
            // * its id is simple (a single part, not `this` or `..`)
            var eligibleHelper = this.eligibleHelper = id.isSimple;
            // a mustache is definitely a helper if:
            // * it is an eligible helper, and
            // * it has at least one parameter or hash segment
            this.isHelper = eligibleHelper && (params.length || hash);
        };
        Handlebars.AST.PartialNode = function(partialName, context) {
            this.type = "partial";
            this.partialName = partialName;
            this.context = context;
        };
        Handlebars.AST.BlockNode = function(mustache, program, inverse, close) {
            var verifyMatch = function(open, close) {
                if (open.original !== close.original) {
                    throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
                }
            };
            verifyMatch(mustache.id, close);
            this.type = "block";
            this.mustache = mustache;
            this.program = program;
            this.inverse = inverse;
            if (this.inverse && !this.program) {
                this.isInverse = true;
            }
        };
        Handlebars.AST.ContentNode = function(string) {
            this.type = "content";
            this.string = string;
        };
        Handlebars.AST.HashNode = function(pairs) {
            this.type = "hash";
            this.pairs = pairs;
        };
        Handlebars.AST.IdNode = function(parts) {
            this.type = "ID";
            this.original = parts.join(".");
            var dig = [], depth = 0;
            for (var i = 0, l = parts.length; i < l; i++) {
                var part = parts[i];
                if (part === ".." || part === "." || part === "this") {
                    if (dig.length > 0) {
                        throw new Handlebars.Exception("Invalid path: " + this.original);
                    } else if (part === "..") {
                        depth++;
                    } else {
                        this.isScoped = true;
                    }
                } else {
                    dig.push(part);
                }
            }
            this.parts = dig;
            this.string = dig.join(".");
            this.depth = depth;
            // an ID is simple if it only has one part, and that part is not
            // `..` or `this`.
            this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;
            this.stringModeValue = this.string;
        };
        Handlebars.AST.PartialNameNode = function(name) {
            this.type = "PARTIAL_NAME";
            this.name = name;
        };
        Handlebars.AST.DataNode = function(id) {
            this.type = "DATA";
            this.id = id;
        };
        Handlebars.AST.StringNode = function(string) {
            this.type = "STRING";
            this.string = string;
            this.stringModeValue = string;
        };
        Handlebars.AST.IntegerNode = function(integer) {
            this.type = "INTEGER";
            this.integer = integer;
            this.stringModeValue = Number(integer);
        };
        Handlebars.AST.BooleanNode = function(bool) {
            this.type = "BOOLEAN";
            this.bool = bool;
            this.stringModeValue = bool === "true";
        };
        Handlebars.AST.CommentNode = function(comment) {
            this.type = "comment";
            this.comment = comment;
        };
        // lib/handlebars/utils.js
        var errorProps = [ "description", "fileName", "lineNumber", "message", "name", "number", "stack" ];
        Handlebars.Exception = function(message) {
            var tmp = Error.prototype.constructor.apply(this, arguments);
            // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
            for (var idx = 0; idx < errorProps.length; idx++) {
                this[errorProps[idx]] = tmp[errorProps[idx]];
            }
        };
        Handlebars.Exception.prototype = new Error();
        // Build out our basic SafeString type
        Handlebars.SafeString = function(string) {
            this.string = string;
        };
        Handlebars.SafeString.prototype.toString = function() {
            return this.string.toString();
        };
        var escape = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        };
        var badChars = /[&<>"'`]/g;
        var possible = /[&<>"'`]/;
        var escapeChar = function(chr) {
            return escape[chr] || "&amp;";
        };
        Handlebars.Utils = {
            extend: function(obj, value) {
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        obj[key] = value[key];
                    }
                }
            },
            escapeExpression: function(string) {
                // don't escape SafeStrings, since they're already safe
                if (string instanceof Handlebars.SafeString) {
                    return string.toString();
                } else if (string == null || string === false) {
                    return "";
                }
                // Force a string conversion as this will be done by the append regardless and
                // the regex test will do this transparently behind the scenes, causing issues if
                // an object's to string has escaped characters in it.
                string = string.toString();
                if (!possible.test(string)) {
                    return string;
                }
                return string.replace(badChars, escapeChar);
            },
            isEmpty: function(value) {
                if (!value && value !== 0) {
                    return true;
                } else if (toString.call(value) === "[object Array]" && value.length === 0) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        // lib/handlebars/compiler/compiler.js
        /*jshint eqnull:true*/
        var Compiler = Handlebars.Compiler = function() {};
        var JavaScriptCompiler = Handlebars.JavaScriptCompiler = function() {};
        // the foundHelper register will disambiguate helper lookup from finding a
        // function in a context. This is necessary for mustache compatibility, which
        // requires that context functions in blocks are evaluated by blockHelperMissing,
        // and then proceed as if the resulting value was provided to blockHelperMissing.
        Compiler.prototype = {
            compiler: Compiler,
            disassemble: function() {
                var opcodes = this.opcodes, opcode, out = [], params, param;
                for (var i = 0, l = opcodes.length; i < l; i++) {
                    opcode = opcodes[i];
                    if (opcode.opcode === "DECLARE") {
                        out.push("DECLARE " + opcode.name + "=" + opcode.value);
                    } else {
                        params = [];
                        for (var j = 0; j < opcode.args.length; j++) {
                            param = opcode.args[j];
                            if (typeof param === "string") {
                                param = '"' + param.replace("\n", "\\n") + '"';
                            }
                            params.push(param);
                        }
                        out.push(opcode.opcode + " " + params.join(" "));
                    }
                }
                return out.join("\n");
            },
            equals: function(other) {
                var len = this.opcodes.length;
                if (other.opcodes.length !== len) {
                    return false;
                }
                for (var i = 0; i < len; i++) {
                    var opcode = this.opcodes[i], otherOpcode = other.opcodes[i];
                    if (opcode.opcode !== otherOpcode.opcode || opcode.args.length !== otherOpcode.args.length) {
                        return false;
                    }
                    for (var j = 0; j < opcode.args.length; j++) {
                        if (opcode.args[j] !== otherOpcode.args[j]) {
                            return false;
                        }
                    }
                }
                len = this.children.length;
                if (other.children.length !== len) {
                    return false;
                }
                for (i = 0; i < len; i++) {
                    if (!this.children[i].equals(other.children[i])) {
                        return false;
                    }
                }
                return true;
            },
            guid: 0,
            compile: function(program, options) {
                this.children = [];
                this.depths = {
                    list: []
                };
                this.options = options;
                // These changes will propagate to the other compiler components
                var knownHelpers = this.options.knownHelpers;
                this.options.knownHelpers = {
                    helperMissing: true,
                    blockHelperMissing: true,
                    each: true,
                    "if": true,
                    unless: true,
                    "with": true,
                    log: true
                };
                if (knownHelpers) {
                    for (var name in knownHelpers) {
                        this.options.knownHelpers[name] = knownHelpers[name];
                    }
                }
                return this.program(program);
            },
            accept: function(node) {
                return this[node.type](node);
            },
            program: function(program) {
                var statements = program.statements, statement;
                this.opcodes = [];
                for (var i = 0, l = statements.length; i < l; i++) {
                    statement = statements[i];
                    this[statement.type](statement);
                }
                this.isSimple = l === 1;
                this.depths.list = this.depths.list.sort(function(a, b) {
                    return a - b;
                });
                return this;
            },
            compileProgram: function(program) {
                var result = new this.compiler().compile(program, this.options);
                var guid = this.guid++, depth;
                this.usePartial = this.usePartial || result.usePartial;
                this.children[guid] = result;
                for (var i = 0, l = result.depths.list.length; i < l; i++) {
                    depth = result.depths.list[i];
                    if (depth < 2) {
                        continue;
                    } else {
                        this.addDepth(depth - 1);
                    }
                }
                return guid;
            },
            block: function(block) {
                var mustache = block.mustache, program = block.program, inverse = block.inverse;
                if (program) {
                    program = this.compileProgram(program);
                }
                if (inverse) {
                    inverse = this.compileProgram(inverse);
                }
                var type = this.classifyMustache(mustache);
                if (type === "helper") {
                    this.helperMustache(mustache, program, inverse);
                } else if (type === "simple") {
                    this.simpleMustache(mustache);
                    // now that the simple mustache is resolved, we need to
                    // evaluate it by executing `blockHelperMissing`
                    this.opcode("pushProgram", program);
                    this.opcode("pushProgram", inverse);
                    this.opcode("emptyHash");
                    this.opcode("blockValue");
                } else {
                    this.ambiguousMustache(mustache, program, inverse);
                    // now that the simple mustache is resolved, we need to
                    // evaluate it by executing `blockHelperMissing`
                    this.opcode("pushProgram", program);
                    this.opcode("pushProgram", inverse);
                    this.opcode("emptyHash");
                    this.opcode("ambiguousBlockValue");
                }
                this.opcode("append");
            },
            hash: function(hash) {
                var pairs = hash.pairs, pair, val;
                this.opcode("pushHash");
                for (var i = 0, l = pairs.length; i < l; i++) {
                    pair = pairs[i];
                    val = pair[1];
                    if (this.options.stringParams) {
                        if (val.depth) {
                            this.addDepth(val.depth);
                        }
                        this.opcode("getContext", val.depth || 0);
                        this.opcode("pushStringParam", val.stringModeValue, val.type);
                    } else {
                        this.accept(val);
                    }
                    this.opcode("assignToHash", pair[0]);
                }
                this.opcode("popHash");
            },
            partial: function(partial) {
                var partialName = partial.partialName;
                this.usePartial = true;
                if (partial.context) {
                    this.ID(partial.context);
                } else {
                    this.opcode("push", "depth0");
                }
                this.opcode("invokePartial", partialName.name);
                this.opcode("append");
            },
            content: function(content) {
                this.opcode("appendContent", content.string);
            },
            mustache: function(mustache) {
                var options = this.options;
                var type = this.classifyMustache(mustache);
                if (type === "simple") {
                    this.simpleMustache(mustache);
                } else if (type === "helper") {
                    this.helperMustache(mustache);
                } else {
                    this.ambiguousMustache(mustache);
                }
                if (mustache.escaped && !options.noEscape) {
                    this.opcode("appendEscaped");
                } else {
                    this.opcode("append");
                }
            },
            ambiguousMustache: function(mustache, program, inverse) {
                var id = mustache.id, name = id.parts[0], isBlock = program != null || inverse != null;
                this.opcode("getContext", id.depth);
                this.opcode("pushProgram", program);
                this.opcode("pushProgram", inverse);
                this.opcode("invokeAmbiguous", name, isBlock);
            },
            simpleMustache: function(mustache) {
                var id = mustache.id;
                if (id.type === "DATA") {
                    this.DATA(id);
                } else if (id.parts.length) {
                    this.ID(id);
                } else {
                    // Simplified ID for `this`
                    this.addDepth(id.depth);
                    this.opcode("getContext", id.depth);
                    this.opcode("pushContext");
                }
                this.opcode("resolvePossibleLambda");
            },
            helperMustache: function(mustache, program, inverse) {
                var params = this.setupFullMustacheParams(mustache, program, inverse), name = mustache.id.parts[0];
                if (this.options.knownHelpers[name]) {
                    this.opcode("invokeKnownHelper", params.length, name);
                } else if (this.options.knownHelpersOnly) {
                    throw new Error("You specified knownHelpersOnly, but used the unknown helper " + name);
                } else {
                    this.opcode("invokeHelper", params.length, name);
                }
            },
            ID: function(id) {
                this.addDepth(id.depth);
                this.opcode("getContext", id.depth);
                var name = id.parts[0];
                if (!name) {
                    this.opcode("pushContext");
                } else {
                    this.opcode("lookupOnContext", id.parts[0]);
                }
                for (var i = 1, l = id.parts.length; i < l; i++) {
                    this.opcode("lookup", id.parts[i]);
                }
            },
            DATA: function(data) {
                this.options.data = true;
                this.opcode("lookupData", data.id);
            },
            STRING: function(string) {
                this.opcode("pushString", string.string);
            },
            INTEGER: function(integer) {
                this.opcode("pushLiteral", integer.integer);
            },
            BOOLEAN: function(bool) {
                this.opcode("pushLiteral", bool.bool);
            },
            comment: function() {},
            // HELPERS
            opcode: function(name) {
                this.opcodes.push({
                    opcode: name,
                    args: [].slice.call(arguments, 1)
                });
            },
            declare: function(name, value) {
                this.opcodes.push({
                    opcode: "DECLARE",
                    name: name,
                    value: value
                });
            },
            addDepth: function(depth) {
                if (isNaN(depth)) {
                    throw new Error("EWOT");
                }
                if (depth === 0) {
                    return;
                }
                if (!this.depths[depth]) {
                    this.depths[depth] = true;
                    this.depths.list.push(depth);
                }
            },
            classifyMustache: function(mustache) {
                var isHelper = mustache.isHelper;
                var isEligible = mustache.eligibleHelper;
                var options = this.options;
                // if ambiguous, we can possibly resolve the ambiguity now
                if (isEligible && !isHelper) {
                    var name = mustache.id.parts[0];
                    if (options.knownHelpers[name]) {
                        isHelper = true;
                    } else if (options.knownHelpersOnly) {
                        isEligible = false;
                    }
                }
                if (isHelper) {
                    return "helper";
                } else if (isEligible) {
                    return "ambiguous";
                } else {
                    return "simple";
                }
            },
            pushParams: function(params) {
                var i = params.length, param;
                while (i--) {
                    param = params[i];
                    if (this.options.stringParams) {
                        if (param.depth) {
                            this.addDepth(param.depth);
                        }
                        this.opcode("getContext", param.depth || 0);
                        this.opcode("pushStringParam", param.stringModeValue, param.type);
                    } else {
                        this[param.type](param);
                    }
                }
            },
            setupMustacheParams: function(mustache) {
                var params = mustache.params;
                this.pushParams(params);
                if (mustache.hash) {
                    this.hash(mustache.hash);
                } else {
                    this.opcode("emptyHash");
                }
                return params;
            },
            // this will replace setupMustacheParams when we're done
            setupFullMustacheParams: function(mustache, program, inverse) {
                var params = mustache.params;
                this.pushParams(params);
                this.opcode("pushProgram", program);
                this.opcode("pushProgram", inverse);
                if (mustache.hash) {
                    this.hash(mustache.hash);
                } else {
                    this.opcode("emptyHash");
                }
                return params;
            }
        };
        var Literal = function(value) {
            this.value = value;
        };
        JavaScriptCompiler.prototype = {
            // PUBLIC API: You can override these methods in a subclass to provide
            // alternative compiled forms for name lookup and buffering semantics
            nameLookup: function(parent, name) {
                if (/^[0-9]+$/.test(name)) {
                    return parent + "[" + name + "]";
                } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
                    return parent + "." + name;
                } else {
                    return parent + "['" + name + "']";
                }
            },
            appendToBuffer: function(string) {
                if (this.environment.isSimple) {
                    return "return " + string + ";";
                } else {
                    return {
                        appendToBuffer: true,
                        content: string,
                        toString: function() {
                            return "buffer += " + string + ";";
                        }
                    };
                }
            },
            initializeBuffer: function() {
                return this.quotedString("");
            },
            namespace: "Handlebars",
            // END PUBLIC API
            compile: function(environment, options, context, asObject) {
                this.environment = environment;
                this.options = options || {};
                Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n");
                this.name = this.environment.name;
                this.isChild = !!context;
                this.context = context || {
                    programs: [],
                    environments: [],
                    aliases: {}
                };
                this.preamble();
                this.stackSlot = 0;
                this.stackVars = [];
                this.registers = {
                    list: []
                };
                this.compileStack = [];
                this.inlineStack = [];
                this.compileChildren(environment, options);
                var opcodes = environment.opcodes, opcode;
                this.i = 0;
                for (l = opcodes.length; this.i < l; this.i++) {
                    opcode = opcodes[this.i];
                    if (opcode.opcode === "DECLARE") {
                        this[opcode.name] = opcode.value;
                    } else {
                        this[opcode.opcode].apply(this, opcode.args);
                    }
                }
                return this.createFunctionContext(asObject);
            },
            nextOpcode: function() {
                var opcodes = this.environment.opcodes;
                return opcodes[this.i + 1];
            },
            eat: function() {
                this.i = this.i + 1;
            },
            preamble: function() {
                var out = [];
                if (!this.isChild) {
                    var namespace = this.namespace;
                    var copies = "helpers = helpers || " + namespace + ".helpers;";
                    if (this.environment.usePartial) {
                        copies = copies + " partials = partials || " + namespace + ".partials;";
                    }
                    if (this.options.data) {
                        copies = copies + " data = data || {};";
                    }
                    out.push(copies);
                } else {
                    out.push("");
                }
                if (!this.environment.isSimple) {
                    out.push(", buffer = " + this.initializeBuffer());
                } else {
                    out.push("");
                }
                // track the last context pushed into place to allow skipping the
                // getContext opcode when it would be a noop
                this.lastContext = 0;
                this.source = out;
            },
            createFunctionContext: function(asObject) {
                var locals = this.stackVars.concat(this.registers.list);
                if (locals.length > 0) {
                    this.source[1] = this.source[1] + ", " + locals.join(", ");
                }
                // Generate minimizer alias mappings
                if (!this.isChild) {
                    for (var alias in this.context.aliases) {
                        this.source[1] = this.source[1] + ", " + alias + "=" + this.context.aliases[alias];
                    }
                }
                if (this.source[1]) {
                    this.source[1] = "var " + this.source[1].substring(2) + ";";
                }
                // Merge children
                if (!this.isChild) {
                    this.source[1] += "\n" + this.context.programs.join("\n") + "\n";
                }
                if (!this.environment.isSimple) {
                    this.source.push("return buffer;");
                }
                var params = this.isChild ? [ "depth0", "data" ] : [ "Handlebars", "depth0", "helpers", "partials", "data" ];
                for (var i = 0, l = this.environment.depths.list.length; i < l; i++) {
                    params.push("depth" + this.environment.depths.list[i]);
                }
                // Perform a second pass over the output to merge content when possible
                var source = this.mergeSource();
                if (!this.isChild) {
                    var revision = Handlebars.COMPILER_REVISION, versions = Handlebars.REVISION_CHANGES[revision];
                    source = "this.compilerInfo = [" + revision + ",'" + versions + "'];\n" + source;
                }
                if (asObject) {
                    params.push(source);
                    return Function.apply(this, params);
                } else {
                    var functionSource = "function " + (this.name || "") + "(" + params.join(",") + ") {\n  " + source + "}";
                    Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
                    return functionSource;
                }
            },
            mergeSource: function() {
                // WARN: We are not handling the case where buffer is still populated as the source should
                // not have buffer append operations as their final action.
                var source = "", buffer;
                for (var i = 0, len = this.source.length; i < len; i++) {
                    var line = this.source[i];
                    if (line.appendToBuffer) {
                        if (buffer) {
                            buffer = buffer + "\n    + " + line.content;
                        } else {
                            buffer = line.content;
                        }
                    } else {
                        if (buffer) {
                            source += "buffer += " + buffer + ";\n  ";
                            buffer = undefined;
                        }
                        source += line + "\n  ";
                    }
                }
                return source;
            },
            // [blockValue]
            //
            // On stack, before: hash, inverse, program, value
            // On stack, after: return value of blockHelperMissing
            //
            // The purpose of this opcode is to take a block of the form
            // `{{#foo}}...{{/foo}}`, resolve the value of `foo`, and
            // replace it on the stack with the result of properly
            // invoking blockHelperMissing.
            blockValue: function() {
                this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
                var params = [ "depth0" ];
                this.setupParams(0, params);
                this.replaceStack(function(current) {
                    params.splice(1, 0, current);
                    return "blockHelperMissing.call(" + params.join(", ") + ")";
                });
            },
            // [ambiguousBlockValue]
            //
            // On stack, before: hash, inverse, program, value
            // Compiler value, before: lastHelper=value of last found helper, if any
            // On stack, after, if no lastHelper: same as [blockValue]
            // On stack, after, if lastHelper: value
            ambiguousBlockValue: function() {
                this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
                var params = [ "depth0" ];
                this.setupParams(0, params);
                var current = this.topStack();
                params.splice(1, 0, current);
                // Use the options value generated from the invocation
                params[params.length - 1] = "options";
                this.source.push("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
            },
            // [appendContent]
            //
            // On stack, before: ...
            // On stack, after: ...
            //
            // Appends the string value of `content` to the current buffer
            appendContent: function(content) {
                this.source.push(this.appendToBuffer(this.quotedString(content)));
            },
            // [append]
            //
            // On stack, before: value, ...
            // On stack, after: ...
            //
            // Coerces `value` to a String and appends it to the current buffer.
            //
            // If `value` is truthy, or 0, it is coerced into a string and appended
            // Otherwise, the empty string is appended
            append: function() {
                // Force anything that is inlined onto the stack so we don't have duplication
                // when we examine local
                this.flushInline();
                var local = this.popStack();
                this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
                if (this.environment.isSimple) {
                    this.source.push("else { " + this.appendToBuffer("''") + " }");
                }
            },
            // [appendEscaped]
            //
            // On stack, before: value, ...
            // On stack, after: ...
            //
            // Escape `value` and append it to the buffer
            appendEscaped: function() {
                this.context.aliases.escapeExpression = "this.escapeExpression";
                this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"));
            },
            // [getContext]
            //
            // On stack, before: ...
            // On stack, after: ...
            // Compiler value, after: lastContext=depth
            //
            // Set the value of the `lastContext` compiler value to the depth
            getContext: function(depth) {
                if (this.lastContext !== depth) {
                    this.lastContext = depth;
                }
            },
            // [lookupOnContext]
            //
            // On stack, before: ...
            // On stack, after: currentContext[name], ...
            //
            // Looks up the value of `name` on the current context and pushes
            // it onto the stack.
            lookupOnContext: function(name) {
                this.push(this.nameLookup("depth" + this.lastContext, name, "context"));
            },
            // [pushContext]
            //
            // On stack, before: ...
            // On stack, after: currentContext, ...
            //
            // Pushes the value of the current context onto the stack.
            pushContext: function() {
                this.pushStackLiteral("depth" + this.lastContext);
            },
            // [resolvePossibleLambda]
            //
            // On stack, before: value, ...
            // On stack, after: resolved value, ...
            //
            // If the `value` is a lambda, replace it on the stack by
            // the return value of the lambda
            resolvePossibleLambda: function() {
                this.context.aliases.functionType = '"function"';
                this.replaceStack(function(current) {
                    return "typeof " + current + " === functionType ? " + current + ".apply(depth0) : " + current;
                });
            },
            // [lookup]
            //
            // On stack, before: value, ...
            // On stack, after: value[name], ...
            //
            // Replace the value on the stack with the result of looking
            // up `name` on `value`
            lookup: function(name) {
                this.replaceStack(function(current) {
                    return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, "context");
                });
            },
            // [lookupData]
            //
            // On stack, before: ...
            // On stack, after: data[id], ...
            //
            // Push the result of looking up `id` on the current data
            lookupData: function(id) {
                this.push(this.nameLookup("data", id, "data"));
            },
            // [pushStringParam]
            //
            // On stack, before: ...
            // On stack, after: string, currentContext, ...
            //
            // This opcode is designed for use in string mode, which
            // provides the string value of a parameter along with its
            // depth rather than resolving it immediately.
            pushStringParam: function(string, type) {
                this.pushStackLiteral("depth" + this.lastContext);
                this.pushString(type);
                if (typeof string === "string") {
                    this.pushString(string);
                } else {
                    this.pushStackLiteral(string);
                }
            },
            emptyHash: function() {
                this.pushStackLiteral("{}");
                if (this.options.stringParams) {
                    this.register("hashTypes", "{}");
                    this.register("hashContexts", "{}");
                }
            },
            pushHash: function() {
                this.hash = {
                    values: [],
                    types: [],
                    contexts: []
                };
            },
            popHash: function() {
                var hash = this.hash;
                this.hash = undefined;
                if (this.options.stringParams) {
                    this.register("hashContexts", "{" + hash.contexts.join(",") + "}");
                    this.register("hashTypes", "{" + hash.types.join(",") + "}");
                }
                this.push("{\n    " + hash.values.join(",\n    ") + "\n  }");
            },
            // [pushString]
            //
            // On stack, before: ...
            // On stack, after: quotedString(string), ...
            //
            // Push a quoted version of `string` onto the stack
            pushString: function(string) {
                this.pushStackLiteral(this.quotedString(string));
            },
            // [push]
            //
            // On stack, before: ...
            // On stack, after: expr, ...
            //
            // Push an expression onto the stack
            push: function(expr) {
                this.inlineStack.push(expr);
                return expr;
            },
            // [pushLiteral]
            //
            // On stack, before: ...
            // On stack, after: value, ...
            //
            // Pushes a value onto the stack. This operation prevents
            // the compiler from creating a temporary variable to hold
            // it.
            pushLiteral: function(value) {
                this.pushStackLiteral(value);
            },
            // [pushProgram]
            //
            // On stack, before: ...
            // On stack, after: program(guid), ...
            //
            // Push a program expression onto the stack. This takes
            // a compile-time guid and converts it into a runtime-accessible
            // expression.
            pushProgram: function(guid) {
                if (guid != null) {
                    this.pushStackLiteral(this.programExpression(guid));
                } else {
                    this.pushStackLiteral(null);
                }
            },
            // [invokeHelper]
            //
            // On stack, before: hash, inverse, program, params..., ...
            // On stack, after: result of helper invocation
            //
            // Pops off the helper's parameters, invokes the helper,
            // and pushes the helper's return value onto the stack.
            //
            // If the helper is not found, `helperMissing` is called.
            invokeHelper: function(paramSize, name) {
                this.context.aliases.helperMissing = "helpers.helperMissing";
                var helper = this.lastHelper = this.setupHelper(paramSize, name, true);
                this.push(helper.name);
                this.replaceStack(function(name) {
                    return name + " ? " + name + ".call(" + helper.callParams + ") " + ": helperMissing.call(" + helper.helperMissingParams + ")";
                });
            },
            // [invokeKnownHelper]
            //
            // On stack, before: hash, inverse, program, params..., ...
            // On stack, after: result of helper invocation
            //
            // This operation is used when the helper is known to exist,
            // so a `helperMissing` fallback is not required.
            invokeKnownHelper: function(paramSize, name) {
                var helper = this.setupHelper(paramSize, name);
                this.push(helper.name + ".call(" + helper.callParams + ")");
            },
            // [invokeAmbiguous]
            //
            // On stack, before: hash, inverse, program, params..., ...
            // On stack, after: result of disambiguation
            //
            // This operation is used when an expression like `{{foo}}`
            // is provided, but we don't know at compile-time whether it
            // is a helper or a path.
            //
            // This operation emits more code than the other options,
            // and can be avoided by passing the `knownHelpers` and
            // `knownHelpersOnly` flags at compile-time.
            invokeAmbiguous: function(name, helperCall) {
                this.context.aliases.functionType = '"function"';
                this.pushStackLiteral("{}");
                // Hash value
                var helper = this.setupHelper(0, name, helperCall);
                var helperName = this.lastHelper = this.nameLookup("helpers", name, "helper");
                var nonHelper = this.nameLookup("depth" + this.lastContext, name, "context");
                var nextStack = this.nextStack();
                this.source.push("if (" + nextStack + " = " + helperName + ") { " + nextStack + " = " + nextStack + ".call(" + helper.callParams + "); }");
                this.source.push("else { " + nextStack + " = " + nonHelper + "; " + nextStack + " = typeof " + nextStack + " === functionType ? " + nextStack + ".apply(depth0) : " + nextStack + "; }");
            },
            // [invokePartial]
            //
            // On stack, before: context, ...
            // On stack after: result of partial invocation
            //
            // This operation pops off a context, invokes a partial with that context,
            // and pushes the result of the invocation back.
            invokePartial: function(name) {
                var params = [ this.nameLookup("partials", name, "partial"), "'" + name + "'", this.popStack(), "helpers", "partials" ];
                if (this.options.data) {
                    params.push("data");
                }
                this.context.aliases.self = "this";
                this.push("self.invokePartial(" + params.join(", ") + ")");
            },
            // [assignToHash]
            //
            // On stack, before: value, hash, ...
            // On stack, after: hash, ...
            //
            // Pops a value and hash off the stack, assigns `hash[key] = value`
            // and pushes the hash back onto the stack.
            assignToHash: function(key) {
                var value = this.popStack(), context, type;
                if (this.options.stringParams) {
                    type = this.popStack();
                    context = this.popStack();
                }
                var hash = this.hash;
                if (context) {
                    hash.contexts.push("'" + key + "': " + context);
                }
                if (type) {
                    hash.types.push("'" + key + "': " + type);
                }
                hash.values.push("'" + key + "': (" + value + ")");
            },
            // HELPERS
            compiler: JavaScriptCompiler,
            compileChildren: function(environment, options) {
                var children = environment.children, child, compiler;
                for (var i = 0, l = children.length; i < l; i++) {
                    child = children[i];
                    compiler = new this.compiler();
                    var index = this.matchExistingProgram(child);
                    if (index == null) {
                        this.context.programs.push("");
                        // Placeholder to prevent name conflicts for nested children
                        index = this.context.programs.length;
                        child.index = index;
                        child.name = "program" + index;
                        this.context.programs[index] = compiler.compile(child, options, this.context);
                        this.context.environments[index] = child;
                    } else {
                        child.index = index;
                        child.name = "program" + index;
                    }
                }
            },
            matchExistingProgram: function(child) {
                for (var i = 0, len = this.context.environments.length; i < len; i++) {
                    var environment = this.context.environments[i];
                    if (environment && environment.equals(child)) {
                        return i;
                    }
                }
            },
            programExpression: function(guid) {
                this.context.aliases.self = "this";
                if (guid == null) {
                    return "self.noop";
                }
                var child = this.environment.children[guid], depths = child.depths.list, depth;
                var programParams = [ child.index, child.name, "data" ];
                for (var i = 0, l = depths.length; i < l; i++) {
                    depth = depths[i];
                    if (depth === 1) {
                        programParams.push("depth0");
                    } else {
                        programParams.push("depth" + (depth - 1));
                    }
                }
                return (depths.length === 0 ? "self.program(" : "self.programWithDepth(") + programParams.join(", ") + ")";
            },
            register: function(name, val) {
                this.useRegister(name);
                this.source.push(name + " = " + val + ";");
            },
            useRegister: function(name) {
                if (!this.registers[name]) {
                    this.registers[name] = true;
                    this.registers.list.push(name);
                }
            },
            pushStackLiteral: function(item) {
                return this.push(new Literal(item));
            },
            pushStack: function(item) {
                this.flushInline();
                var stack = this.incrStack();
                if (item) {
                    this.source.push(stack + " = " + item + ";");
                }
                this.compileStack.push(stack);
                return stack;
            },
            replaceStack: function(callback) {
                var prefix = "", inline = this.isInline(), stack;
                // If we are currently inline then we want to merge the inline statement into the
                // replacement statement via ','
                if (inline) {
                    var top = this.popStack(true);
                    if (top instanceof Literal) {
                        // Literals do not need to be inlined
                        stack = top.value;
                    } else {
                        // Get or create the current stack name for use by the inline
                        var name = this.stackSlot ? this.topStackName() : this.incrStack();
                        prefix = "(" + this.push(name) + " = " + top + "),";
                        stack = this.topStack();
                    }
                } else {
                    stack = this.topStack();
                }
                var item = callback.call(this, stack);
                if (inline) {
                    if (this.inlineStack.length || this.compileStack.length) {
                        this.popStack();
                    }
                    this.push("(" + prefix + item + ")");
                } else {
                    // Prevent modification of the context depth variable. Through replaceStack
                    if (!/^stack/.test(stack)) {
                        stack = this.nextStack();
                    }
                    this.source.push(stack + " = (" + prefix + item + ");");
                }
                return stack;
            },
            nextStack: function() {
                return this.pushStack();
            },
            incrStack: function() {
                this.stackSlot++;
                if (this.stackSlot > this.stackVars.length) {
                    this.stackVars.push("stack" + this.stackSlot);
                }
                return this.topStackName();
            },
            topStackName: function() {
                return "stack" + this.stackSlot;
            },
            flushInline: function() {
                var inlineStack = this.inlineStack;
                if (inlineStack.length) {
                    this.inlineStack = [];
                    for (var i = 0, len = inlineStack.length; i < len; i++) {
                        var entry = inlineStack[i];
                        if (entry instanceof Literal) {
                            this.compileStack.push(entry);
                        } else {
                            this.pushStack(entry);
                        }
                    }
                }
            },
            isInline: function() {
                return this.inlineStack.length;
            },
            popStack: function(wrapped) {
                var inline = this.isInline(), item = (inline ? this.inlineStack : this.compileStack).pop();
                if (!wrapped && item instanceof Literal) {
                    return item.value;
                } else {
                    if (!inline) {
                        this.stackSlot--;
                    }
                    return item;
                }
            },
            topStack: function(wrapped) {
                var stack = this.isInline() ? this.inlineStack : this.compileStack, item = stack[stack.length - 1];
                if (!wrapped && item instanceof Literal) {
                    return item.value;
                } else {
                    return item;
                }
            },
            quotedString: function(str) {
                return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") + '"';
            },
            setupHelper: function(paramSize, name, missingParams) {
                var params = [];
                this.setupParams(paramSize, params, missingParams);
                var foundHelper = this.nameLookup("helpers", name, "helper");
                return {
                    params: params,
                    name: foundHelper,
                    callParams: [ "depth0" ].concat(params).join(", "),
                    helperMissingParams: missingParams && [ "depth0", this.quotedString(name) ].concat(params).join(", ")
                };
            },
            // the params and contexts arguments are passed in arrays
            // to fill in
            setupParams: function(paramSize, params, useRegister) {
                var options = [], contexts = [], types = [], param, inverse, program;
                options.push("hash:" + this.popStack());
                inverse = this.popStack();
                program = this.popStack();
                // Avoid setting fn and inverse if neither are set. This allows
                // helpers to do a check for `if (options.fn)`
                if (program || inverse) {
                    if (!program) {
                        this.context.aliases.self = "this";
                        program = "self.noop";
                    }
                    if (!inverse) {
                        this.context.aliases.self = "this";
                        inverse = "self.noop";
                    }
                    options.push("inverse:" + inverse);
                    options.push("fn:" + program);
                }
                for (var i = 0; i < paramSize; i++) {
                    param = this.popStack();
                    params.push(param);
                    if (this.options.stringParams) {
                        types.push(this.popStack());
                        contexts.push(this.popStack());
                    }
                }
                if (this.options.stringParams) {
                    options.push("contexts:[" + contexts.join(",") + "]");
                    options.push("types:[" + types.join(",") + "]");
                    options.push("hashContexts:hashContexts");
                    options.push("hashTypes:hashTypes");
                }
                if (this.options.data) {
                    options.push("data:data");
                }
                options = "{" + options.join(",") + "}";
                if (useRegister) {
                    this.register("options", options);
                    params.push("options");
                } else {
                    params.push(options);
                }
                return params.join(", ");
            }
        };
        var reservedWords = ("break else new var" + " case finally return void" + " catch for switch while" + " continue function this with" + " default if throw" + " delete in try" + " do instanceof typeof" + " abstract enum int short" + " boolean export interface static" + " byte extends long super" + " char final native synchronized" + " class float package throws" + " const goto private transient" + " debugger implements protected volatile" + " double import public let yield").split(" ");
        var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};
        for (var i = 0, l = reservedWords.length; i < l; i++) {
            compilerWords[reservedWords[i]] = true;
        }
        JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
            if (!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
                return true;
            }
            return false;
        };
        Handlebars.precompile = function(input, options) {
            if (input == null || typeof input !== "string" && input.constructor !== Handlebars.AST.ProgramNode) {
                throw new Handlebars.Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
            }
            options = options || {};
            if (!("data" in options)) {
                options.data = true;
            }
            var ast = Handlebars.parse(input);
            var environment = new Compiler().compile(ast, options);
            return new JavaScriptCompiler().compile(environment, options);
        };
        Handlebars.compile = function(input, options) {
            if (input == null || typeof input !== "string" && input.constructor !== Handlebars.AST.ProgramNode) {
                throw new Handlebars.Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
            }
            options = options || {};
            if (!("data" in options)) {
                options.data = true;
            }
            var compiled;
            function compile() {
                var ast = Handlebars.parse(input);
                var environment = new Compiler().compile(ast, options);
                var templateSpec = new JavaScriptCompiler().compile(environment, options, undefined, true);
                return Handlebars.template(templateSpec);
            }
            // Template is only compiled on first use and cached after that point.
            return function(context, options) {
                if (!compiled) {
                    compiled = compile();
                }
                return compiled.call(this, context, options);
            };
        };
        // lib/handlebars/runtime.js
        Handlebars.VM = {
            template: function(templateSpec) {
                // Just add water
                var container = {
                    escapeExpression: Handlebars.Utils.escapeExpression,
                    invokePartial: Handlebars.VM.invokePartial,
                    programs: [],
                    program: function(i, fn, data) {
                        var programWrapper = this.programs[i];
                        if (data) {
                            programWrapper = Handlebars.VM.program(i, fn, data);
                        } else if (!programWrapper) {
                            programWrapper = this.programs[i] = Handlebars.VM.program(i, fn);
                        }
                        return programWrapper;
                    },
                    programWithDepth: Handlebars.VM.programWithDepth,
                    noop: Handlebars.VM.noop,
                    compilerInfo: null
                };
                return function(context, options) {
                    options = options || {};
                    var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
                    var compilerInfo = container.compilerInfo || [], compilerRevision = compilerInfo[0] || 1, currentRevision = Handlebars.COMPILER_REVISION;
                    if (compilerRevision !== currentRevision) {
                        if (compilerRevision < currentRevision) {
                            var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision], compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
                            throw "Template was precompiled with an older version of Handlebars than the current runtime. " + "Please update your precompiler to a newer version (" + runtimeVersions + ") or downgrade your runtime to an older version (" + compilerVersions + ").";
                        } else {
                            // Use the embedded version info since the runtime doesn't know about this revision yet
                            throw "Template was precompiled with a newer version of Handlebars than the current runtime. " + "Please update your runtime to a newer version (" + compilerInfo[1] + ").";
                        }
                    }
                    return result;
                };
            },
            programWithDepth: function(i, fn, data) {
                var args = Array.prototype.slice.call(arguments, 3);
                var program = function(context, options) {
                    options = options || {};
                    return fn.apply(this, [ context, options.data || data ].concat(args));
                };
                program.program = i;
                program.depth = args.length;
                return program;
            },
            program: function(i, fn, data) {
                var program = function(context, options) {
                    options = options || {};
                    return fn(context, options.data || data);
                };
                program.program = i;
                program.depth = 0;
                return program;
            },
            noop: function() {
                return "";
            },
            invokePartial: function(partial, name, context, helpers, partials, data) {
                var options = {
                    helpers: helpers,
                    partials: partials,
                    data: data
                };
                if (partial === undefined) {
                    throw new Handlebars.Exception("The partial " + name + " could not be found");
                } else if (partial instanceof Function) {
                    return partial(context, options);
                } else if (!Handlebars.compile) {
                    throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
                } else {
                    partials[name] = Handlebars.compile(partial, {
                        data: data !== undefined
                    });
                    return partials[name](context, options);
                }
            }
        };
        Handlebars.template = Handlebars.VM.template;
    })(Handlebars);
    module.exports = Handlebars;
});

define("gallery/handlebars/1.0.2/runtime-debug", [], function(require, exports, module) {
    /*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
    // lib/handlebars/browser-prefix.js
    var Handlebars = {};
    (function(Handlebars, undefined) {
        // lib/handlebars/base.js
        Handlebars.VERSION = "1.0.0-rc.4";
        Handlebars.COMPILER_REVISION = 3;
        Handlebars.REVISION_CHANGES = {
            1: "<= 1.0.rc.2",
            // 1.0.rc.2 is actually rev2 but doesn't report it
            2: "== 1.0.0-rc.3",
            3: ">= 1.0.0-rc.4"
        };
        Handlebars.helpers = {};
        Handlebars.partials = {};
        var toString = Object.prototype.toString, functionType = "[object Function]", objectType = "[object Object]";
        Handlebars.registerHelper = function(name, fn, inverse) {
            if (toString.call(name) === objectType) {
                if (inverse || fn) {
                    throw new Handlebars.Exception("Arg not supported with multiple helpers");
                }
                Handlebars.Utils.extend(this.helpers, name);
            } else {
                if (inverse) {
                    fn.not = inverse;
                }
                this.helpers[name] = fn;
            }
        };
        Handlebars.registerPartial = function(name, str) {
            if (toString.call(name) === objectType) {
                Handlebars.Utils.extend(this.partials, name);
            } else {
                this.partials[name] = str;
            }
        };
        Handlebars.registerHelper("helperMissing", function(arg) {
            if (arguments.length === 2) {
                return undefined;
            } else {
                throw new Error("Could not find property '" + arg + "'");
            }
        });
        Handlebars.registerHelper("blockHelperMissing", function(context, options) {
            var inverse = options.inverse || function() {}, fn = options.fn;
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this);
            }
            if (context === true) {
                return fn(this);
            } else if (context === false || context == null) {
                return inverse(this);
            } else if (type === "[object Array]") {
                if (context.length > 0) {
                    return Handlebars.helpers.each(context, options);
                } else {
                    return inverse(this);
                }
            } else {
                return fn(context);
            }
        });
        Handlebars.K = function() {};
        Handlebars.createFrame = Object.create || function(object) {
            Handlebars.K.prototype = object;
            var obj = new Handlebars.K();
            Handlebars.K.prototype = null;
            return obj;
        };
        Handlebars.logger = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            level: 3,
            methodMap: {
                0: "debug",
                1: "info",
                2: "warn",
                3: "error"
            },
            // can be overridden in the host environment
            log: function(level, obj) {
                if (Handlebars.logger.level <= level) {
                    var method = Handlebars.logger.methodMap[level];
                    if (typeof console !== "undefined" && console[method]) {
                        console[method].call(console, obj);
                    }
                }
            }
        };
        Handlebars.log = function(level, obj) {
            Handlebars.logger.log(level, obj);
        };
        Handlebars.registerHelper("each", function(context, options) {
            var fn = options.fn, inverse = options.inverse;
            var i = 0, ret = "", data;
            if (options.data) {
                data = Handlebars.createFrame(options.data);
            }
            if (context && typeof context === "object") {
                if (context instanceof Array) {
                    for (var j = context.length; i < j; i++) {
                        if (data) {
                            data.index = i;
                        }
                        ret = ret + fn(context[i], {
                            data: data
                        });
                    }
                } else {
                    for (var key in context) {
                        if (context.hasOwnProperty(key)) {
                            if (data) {
                                data.key = key;
                            }
                            ret = ret + fn(context[key], {
                                data: data
                            });
                            i++;
                        }
                    }
                }
            }
            if (i === 0) {
                ret = inverse(this);
            }
            return ret;
        });
        Handlebars.registerHelper("if", function(context, options) {
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this);
            }
            if (!context || Handlebars.Utils.isEmpty(context)) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        });
        Handlebars.registerHelper("unless", function(context, options) {
            return Handlebars.helpers["if"].call(this, context, {
                fn: options.inverse,
                inverse: options.fn
            });
        });
        Handlebars.registerHelper("with", function(context, options) {
            if (!Handlebars.Utils.isEmpty(context)) return options.fn(context);
        });
        Handlebars.registerHelper("log", function(context, options) {
            var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
            Handlebars.log(level, context);
        });
        // lib/handlebars/utils.js
        var errorProps = [ "description", "fileName", "lineNumber", "message", "name", "number", "stack" ];
        Handlebars.Exception = function(message) {
            var tmp = Error.prototype.constructor.apply(this, arguments);
            // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
            for (var idx = 0; idx < errorProps.length; idx++) {
                this[errorProps[idx]] = tmp[errorProps[idx]];
            }
        };
        Handlebars.Exception.prototype = new Error();
        // Build out our basic SafeString type
        Handlebars.SafeString = function(string) {
            this.string = string;
        };
        Handlebars.SafeString.prototype.toString = function() {
            return this.string.toString();
        };
        var escape = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        };
        var badChars = /[&<>"'`]/g;
        var possible = /[&<>"'`]/;
        var escapeChar = function(chr) {
            return escape[chr] || "&amp;";
        };
        Handlebars.Utils = {
            extend: function(obj, value) {
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        obj[key] = value[key];
                    }
                }
            },
            escapeExpression: function(string) {
                // don't escape SafeStrings, since they're already safe
                if (string instanceof Handlebars.SafeString) {
                    return string.toString();
                } else if (string == null || string === false) {
                    return "";
                }
                // Force a string conversion as this will be done by the append regardless and
                // the regex test will do this transparently behind the scenes, causing issues if
                // an object's to string has escaped characters in it.
                string = string.toString();
                if (!possible.test(string)) {
                    return string;
                }
                return string.replace(badChars, escapeChar);
            },
            isEmpty: function(value) {
                if (!value && value !== 0) {
                    return true;
                } else if (toString.call(value) === "[object Array]" && value.length === 0) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        // lib/handlebars/runtime.js
        Handlebars.VM = {
            template: function(templateSpec) {
                // Just add water
                var container = {
                    escapeExpression: Handlebars.Utils.escapeExpression,
                    invokePartial: Handlebars.VM.invokePartial,
                    programs: [],
                    program: function(i, fn, data) {
                        var programWrapper = this.programs[i];
                        if (data) {
                            programWrapper = Handlebars.VM.program(i, fn, data);
                        } else if (!programWrapper) {
                            programWrapper = this.programs[i] = Handlebars.VM.program(i, fn);
                        }
                        return programWrapper;
                    },
                    programWithDepth: Handlebars.VM.programWithDepth,
                    noop: Handlebars.VM.noop,
                    compilerInfo: null
                };
                return function(context, options) {
                    options = options || {};
                    var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
                    var compilerInfo = container.compilerInfo || [], compilerRevision = compilerInfo[0] || 1, currentRevision = Handlebars.COMPILER_REVISION;
                    if (compilerRevision !== currentRevision) {
                        if (compilerRevision < currentRevision) {
                            var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision], compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
                            throw "Template was precompiled with an older version of Handlebars than the current runtime. " + "Please update your precompiler to a newer version (" + runtimeVersions + ") or downgrade your runtime to an older version (" + compilerVersions + ").";
                        } else {
                            // Use the embedded version info since the runtime doesn't know about this revision yet
                            throw "Template was precompiled with a newer version of Handlebars than the current runtime. " + "Please update your runtime to a newer version (" + compilerInfo[1] + ").";
                        }
                    }
                    return result;
                };
            },
            programWithDepth: function(i, fn, data) {
                var args = Array.prototype.slice.call(arguments, 3);
                var program = function(context, options) {
                    options = options || {};
                    return fn.apply(this, [ context, options.data || data ].concat(args));
                };
                program.program = i;
                program.depth = args.length;
                return program;
            },
            program: function(i, fn, data) {
                var program = function(context, options) {
                    options = options || {};
                    return fn(context, options.data || data);
                };
                program.program = i;
                program.depth = 0;
                return program;
            },
            noop: function() {
                return "";
            },
            invokePartial: function(partial, name, context, helpers, partials, data) {
                var options = {
                    helpers: helpers,
                    partials: partials,
                    data: data
                };
                if (partial === undefined) {
                    throw new Handlebars.Exception("The partial " + name + " could not be found");
                } else if (partial instanceof Function) {
                    return partial(context, options);
                } else if (!Handlebars.compile) {
                    throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
                } else {
                    partials[name] = Handlebars.compile(partial, {
                        data: data !== undefined
                    });
                    return partials[name](context, options);
                }
            }
        };
        Handlebars.template = Handlebars.VM.template;
    })(Handlebars);
    module.exports = Handlebars;
});

define("app/common/dialog/confirmbox-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n        <div class="';
            if (stack1 = helpers.classPrefix) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.classPrefix;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '-header">\n            <h2 class="tit">';
            if (stack1 = helpers.title) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.title;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</h2>\n        </div>\n    ";
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n        <div class="';
            if (stack1 = helpers.classPrefix) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.classPrefix;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '-footer" data-role="foot">\n            ';
            stack1 = helpers["if"].call(depth0, depth0.cancelTpl, {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n            ";
            stack1 = helpers["if"].call(depth0, depth0.confirmTpl, {
                hash: {},
                inverse: self.noop,
                fn: self.program(6, program6, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n        </div>\n    ";
            return buffer;
        }
        function program4(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n                <div data-role="cancel" class="dialog-btn">\n                    ';
            if (stack1 = helpers.cancelTpl) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.cancelTpl;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n                </div>\n            ";
            return buffer;
        }
        function program6(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n                <div data-role="confirm" class="dialog-btn">\n                    ';
            if (stack1 = helpers.confirmTpl) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.confirmTpl;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n                </div>\n            ";
            return buffer;
        }
        function program8(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n        <div class="';
            if (stack1 = helpers.classPrefix) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.classPrefix;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '-footer"></div>\n    ';
            return buffer;
        }
        buffer += '<div class="';
        if (stack1 = helpers.classPrefix) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.classPrefix;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '-main">\n\n    ';
        stack1 = helpers["if"].call(depth0, depth0.title, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\n\n    <div class="';
        if (stack1 = helpers.classPrefix) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.classPrefix;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '-con">\n        <div data-role="message">\n            ';
        if (stack1 = helpers.message) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.message;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n        </div>\n    </div>\n\n    ";
        stack1 = helpers["if"].call(depth0, depth0.hasFoot, {
            hash: {},
            inverse: self.program(8, program8, data),
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n</div>";
        return buffer;
    });
});

define("app/common/io-debug", [ "$-debug", "app/common/util-debug", "app/common/interfaceUrl-debug", "app/common/dialog/confirmbox-debug", "arale/dialog/1.3.0/dialog-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/overlay/1.1.4/mask-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug"), util = require("app/common/util-debug"), ConfirmBox = require("app/common/dialog/confirmbox-debug"), io = {};
    // helper
    function isType(type) {
        return function(obj) {
            return Object.prototype.toString.call(obj) === "[object " + type + "]";
        };
    }
    var isArray = Array.isArray || isType("Array");
    io.processor = function(json, callback) {
        var msg, success, error, input;
        //全局异常处理(login|error)
        /*if ( json.result == 'login' ) {
		        //登录页跳转
		        window.location.href = io.$cfg('page_login');
		    }*/
        if (json.result == "error") {
            //异常提示
            console.error(json.messages);
            return;
        }
        /**
		 * 业务相关回调,参数中包含业务的成功失败消息
		 * 1. success(message)|failure(message)
		 *
		 * 表单验证
		 * 2. input(fieldErrors)
		 */
        if (json.result == "needLogin") {
            msg = json.messages;
            if (isArray(msg)) {
                msg = msg.join("<br/>").replace("\n", "<br/>");
            }
            setTimeout(function() {
                window.location.href = "/";
            }, 1500);
            util.showError(msg || "需要登录");
        } else if ($.inArray(json.result, [ "success", "login", "failure" ]) != -1) {
            msg = json.messages;
            if (isArray(msg)) {
                msg = msg.join("<br/>").replace("\n", "<br/>");
            }
            success = callback["success"] || callback;
            error = callback["error"] || function(msg) {
                util.showError(msg || "未知错误，请联系管理员。");
            };
            if (json.result == "success" || json.result == "login") {
                success.call(json, msg);
            } else {
                util.hideLoading();
                error.call(json, msg);
            }
        } else if (json.result == "input") {
            if (!$.isEmptyObject(json["fieldErrors"])) {
                $.each(json["fieldErrors"], function(field, v) {
                    msg = v.shift && v.shift() || v;
                    input = callback["input"];
                    input && input[field] && input[field].call(json, msg);
                });
            } else {
                msg = json.messages.shift() || json.messages;
                callback["input"] ? callback["input"].call(json, msg) : console.log(msg);
            }
        }
    };
    io.post = function(url, data, callback) {
        if (typeof callback == "undefined") {
            callback = data;
            data = {};
        }
        var cfg = {
            url: url,
            data: data,
            callback: callback,
            type: "post"
        };
        io.ajax(cfg);
    };
    io.syncPost = function(url, data, callback) {
        if (typeof callback == "undefined") {
            callback = data;
            data = {};
        }
        var cfg = {
            async: false,
            url: url,
            data: data,
            callback: callback,
            type: "post"
        };
        io.ajax(cfg);
    };
    io.get = function(url, data, callback) {
        if (typeof callback == "undefined") {
            callback = data;
            data = {};
        }
        var cfg = {
            url: url,
            data: data,
            callback: callback,
            type: "get"
        };
        io.ajax(cfg);
    };
    io.syncGet = function(url, data, callback) {
        if (typeof callback == "undefined") {
            callback = data;
            data = {};
        }
        var cfg = {
            async: false,
            url: url,
            data: data,
            callback: callback,
            type: "get"
        };
        io.ajax(cfg);
    };
    io.ajax = function(cfg) {
        var async = typeof cfg.async === "undefined";
        $.ajax({
            async: async,
            cache: false,
            url: cfg.url,
            dataType: "json",
            traditional: true,
            type: cfg.type,
            data: cfg.data,
            success: function(d) {
                //callback(d);
                d && io.processor(d, cfg.callback);
            },
            error: function() {
                console.warn("server error: " + cfg.url);
            }
        });
    };
    return io;
});

define("app/common/helpers-debug", [ "gallery/moment/2.8.1/moment-debug" ], function(require) {
    var moment = require("gallery/moment/2.8.1/moment-debug");
    return {
        fDate: function(val) {
            var ret = "";
            if (val) {
                ret = moment(val).format("YYYY-MM-DD HH:mm");
            }
            return ret;
        },
        fShortDate: function(val) {
            var ret = "";
            if (val) {
                ret = moment(val).format("YYYY-MM-DD");
            }
            return ret;
        },
        // 解析只有小时的“时间戳”
        fTime: function(val) {
            var ret = "", timestamp = +val;
            if (timestamp || timestamp === 0) {
                // 946656000000 = '2000-01-01 00:00:00'
                ret = moment(timestamp + 946656e6).format("HH:mm");
            }
            return ret;
        },
        judge: function(a, b, options) {
            if (a === b) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        contrast: function(a, b, options) {
            if (a > b) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        getImage: function(val) {
            return imageURL + "/" + val;
        },
        getAvatars: function(userId) {
            return userImagePath + "/m_" + userId + "/head_pic/small.jpg";
        },
        now: function() {
            return moment().format("HH:mm");
        },
        getFileIcon: function(fileName) {
            var o = fileName.split("."), fileType = o[o.length - 1].toString().toLowerCase(), baseUrl = "http://ue1.17173cdn.com/a/2035/open/2014/img/", imgName;
            switch (fileType) {
              case "jpg":
              case "jpeg":
              case "png":
              case "gif":
              case "bmp":
                imgName = fileName;
                break;

              case "doc":
                imgName = baseUrl + "f1.jpg";
                break;

              case "txt":
                imgName = baseUrl + "f2.jpg";
                break;

              case "xls":
                imgName = baseUrl + "f3.jpg";
                break;

              case "pdf":
                imgName = baseUrl + "f4.jpg";
                break;

              case "ppt":
                imgName = baseUrl + "f5.jpg";
                break;

              case "rar":
                imgName = baseUrl + "f6.jpg";
                break;

              case "zip":
                imgName = baseUrl + "f7.jpg";
                break;

              case "mp3":
                imgName = baseUrl + "f8.jpg";
                break;

              default:
                imgName = baseUrl + "f9.jpg";
                break;
            }
            return imgName;
        }
    };
});

define("gallery/moment/2.8.1/moment-debug", [], function(require, exports, module) {
    //! moment.js
    //! version : 2.8.1
    //! authors : Tim Wood, Iskren Chernev, Moment.js contributors
    //! license : MIT
    //! momentjs.com
    (function(undefined) {
        /************************************
        Constants
    ************************************/
        var moment, VERSION = "2.8.1", // the global-scope this is NOT the global object in Node.js
        globalScope = typeof global !== "undefined" ? global : this, oldGlobalMoment, round = Math.round, i, YEAR = 0, MONTH = 1, DATE = 2, HOUR = 3, MINUTE = 4, SECOND = 5, MILLISECOND = 6, // internal storage for locale config files
        locales = {}, // extra moment internal properties (plugins register props here)
        momentProperties = [], // check for nodeJS
        hasModule = typeof module !== "undefined" && module.exports, // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i, aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/, // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        parseTokenOrdinal = /\d{1,2}/, //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf
        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, isoFormat = "YYYY-MM-DDTHH:mm:ssZ", isoDates = [ [ "YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/ ], [ "YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/ ], [ "GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/ ], [ "GGGG-[W]WW", /\d{4}-W\d{2}/ ], [ "YYYY-DDD", /\d{4}-\d{3}/ ] ], // iso time formats and regexes
        isoTimes = [ [ "HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/ ], [ "HH:mm:ss", /(T| )\d\d:\d\d:\d\d/ ], [ "HH:mm", /(T| )\d\d:\d\d/ ], [ "HH", /(T| )\d\d/ ] ], // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi, // getter and setter names
        proxyGettersAndSetters = "Date|Hours|Minutes|Seconds|Milliseconds".split("|"), unitMillisecondFactors = {
            Milliseconds: 1,
            Seconds: 1e3,
            Minutes: 6e4,
            Hours: 36e5,
            Days: 864e5,
            Months: 2592e6,
            Years: 31536e6
        }, unitAliases = {
            ms: "millisecond",
            s: "second",
            m: "minute",
            h: "hour",
            d: "day",
            D: "date",
            w: "week",
            W: "isoWeek",
            M: "month",
            Q: "quarter",
            y: "year",
            DDD: "dayOfYear",
            e: "weekday",
            E: "isoWeekday",
            gg: "weekYear",
            GG: "isoWeekYear"
        }, camelFunctions = {
            dayofyear: "dayOfYear",
            isoweekday: "isoWeekday",
            isoweek: "isoWeek",
            weekyear: "weekYear",
            isoweekyear: "isoWeekYear"
        }, // format function strings
        formatFunctions = {}, // default relative time thresholds
        relativeTimeThresholds = {
            s: 45,
            // seconds to minute
            m: 45,
            // minutes to hour
            h: 22,
            // hours to day
            d: 26,
            // days to month
            M: 11
        }, // tokens to ordinalize and pad
        ordinalizeTokens = "DDD w W M D d".split(" "), paddedTokens = "M D H h m s w W".split(" "), formatTokenFunctions = {
            M: function() {
                return this.month() + 1;
            },
            MMM: function(format) {
                return this.localeData().monthsShort(this, format);
            },
            MMMM: function(format) {
                return this.localeData().months(this, format);
            },
            D: function() {
                return this.date();
            },
            DDD: function() {
                return this.dayOfYear();
            },
            d: function() {
                return this.day();
            },
            dd: function(format) {
                return this.localeData().weekdaysMin(this, format);
            },
            ddd: function(format) {
                return this.localeData().weekdaysShort(this, format);
            },
            dddd: function(format) {
                return this.localeData().weekdays(this, format);
            },
            w: function() {
                return this.week();
            },
            W: function() {
                return this.isoWeek();
            },
            YY: function() {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY: function() {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY: function() {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY: function() {
                var y = this.year(), sign = y >= 0 ? "+" : "-";
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg: function() {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg: function() {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg: function() {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG: function() {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG: function() {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG: function() {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e: function() {
                return this.weekday();
            },
            E: function() {
                return this.isoWeekday();
            },
            a: function() {
                return this.localeData().meridiem(this.hours(), this.minutes(), true);
            },
            A: function() {
                return this.localeData().meridiem(this.hours(), this.minutes(), false);
            },
            H: function() {
                return this.hours();
            },
            h: function() {
                return this.hours() % 12 || 12;
            },
            m: function() {
                return this.minutes();
            },
            s: function() {
                return this.seconds();
            },
            S: function() {
                return toInt(this.milliseconds() / 100);
            },
            SS: function() {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS: function() {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS: function() {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z: function() {
                var a = -this.zone(), b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ: function() {
                var a = -this.zone(), b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z: function() {
                return this.zoneAbbr();
            },
            zz: function() {
                return this.zoneName();
            },
            X: function() {
                return this.unix();
            },
            Q: function() {
                return this.quarter();
            }
        }, deprecations = {}, lists = [ "months", "monthsShort", "weekdays", "weekdaysShort", "weekdaysMin" ];
        // Pick the first defined of two or three arguments. dfl comes from
        // default.
        function dfl(a, b, c) {
            switch (arguments.length) {
              case 2:
                return a != null ? a : b;

              case 3:
                return a != null ? a : b != null ? b : c;

              default:
                throw new Error("Implement me");
            }
        }
        function defaultParsingFlags() {
            // We need to deep clone this object, and es5 standard is not very
            // helpful.
            return {
                empty: false,
                unusedTokens: [],
                unusedInput: [],
                overflow: -2,
                charsLeftOver: 0,
                nullInput: false,
                invalidMonth: null,
                invalidFormat: false,
                userInvalidated: false,
                iso: false
            };
        }
        function printMsg(msg) {
            if (moment.suppressDeprecationWarnings === false && typeof console !== "undefined" && console.warn) {
                console.warn("Deprecation warning: " + msg);
            }
        }
        function deprecate(msg, fn) {
            var firstTime = true;
            return extend(function() {
                if (firstTime) {
                    printMsg(msg);
                    firstTime = false;
                }
                return fn.apply(this, arguments);
            }, fn);
        }
        function deprecateSimple(name, msg) {
            if (!deprecations[name]) {
                printMsg(msg);
                deprecations[name] = true;
            }
        }
        function padToken(func, count) {
            return function(a) {
                return leftZeroFill(func.call(this, a), count);
            };
        }
        function ordinalizeToken(func, period) {
            return function(a) {
                return this.localeData().ordinal(func.call(this, a), period);
            };
        }
        while (ordinalizeTokens.length) {
            i = ordinalizeTokens.pop();
            formatTokenFunctions[i + "o"] = ordinalizeToken(formatTokenFunctions[i], i);
        }
        while (paddedTokens.length) {
            i = paddedTokens.pop();
            formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
        }
        formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);
        /************************************
        Constructors
    ************************************/
        function Locale() {}
        // Moment prototype object
        function Moment(config, skipOverflow) {
            if (skipOverflow !== false) {
                checkOverflow(config);
            }
            copyConfig(this, config);
            this._d = new Date(+config._d);
        }
        // Duration Constructor
        function Duration(duration) {
            var normalizedInput = normalizeObjectUnits(duration), years = normalizedInput.year || 0, quarters = normalizedInput.quarter || 0, months = normalizedInput.month || 0, weeks = normalizedInput.week || 0, days = normalizedInput.day || 0, hours = normalizedInput.hour || 0, minutes = normalizedInput.minute || 0, seconds = normalizedInput.second || 0, milliseconds = normalizedInput.millisecond || 0;
            // representation for dateAddRemove
            this._milliseconds = +milliseconds + seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5;
            // 1000 * 60 * 60
            // Because of dateAddRemove treats 24 hours as different from a
            // day when working around DST, we need to store them separately
            this._days = +days + weeks * 7;
            // It is impossible translate months into days without knowing
            // which months you are are talking about, so we have to store
            // it separately.
            this._months = +months + quarters * 3 + years * 12;
            this._data = {};
            this._locale = moment.localeData();
            this._bubble();
        }
        /************************************
        Helpers
    ************************************/
        function extend(a, b) {
            for (var i in b) {
                if (b.hasOwnProperty(i)) {
                    a[i] = b[i];
                }
            }
            if (b.hasOwnProperty("toString")) {
                a.toString = b.toString;
            }
            if (b.hasOwnProperty("valueOf")) {
                a.valueOf = b.valueOf;
            }
            return a;
        }
        function copyConfig(to, from) {
            var i, prop, val;
            if (typeof from._isAMomentObject !== "undefined") {
                to._isAMomentObject = from._isAMomentObject;
            }
            if (typeof from._i !== "undefined") {
                to._i = from._i;
            }
            if (typeof from._f !== "undefined") {
                to._f = from._f;
            }
            if (typeof from._l !== "undefined") {
                to._l = from._l;
            }
            if (typeof from._strict !== "undefined") {
                to._strict = from._strict;
            }
            if (typeof from._tzm !== "undefined") {
                to._tzm = from._tzm;
            }
            if (typeof from._isUTC !== "undefined") {
                to._isUTC = from._isUTC;
            }
            if (typeof from._offset !== "undefined") {
                to._offset = from._offset;
            }
            if (typeof from._pf !== "undefined") {
                to._pf = from._pf;
            }
            if (typeof from._locale !== "undefined") {
                to._locale = from._locale;
            }
            if (momentProperties.length > 0) {
                for (i in momentProperties) {
                    prop = momentProperties[i];
                    val = from[prop];
                    if (typeof val !== "undefined") {
                        to[prop] = val;
                    }
                }
            }
            return to;
        }
        function absRound(number) {
            if (number < 0) {
                return Math.ceil(number);
            } else {
                return Math.floor(number);
            }
        }
        // left zero fill a number
        // see http://jsperf.com/left-zero-filling for performance comparison
        function leftZeroFill(number, targetLength, forceSign) {
            var output = "" + Math.abs(number), sign = number >= 0;
            while (output.length < targetLength) {
                output = "0" + output;
            }
            return (sign ? forceSign ? "+" : "" : "-") + output;
        }
        function positiveMomentsDifference(base, other) {
            var res = {
                milliseconds: 0,
                months: 0
            };
            res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
            if (base.clone().add(res.months, "M").isAfter(other)) {
                --res.months;
            }
            res.milliseconds = +other - +base.clone().add(res.months, "M");
            return res;
        }
        function momentsDifference(base, other) {
            var res;
            other = makeAs(other, base);
            if (base.isBefore(other)) {
                res = positiveMomentsDifference(base, other);
            } else {
                res = positiveMomentsDifference(other, base);
                res.milliseconds = -res.milliseconds;
                res.months = -res.months;
            }
            return res;
        }
        // TODO: remove 'name' arg after deprecation is removed
        function createAdder(direction, name) {
            return function(val, period) {
                var dur, tmp;
                //invert the arguments, but complain about it
                if (period !== null && !isNaN(+period)) {
                    deprecateSimple(name, "moment()." + name + "(period, number) is deprecated. Please use moment()." + name + "(number, period).");
                    tmp = val;
                    val = period;
                    period = tmp;
                }
                val = typeof val === "string" ? +val : val;
                dur = moment.duration(val, period);
                addOrSubtractDurationFromMoment(this, dur, direction);
                return this;
            };
        }
        function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
            var milliseconds = duration._milliseconds, days = duration._days, months = duration._months;
            updateOffset = updateOffset == null ? true : updateOffset;
            if (milliseconds) {
                mom._d.setTime(+mom._d + milliseconds * isAdding);
            }
            if (days) {
                rawSetter(mom, "Date", rawGetter(mom, "Date") + days * isAdding);
            }
            if (months) {
                rawMonthSetter(mom, rawGetter(mom, "Month") + months * isAdding);
            }
            if (updateOffset) {
                moment.updateOffset(mom, days || months);
            }
        }
        // check if is an array
        function isArray(input) {
            return Object.prototype.toString.call(input) === "[object Array]";
        }
        function isDate(input) {
            return Object.prototype.toString.call(input) === "[object Date]" || input instanceof Date;
        }
        // compare two arrays, return the number of differences
        function compareArrays(array1, array2, dontConvert) {
            var len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0, i;
            for (i = 0; i < len; i++) {
                if (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) {
                    diffs++;
                }
            }
            return diffs + lengthDiff;
        }
        function normalizeUnits(units) {
            if (units) {
                var lowered = units.toLowerCase().replace(/(.)s$/, "$1");
                units = unitAliases[units] || camelFunctions[lowered] || lowered;
            }
            return units;
        }
        function normalizeObjectUnits(inputObject) {
            var normalizedInput = {}, normalizedProp, prop;
            for (prop in inputObject) {
                if (inputObject.hasOwnProperty(prop)) {
                    normalizedProp = normalizeUnits(prop);
                    if (normalizedProp) {
                        normalizedInput[normalizedProp] = inputObject[prop];
                    }
                }
            }
            return normalizedInput;
        }
        function makeList(field) {
            var count, setter;
            if (field.indexOf("week") === 0) {
                count = 7;
                setter = "day";
            } else if (field.indexOf("month") === 0) {
                count = 12;
                setter = "month";
            } else {
                return;
            }
            moment[field] = function(format, index) {
                var i, getter, method = moment._locale[field], results = [];
                if (typeof format === "number") {
                    index = format;
                    format = undefined;
                }
                getter = function(i) {
                    var m = moment().utc().set(setter, i);
                    return method.call(moment._locale, m, format || "");
                };
                if (index != null) {
                    return getter(index);
                } else {
                    for (i = 0; i < count; i++) {
                        results.push(getter(i));
                    }
                    return results;
                }
            };
        }
        function toInt(argumentForCoercion) {
            var coercedNumber = +argumentForCoercion, value = 0;
            if (coercedNumber !== 0 && isFinite(coercedNumber)) {
                if (coercedNumber >= 0) {
                    value = Math.floor(coercedNumber);
                } else {
                    value = Math.ceil(coercedNumber);
                }
            }
            return value;
        }
        function daysInMonth(year, month) {
            return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
        }
        function weeksInYear(year, dow, doy) {
            return weekOfYear(moment([ year, 11, 31 + dow - doy ]), dow, doy).week;
        }
        function daysInYear(year) {
            return isLeapYear(year) ? 366 : 365;
        }
        function isLeapYear(year) {
            return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
        }
        function checkOverflow(m) {
            var overflow;
            if (m._a && m._pf.overflow === -2) {
                overflow = m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH : m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE : m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR : m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE : m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND : m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND : -1;
                if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                    overflow = DATE;
                }
                m._pf.overflow = overflow;
            }
        }
        function isValid(m) {
            if (m._isValid == null) {
                m._isValid = !isNaN(m._d.getTime()) && m._pf.overflow < 0 && !m._pf.empty && !m._pf.invalidMonth && !m._pf.nullInput && !m._pf.invalidFormat && !m._pf.userInvalidated;
                if (m._strict) {
                    m._isValid = m._isValid && m._pf.charsLeftOver === 0 && m._pf.unusedTokens.length === 0;
                }
            }
            return m._isValid;
        }
        function normalizeLocale(key) {
            return key ? key.toLowerCase().replace("_", "-") : key;
        }
        // pick the locale from the array
        // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        function chooseLocale(names) {
            var i = 0, j, next, locale, split;
            while (i < names.length) {
                split = normalizeLocale(names[i]).split("-");
                j = split.length;
                next = normalizeLocale(names[i + 1]);
                next = next ? next.split("-") : null;
                while (j > 0) {
                    locale = loadLocale(split.slice(0, j).join("-"));
                    if (locale) {
                        return locale;
                    }
                    if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                        //the next array item is better than a shallower substring of this one
                        break;
                    }
                    j--;
                }
                i++;
            }
            return null;
        }
        function loadLocale(name) {
            var oldLocale = null;
            if (!locales[name] && hasModule) {
                try {
                    oldLocale = moment.locale();
                    require("./locale/" + name);
                    // because defineLocale currently also sets the global locale, we want to undo that for lazy loaded locales
                    moment.locale(oldLocale);
                } catch (e) {}
            }
            return locales[name];
        }
        // Return a moment from input, that is local/utc/zone equivalent to model.
        function makeAs(input, model) {
            return model._isUTC ? moment(input).zone(model._offset || 0) : moment(input).local();
        }
        /************************************
        Locale
    ************************************/
        extend(Locale.prototype, {
            set: function(config) {
                var prop, i;
                for (i in config) {
                    prop = config[i];
                    if (typeof prop === "function") {
                        this[i] = prop;
                    } else {
                        this["_" + i] = prop;
                    }
                }
            },
            _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            months: function(m) {
                return this._months[m.month()];
            },
            _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            monthsShort: function(m) {
                return this._monthsShort[m.month()];
            },
            monthsParse: function(monthName) {
                var i, mom, regex;
                if (!this._monthsParse) {
                    this._monthsParse = [];
                }
                for (i = 0; i < 12; i++) {
                    // make the regex if we don't have it already
                    if (!this._monthsParse[i]) {
                        mom = moment.utc([ 2e3, i ]);
                        regex = "^" + this.months(mom, "") + "|^" + this.monthsShort(mom, "");
                        this._monthsParse[i] = new RegExp(regex.replace(".", ""), "i");
                    }
                    // test the regex
                    if (this._monthsParse[i].test(monthName)) {
                        return i;
                    }
                }
            },
            _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdays: function(m) {
                return this._weekdays[m.day()];
            },
            _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysShort: function(m) {
                return this._weekdaysShort[m.day()];
            },
            _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            weekdaysMin: function(m) {
                return this._weekdaysMin[m.day()];
            },
            weekdaysParse: function(weekdayName) {
                var i, mom, regex;
                if (!this._weekdaysParse) {
                    this._weekdaysParse = [];
                }
                for (i = 0; i < 7; i++) {
                    // make the regex if we don't have it already
                    if (!this._weekdaysParse[i]) {
                        mom = moment([ 2e3, 1 ]).day(i);
                        regex = "^" + this.weekdays(mom, "") + "|^" + this.weekdaysShort(mom, "") + "|^" + this.weekdaysMin(mom, "");
                        this._weekdaysParse[i] = new RegExp(regex.replace(".", ""), "i");
                    }
                    // test the regex
                    if (this._weekdaysParse[i].test(weekdayName)) {
                        return i;
                    }
                }
            },
            _longDateFormat: {
                LT: "h:mm A",
                L: "MM/DD/YYYY",
                LL: "MMMM D, YYYY",
                LLL: "MMMM D, YYYY LT",
                LLLL: "dddd, MMMM D, YYYY LT"
            },
            longDateFormat: function(key) {
                var output = this._longDateFormat[key];
                if (!output && this._longDateFormat[key.toUpperCase()]) {
                    output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(val) {
                        return val.slice(1);
                    });
                    this._longDateFormat[key] = output;
                }
                return output;
            },
            isPM: function(input) {
                // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
                // Using charAt should be more compatible.
                return (input + "").toLowerCase().charAt(0) === "p";
            },
            _meridiemParse: /[ap]\.?m?\.?/i,
            meridiem: function(hours, minutes, isLower) {
                if (hours > 11) {
                    return isLower ? "pm" : "PM";
                } else {
                    return isLower ? "am" : "AM";
                }
            },
            _calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            calendar: function(key, mom) {
                var output = this._calendar[key];
                return typeof output === "function" ? output.apply(mom) : output;
            },
            _relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            relativeTime: function(number, withoutSuffix, string, isFuture) {
                var output = this._relativeTime[string];
                return typeof output === "function" ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
            },
            pastFuture: function(diff, output) {
                var format = this._relativeTime[diff > 0 ? "future" : "past"];
                return typeof format === "function" ? format(output) : format.replace(/%s/i, output);
            },
            ordinal: function(number) {
                return this._ordinal.replace("%d", number);
            },
            _ordinal: "%d",
            preparse: function(string) {
                return string;
            },
            postformat: function(string) {
                return string;
            },
            week: function(mom) {
                return weekOfYear(mom, this._week.dow, this._week.doy).week;
            },
            _week: {
                dow: 0,
                // Sunday is the first day of the week.
                doy: 6
            },
            _invalidDate: "Invalid date",
            invalidDate: function() {
                return this._invalidDate;
            }
        });
        /************************************
        Formatting
    ************************************/
        function removeFormattingTokens(input) {
            if (input.match(/\[[\s\S]/)) {
                return input.replace(/^\[|\]$/g, "");
            }
            return input.replace(/\\/g, "");
        }
        function makeFormatFunction(format) {
            var array = format.match(formattingTokens), i, length;
            for (i = 0, length = array.length; i < length; i++) {
                if (formatTokenFunctions[array[i]]) {
                    array[i] = formatTokenFunctions[array[i]];
                } else {
                    array[i] = removeFormattingTokens(array[i]);
                }
            }
            return function(mom) {
                var output = "";
                for (i = 0; i < length; i++) {
                    output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
                }
                return output;
            };
        }
        // format date using native date object
        function formatMoment(m, format) {
            if (!m.isValid()) {
                return m.localeData().invalidDate();
            }
            format = expandFormat(format, m.localeData());
            if (!formatFunctions[format]) {
                formatFunctions[format] = makeFormatFunction(format);
            }
            return formatFunctions[format](m);
        }
        function expandFormat(format, locale) {
            var i = 5;
            function replaceLongDateFormatTokens(input) {
                return locale.longDateFormat(input) || input;
            }
            localFormattingTokens.lastIndex = 0;
            while (i >= 0 && localFormattingTokens.test(format)) {
                format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
                localFormattingTokens.lastIndex = 0;
                i -= 1;
            }
            return format;
        }
        /************************************
        Parsing
    ************************************/
        // get the regex to find the next token
        function getParseRegexForToken(token, config) {
            var a, strict = config._strict;
            switch (token) {
              case "Q":
                return parseTokenOneDigit;

              case "DDDD":
                return parseTokenThreeDigits;

              case "YYYY":
              case "GGGG":
              case "gggg":
                return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;

              case "Y":
              case "G":
              case "g":
                return parseTokenSignedNumber;

              case "YYYYYY":
              case "YYYYY":
              case "GGGGG":
              case "ggggg":
                return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;

              case "S":
                if (strict) {
                    return parseTokenOneDigit;
                }

              /* falls through */
                case "SS":
                if (strict) {
                    return parseTokenTwoDigits;
                }

              /* falls through */
                case "SSS":
                if (strict) {
                    return parseTokenThreeDigits;
                }

              /* falls through */
                case "DDD":
                return parseTokenOneToThreeDigits;

              case "MMM":
              case "MMMM":
              case "dd":
              case "ddd":
              case "dddd":
                return parseTokenWord;

              case "a":
              case "A":
                return config._locale._meridiemParse;

              case "X":
                return parseTokenTimestampMs;

              case "Z":
              case "ZZ":
                return parseTokenTimezone;

              case "T":
                return parseTokenT;

              case "SSSS":
                return parseTokenDigits;

              case "MM":
              case "DD":
              case "YY":
              case "GG":
              case "gg":
              case "HH":
              case "hh":
              case "mm":
              case "ss":
              case "ww":
              case "WW":
                return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;

              case "M":
              case "D":
              case "d":
              case "H":
              case "h":
              case "m":
              case "s":
              case "w":
              case "W":
              case "e":
              case "E":
                return parseTokenOneOrTwoDigits;

              case "Do":
                return parseTokenOrdinal;

              default:
                a = new RegExp(regexpEscape(unescapeFormat(token.replace("\\", "")), "i"));
                return a;
            }
        }
        function timezoneMinutesFromString(string) {
            string = string || "";
            var possibleTzMatches = string.match(parseTokenTimezone) || [], tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [], parts = (tzChunk + "").match(parseTimezoneChunker) || [ "-", 0, 0 ], minutes = +(parts[1] * 60) + toInt(parts[2]);
            return parts[0] === "+" ? -minutes : minutes;
        }
        // function to convert string input to date
        function addTimeToArrayFromToken(token, input, config) {
            var a, datePartArray = config._a;
            switch (token) {
              // QUARTER
                case "Q":
                if (input != null) {
                    datePartArray[MONTH] = (toInt(input) - 1) * 3;
                }
                break;

              // MONTH
                case "M":
              // fall through to MM
                case "MM":
                if (input != null) {
                    datePartArray[MONTH] = toInt(input) - 1;
                }
                break;

              case "MMM":
              // fall through to MMMM
                case "MMMM":
                a = config._locale.monthsParse(input);
                // if we didn't find a month name, mark the date as invalid.
                if (a != null) {
                    datePartArray[MONTH] = a;
                } else {
                    config._pf.invalidMonth = input;
                }
                break;

              // DAY OF MONTH
                case "D":
              // fall through to DD
                case "DD":
                if (input != null) {
                    datePartArray[DATE] = toInt(input);
                }
                break;

              case "Do":
                if (input != null) {
                    datePartArray[DATE] = toInt(parseInt(input, 10));
                }
                break;

              // DAY OF YEAR
                case "DDD":
              // fall through to DDDD
                case "DDDD":
                if (input != null) {
                    config._dayOfYear = toInt(input);
                }
                break;

              // YEAR
                case "YY":
                datePartArray[YEAR] = moment.parseTwoDigitYear(input);
                break;

              case "YYYY":
              case "YYYYY":
              case "YYYYYY":
                datePartArray[YEAR] = toInt(input);
                break;

              // AM / PM
                case "a":
              // fall through to A
                case "A":
                config._isPm = config._locale.isPM(input);
                break;

              // 24 HOUR
                case "H":
              // fall through to hh
                case "HH":
              // fall through to hh
                case "h":
              // fall through to hh
                case "hh":
                datePartArray[HOUR] = toInt(input);
                break;

              // MINUTE
                case "m":
              // fall through to mm
                case "mm":
                datePartArray[MINUTE] = toInt(input);
                break;

              // SECOND
                case "s":
              // fall through to ss
                case "ss":
                datePartArray[SECOND] = toInt(input);
                break;

              // MILLISECOND
                case "S":
              case "SS":
              case "SSS":
              case "SSSS":
                datePartArray[MILLISECOND] = toInt(("0." + input) * 1e3);
                break;

              // UNIX TIMESTAMP WITH MS
                case "X":
                config._d = new Date(parseFloat(input) * 1e3);
                break;

              // TIMEZONE
                case "Z":
              // fall through to ZZ
                case "ZZ":
                config._useUTC = true;
                config._tzm = timezoneMinutesFromString(input);
                break;

              // WEEKDAY - human
                case "dd":
              case "ddd":
              case "dddd":
                a = config._locale.weekdaysParse(input);
                // if we didn't get a weekday name, mark the date as invalid
                if (a != null) {
                    config._w = config._w || {};
                    config._w["d"] = a;
                } else {
                    config._pf.invalidWeekday = input;
                }
                break;

              // WEEK, WEEK DAY - numeric
                case "w":
              case "ww":
              case "W":
              case "WW":
              case "d":
              case "e":
              case "E":
                token = token.substr(0, 1);

              /* falls through */
                case "gggg":
              case "GGGG":
              case "GGGGG":
                token = token.substr(0, 2);
                if (input) {
                    config._w = config._w || {};
                    config._w[token] = toInt(input);
                }
                break;

              case "gg":
              case "GG":
                config._w = config._w || {};
                config._w[token] = moment.parseTwoDigitYear(input);
            }
        }
        function dayOfYearFromWeekInfo(config) {
            var w, weekYear, week, weekday, dow, doy, temp;
            w = config._w;
            if (w.GG != null || w.W != null || w.E != null) {
                dow = 1;
                doy = 4;
                // TODO: We need to take the current isoWeekYear, but that depends on
                // how we interpret now (local, utc, fixed offset). So create
                // a now version of current config (take local/utc/offset flags, and
                // create now).
                weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
                week = dfl(w.W, 1);
                weekday = dfl(w.E, 1);
            } else {
                dow = config._locale._week.dow;
                doy = config._locale._week.doy;
                weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
                week = dfl(w.w, 1);
                if (w.d != null) {
                    // weekday -- low day numbers are considered next week
                    weekday = w.d;
                    if (weekday < dow) {
                        ++week;
                    }
                } else if (w.e != null) {
                    // local weekday -- counting starts from begining of week
                    weekday = w.e + dow;
                } else {
                    // default to begining of week
                    weekday = dow;
                }
            }
            temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
        // convert an array to a date.
        // the array should mirror the parameters below
        // note: all values past the year are optional and will default to the lowest possible value.
        // [year, month, day , hour, minute, second, millisecond]
        function dateFromConfig(config) {
            var i, date, input = [], currentDate, yearToUse;
            if (config._d) {
                return;
            }
            currentDate = currentDateArray(config);
            //compute day of the year from weeks and weekdays
            if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
                dayOfYearFromWeekInfo(config);
            }
            //if the day of the year is set, figure out what it is
            if (config._dayOfYear) {
                yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);
                if (config._dayOfYear > daysInYear(yearToUse)) {
                    config._pf._overflowDayOfYear = true;
                }
                date = makeUTCDate(yearToUse, 0, config._dayOfYear);
                config._a[MONTH] = date.getUTCMonth();
                config._a[DATE] = date.getUTCDate();
            }
            // Default to current date.
            // * if no year, month, day of month are given, default to today
            // * if day of month is given, default month and year
            // * if month is given, default only year
            // * if year is given, don't default anything
            for (i = 0; i < 3 && config._a[i] == null; ++i) {
                config._a[i] = input[i] = currentDate[i];
            }
            // Zero out whatever was not defaulted, including time
            for (;i < 7; i++) {
                config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
            }
            config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
            // Apply timezone offset from input. The actual zone can be changed
            // with parseZone.
            if (config._tzm != null) {
                config._d.setUTCMinutes(config._d.getUTCMinutes() + config._tzm);
            }
        }
        function dateFromObject(config) {
            var normalizedInput;
            if (config._d) {
                return;
            }
            normalizedInput = normalizeObjectUnits(config._i);
            config._a = [ normalizedInput.year, normalizedInput.month, normalizedInput.day, normalizedInput.hour, normalizedInput.minute, normalizedInput.second, normalizedInput.millisecond ];
            dateFromConfig(config);
        }
        function currentDateArray(config) {
            var now = new Date();
            if (config._useUTC) {
                return [ now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() ];
            } else {
                return [ now.getFullYear(), now.getMonth(), now.getDate() ];
            }
        }
        // date from string and format string
        function makeDateFromStringAndFormat(config) {
            if (config._f === moment.ISO_8601) {
                parseISO(config);
                return;
            }
            config._a = [];
            config._pf.empty = true;
            // This array is used to make a Date, either with `new Date` or `Date.UTC`
            var string = "" + config._i, i, parsedInput, tokens, token, skipped, stringLength = string.length, totalParsedInputLength = 0;
            tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];
            for (i = 0; i < tokens.length; i++) {
                token = tokens[i];
                parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
                if (parsedInput) {
                    skipped = string.substr(0, string.indexOf(parsedInput));
                    if (skipped.length > 0) {
                        config._pf.unusedInput.push(skipped);
                    }
                    string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                    totalParsedInputLength += parsedInput.length;
                }
                // don't parse if it's not a known token
                if (formatTokenFunctions[token]) {
                    if (parsedInput) {
                        config._pf.empty = false;
                    } else {
                        config._pf.unusedTokens.push(token);
                    }
                    addTimeToArrayFromToken(token, parsedInput, config);
                } else if (config._strict && !parsedInput) {
                    config._pf.unusedTokens.push(token);
                }
            }
            // add remaining unparsed input length to the string
            config._pf.charsLeftOver = stringLength - totalParsedInputLength;
            if (string.length > 0) {
                config._pf.unusedInput.push(string);
            }
            // handle am pm
            if (config._isPm && config._a[HOUR] < 12) {
                config._a[HOUR] += 12;
            }
            // if is 12 am, change hours to 0
            if (config._isPm === false && config._a[HOUR] === 12) {
                config._a[HOUR] = 0;
            }
            dateFromConfig(config);
            checkOverflow(config);
        }
        function unescapeFormat(s) {
            return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(matched, p1, p2, p3, p4) {
                return p1 || p2 || p3 || p4;
            });
        }
        // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
        function regexpEscape(s) {
            return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        }
        // date from string and array of format strings
        function makeDateFromStringAndArray(config) {
            var tempConfig, bestMoment, scoreToBeat, i, currentScore;
            if (config._f.length === 0) {
                config._pf.invalidFormat = true;
                config._d = new Date(NaN);
                return;
            }
            for (i = 0; i < config._f.length; i++) {
                currentScore = 0;
                tempConfig = copyConfig({}, config);
                tempConfig._pf = defaultParsingFlags();
                tempConfig._f = config._f[i];
                makeDateFromStringAndFormat(tempConfig);
                if (!isValid(tempConfig)) {
                    continue;
                }
                // if there is any input that was not parsed add a penalty for that format
                currentScore += tempConfig._pf.charsLeftOver;
                //or tokens
                currentScore += tempConfig._pf.unusedTokens.length * 10;
                tempConfig._pf.score = currentScore;
                if (scoreToBeat == null || currentScore < scoreToBeat) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                }
            }
            extend(config, bestMoment || tempConfig);
        }
        // date from iso format
        function parseISO(config) {
            var i, l, string = config._i, match = isoRegex.exec(string);
            if (match) {
                config._pf.iso = true;
                for (i = 0, l = isoDates.length; i < l; i++) {
                    if (isoDates[i][1].exec(string)) {
                        // match[5] should be "T" or undefined
                        config._f = isoDates[i][0] + (match[6] || " ");
                        break;
                    }
                }
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(string)) {
                        config._f += isoTimes[i][0];
                        break;
                    }
                }
                if (string.match(parseTokenTimezone)) {
                    config._f += "Z";
                }
                makeDateFromStringAndFormat(config);
            } else {
                config._isValid = false;
            }
        }
        // date from iso format or fallback
        function makeDateFromString(config) {
            parseISO(config);
            if (config._isValid === false) {
                delete config._isValid;
                moment.createFromInputFallback(config);
            }
        }
        function makeDateFromInput(config) {
            var input = config._i, matched;
            if (input === undefined) {
                config._d = new Date();
            } else if (isDate(input)) {
                config._d = new Date(+input);
            } else if ((matched = aspNetJsonRegex.exec(input)) !== null) {
                config._d = new Date(+matched[1]);
            } else if (typeof input === "string") {
                makeDateFromString(config);
            } else if (isArray(input)) {
                config._a = input.slice(0);
                dateFromConfig(config);
            } else if (typeof input === "object") {
                dateFromObject(config);
            } else if (typeof input === "number") {
                // from milliseconds
                config._d = new Date(input);
            } else {
                moment.createFromInputFallback(config);
            }
        }
        function makeDate(y, m, d, h, M, s, ms) {
            //can't just apply() to create a date:
            //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
            var date = new Date(y, m, d, h, M, s, ms);
            //the date constructor doesn't accept years < 1970
            if (y < 1970) {
                date.setFullYear(y);
            }
            return date;
        }
        function makeUTCDate(y) {
            var date = new Date(Date.UTC.apply(null, arguments));
            if (y < 1970) {
                date.setUTCFullYear(y);
            }
            return date;
        }
        function parseWeekday(input, locale) {
            if (typeof input === "string") {
                if (!isNaN(input)) {
                    input = parseInt(input, 10);
                } else {
                    input = locale.weekdaysParse(input);
                    if (typeof input !== "number") {
                        return null;
                    }
                }
            }
            return input;
        }
        /************************************
        Relative Time
    ************************************/
        // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
        function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
            return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
        }
        function relativeTime(posNegDuration, withoutSuffix, locale) {
            var duration = moment.duration(posNegDuration).abs(), seconds = round(duration.as("s")), minutes = round(duration.as("m")), hours = round(duration.as("h")), days = round(duration.as("d")), months = round(duration.as("M")), years = round(duration.as("y")), args = seconds < relativeTimeThresholds.s && [ "s", seconds ] || minutes === 1 && [ "m" ] || minutes < relativeTimeThresholds.m && [ "mm", minutes ] || hours === 1 && [ "h" ] || hours < relativeTimeThresholds.h && [ "hh", hours ] || days === 1 && [ "d" ] || days < relativeTimeThresholds.d && [ "dd", days ] || months === 1 && [ "M" ] || months < relativeTimeThresholds.M && [ "MM", months ] || years === 1 && [ "y" ] || [ "yy", years ];
            args[2] = withoutSuffix;
            args[3] = +posNegDuration > 0;
            args[4] = locale;
            return substituteTimeAgo.apply({}, args);
        }
        /************************************
        Week of Year
    ************************************/
        // firstDayOfWeek       0 = sun, 6 = sat
        //                      the day of the week that starts the week
        //                      (usually sunday or monday)
        // firstDayOfWeekOfYear 0 = sun, 6 = sat
        //                      the first week is the week that contains the first
        //                      of this day of the week
        //                      (eg. ISO weeks use thursday (4))
        function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
            var end = firstDayOfWeekOfYear - firstDayOfWeek, daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(), adjustedMoment;
            if (daysToDayOfWeek > end) {
                daysToDayOfWeek -= 7;
            }
            if (daysToDayOfWeek < end - 7) {
                daysToDayOfWeek += 7;
            }
            adjustedMoment = moment(mom).add(daysToDayOfWeek, "d");
            return {
                week: Math.ceil(adjustedMoment.dayOfYear() / 7),
                year: adjustedMoment.year()
            };
        }
        //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
        function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
            var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;
            d = d === 0 ? 7 : d;
            weekday = weekday != null ? weekday : firstDayOfWeek;
            daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
            dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;
            return {
                year: dayOfYear > 0 ? year : year - 1,
                dayOfYear: dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear
            };
        }
        /************************************
        Top Level Functions
    ************************************/
        function makeMoment(config) {
            var input = config._i, format = config._f;
            config._locale = config._locale || moment.localeData(config._l);
            if (input === null || format === undefined && input === "") {
                return moment.invalid({
                    nullInput: true
                });
            }
            if (typeof input === "string") {
                config._i = input = config._locale.preparse(input);
            }
            if (moment.isMoment(input)) {
                return new Moment(input, true);
            } else if (format) {
                if (isArray(format)) {
                    makeDateFromStringAndArray(config);
                } else {
                    makeDateFromStringAndFormat(config);
                }
            } else {
                makeDateFromInput(config);
            }
            return new Moment(config);
        }
        moment = function(input, format, locale, strict) {
            var c;
            if (typeof locale === "boolean") {
                strict = locale;
                locale = undefined;
            }
            // object construction must be done this way.
            // https://github.com/moment/moment/issues/1423
            c = {};
            c._isAMomentObject = true;
            c._i = input;
            c._f = format;
            c._l = locale;
            c._strict = strict;
            c._isUTC = false;
            c._pf = defaultParsingFlags();
            return makeMoment(c);
        };
        moment.suppressDeprecationWarnings = false;
        moment.createFromInputFallback = deprecate("moment construction falls back to js Date. This is " + "discouraged and will be removed in upcoming major " + "release. Please refer to " + "https://github.com/moment/moment/issues/1407 for more info.", function(config) {
            config._d = new Date(config._i);
        });
        // Pick a moment m from moments so that m[fn](other) is true for all
        // other. This relies on the function fn to be transitive.
        //
        // moments should either be an array of moment objects or an array, whose
        // first element is an array of moment objects.
        function pickBy(fn, moments) {
            var res, i;
            if (moments.length === 1 && isArray(moments[0])) {
                moments = moments[0];
            }
            if (!moments.length) {
                return moment();
            }
            res = moments[0];
            for (i = 1; i < moments.length; ++i) {
                if (moments[i][fn](res)) {
                    res = moments[i];
                }
            }
            return res;
        }
        moment.min = function() {
            var args = [].slice.call(arguments, 0);
            return pickBy("isBefore", args);
        };
        moment.max = function() {
            var args = [].slice.call(arguments, 0);
            return pickBy("isAfter", args);
        };
        // creating with utc
        moment.utc = function(input, format, locale, strict) {
            var c;
            if (typeof locale === "boolean") {
                strict = locale;
                locale = undefined;
            }
            // object construction must be done this way.
            // https://github.com/moment/moment/issues/1423
            c = {};
            c._isAMomentObject = true;
            c._useUTC = true;
            c._isUTC = true;
            c._l = locale;
            c._i = input;
            c._f = format;
            c._strict = strict;
            c._pf = defaultParsingFlags();
            return makeMoment(c).utc();
        };
        // creating with unix timestamp (in seconds)
        moment.unix = function(input) {
            return moment(input * 1e3);
        };
        // duration
        moment.duration = function(input, key) {
            var duration = input, // matching against regexp is expensive, do it on demand
            match = null, sign, ret, parseIso, diffRes;
            if (moment.isDuration(input)) {
                duration = {
                    ms: input._milliseconds,
                    d: input._days,
                    M: input._months
                };
            } else if (typeof input === "number") {
                duration = {};
                if (key) {
                    duration[key] = input;
                } else {
                    duration.milliseconds = input;
                }
            } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
                sign = match[1] === "-" ? -1 : 1;
                duration = {
                    y: 0,
                    d: toInt(match[DATE]) * sign,
                    h: toInt(match[HOUR]) * sign,
                    m: toInt(match[MINUTE]) * sign,
                    s: toInt(match[SECOND]) * sign,
                    ms: toInt(match[MILLISECOND]) * sign
                };
            } else if (!!(match = isoDurationRegex.exec(input))) {
                sign = match[1] === "-" ? -1 : 1;
                parseIso = function(inp) {
                    // We'd normally use ~~inp for this, but unfortunately it also
                    // converts floats to ints.
                    // inp may be undefined, so careful calling replace on it.
                    var res = inp && parseFloat(inp.replace(",", "."));
                    // apply sign while we're at it
                    return (isNaN(res) ? 0 : res) * sign;
                };
                duration = {
                    y: parseIso(match[2]),
                    M: parseIso(match[3]),
                    d: parseIso(match[4]),
                    h: parseIso(match[5]),
                    m: parseIso(match[6]),
                    s: parseIso(match[7]),
                    w: parseIso(match[8])
                };
            } else if (typeof duration === "object" && ("from" in duration || "to" in duration)) {
                diffRes = momentsDifference(moment(duration.from), moment(duration.to));
                duration = {};
                duration.ms = diffRes.milliseconds;
                duration.M = diffRes.months;
            }
            ret = new Duration(duration);
            if (moment.isDuration(input) && input.hasOwnProperty("_locale")) {
                ret._locale = input._locale;
            }
            return ret;
        };
        // version number
        moment.version = VERSION;
        // default format
        moment.defaultFormat = isoFormat;
        // constant that refers to the ISO standard
        moment.ISO_8601 = function() {};
        // Plugins that add properties should also add the key here (null value),
        // so we can properly clone ourselves.
        moment.momentProperties = momentProperties;
        // This function will be called whenever a moment is mutated.
        // It is intended to keep the offset in sync with the timezone.
        moment.updateOffset = function() {};
        // This function allows you to set a threshold for relative time strings
        moment.relativeTimeThreshold = function(threshold, limit) {
            if (relativeTimeThresholds[threshold] === undefined) {
                return false;
            }
            if (limit === undefined) {
                return relativeTimeThresholds[threshold];
            }
            relativeTimeThresholds[threshold] = limit;
            return true;
        };
        moment.lang = deprecate("moment.lang is deprecated. Use moment.locale instead.", function(key, value) {
            return moment.locale(key, value);
        });
        // This function will load locale and then set the global locale.  If
        // no arguments are passed in, it will simply return the current global
        // locale key.
        moment.locale = function(key, values) {
            var data;
            if (key) {
                if (typeof values !== "undefined") {
                    data = moment.defineLocale(key, values);
                } else {
                    data = moment.localeData(key);
                }
                if (data) {
                    moment.duration._locale = moment._locale = data;
                }
            }
            return moment._locale._abbr;
        };
        moment.defineLocale = function(name, values) {
            if (values !== null) {
                values.abbr = name;
                if (!locales[name]) {
                    locales[name] = new Locale();
                }
                locales[name].set(values);
                // backwards compat for now: also set the locale
                moment.locale(name);
                return locales[name];
            } else {
                // useful for testing
                delete locales[name];
                return null;
            }
        };
        moment.langData = deprecate("moment.langData is deprecated. Use moment.localeData instead.", function(key) {
            return moment.localeData(key);
        });
        // returns locale data
        moment.localeData = function(key) {
            var locale;
            if (key && key._locale && key._locale._abbr) {
                key = key._locale._abbr;
            }
            if (!key) {
                return moment._locale;
            }
            if (!isArray(key)) {
                //short-circuit everything else
                locale = loadLocale(key);
                if (locale) {
                    return locale;
                }
                key = [ key ];
            }
            return chooseLocale(key);
        };
        // compare moment object
        moment.isMoment = function(obj) {
            return obj instanceof Moment || obj != null && obj.hasOwnProperty("_isAMomentObject");
        };
        // for typechecking Duration objects
        moment.isDuration = function(obj) {
            return obj instanceof Duration;
        };
        for (i = lists.length - 1; i >= 0; --i) {
            makeList(lists[i]);
        }
        moment.normalizeUnits = function(units) {
            return normalizeUnits(units);
        };
        moment.invalid = function(flags) {
            var m = moment.utc(NaN);
            if (flags != null) {
                extend(m._pf, flags);
            } else {
                m._pf.userInvalidated = true;
            }
            return m;
        };
        moment.parseZone = function() {
            return moment.apply(null, arguments).parseZone();
        };
        moment.parseTwoDigitYear = function(input) {
            return toInt(input) + (toInt(input) > 68 ? 1900 : 2e3);
        };
        /************************************
        Moment Prototype
    ************************************/
        extend(moment.fn = Moment.prototype, {
            clone: function() {
                return moment(this);
            },
            valueOf: function() {
                return +this._d + (this._offset || 0) * 6e4;
            },
            unix: function() {
                return Math.floor(+this / 1e3);
            },
            toString: function() {
                return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
            },
            toDate: function() {
                return this._offset ? new Date(+this) : this._d;
            },
            toISOString: function() {
                var m = moment(this).utc();
                if (0 < m.year() && m.year() <= 9999) {
                    return formatMoment(m, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
                } else {
                    return formatMoment(m, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
                }
            },
            toArray: function() {
                var m = this;
                return [ m.year(), m.month(), m.date(), m.hours(), m.minutes(), m.seconds(), m.milliseconds() ];
            },
            isValid: function() {
                return isValid(this);
            },
            isDSTShifted: function() {
                if (this._a) {
                    return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
                }
                return false;
            },
            parsingFlags: function() {
                return extend({}, this._pf);
            },
            invalidAt: function() {
                return this._pf.overflow;
            },
            utc: function(keepLocalTime) {
                return this.zone(0, keepLocalTime);
            },
            local: function(keepLocalTime) {
                if (this._isUTC) {
                    this.zone(0, keepLocalTime);
                    this._isUTC = false;
                    if (keepLocalTime) {
                        this.add(this._d.getTimezoneOffset(), "m");
                    }
                }
                return this;
            },
            format: function(inputString) {
                var output = formatMoment(this, inputString || moment.defaultFormat);
                return this.localeData().postformat(output);
            },
            add: createAdder(1, "add"),
            subtract: createAdder(-1, "subtract"),
            diff: function(input, units, asFloat) {
                var that = makeAs(input, this), zoneDiff = (this.zone() - that.zone()) * 6e4, diff, output;
                units = normalizeUnits(units);
                if (units === "year" || units === "month") {
                    // average number of days in the months in the given dates
                    diff = (this.daysInMonth() + that.daysInMonth()) * 432e5;
                    // 24 * 60 * 60 * 1000 / 2
                    // difference in months
                    output = (this.year() - that.year()) * 12 + (this.month() - that.month());
                    // adjust by taking difference in days, average number of days
                    // and dst in the given months.
                    output += (this - moment(this).startOf("month") - (that - moment(that).startOf("month"))) / diff;
                    // same as above but with zones, to negate all dst
                    output -= (this.zone() - moment(this).startOf("month").zone() - (that.zone() - moment(that).startOf("month").zone())) * 6e4 / diff;
                    if (units === "year") {
                        output = output / 12;
                    }
                } else {
                    diff = this - that;
                    output = units === "second" ? diff / 1e3 : // 1000
                    units === "minute" ? diff / 6e4 : // 1000 * 60
                    units === "hour" ? diff / 36e5 : // 1000 * 60 * 60
                    units === "day" ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === "week" ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
                }
                return asFloat ? output : absRound(output);
            },
            from: function(time, withoutSuffix) {
                return moment.duration({
                    to: this,
                    from: time
                }).locale(this.locale()).humanize(!withoutSuffix);
            },
            fromNow: function(withoutSuffix) {
                return this.from(moment(), withoutSuffix);
            },
            calendar: function(time) {
                // We want to compare the start of today, vs this.
                // Getting start-of-today depends on whether we're zone'd or not.
                var now = time || moment(), sod = makeAs(now, this).startOf("day"), diff = this.diff(sod, "days", true), format = diff < -6 ? "sameElse" : diff < -1 ? "lastWeek" : diff < 0 ? "lastDay" : diff < 1 ? "sameDay" : diff < 2 ? "nextDay" : diff < 7 ? "nextWeek" : "sameElse";
                return this.format(this.localeData().calendar(format, this));
            },
            isLeapYear: function() {
                return isLeapYear(this.year());
            },
            isDST: function() {
                return this.zone() < this.clone().month(0).zone() || this.zone() < this.clone().month(5).zone();
            },
            day: function(input) {
                var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
                if (input != null) {
                    input = parseWeekday(input, this.localeData());
                    return this.add(input - day, "d");
                } else {
                    return day;
                }
            },
            month: makeAccessor("Month", true),
            startOf: function(units) {
                units = normalizeUnits(units);
                // the following switch intentionally omits break keywords
                // to utilize falling through the cases.
                switch (units) {
                  case "year":
                    this.month(0);

                  /* falls through */
                    case "quarter":
                  case "month":
                    this.date(1);

                  /* falls through */
                    case "week":
                  case "isoWeek":
                  case "day":
                    this.hours(0);

                  /* falls through */
                    case "hour":
                    this.minutes(0);

                  /* falls through */
                    case "minute":
                    this.seconds(0);

                  /* falls through */
                    case "second":
                    this.milliseconds(0);
                }
                // weeks are a special case
                if (units === "week") {
                    this.weekday(0);
                } else if (units === "isoWeek") {
                    this.isoWeekday(1);
                }
                // quarters are also special
                if (units === "quarter") {
                    this.month(Math.floor(this.month() / 3) * 3);
                }
                return this;
            },
            endOf: function(units) {
                units = normalizeUnits(units);
                return this.startOf(units).add(1, units === "isoWeek" ? "week" : units).subtract(1, "ms");
            },
            isAfter: function(input, units) {
                units = typeof units !== "undefined" ? units : "millisecond";
                return +this.clone().startOf(units) > +moment(input).startOf(units);
            },
            isBefore: function(input, units) {
                units = typeof units !== "undefined" ? units : "millisecond";
                return +this.clone().startOf(units) < +moment(input).startOf(units);
            },
            isSame: function(input, units) {
                units = units || "ms";
                return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
            },
            min: deprecate("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function(other) {
                other = moment.apply(null, arguments);
                return other < this ? this : other;
            }),
            max: deprecate("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function(other) {
                other = moment.apply(null, arguments);
                return other > this ? this : other;
            }),
            // keepLocalTime = true means only change the timezone, without
            // affecting the local hour. So 5:31:26 +0300 --[zone(2, true)]-->
            // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist int zone
            // +0200, so we adjust the time as needed, to be valid.
            //
            // Keeping the time actually adds/subtracts (one hour)
            // from the actual represented time. That is why we call updateOffset
            // a second time. In case it wants us to change the offset again
            // _changeInProgress == true case, then we have to adjust, because
            // there is no such time in the given timezone.
            zone: function(input, keepLocalTime) {
                var offset = this._offset || 0, localAdjust;
                if (input != null) {
                    if (typeof input === "string") {
                        input = timezoneMinutesFromString(input);
                    }
                    if (Math.abs(input) < 16) {
                        input = input * 60;
                    }
                    if (!this._isUTC && keepLocalTime) {
                        localAdjust = this._d.getTimezoneOffset();
                    }
                    this._offset = input;
                    this._isUTC = true;
                    if (localAdjust != null) {
                        this.subtract(localAdjust, "m");
                    }
                    if (offset !== input) {
                        if (!keepLocalTime || this._changeInProgress) {
                            addOrSubtractDurationFromMoment(this, moment.duration(offset - input, "m"), 1, false);
                        } else if (!this._changeInProgress) {
                            this._changeInProgress = true;
                            moment.updateOffset(this, true);
                            this._changeInProgress = null;
                        }
                    }
                } else {
                    return this._isUTC ? offset : this._d.getTimezoneOffset();
                }
                return this;
            },
            zoneAbbr: function() {
                return this._isUTC ? "UTC" : "";
            },
            zoneName: function() {
                return this._isUTC ? "Coordinated Universal Time" : "";
            },
            parseZone: function() {
                if (this._tzm) {
                    this.zone(this._tzm);
                } else if (typeof this._i === "string") {
                    this.zone(this._i);
                }
                return this;
            },
            hasAlignedHourOffset: function(input) {
                if (!input) {
                    input = 0;
                } else {
                    input = moment(input).zone();
                }
                return (this.zone() - input) % 60 === 0;
            },
            daysInMonth: function() {
                return daysInMonth(this.year(), this.month());
            },
            dayOfYear: function(input) {
                var dayOfYear = round((moment(this).startOf("day") - moment(this).startOf("year")) / 864e5) + 1;
                return input == null ? dayOfYear : this.add(input - dayOfYear, "d");
            },
            quarter: function(input) {
                return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
            },
            weekYear: function(input) {
                var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
                return input == null ? year : this.add(input - year, "y");
            },
            isoWeekYear: function(input) {
                var year = weekOfYear(this, 1, 4).year;
                return input == null ? year : this.add(input - year, "y");
            },
            week: function(input) {
                var week = this.localeData().week(this);
                return input == null ? week : this.add((input - week) * 7, "d");
            },
            isoWeek: function(input) {
                var week = weekOfYear(this, 1, 4).week;
                return input == null ? week : this.add((input - week) * 7, "d");
            },
            weekday: function(input) {
                var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
                return input == null ? weekday : this.add(input - weekday, "d");
            },
            isoWeekday: function(input) {
                // behaves the same as moment#day except
                // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
                // as a setter, sunday should belong to the previous week.
                return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
            },
            isoWeeksInYear: function() {
                return weeksInYear(this.year(), 1, 4);
            },
            weeksInYear: function() {
                var weekInfo = this.localeData()._week;
                return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
            },
            get: function(units) {
                units = normalizeUnits(units);
                return this[units]();
            },
            set: function(units, value) {
                units = normalizeUnits(units);
                if (typeof this[units] === "function") {
                    this[units](value);
                }
                return this;
            },
            // If passed a locale key, it will set the locale for this
            // instance.  Otherwise, it will return the locale configuration
            // variables for this instance.
            locale: function(key) {
                if (key === undefined) {
                    return this._locale._abbr;
                } else {
                    this._locale = moment.localeData(key);
                    return this;
                }
            },
            lang: deprecate("moment().lang() is deprecated. Use moment().localeData() instead.", function(key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    this._locale = moment.localeData(key);
                    return this;
                }
            }),
            localeData: function() {
                return this._locale;
            }
        });
        function rawMonthSetter(mom, value) {
            var dayOfMonth;
            // TODO: Move this out of here!
            if (typeof value === "string") {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (typeof value !== "number") {
                    return mom;
                }
            }
            dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
            mom._d["set" + (mom._isUTC ? "UTC" : "") + "Month"](value, dayOfMonth);
            return mom;
        }
        function rawGetter(mom, unit) {
            return mom._d["get" + (mom._isUTC ? "UTC" : "") + unit]();
        }
        function rawSetter(mom, unit, value) {
            if (unit === "Month") {
                return rawMonthSetter(mom, value);
            } else {
                return mom._d["set" + (mom._isUTC ? "UTC" : "") + unit](value);
            }
        }
        function makeAccessor(unit, keepTime) {
            return function(value) {
                if (value != null) {
                    rawSetter(this, unit, value);
                    moment.updateOffset(this, keepTime);
                    return this;
                } else {
                    return rawGetter(this, unit);
                }
            };
        }
        moment.fn.millisecond = moment.fn.milliseconds = makeAccessor("Milliseconds", false);
        moment.fn.second = moment.fn.seconds = makeAccessor("Seconds", false);
        moment.fn.minute = moment.fn.minutes = makeAccessor("Minutes", false);
        // Setting the hour should keep the time, because the user explicitly
        // specified which hour he wants. So trying to maintain the same hour (in
        // a new timezone) makes sense. Adding/subtracting hours does not follow
        // this rule.
        moment.fn.hour = moment.fn.hours = makeAccessor("Hours", true);
        // moment.fn.month is defined separately
        moment.fn.date = makeAccessor("Date", true);
        moment.fn.dates = deprecate("dates accessor is deprecated. Use date instead.", makeAccessor("Date", true));
        moment.fn.year = makeAccessor("FullYear", true);
        moment.fn.years = deprecate("years accessor is deprecated. Use year instead.", makeAccessor("FullYear", true));
        // add plural methods
        moment.fn.days = moment.fn.day;
        moment.fn.months = moment.fn.month;
        moment.fn.weeks = moment.fn.week;
        moment.fn.isoWeeks = moment.fn.isoWeek;
        moment.fn.quarters = moment.fn.quarter;
        // add aliased format methods
        moment.fn.toJSON = moment.fn.toISOString;
        /************************************
        Duration Prototype
    ************************************/
        function daysToYears(days) {
            // 400 years have 146097 days (taking into account leap year rules)
            return days * 400 / 146097;
        }
        function yearsToDays(years) {
            // years * 365 + absRound(years / 4) -
            //     absRound(years / 100) + absRound(years / 400);
            return years * 146097 / 400;
        }
        extend(moment.duration.fn = Duration.prototype, {
            _bubble: function() {
                var milliseconds = this._milliseconds, days = this._days, months = this._months, data = this._data, seconds, minutes, hours, years = 0;
                // The following code bubbles up values, see the tests for
                // examples of what that means.
                data.milliseconds = milliseconds % 1e3;
                seconds = absRound(milliseconds / 1e3);
                data.seconds = seconds % 60;
                minutes = absRound(seconds / 60);
                data.minutes = minutes % 60;
                hours = absRound(minutes / 60);
                data.hours = hours % 24;
                days += absRound(hours / 24);
                // Accurately convert days to years, assume start from year 0.
                years = absRound(daysToYears(days));
                days -= absRound(yearsToDays(years));
                // 30 days to a month
                // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
                months += absRound(days / 30);
                days %= 30;
                // 12 months -> 1 year
                years += absRound(months / 12);
                months %= 12;
                data.days = days;
                data.months = months;
                data.years = years;
            },
            abs: function() {
                this._milliseconds = Math.abs(this._milliseconds);
                this._days = Math.abs(this._days);
                this._months = Math.abs(this._months);
                this._data.milliseconds = Math.abs(this._data.milliseconds);
                this._data.seconds = Math.abs(this._data.seconds);
                this._data.minutes = Math.abs(this._data.minutes);
                this._data.hours = Math.abs(this._data.hours);
                this._data.months = Math.abs(this._data.months);
                this._data.years = Math.abs(this._data.years);
                return this;
            },
            weeks: function() {
                return absRound(this.days() / 7);
            },
            valueOf: function() {
                return this._milliseconds + this._days * 864e5 + this._months % 12 * 2592e6 + toInt(this._months / 12) * 31536e6;
            },
            humanize: function(withSuffix) {
                var output = relativeTime(this, !withSuffix, this.localeData());
                if (withSuffix) {
                    output = this.localeData().pastFuture(+this, output);
                }
                return this.localeData().postformat(output);
            },
            add: function(input, val) {
                // supports only 2.0-style add(1, 's') or add(moment)
                var dur = moment.duration(input, val);
                this._milliseconds += dur._milliseconds;
                this._days += dur._days;
                this._months += dur._months;
                this._bubble();
                return this;
            },
            subtract: function(input, val) {
                var dur = moment.duration(input, val);
                this._milliseconds -= dur._milliseconds;
                this._days -= dur._days;
                this._months -= dur._months;
                this._bubble();
                return this;
            },
            get: function(units) {
                units = normalizeUnits(units);
                return this[units.toLowerCase() + "s"]();
            },
            as: function(units) {
                var days, months;
                units = normalizeUnits(units);
                days = this._days + this._milliseconds / 864e5;
                if (units === "month" || units === "year") {
                    months = this._months + daysToYears(days) * 12;
                    return units === "month" ? months : months / 12;
                } else {
                    days += yearsToDays(this._months / 12);
                    switch (units) {
                      case "week":
                        return days / 7;

                      case "day":
                        return days;

                      case "hour":
                        return days * 24;

                      case "minute":
                        return days * 24 * 60;

                      case "second":
                        return days * 24 * 60 * 60;

                      case "millisecond":
                        return days * 24 * 60 * 60 * 1e3;

                      default:
                        throw new Error("Unknown unit " + units);
                    }
                }
            },
            lang: moment.fn.lang,
            locale: moment.fn.locale,
            toIsoString: deprecate("toIsoString() is deprecated. Please use toISOString() instead " + "(notice the capitals)", function() {
                return this.toISOString();
            }),
            toISOString: function() {
                // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
                var years = Math.abs(this.years()), months = Math.abs(this.months()), days = Math.abs(this.days()), hours = Math.abs(this.hours()), minutes = Math.abs(this.minutes()), seconds = Math.abs(this.seconds() + this.milliseconds() / 1e3);
                if (!this.asSeconds()) {
                    // this is the same as C#'s (Noda) and python (isodate)...
                    // but not other JS (goog.date)
                    return "P0D";
                }
                return (this.asSeconds() < 0 ? "-" : "") + "P" + (years ? years + "Y" : "") + (months ? months + "M" : "") + (days ? days + "D" : "") + (hours || minutes || seconds ? "T" : "") + (hours ? hours + "H" : "") + (minutes ? minutes + "M" : "") + (seconds ? seconds + "S" : "");
            },
            localeData: function() {
                return this._locale;
            }
        });
        function makeDurationGetter(name) {
            moment.duration.fn[name] = function() {
                return this._data[name];
            };
        }
        for (i in unitMillisecondFactors) {
            if (unitMillisecondFactors.hasOwnProperty(i)) {
                makeDurationGetter(i.toLowerCase());
            }
        }
        moment.duration.fn.asMilliseconds = function() {
            return this.as("ms");
        };
        moment.duration.fn.asSeconds = function() {
            return this.as("s");
        };
        moment.duration.fn.asMinutes = function() {
            return this.as("m");
        };
        moment.duration.fn.asHours = function() {
            return this.as("h");
        };
        moment.duration.fn.asDays = function() {
            return this.as("d");
        };
        moment.duration.fn.asWeeks = function() {
            return this.as("weeks");
        };
        moment.duration.fn.asMonths = function() {
            return this.as("M");
        };
        moment.duration.fn.asYears = function() {
            return this.as("y");
        };
        /************************************
        Default Locale
    ************************************/
        // Set default locale, other locale will inherit from English.
        moment.locale("en", {
            ordinal: function(number) {
                var b = number % 10, output = toInt(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
                return number + output;
            }
        });
        /* EMBED_LOCALES */
        /************************************
        Exposing Moment
    ************************************/
        function makeGlobal(shouldDeprecate) {
            /*global ender:false */
            if (typeof ender !== "undefined") {
                return;
            }
            oldGlobalMoment = globalScope.moment;
            if (shouldDeprecate) {
                globalScope.moment = deprecate("Accessing Moment through the global scope is " + "deprecated, and will be removed in an upcoming " + "release.", moment);
            } else {
                globalScope.moment = moment;
            }
        }
        // CommonJS module is defined
        if (hasModule) {
            module.exports = moment;
        } else if (typeof define === "function" && define.amd) {
            define("moment", function(require, exports, module) {
                if (module.config && module.config() && module.config().noGlobal === true) {
                    // release the global variable
                    globalScope.moment = oldGlobalMoment;
                }
                return moment;
            });
            makeGlobal(true);
        } else {
            makeGlobal();
        }
    }).call(this);
});

define("app/common/paginator-debug", [ "keenwon/jqPaginator/1.1.0/jqPaginator-debug", "$-debug" ], function(require, exports, module) {
    "use strict";
    require("keenwon/jqPaginator/1.1.0/jqPaginator-debug");
    module.exports = function(config) {
        var $obj = config.obj, totalCounts = config.totalHit, currentPage = config.pageNo, pageSize = config.pageSize, callback = config.callback;
        if (totalCounts <= pageSize) {
            $obj.data("jqPaginator") && $obj.jqPaginator("destroy");
            return;
        }
        $obj.jqPaginator({
            totalCounts: totalCounts,
            pageSize: pageSize,
            visiblePages: 7,
            currentPage: currentPage,
            disableClass: "disable",
            first: '<li><a href="javascript:;" title="首页"><i class="ico ico-arrow1"></i></a></li>',
            prev: '<li><a href="javascript:;" title="上一页"><i class="ico ico-arrow2"></i></a></li>',
            next: '<li><a href="javascript:;" title="下一页"><i class="ico ico-arrow3"></i></a></li>',
            last: '<li><a href="javascript:;" title="尾页"><i class="ico ico-arrow4"></i></a></li>',
            page: '<li><a href="javascript:;">{{page}}</a></li>',
            onPageChange: callback
        });
    };
});

define("keenwon/jqPaginator/1.1.0/jqPaginator-debug", [ "$-debug" ], function(require) {
    var jQuery = require("$-debug");
    (function($) {
        "use strict";
        $.jqPaginator = function(el, options) {
            if (!(this instanceof $.jqPaginator)) {
                return new $.jqPaginator(el, options);
            }
            var self = this;
            self.$container = $(el);
            self.$container.data("jqPaginator", self);
            self.init = function() {
                if (options.first || options.prev || options.next || options.last || options.page) {
                    options = $.extend({}, {
                        first: "",
                        prev: "",
                        next: "",
                        last: "",
                        page: ""
                    }, options);
                }
                self.options = $.extend({}, $.jqPaginator.defaultOptions, options);
                self.verify();
                self.extendJquery();
                self.render();
                self.fireEvent(this.options.currentPage, "init");
            };
            self.verify = function() {
                var opts = self.options;
                if (!opts.totalPages && !opts.totalCounts) {
                    throw new Error("[jqPaginator] totalCounts or totalPages is required");
                }
                if (!opts.totalPages && opts.totalCounts && !opts.pageSize) {
                    throw new Error("[jqPaginator] pageSize is required");
                }
                if (opts.totalCounts && opts.pageSize) {
                    opts.totalPages = Math.ceil(opts.totalCounts / opts.pageSize);
                }
                if (opts.currentPage < 1 || opts.currentPage > opts.totalPages) {
                    throw new Error("[jqPaginator] currentPage is incorrect");
                }
                if (opts.totalPages < 1) {
                    throw new Error("[jqPaginator] totalPages cannot be less currentPage");
                }
            };
            self.extendJquery = function() {
                $.fn.jqPaginatorHTML = function(s) {
                    return s ? this.before(s).remove() : $("<p>").append(this.eq(0).clone()).html();
                };
            };
            self.render = function() {
                self.renderHtml();
                self.setStatus();
                self.bindEvents();
            };
            self.renderHtml = function() {
                var html = [];
                var pages = self.getPages();
                for (var i = 0, j = pages.length; i < j; i++) {
                    html.push(self.buildItem("page", pages[i]));
                }
                self.isEnable("prev") && html.unshift(self.buildItem("prev", self.options.currentPage - 1));
                self.isEnable("first") && html.unshift(self.buildItem("first", 1));
                self.isEnable("statistics") && html.unshift(self.buildItem("statistics"));
                self.isEnable("next") && html.push(self.buildItem("next", self.options.currentPage + 1));
                self.isEnable("last") && html.push(self.buildItem("last", self.options.totalPages));
                if (self.options.wrapper) {
                    self.$container.html($(self.options.wrapper).html(html.join("")).jqPaginatorHTML());
                } else {
                    self.$container.html(html.join(""));
                }
            };
            self.buildItem = function(type, pageData) {
                var html = self.options[type].replace(/{{page}}/g, pageData).replace(/{{totalPages}}/g, self.options.totalPages).replace(/{{totalCounts}}/g, self.options.totalCounts);
                return $(html).attr({
                    "jp-role": type,
                    "jp-data": pageData
                }).jqPaginatorHTML();
            };
            self.setStatus = function() {
                var options = self.options;
                if (!self.isEnable("first") || options.currentPage === 1) {
                    $("[jp-role=first]", self.$container).addClass(options.disableClass);
                }
                if (!self.isEnable("prev") || options.currentPage === 1) {
                    $("[jp-role=prev]", self.$container).addClass(options.disableClass);
                }
                if (!self.isEnable("next") || options.currentPage >= options.totalPages) {
                    $("[jp-role=next]", self.$container).addClass(options.disableClass);
                }
                if (!self.isEnable("last") || options.currentPage >= options.totalPages) {
                    $("[jp-role=last]", self.$container).addClass(options.disableClass);
                }
                $("[jp-role=page]", self.$container).removeClass(options.activeClass);
                $("[jp-role=page][jp-data=" + options.currentPage + "]", self.$container).addClass(options.activeClass);
            };
            self.getPages = function() {
                var pages = [], visiblePages = self.options.visiblePages, currentPage = self.options.currentPage, totalPages = self.options.totalPages;
                if (visiblePages > totalPages) {
                    visiblePages = totalPages;
                }
                var half = Math.floor(visiblePages / 2);
                var start = currentPage - half + 1 - visiblePages % 2;
                var end = currentPage + half;
                if (start < 1) {
                    start = 1;
                    end = visiblePages;
                }
                if (end > totalPages) {
                    end = totalPages;
                    start = 1 + totalPages - visiblePages;
                }
                var itPage = start;
                while (itPage <= end) {
                    pages.push(itPage);
                    itPage++;
                }
                return pages;
            };
            self.isEnable = function(type) {
                return self.options[type] && typeof self.options[type] === "string";
            };
            self.switchPage = function(pageIndex) {
                self.options.currentPage = pageIndex;
                self.render();
            };
            self.fireEvent = function(pageIndex, type) {
                return typeof self.options.onPageChange !== "function" || self.options.onPageChange(pageIndex, type) !== false;
            };
            self.callMethod = function(method, options) {
                switch (method) {
                  case "option":
                    self.options = $.extend({}, self.options, options);
                    self.verify();
                    self.render();
                    break;

                  case "destroy":
                    self.$container.empty();
                    self.$container.removeData("jqPaginator");
                    break;

                  default:
                    throw new Error('[jqPaginator] method "' + method + '" does not exist');
                }
                return self.$container;
            };
            self.bindEvents = function() {
                var opts = self.options;
                self.$container.off();
                self.$container.on("click", "[jp-role]", function() {
                    var $el = $(this);
                    if ($el.hasClass(opts.disableClass) || $el.hasClass(opts.activeClass)) {
                        return;
                    }
                    var pageIndex = +$el.attr("jp-data");
                    if (self.fireEvent(pageIndex, "change")) {
                        self.switchPage(pageIndex);
                    }
                });
            };
            self.init();
            return self.$container;
        };
        $.jqPaginator.defaultOptions = {
            wrapper: "",
            first: '<li class="first"><a href="javascript:;">First</a></li>',
            prev: '<li class="prev"><a href="javascript:;">Previous</a></li>',
            next: '<li class="next"><a href="javascript:;">Next</a></li>',
            last: '<li class="last"><a href="javascript:;">Last</a></li>',
            page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
            totalPages: 0,
            totalCounts: 0,
            pageSize: 0,
            currentPage: 1,
            visiblePages: 7,
            disableClass: "disabled",
            activeClass: "active",
            onPageChange: null
        };
        $.fn.jqPaginator = function() {
            var self = this, args = Array.prototype.slice.call(arguments);
            if (typeof args[0] === "string") {
                var $instance = $(self).data("jqPaginator");
                if (!$instance) {
                    throw new Error("[jqPaginator] the element is not instantiated");
                } else {
                    return $instance.callMethod(args[0], args[1]);
                }
            } else {
                return new $.jqPaginator(this, args[0]);
            }
        };
    })(jQuery);
});

define("app/service/custom/reward/finish/reward-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, stack2, options, functionType = "function", escapeExpression = this.escapeExpression, self = this, helperMissing = helpers.helperMissing;
        function program1(depth0, data) {
            return "公开";
        }
        function program3(depth0, data) {
            return "不公开";
        }
        function program5(depth0, data) {
            return "悬赏结束后公开";
        }
        function program7(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n        <div class="accessory-box2">\r\n            <div class="tit">附件：</div>\r\n\r\n            ';
            stack1 = helpers.each.call(depth0, depth0.additionFiles, {
                hash: {},
                inverse: self.noop,
                fn: self.program(8, program8, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n        </div>\r\n    ";
            return buffer;
        }
        function program8(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += "\r\n                ";
            options = {
                hash: {},
                inverse: self.program(11, program11, data),
                fn: self.program(9, program9, data),
                data: data
            };
            stack2 = (stack1 = helpers.isPic, stack1 ? stack1.call(depth0, depth0.fileName, options) : helperMissing.call(depth0, "isPic", depth0.fileName, options));
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\r\n            ";
            return buffer;
        }
        function program9(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n                    <div class="info">\r\n                        <span>';
            if (stack1 = helpers.fileName) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.fileName;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '</span><a href="javascript:;" data-role="preview" data-url="';
            if (stack1 = helpers.fileUrl) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.fileUrl;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" class="link">预览</a><a href="';
            if (stack1 = helpers.fileUrl) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.fileUrl;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" target="_blank" class="link">下载</a>\r\n                    </div>\r\n                ';
            return buffer;
        }
        function program11(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n                    <div class="info">\r\n                        <span>';
            if (stack1 = helpers.fileName) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.fileName;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '</span><a href="';
            if (stack1 = helpers.fileUrl) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.fileUrl;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" target="_blank" class="link">下载</a>\r\n                    </div>\r\n                ';
            return buffer;
        }
        buffer += '<div class="article">\r\n    <div class="tit">悬赏主题：' + escapeExpression((stack1 = (stack1 = depth0.serviceBaseVo, 
        stack1 == null || stack1 === false ? stack1 : stack1.serviceName), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '</div>\r\n    <div class="txt">';
        options = {
            hash: {},
            data: data
        };
        stack2 = (stack1 = helpers.toHtml, stack1 ? stack1.call(depth0, (stack1 = depth0.serviceBaseVo, 
        stack1 == null || stack1 === false ? stack1 : stack1.serviceDescribe), options) : helperMissing.call(depth0, "toHtml", (stack1 = depth0.serviceBaseVo, 
        stack1 == null || stack1 === false ? stack1 : stack1.serviceDescribe), options));
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += '</div>\r\n</div>\r\n<div class="info-box">\r\n    <div class="item">\r\n        <span class="tit">创意隐私：</span>\r\n        ';
        options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        };
        stack2 = (stack1 = helpers.judge, stack1 ? stack1.call(depth0, (stack1 = depth0.detailsAddition, 
        stack1 == null || stack1 === false ? stack1 : stack1.origSecrecy), "0", options) : helperMissing.call(depth0, "judge", (stack1 = depth0.detailsAddition, 
        stack1 == null || stack1 === false ? stack1 : stack1.origSecrecy), "0", options));
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += "\r\n        ";
        options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        };
        stack2 = (stack1 = helpers.judge, stack1 ? stack1.call(depth0, (stack1 = depth0.detailsAddition, 
        stack1 == null || stack1 === false ? stack1 : stack1.origSecrecy), "1", options) : helperMissing.call(depth0, "judge", (stack1 = depth0.detailsAddition, 
        stack1 == null || stack1 === false ? stack1 : stack1.origSecrecy), "1", options));
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += "\r\n        ";
        options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        };
        stack2 = (stack1 = helpers.judge, stack1 ? stack1.call(depth0, (stack1 = depth0.detailsAddition, 
        stack1 == null || stack1 === false ? stack1 : stack1.origSecrecy), "2", options) : helperMissing.call(depth0, "judge", (stack1 = depth0.detailsAddition, 
        stack1 == null || stack1 === false ? stack1 : stack1.origSecrecy), "2", options));
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += "\r\n    </div>\r\n    ";
        options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(7, program7, data),
            data: data
        };
        stack2 = (stack1 = helpers.notEmptyArray, stack1 ? stack1.call(depth0, depth0.additionFiles, options) : helperMissing.call(depth0, "notEmptyArray", depth0.additionFiles, options));
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += "\r\n</div>";
        return buffer;
    });
});

define("app/service/custom/reward/finish/list-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var stack1, stack2, options, functionType = "function", escapeExpression = this.escapeExpression, self = this, helperMissing = helpers.helperMissing;
        function program1(depth0, data) {
            return '\r\n    <div class="nodata-box">\r\n        <img src="http://ue1.17173cdn.com/a/2035/open/2014/img/nodata.jpg" alt="暂无数据" width="84" height="90">\r\n        <div class="tit">暂无数据...</div>\r\n    </div>\r\n';
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            buffer += "\r\n    ";
            stack1 = helpers.each.call(depth0, depth0.listData, {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n";
            return buffer;
        }
        function program4(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += '\r\n        <div class="list-item">\r\n            <div class="pic-box">\r\n                <img src="';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getAvatars, stack1 ? stack1.call(depth0, (stack1 = depth0.userinfo, 
            stack1 == null || stack1 === false ? stack1 : stack1.userId), options) : helperMissing.call(depth0, "getAvatars", (stack1 = depth0.userinfo, 
            stack1 == null || stack1 === false ? stack1 : stack1.userId), options))) + '" class="pic-per" alt="">\r\n            </div>\r\n            <div class="detail-box">\r\n                <div class="detail-c1">\r\n                    <div class="name">' + escapeExpression((stack1 = (stack1 = depth0.userinfo, 
            stack1 == null || stack1 === false ? stack1 : stack1.fullName), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '</div>\r\n                    <div class="txt">';
            if (stack2 = helpers.content) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.content;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + "</div>\r\n                    ";
            options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(5, program5, data),
                data: data
            };
            stack2 = (stack1 = helpers.notEmptyArray, stack1 ? stack1.call(depth0, depth0.fujian, options) : helperMissing.call(depth0, "notEmptyArray", depth0.fujian, options));
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += '\r\n                </div>\r\n                <div class="detail-c2">\r\n                    <div class="star-box done star-box-l';
            if (stack2 = helpers.star) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.star;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">\r\n                        <i class="ico ico-star ico-star0" data-class="star-box-l0" data-star="0" title="〇星：作废"></i>\r\n                        <i class="ico ico-star ico-star1" data-class="star-box-l1" data-star="1" title="一星：谢谢参与"></i>\r\n                        <i class="ico ico-star ico-star2" data-class="star-box-l2" data-star="2" title="二星：有参考价值"></i>\r\n                        <i class="ico ico-star ico-star3" data-class="star-box-l3" data-star="3" title="三星：有启发"></i>\r\n                        <i class="ico ico-star ico-star4" data-class="star-box-l4" data-star="4" title="四星：可以用"></i>\r\n                        <i class="ico ico-star ico-star5" data-class="star-box-l5" data-star="5" title="五星：非常好"></i>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    ';
            return buffer;
        }
        function program5(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n                        <div class="accessory-box2">\r\n                            <div class="tit">附件：</div>\r\n\r\n                            ';
            stack1 = helpers.each.call(depth0, depth0.fujian, {
                hash: {},
                inverse: self.noop,
                fn: self.program(6, program6, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n                        </div>\r\n                    ";
            return buffer;
        }
        function program6(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += "\r\n                                ";
            options = {
                hash: {},
                inverse: self.program(9, program9, data),
                fn: self.program(7, program7, data),
                data: data
            };
            stack2 = (stack1 = helpers.isPic, stack1 ? stack1.call(depth0, depth0.name, options) : helperMissing.call(depth0, "isPic", depth0.name, options));
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\r\n                            ";
            return buffer;
        }
        function program7(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n                                    <div class="info">\r\n                                        <span>';
            if (stack1 = helpers.name) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.name;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '</span><a href="javascript:;" data-role="preview" data-url="';
            if (stack1 = helpers.path) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.path;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" class="link">预览</a><a href="';
            if (stack1 = helpers.path) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.path;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" target="_blank" class="link">下载</a>\r\n                                    </div>\r\n                                ';
            return buffer;
        }
        function program9(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n                                    <div class="info">\r\n                                        <span>';
            if (stack1 = helpers.name) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.name;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '</span><a href="';
            if (stack1 = helpers.path) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.path;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" target="_blank" class="link">下载</a>\r\n                                    </div>\r\n                                ';
            return buffer;
        }
        options = {
            hash: {},
            inverse: self.program(3, program3, data),
            fn: self.program(1, program1, data),
            data: data
        };
        stack2 = (stack1 = helpers.judge, stack1 ? stack1.call(depth0, (stack1 = depth0.listData, 
        stack1 == null || stack1 === false ? stack1 : stack1.length), 0, options) : helperMissing.call(depth0, "judge", (stack1 = depth0.listData, 
        stack1 == null || stack1 === false ? stack1 : stack1.length), 0, options));
        if (stack2 || stack2 === 0) {
            return stack2;
        } else {
            return "";
        }
    });
});

define("app/common/logout-debug", [ "$-debug", "app/common/util-debug", "app/common/interfaceUrl-debug", "app/common/dialog/confirmbox-debug", "arale/dialog/1.3.0/dialog-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/overlay/1.1.4/mask-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "gallery/handlebars/1.0.2/runtime-debug", "app/common/io-debug" ], function(require) {
    "use strict";
    var $ = require("$-debug"), util = require("app/common/util-debug"), io = require("app/common/io-debug");
    $("#J_Logout").on("click", function() {
        io.get(util.getUrl("logout"), {}, function() {
            window.location.href = "/login.htm";
        });
    });
});

define("app/common/sidebar-debug", [ "$-debug" ], function(require) {
    "use strict";
    var $ = require("$-debug");
    $(".nav-item:first,.nav-item:last").children("a").on("click", function() {
        $(this).parent().toggleClass("show");
    });
});
