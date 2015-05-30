define("app/service/user/main-debug", [ "$-debug", "../../common/util-debug", "../../common/interfaceUrl-debug", "../../common/dialog/confirmbox-debug", "arale/dialog/1.3.0/dialog-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/overlay/1.1.4/mask-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "gallery/handlebars/1.0.2/runtime-debug", "../../common/dialog/confirmbox-debug.handlebars", "../../common/io-debug", "../../common/helpers-debug", "gallery/moment/2.8.1/moment-debug", "../../common/paginator-debug", "keenwon/jqPaginator/1.1.0/jqPaginator-debug", "../../common/validator-debug", "arale/validator/0.9.7/validator-debug", "./userGroupList-debug.handlebars", "./userList-debug.handlebars", "./blackUserList-debug.handlebars", "./select-debug.handlebars", "./userGroupDialog-debug.handlebars", "../../common/logout-debug", "../../common/sidebar-debug", "keenwon/select2/3.5.2/select2-debug" ], function(require) {
    "use strict";
    var $ = require("$-debug"), util = require("../../common/util-debug"), io = require("../../common/io-debug"), helpers = require("../../common/helpers-debug"), ConfirmBox = require("../../common/dialog/confirmbox-debug"), paginator = require("../../common/paginator-debug"), Validator = require("../../common/validator-debug").fixedValidator, userGrouplistTemplate = require("./userGroupList-debug.handlebars"), userlistTemplate = require("./userList-debug.handlebars"), blackUserListTemplate = require("./blackUserList-debug.handlebars"), selectTemplate = require("./select-debug.handlebars"), userGroupDialogTemplate = require("./userGroupDialog-debug.handlebars");
    require("../../common/logout-debug");
    require("../../common/sidebar-debug");
    require("gallery/handlebars/1.0.2/handlebars-debug");
    require("keenwon/select2/3.5.2/select2-debug");
    var app = {
        model: {
            pageNo: 1,
            pageSize: 10,
            nickName: "",
            userGroupId: -1
        },
        userGroup: {
            id: -1,
            userGroupName: "好友组",
            userGroupType: "10"
        },
        userGroupList: [],
        isInit: true,
        init: function() {
            var self = this;
            self.cacheElements();
            self.getUserGroupList();
            self.bindEvents();
        },
        cacheElements: function() {
            var self = this;
            self.$main = $("#J_Main");
            self.$form = $("#J_Form");
            self.$list = $("#J_List");
            self.$select = $("#J_Select");
            self.$userGroupName = $("#J_UserGroup_Name");
            self.$userGroupList = $("#J_UserGroup_List");
            self.$createUserGroup = $("#J_UserGroup_Create");
            self.$editUserGroup = $("#J_UserGroup_Edit");
            self.$delUserGroup = $("#J_UserGroup_Del");
        },
        getUserGroupList: function(callback) {
            var self = this, url = util.getUrl("queryUserGroupList"), result, userGrouplistHtml;
            io.get(url, {
                serviceTagId: serviceTagId
            }, function() {
                self.userGroupList = result = this.data;
                userGrouplistHtml = userGrouplistTemplate(result, {
                    helpers: helpers
                });
                self.$userGroupList.html(userGrouplistHtml);
                if (self.isInit) {
                    self.setCurrentUserGroup(result[0]);
                    self.proof();
                    self.isInit = false;
                } else {
                    self.setCurrentUserGroup(self.userGroup);
                }
                callback && callback();
            });
        },
        proof: function() {
            var self = this, data = util.packForm(self.$form);
            self.model = $.extend({}, self.model, data);
            self.model.pageNo = 1;
            self.model.userGroupId = self.userGroup.id;
            self.search();
        },
        search: function() {
            var self = this, url = util.getUrl("queryUserList"), result, listHtml;
            io.get(url, self.model, function() {
                result = this.data;
                if (self.userGroup.userGroupType === "11") {
                    listHtml = blackUserListTemplate(result, {
                        helpers: helpers
                    });
                } else {
                    listHtml = userlistTemplate(result, {
                        helpers: helpers
                    });
                }
                self.$list.html(listHtml);
                paginator({
                    obj: $("#J_Page"),
                    pageNo: result.pageNo,
                    pageSize: result.pageSize,
                    totalHit: result.totalHit,
                    callback: function(num, type) {
                        if (type === "change" && self.model.pageNo != num) {
                            self.model.pageNo = num;
                            self.search();
                        }
                    }
                });
                //调整关注人数
                var $userGroup = $('[data-id="' + self.userGroup.id + '"]');
                $userGroup.text(self.userGroup.userGroupName + "（" + result.totalHit + "）");
            });
        },
        createUserGroup: function() {
            var self = this;
            var cb = new ConfirmBox({
                title: "创建分组",
                width: 400,
                height: 200,
                message: userGroupDialogTemplate({}),
                onConfirm: function() {
                    self.userGroupValidator.execute(function(hasError) {
                        if (!hasError) {
                            var url = util.getUrl("createUserGroup"), data = util.packForm("#J_UserGroupDialog_Form");
                            data.serviceTagId = serviceTagId;
                            io.post(url, data, function() {
                                self.getUserGroupList();
                                cb.hide();
                            });
                        }
                    });
                }
            }).after("show", function() {
                self.initUserGroupValidator();
            }).after("hide", function() {
                self.userGroupValidator && self.userGroupValidator.destroy();
                cb.destroy();
            }).show();
        },
        editUserGroup: function() {
            var self = this;
            var cb = new ConfirmBox({
                title: "编辑分组",
                width: 400,
                height: 200,
                message: userGroupDialogTemplate({
                    userGroup: self.userGroup
                }),
                onConfirm: function() {
                    self.userGroupValidator.execute(function(hasError) {
                        if (!hasError) {
                            var url = util.getUrl("editUserGroup"), data = util.packForm("#J_UserGroupDialog_Form");
                            io.post(url, data, function() {
                                self.getUserGroupList(function() {
                                    $('[data-id="' + data.userGroupId + '"]').parent("li").trigger("click");
                                });
                                cb.hide();
                            });
                        }
                    });
                }
            }).after("show", function() {
                self.initUserGroupValidator();
            }).after("hide", function() {
                self.userGroupValidator && self.userGroupValidator.destroy();
                cb.destroy();
            }).show();
        },
        initUserGroupValidator: function() {
            this.userGroupValidator && this.userGroupValidator.destroy();
            this.userGroupValidator = new Validator({
                element: "#J_UserGroupDialog_Form"
            }).addItem({
                element: "[name=userGroupName]",
                display: "分组名称",
                rule: "maxlength{max:8}",
                required: true
            });
        },
        delUserGroup: function() {
            var self = this;
            ConfirmBox.alert("确认要删除该分组吗？", function() {
                io.post(util.getUrl("delUserGroup"), {
                    userGroupId: self.userGroup.id
                }, function() {
                    self.isInit = true;
                    self.getUserGroupList();
                });
            });
        },
        black: function(userId) {
            var self = this;
            ConfirmBox.alert("确认要将此用户加入黑名单吗？", function() {
                io.post(util.getUrl("moveToBlack"), {
                    serviceTagId: serviceTagId,
                    userId: userId
                }, function() {
                    self.getUserGroupList(function() {
                        $('[data-id="' + self.userGroup.id + '"]').parent("li").trigger("click");
                    });
                });
            });
        },
        outBlack: function(userId) {
            var self = this;
            ConfirmBox.alert("确认要将此用户移出黑名单吗？", function() {
                io.post(util.getUrl("moveOutBlack"), {
                    serviceTagId: serviceTagId,
                    userId: userId
                }, function() {
                    self.getUserGroupList(function() {
                        $('[data-id="' + self.userGroup.id + '"]').parent("li").trigger("click");
                    });
                });
            });
        },
        setCurrentUserGroup: function(userGroup) {
            var self = this, _userGroup, $t, userGroupList = [ '<option value=""></option>' ];
            self.userGroup.id = userGroup.id;
            self.userGroup.userGroupName = userGroup.userGroupName;
            self.userGroup.userGroupType = userGroup.userGroupType;
            self.$userGroupName.text(userGroup.userGroupName);
            $t = self.$userGroupList.find("[data-id=" + userGroup.id + "]").parent("li");
            $t.siblings("li").removeClass("current");
            $t.addClass("current");
            if (userGroup.userGroupType === "12") {
                self.$delUserGroup.show();
                self.$editUserGroup.show();
            } else {
                self.$delUserGroup.hide();
                self.$editUserGroup.hide();
            }
            if (self.userGroup.userGroupType === "11") {
                self.$select.select2("destroy");
                self.$select.hide();
            } else {
                for (var i = 0, j = self.userGroupList.length; i < j; i++) {
                    _userGroup = self.userGroupList[i];
                    if (_userGroup.userGroupType !== "11" && _userGroup.id !== self.userGroup.id) {
                        userGroupList.push(_userGroup);
                    }
                }
                if (userGroupList.length > 1) {
                    self.$list.removeClass("pn-nogroup");
                    self.$select.show();
                    self.$select.html(selectTemplate({
                        userGroupList: userGroupList
                    }, {
                        helpers: helpers
                    }));
                    self.initSelect();
                } else {
                    self.$list.addClass("pn-nogroup");
                    self.$select.select2("destroy");
                    self.$select.hide();
                }
            }
        },
        initSelect: function() {
            var self = this;
            self.$select.select2("destroy");
            self.$select.select2({
                placeholder: "请选择用户分组",
                minimumResultsForSearch: -1
            }).off("select2-selecting").on("select2-selecting", function(e) {
                var checkedItem = self.getCheckedItem();
                if (checkedItem.length <= 0) {
                    ConfirmBox.alert("请选择要移动的用户");
                } else {
                    io.post(util.getUrl("addUserToGroup"), {
                        serviceTagId: serviceTagId,
                        newGroupId: e.val,
                        userIds: checkedItem
                    }, function() {
                        self.getUserGroupList(function() {
                            $('[data-id="' + self.userGroup.id + '"]').parent("li").trigger("click");
                        });
                    });
                }
                self.$select.select2("close");
                return false;
            });
        },
        getCheckedItem: function() {
            var checkedItem = [];
            $(".check-box").not(".check-all").each(function() {
                if ($(this).hasClass("checked")) {
                    checkedItem.push($(this).closest("li").data("userid"));
                }
            });
            return checkedItem;
        },
        bindEvents: function() {
            var self = this;
            self.$userGroupList.on("click", "li", function() {
                var $t = $(this), $a = $t.children("a");
                self.setCurrentUserGroup({
                    id: $a.data("id"),
                    userGroupName: $a.data("name"),
                    userGroupType: $a.data("type").toString()
                });
                // 清空搜索
                self.$form.find('[name="nickName"]').val("");
                self.proof();
            });
            self.$createUserGroup.on("click", $.proxy(self.createUserGroup, self));
            self.$form.on("submit", function() {
                self.proof();
                return false;
            });
            self.$editUserGroup.on("click", $.proxy(self.editUserGroup, self));
            self.$delUserGroup.on("click", $.proxy(self.delUserGroup, self));
            self.$main.on("click", ".check-box", function() {
                var $t = $(this);
                if ($t.hasClass("check-all")) {
                    if ($t.hasClass("checked")) {
                        $(".check-box").removeClass("checked");
                    } else {
                        $(".check-box").addClass("checked");
                    }
                } else {
                    $t.toggleClass("checked");
                    var checkedAll = true;
                    $(".check-box").not(".check-all").each(function() {
                        if (!$(this).hasClass("checked")) {
                            checkedAll = false;
                            return;
                        }
                    });
                    if (checkedAll) {
                        $(".check-all").addClass("checked");
                    } else {
                        $(".check-all").removeClass("checked");
                    }
                }
            });
            self.$main.on("click", "[data-role=black]", function() {
                var userid = $(this).closest("li").data("userid");
                self.black(userid);
            });
            self.$main.on("click", "[data-role=outBlack]", function() {
                var userid = $(this).closest("li").data("userid");
                self.outBlack(userid);
            });
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

define("app/common/validator-debug", [ "arale/validator/0.9.7/validator-debug", "$-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    "use strict";
    var Validator = require("arale/validator/0.9.7/validator-debug");
    exports.relativeValidator = Validator.extend({
        attrs: {
            explainClass: "help-block",
            itemClass: "form-group",
            autoSubmit: false,
            stopOnError: true,
            autoFocus: false,
            itemErrorClass: "has-error",
            inputClass: "form-control",
            textareaClass: "form-control",
            showMessage: function(message, element) {
                message = '<i class="ico ico-error"></i>' + message;
                this.getExplain(element).html(message);
                this.getItem(element).addClass("has-error");
            }
        }
    });
    exports.fixedValidator = Validator.extend({
        attrs: {
            explainClass: "help-block",
            itemClass: "form-group",
            autoSubmit: false,
            stopOnError: true,
            autoFocus: false,
            itemErrorClass: "has-error",
            inputClass: "form-control",
            textareaClass: "form-control",
            showMessage: function(message, element) {
                message = '<i class="ico ico-error"></i>' + message;
                element = element.closest("form").find(".validatorError");
                element.html(message);
                element.addClass("has-error");
            },
            hideMessage: function(message, element) {
                element = element.closest("form").find(".validatorError");
                element.html("&nbsp;");
            }
        }
    });
});

define("arale/validator/0.9.7/validator-debug", [ "./core-debug", "$-debug", "./async-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./utils-debug", "./rule-debug", "./item-debug" ], function(require, exports, module) {
    var Core = require("./core-debug"), $ = require("$-debug");
    var Validator = Core.extend({
        events: {
            "mouseenter .{{attrs.inputClass}}": "mouseenter",
            "mouseleave .{{attrs.inputClass}}": "mouseleave",
            "mouseenter .{{attrs.textareaClass}}": "mouseenter",
            "mouseleave .{{attrs.textareaClass}}": "mouseleave",
            "focus .{{attrs.itemClass}} input,textarea,select": "focus",
            "blur .{{attrs.itemClass}} input,textarea,select": "blur"
        },
        attrs: {
            explainClass: "ui-form-explain",
            itemClass: "ui-form-item",
            itemHoverClass: "ui-form-item-hover",
            itemFocusClass: "ui-form-item-focus",
            itemErrorClass: "ui-form-item-error",
            inputClass: "ui-input",
            textareaClass: "ui-textarea",
            showMessage: function(message, element) {
                this.getExplain(element).html(message);
                this.getItem(element).addClass(this.get("itemErrorClass"));
            },
            hideMessage: function(message, element) {
                this.getExplain(element).html(element.attr("data-explain") || " ");
                this.getItem(element).removeClass(this.get("itemErrorClass"));
            }
        },
        setup: function() {
            Validator.superclass.setup.call(this);
            var that = this;
            this.on("autoFocus", function(ele) {
                that.set("autoFocusEle", ele);
            });
        },
        addItem: function(cfg) {
            Validator.superclass.addItem.apply(this, [].slice.call(arguments));
            var item = this.query(cfg.element);
            if (item) {
                this._saveExplainMessage(item);
            }
            return this;
        },
        _saveExplainMessage: function(item) {
            var that = this;
            var ele = item.element;
            var explain = ele.attr("data-explain");
            // If explaining message is not specified, retrieve it from data-explain attribute of the target
            // or from DOM element with class name of the value of explainClass attr.
            // Explaining message cannot always retrieve from DOM element with class name of the value of explainClass
            // attr because the initial state of form may contain error messages from server.
            // ---
            // Also, If explaining message is under ui-form-item-error className
            // it could be considered to be a error message from server
            // that should not be put into data-explain attribute
            if (explain === undefined && !this.getItem(ele).hasClass(this.get("itemErrorClass"))) {
                ele.attr("data-explain", this.getExplain(ele).html());
            }
        },
        getExplain: function(ele) {
            var item = this.getItem(ele);
            var explain = item.find("." + this.get("explainClass"));
            if (explain.length == 0) {
                explain = $('<div class="' + this.get("explainClass") + '"></div>').appendTo(item);
            }
            return explain;
        },
        getItem: function(ele) {
            ele = $(ele);
            var item = ele.parents("." + this.get("itemClass"));
            return item;
        },
        mouseenter: function(e) {
            this.getItem(e.target).addClass(this.get("itemHoverClass"));
        },
        mouseleave: function(e) {
            this.getItem(e.target).removeClass(this.get("itemHoverClass"));
        },
        focus: function(e) {
            var target = e.target, autoFocusEle = this.get("autoFocusEle");
            if (autoFocusEle && autoFocusEle.has(target)) {
                var that = this;
                $(target).keyup(function(e) {
                    that.set("autoFocusEle", null);
                    that.focus({
                        target: target
                    });
                });
                return;
            }
            this.getItem(target).removeClass(this.get("itemErrorClass"));
            this.getItem(target).addClass(this.get("itemFocusClass"));
            this.getExplain(target).html($(target).attr("data-explain") || "");
        },
        blur: function(e) {
            this.getItem(e.target).removeClass(this.get("itemFocusClass"));
        }
    });
    module.exports = Validator;
});

define("arale/validator/0.9.7/core-debug", [ "$-debug", "arale/validator/0.9.7/async-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/validator/0.9.7/utils-debug", "arale/validator/0.9.7/rule-debug", "arale/validator/0.9.7/item-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), async = require("arale/validator/0.9.7/async-debug"), Widget = require("arale/widget/1.1.1/widget-debug"), utils = require("arale/validator/0.9.7/utils-debug"), Item = require("arale/validator/0.9.7/item-debug");
    var validators = [];
    var setterConfig = {
        value: $.noop,
        setter: function(val) {
            return $.isFunction(val) ? val : utils.helper(val);
        }
    };
    var Core = Widget.extend({
        attrs: {
            triggerType: "blur",
            checkOnSubmit: true,
            // 是否在表单提交前进行校验，默认进行校验。
            stopOnError: false,
            // 校验整个表单时，遇到错误时是否停止校验其他表单项。
            autoSubmit: true,
            // When all validation passed, submit the form automatically.
            checkNull: true,
            // 除提交前的校验外，input的值为空时是否校验。
            onItemValidate: setterConfig,
            onItemValidated: setterConfig,
            onFormValidate: setterConfig,
            onFormValidated: setterConfig,
            // 此函数用来定义如何自动获取校验项对应的 display 字段。
            displayHelper: function(item) {
                var labeltext, name;
                var id = item.element.attr("id");
                if (id) {
                    labeltext = $("label[for=" + id + "]").text();
                    if (labeltext) {
                        labeltext = labeltext.replace(/^[\*\s\:\：]*/, "").replace(/[\*\s\:\：]*$/, "");
                    }
                }
                name = item.element.attr("name");
                return labeltext || name;
            },
            showMessage: setterConfig,
            // specify how to display error messages
            hideMessage: setterConfig,
            // specify how to hide error messages
            autoFocus: true,
            // Automatically focus at the first element failed validation if true.
            failSilently: false,
            // If set to true and the given element passed to addItem does not exist, just ignore.
            skipHidden: false
        },
        setup: function() {
            // Validation will be executed according to configurations stored in items.
            var self = this;
            self.items = [];
            // 外层容器是否是 form 元素
            if (self.element.is("form")) {
                // 记录 form 原来的 novalidate 的值，因为初始化时需要设置 novalidate 的值，destroy 的时候需要恢复。
                self._novalidate_old = self.element.attr("novalidate");
                // disable html5 form validation
                // see: http://bugs.jquery.com/ticket/12577
                try {
                    self.element.attr("novalidate", "novalidate");
                } catch (e) {}
                //If checkOnSubmit is true, then bind submit event to execute validation.
                if (self.get("checkOnSubmit")) {
                    self.element.on("submit.validator", function(e) {
                        e.preventDefault();
                        self.execute(function(err) {
                            !err && self.get("autoSubmit") && self.element.get(0).submit();
                        });
                    });
                }
            }
            // 当每项校验之后, 根据返回的 err 状态, 显示或隐藏提示信息
            self.on("itemValidated", function(err, message, element, event) {
                this.query(element).get(err ? "showMessage" : "hideMessage").call(this, message, element, event);
            });
            validators.push(self);
        },
        Statics: $.extend({
            helper: utils.helper
        }, require("arale/validator/0.9.7/rule-debug"), {
            autoRender: function(cfg) {
                var validator = new this(cfg);
                $("input, textarea, select", validator.element).each(function(i, input) {
                    input = $(input);
                    var type = input.attr("type");
                    if (type == "button" || type == "submit" || type == "reset") {
                        return true;
                    }
                    var options = {};
                    if (type == "radio" || type == "checkbox") {
                        options.element = $("[type=" + type + "][name=" + input.attr("name") + "]", validator.element);
                    } else {
                        options.element = input;
                    }
                    if (!validator.query(options.element)) {
                        var obj = utils.parseDom(input);
                        if (!obj.rule) return true;
                        $.extend(options, obj);
                        validator.addItem(options);
                    }
                });
            },
            query: function(selector) {
                return Widget.query(selector);
            },
            // TODO 校验单项静态方法的实现需要优化
            validate: function(options) {
                var element = $(options.element);
                var validator = new Core({
                    element: element.parents()
                });
                validator.addItem(options);
                validator.query(element).execute();
                validator.destroy();
            }
        }),
        addItem: function(cfg) {
            var self = this;
            if ($.isArray(cfg)) {
                $.each(cfg, function(i, v) {
                    self.addItem(v);
                });
                return this;
            }
            cfg = $.extend({
                triggerType: self.get("triggerType"),
                checkNull: self.get("checkNull"),
                displayHelper: self.get("displayHelper"),
                showMessage: self.get("showMessage"),
                hideMessage: self.get("hideMessage"),
                failSilently: self.get("failSilently"),
                skipHidden: self.get("skipHidden")
            }, cfg);
            // 当 item 初始化的 element 为 selector 字符串时
            // 默认到 validator.element 下去找
            if (typeof cfg.element === "string") {
                cfg.element = this.$(cfg.element);
            }
            if (!$(cfg.element).length) {
                if (cfg.failSilently) {
                    return self;
                } else {
                    throw new Error("element does not exist");
                }
            }
            var item = new Item(cfg);
            self.items.push(item);
            // 关联 item 到当前 validator 对象
            item._validator = self;
            item.delegateEvents(item.get("triggerType"), function(e) {
                if (!this.get("checkNull") && !this.element.val()) return;
                this.execute(null, {
                    event: e
                });
            });
            item.on("all", function(eventName) {
                this.trigger.apply(this, [].slice.call(arguments));
            }, self);
            return self;
        },
        removeItem: function(selector) {
            var self = this, target = selector instanceof Item ? selector : self.query(selector);
            if (target) {
                target.get("hideMessage").call(self, null, target.element);
                erase(target, self.items);
                target.destroy();
            }
            return self;
        },
        execute: function(callback) {
            var self = this, results = [], hasError = false, firstElem = null;
            // 在表单校验前, 隐藏所有校验项的错误提示
            $.each(self.items, function(i, item) {
                item.get("hideMessage").call(self, null, item.element);
            });
            self.trigger("formValidate", self.element);
            async[self.get("stopOnError") ? "forEachSeries" : "forEach"](self.items, function(item, cb) {
                // iterator
                item.execute(function(err, message, ele) {
                    // 第一个校验错误的元素
                    if (err && !hasError) {
                        hasError = true;
                        firstElem = ele;
                    }
                    results.push([].slice.call(arguments, 0));
                    // Async doesn't allow any of tasks to fail, if you want the final callback executed after all tasks finished.
                    // So pass none-error value to task callback instead of the real result.
                    cb(self.get("stopOnError") ? err : null);
                });
            }, function() {
                // complete callback
                if (self.get("autoFocus") && hasError) {
                    self.trigger("autoFocus", firstElem);
                    firstElem.focus();
                }
                self.trigger("formValidated", hasError, results, self.element);
                callback && callback(hasError, results, self.element);
            });
            return self;
        },
        destroy: function() {
            var self = this, len = self.items.length;
            if (self.element.is("form")) {
                try {
                    if (self._novalidate_old == undefined) self.element.removeAttr("novalidate"); else self.element.attr("novalidate", self._novalidate_old);
                } catch (e) {}
                self.element.off("submit.validator");
            }
            for (var i = len - 1; i >= 0; i--) {
                self.removeItem(self.items[i]);
            }
            erase(self, validators);
            Core.superclass.destroy.call(this);
        },
        query: function(selector) {
            return findItemBySelector(this.$(selector), this.items);
        }
    });
    // 从数组中删除对应元素
    function erase(target, array) {
        for (var i = 0; i < array.length; i++) {
            if (target === array[i]) {
                array.splice(i, 1);
                return array;
            }
        }
    }
    function findItemBySelector(target, array) {
        var ret;
        $.each(array, function(i, item) {
            if (target.get(0) === item.element.get(0)) {
                ret = item;
                return false;
            }
        });
        return ret;
    }
    module.exports = Core;
});

// Thanks to Caolan McMahon. These codes blow come from his project Async(https://github.com/caolan/async).
define("arale/validator/0.9.7/async-debug", [], function(require, exports, module) {
    var async = {};
    module.exports = async;
    //// cross-browser compatiblity functions ////
    var _forEach = function(arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };
    var _map = function(arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _forEach(arr, function(x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };
    var _keys = function(obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };
    //// exported async module functions ////
    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === "undefined" || !process.nextTick) {
        async.nextTick = function(fn) {
            setTimeout(fn, 0);
        };
    } else {
        async.nextTick = process.nextTick;
    }
    async.forEach = function(arr, iterator, callback) {
        callback = callback || function() {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _forEach(arr, function(x) {
            iterator(x, function(err) {
                if (err) {
                    callback(err);
                    callback = function() {};
                } else {
                    completed += 1;
                    if (completed === arr.length) {
                        callback(null);
                    }
                }
            });
        });
    };
    async.forEachSeries = function(arr, iterator, callback) {
        callback = callback || function() {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function() {
            iterator(arr[completed], function(err) {
                if (err) {
                    callback(err);
                    callback = function() {};
                } else {
                    completed += 1;
                    if (completed === arr.length) {
                        callback(null);
                    } else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    var doParallel = function(fn) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [ async.forEach ].concat(args));
        };
    };
    var doSeries = function(fn) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [ async.forEachSeries ].concat(args));
        };
    };
    var _asyncMap = function(eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function(x, i) {
            return {
                index: i,
                value: x
            };
        });
        eachfn(arr, function(x, callback) {
            iterator(x.value, function(err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function(err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.series = function(tasks, callback) {
        callback = callback || function() {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function(fn, callback) {
                if (fn) {
                    fn(function(err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        } else {
            var results = {};
            async.forEachSeries(_keys(tasks), function(k, callback) {
                tasks[k](function(err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function(err) {
                callback(err, results);
            });
        }
    };
});

define("arale/validator/0.9.7/utils-debug", [ "$-debug", "arale/validator/0.9.7/rule-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), Rule = require("arale/validator/0.9.7/rule-debug");
    var u_count = 0;
    var helpers = {};
    function unique() {
        return "__anonymous__" + u_count++;
    }
    function parseRules(str) {
        if (!str) return null;
        return str.match(/[a-zA-Z0-9\-\_]+(\{[^\{\}]*\})?/g);
    }
    function parseDom(field) {
        var field = $(field);
        var result = {};
        var arr = [];
        //parse required attribute
        var required = field.attr("required");
        if (required) {
            arr.push("required");
            result.required = true;
        }
        //parse type attribute
        var type = field.attr("type");
        if (type && type != "submit" && type != "cancel" && type != "checkbox" && type != "radio" && type != "select" && type != "select-one" && type != "file" && type != "hidden" && type != "textarea") {
            if (!Rule.getRule(type)) {
                throw new Error('Form field with type "' + type + '" not supported!');
            }
            arr.push(type);
        }
        //parse min attribute
        var min = field.attr("min");
        if (min) {
            arr.push('min{"min":"' + min + '"}');
        }
        //parse max attribute
        var max = field.attr("max");
        if (max) {
            arr.push("max{max:" + max + "}");
        }
        //parse minlength attribute
        var minlength = field.attr("minlength");
        if (minlength) {
            arr.push("minlength{min:" + minlength + "}");
        }
        //parse maxlength attribute
        var maxlength = field.attr("maxlength");
        if (maxlength) {
            arr.push("maxlength{max:" + maxlength + "}");
        }
        //parse pattern attribute
        var pattern = field.attr("pattern");
        if (pattern) {
            var regexp = new RegExp(pattern), name = unique();
            Rule.addRule(name, regexp);
            arr.push(name);
        }
        //parse data-rule attribute to get custom rules
        var rules = field.attr("data-rule");
        rules = rules && parseRules(rules);
        if (rules) arr = arr.concat(rules);
        result.rule = arr.length == 0 ? null : arr.join(" ");
        return result;
    }
    function parseJSON(str) {
        if (!str) return null;
        var NOTICE = 'Invalid option object "' + str + '".';
        // remove braces
        str = str.slice(1, -1);
        var result = {};
        var arr = str.split(",");
        $.each(arr, function(i, v) {
            arr[i] = $.trim(v);
            if (!arr[i]) throw new Error(NOTICE);
            var arr2 = arr[i].split(":");
            var key = $.trim(arr2[0]), value = $.trim(arr2[1]);
            if (!key || !value) throw new Error(NOTICE);
            result[getValue(key)] = $.trim(getValue(value));
        });
        // 'abc' -> 'abc'  '"abc"' -> 'abc'
        function getValue(str) {
            if (str.charAt(0) == '"' && str.charAt(str.length - 1) == '"' || str.charAt(0) == "'" && str.charAt(str.length - 1) == "'") {
                return eval(str);
            }
            return str;
        }
        return result;
    }
    function isHidden(ele) {
        var w = ele[0].offsetWidth, h = ele[0].offsetHeight, force = ele.prop("tagName") === "TR";
        return w === 0 && h === 0 && !force ? true : w !== 0 && h !== 0 && !force ? false : ele.css("display") === "none";
    }
    module.exports = {
        parseRule: function(str) {
            var match = str.match(/([^{}:\s]*)(\{[^\{\}]*\})?/);
            // eg. { name: "valueBetween", param: {min: 1, max: 2} }
            return {
                name: match[1],
                param: parseJSON(match[2])
            };
        },
        parseRules: parseRules,
        parseDom: parseDom,
        isHidden: isHidden,
        helper: function(name, fn) {
            if (fn) {
                helpers[name] = fn;
                return this;
            }
            return helpers[name];
        }
    };
});

define("arale/validator/0.9.7/rule-debug", [ "$-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), rules = {}, messages = {};
    function Rule(name, oper) {
        var self = this;
        self.name = name;
        if (oper instanceof RegExp) {
            self.operator = function(opts, commit) {
                var rslt = oper.test($(opts.element).val());
                commit(rslt ? null : opts.rule, _getMsg(opts, rslt));
            };
        } else if ($.isFunction(oper)) {
            self.operator = function(opts, commit) {
                var rslt = oper.call(this, opts, function(result, msg) {
                    commit(result ? null : opts.rule, msg || _getMsg(opts, result));
                });
                // 当是异步判断时, 返回 undefined, 则执行上面的 commit
                if (rslt !== undefined) {
                    commit(rslt ? null : opts.rule, _getMsg(opts, rslt));
                }
            };
        } else {
            throw new Error("The second argument must be a regexp or a function.");
        }
    }
    Rule.prototype.and = function(name, options) {
        var target = name instanceof Rule ? name : getRule(name, options);
        if (!target) {
            throw new Error('No rule with name "' + name + '" found.');
        }
        var that = this;
        var operator = function(opts, commit) {
            that.operator.call(this, opts, function(err, msg) {
                if (err) {
                    commit(err, _getMsg(opts, !err));
                } else {
                    target.operator.call(this, opts, commit);
                }
            });
        };
        return new Rule(null, operator);
    };
    Rule.prototype.or = function(name, options) {
        var target = name instanceof Rule ? name : getRule(name, options);
        if (!target) {
            throw new Error('No rule with name "' + name + '" found.');
        }
        var that = this;
        var operator = function(opts, commit) {
            that.operator.call(this, opts, function(err, msg) {
                if (err) {
                    target.operator.call(this, opts, commit);
                } else {
                    commit(null, _getMsg(opts, true));
                }
            });
        };
        return new Rule(null, operator);
    };
    Rule.prototype.not = function(options) {
        var target = getRule(this.name, options);
        var operator = function(opts, commit) {
            target.operator.call(this, opts, function(err, msg) {
                if (err) {
                    commit(null, _getMsg(opts, true));
                } else {
                    commit(true, _getMsg(opts, false));
                }
            });
        };
        return new Rule(null, operator);
    };
    function addRule(name, operator, message) {
        if ($.isPlainObject(name)) {
            $.each(name, function(i, v) {
                if ($.isArray(v)) addRule(i, v[0], v[1]); else addRule(i, v);
            });
            return this;
        }
        if (operator instanceof Rule) {
            rules[name] = new Rule(name, operator.operator);
        } else {
            rules[name] = new Rule(name, operator);
        }
        setMessage(name, message);
        return this;
    }
    function _getMsg(opts, b) {
        var ruleName = opts.rule;
        var msgtpl;
        if (opts.message) {
            // user specifies a message
            if ($.isPlainObject(opts.message)) {
                msgtpl = opts.message[b ? "success" : "failure"];
                // if user's message is undefined，use default
                typeof msgtpl === "undefined" && (msgtpl = messages[ruleName][b ? "success" : "failure"]);
            } else {
                //just string
                msgtpl = b ? "" : opts.message;
            }
        } else {
            // use default
            msgtpl = messages[ruleName][b ? "success" : "failure"];
        }
        return msgtpl ? compileTpl(opts, msgtpl) : msgtpl;
    }
    function setMessage(name, msg) {
        if ($.isPlainObject(name)) {
            $.each(name, function(i, v) {
                setMessage(i, v);
            });
            return this;
        }
        if ($.isPlainObject(msg)) {
            messages[name] = msg;
        } else {
            messages[name] = {
                failure: msg
            };
        }
        return this;
    }
    function getRule(name, opts) {
        if (opts) {
            var rule = rules[name];
            return new Rule(null, function(options, commit) {
                rule.operator($.extend(null, options, opts), commit);
            });
        } else {
            return rules[name];
        }
    }
    function compileTpl(obj, tpl) {
        var result = tpl;
        var regexp1 = /\{\{[^\{\}]*\}\}/g, regexp2 = /\{\{(.*)\}\}/;
        var arr = tpl.match(regexp1);
        arr && $.each(arr, function(i, v) {
            var key = v.match(regexp2)[1];
            var value = obj[$.trim(key)];
            result = result.replace(v, value);
        });
        return result;
    }
    addRule("required", function(options) {
        var element = $(options.element);
        var t = element.attr("type");
        switch (t) {
          case "checkbox":
          case "radio":
            var checked = false;
            element.each(function(i, item) {
                if ($(item).prop("checked")) {
                    checked = true;
                    return false;
                }
            });
            return checked;

          default:
            return Boolean($.trim(element.val()));
        }
    }, "请输入{{display}}");
    addRule("email", /^\s*([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,20})\s*$/, "{{display}}的格式不正确");
    addRule("text", /.*/);
    addRule("password", /.*/);
    addRule("radio", /.*/);
    addRule("checkbox", /.*/);
    addRule("url", /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, "{{display}}的格式不正确");
    addRule("number", /^[+-]?[1-9][0-9]*(\.[0-9]+)?([eE][+-][1-9][0-9]*)?$|^[+-]?0?\.[0-9]+([eE][+-][1-9][0-9]*)?$/, "{{display}}的格式不正确");
    // 00123450 是 digits 但不是 number
    // 1.23 是 number 但不是 digits
    addRule("digits", /^\s*\d+\s*$/, "{{display}}的格式不正确");
    addRule("date", /^\d{4}\-[01]?\d\-[0-3]?\d$|^[01]\d\/[0-3]\d\/\d{4}$|^\d{4}年[01]?\d月[0-3]?\d[日号]$/, "{{display}}的格式不正确");
    addRule("min", function(options) {
        var element = options.element, min = options.min;
        return Number(element.val()) >= Number(min);
    }, "{{display}}必须大于或者等于{{min}}");
    addRule("max", function(options) {
        var element = options.element, max = options.max;
        return Number(element.val()) <= Number(max);
    }, "{{display}}必须小于或者等于{{max}}");
    addRule("minlength", function(options) {
        var element = options.element;
        var l = element.val().length;
        return l >= Number(options.min);
    }, "{{display}}的长度必须大于或等于{{min}}");
    addRule("maxlength", function(options) {
        var element = options.element;
        var l = element.val().length;
        return l <= Number(options.max);
    }, "{{display}}的长度必须小于或等于{{max}}");
    addRule("mobile", /^1\d{10}$/, "请输入正确的{{display}}");
    addRule("confirmation", function(options) {
        var element = options.element, target = $(options.target);
        return element.val() == target.val();
    }, "两次输入的{{display}}不一致，请重新输入");
    module.exports = {
        addRule: addRule,
        setMessage: setMessage,
        getMessage: function(options, isSuccess) {
            return _getMsg(options, isSuccess);
        },
        getRule: getRule,
        getOperator: function(name) {
            return rules[name].operator;
        }
    };
});

define("arale/validator/0.9.7/item-debug", [ "$-debug", "arale/validator/0.9.7/utils-debug", "arale/validator/0.9.7/rule-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/validator/0.9.7/async-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), utils = require("arale/validator/0.9.7/utils-debug"), Widget = require("arale/widget/1.1.1/widget-debug"), async = require("arale/validator/0.9.7/async-debug"), Rule = require("arale/validator/0.9.7/rule-debug");
    var setterConfig = {
        value: $.noop,
        setter: function(val) {
            return $.isFunction(val) ? val : utils.helper(val);
        }
    };
    var Item = Widget.extend({
        attrs: {
            rule: {
                value: "",
                getter: function(val) {
                    // 在获取的时候动态判断是否required，来追加或者删除 rule: required
                    if (this.get("required")) {
                        if (!val || val.indexOf("required") < 0) {
                            val = "required " + val;
                        }
                    } else {
                        if (val.indexOf("required") != -1) {
                            val = val.replace("required ");
                        }
                    }
                    return val;
                }
            },
            display: null,
            displayHelper: null,
            triggerType: {
                getter: function(val) {
                    if (!val) return val;
                    var element = this.element, type = element.attr("type");
                    // 将 select, radio, checkbox 的 blur 和 key 事件转成 change
                    var b = element.is("select") || type == "radio" || type == "checkbox";
                    if (b && (val.indexOf("blur") > -1 || val.indexOf("key") > -1)) return "change";
                    return val;
                }
            },
            required: {
                value: false,
                getter: function(val) {
                    return $.isFunction(val) ? val() : val;
                }
            },
            checkNull: true,
            errormessage: null,
            onItemValidate: setterConfig,
            onItemValidated: setterConfig,
            showMessage: setterConfig,
            hideMessage: setterConfig
        },
        setup: function() {
            if (!this.get("display") && $.isFunction(this.get("displayHelper"))) {
                this.set("display", this.get("displayHelper")(this));
            }
        },
        // callback 为当这个项校验完后, 通知 form 的 async.forEachSeries 此项校验结束并把结果通知到 async,
        // 通过 async.forEachSeries 的第二个参数 Fn(item, cb) 的 cb 参数
        execute: function(callback, context) {
            var self = this, elemDisabled = !!self.element.attr("disabled");
            context = context || {};
            // 如果是设置了不检查不可见元素的话, 直接 callback
            if (self.get("skipHidden") && utils.isHidden(self.element) || elemDisabled) {
                callback && callback(null, "", self.element);
                return self;
            }
            self.trigger("itemValidate", self.element, context.event);
            var rules = utils.parseRules(self.get("rule"));
            if (rules) {
                _metaValidate(self, rules, function(err, msg) {
                    self.trigger("itemValidated", err, msg, self.element, context.event);
                    callback && callback(err, msg, self.element);
                });
            } else {
                callback && callback(null, "", self.element);
            }
            return self;
        },
        getMessage: function(theRule, isSuccess, options) {
            var message = "", self = this, rules = utils.parseRules(self.get("rule"));
            isSuccess = !!isSuccess;
            $.each(rules, function(i, item) {
                var obj = utils.parseRule(item), ruleName = obj.name, param = obj.param;
                if (theRule === ruleName) {
                    message = Rule.getMessage($.extend(options || {}, getMsgOptions(param, ruleName, self)), isSuccess);
                }
            });
            return message;
        }
    });
    function getMsgOptions(param, ruleName, self) {
        var options = $.extend({}, param, {
            element: self.element,
            display: param && param.display || self.get("display"),
            rule: ruleName
        });
        var message = self.get("errormessage") || self.get("errormessage" + upperFirstLetter(ruleName));
        if (message && !options.message) {
            options.message = {
                failure: message
            };
        }
        return options;
    }
    function upperFirstLetter(str) {
        str = str + "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function _metaValidate(self, rules, callback) {
        var ele = self.element;
        if (!self.get("required")) {
            var truly = false;
            var t = ele.attr("type");
            switch (t) {
              case "checkbox":
              case "radio":
                var checked = false;
                ele.each(function(i, item) {
                    if ($(item).prop("checked")) {
                        checked = true;
                        return false;
                    }
                });
                truly = checked;
                break;

              default:
                truly = !!ele.val();
            }
            // 非必要且没有值的时候, 直接 callback
            if (!truly) {
                callback && callback(null, null);
                return;
            }
        }
        if (!$.isArray(rules)) throw new Error("No validation rule specified or not specified as an array.");
        var tasks = [];
        $.each(rules, function(i, item) {
            var obj = utils.parseRule(item), ruleName = obj.name, param = obj.param;
            var ruleOperator = Rule.getOperator(ruleName);
            if (!ruleOperator) throw new Error('Validation rule with name "' + ruleName + '" cannot be found.');
            var options = getMsgOptions(param, ruleName, self);
            tasks.push(function(cb) {
                // cb 为 async.series 每个 tasks 函数 的 callback!!
                // callback(err, results)
                // self._validator 为当前 Item 对象所在的 Validator 对象
                ruleOperator.call(self._validator, options, cb);
            });
        });
        // form.execute -> 多个 item.execute -> 多个 rule.operator
        // 多个 rule 的校验是串行的, 前一个出错, 立即停止
        // async.series 的 callback fn, 在执行 tasks 结束或某个 task 出错后被调用
        // 其参数 results 为当前每个 task 执行的结果
        // 函数内的 callback 回调给项校验
        async.series(tasks, function(err, results) {
            callback && callback(err, results[results.length - 1]);
        });
    }
    module.exports = Item;
});

define("app/service/user/userGroupList-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n    <li class="sub-nav-item">\r\n        <a href="javascript:;" class="sub-nav-tit" data-id="';
            if (stack1 = helpers.id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" data-type="';
            if (stack1 = helpers.userGroupType) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.userGroupType;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" data-name="';
            if (stack1 = helpers.userGroupName) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.userGroupName;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">';
            if (stack1 = helpers.userGroupName) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.userGroupName;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "（";
            if (stack1 = helpers.userNum) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.userNum;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "）</a>\r\n    </li>\r\n";
            return buffer;
        }
        stack1 = helpers.each.call(depth0, depth0, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            return stack1;
        } else {
            return "";
        }
    });
});

define("app/service/user/userList-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var stack1, stack2, options, functionType = "function", escapeExpression = this.escapeExpression, helperMissing = helpers.helperMissing, self = this;
        function program1(depth0, data) {
            return '\r\n    <div class="nodata-box">\r\n        <img src="http://ue1.17173cdn.com/a/2035/open/2014/img/nodata.jpg" alt="暂无数据" width="84" height="90">\r\n\r\n        <div class="tit">暂无数据...</div>\r\n    </div>\r\n';
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n    <div class="comm-mod">\r\n        <div class="mod-hd">\r\n            <div class="check-box check-all">\r\n                <div class="check-in"></div>\r\n                <div class="check-txt">全选</div>\r\n            </div>\r\n            <div class="tit tit-name">用户名称</div>\r\n            <div class="tit w-15">手机号码</div>\r\n            <div class="tit">关注时间</div>\r\n        </div>\r\n        <div class="comm-bd">\r\n            <ul class="comm-list">\r\n                ';
            stack1 = helpers.each.call(depth0, depth0.listData, {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '\r\n            </ul>\r\n\r\n            <ul class="pagination" id="J_Page"></ul>\r\n\r\n        </div>\r\n    </div>\r\n';
            return buffer;
        }
        function program4(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += '\r\n                    <li class="list-item" data-userid="';
            if (stack1 = helpers.userId) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.userId;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">\r\n                        <div class="check-box">\r\n                            <div class="check-in"></div>\r\n                        </div>\r\n                        <div class="pic-box"><img src="';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getAvatars, stack1 ? stack1.call(depth0, depth0.userId, options) : helperMissing.call(depth0, "getAvatars", depth0.userId, options))) + '" width="40" height="40" alt="" class="pic-user"></div>\r\n                        <div class="info name" title="';
            if (stack2 = helpers.userName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.userName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">';
            if (stack2 = helpers.userName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.userName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</div>\r\n                        <div class="info w-15">';
            if (stack2 = helpers.cellphone) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.cellphone;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</div>\r\n                        <div class="info">';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.fDate, stack1 ? stack1.call(depth0, depth0.focusTime, options) : helperMissing.call(depth0, "fDate", depth0.focusTime, options))) + '</div>\r\n                        <a href="javascript:;" class="btn btn-black" data-role="black" title="加入黑名单"></a>\r\n                    </li>\r\n                ';
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

define("app/service/user/blackUserList-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var stack1, stack2, options, functionType = "function", escapeExpression = this.escapeExpression, helperMissing = helpers.helperMissing, self = this;
        function program1(depth0, data) {
            return '\r\n    <div class="nodata-box">\r\n        <img src="http://ue1.17173cdn.com/a/2035/open/2014/img/nodata.jpg" alt="暂无数据" width="84" height="90">\r\n\r\n        <div class="tit">暂无数据...</div>\r\n    </div>\r\n';
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n    <div class="comm-mod comm-mod-ex2">\r\n        <div class="mod-hd">\r\n            <div class="tit tit-name">用户名称</div>\r\n            <div class="tit w-15">手机号码</div>\r\n            <div class="tit">关注时间</div>\r\n        </div>\r\n        <div class="comm-bd">\r\n            <ul class="comm-list">\r\n                ';
            stack1 = helpers.each.call(depth0, depth0.listData, {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '\r\n            </ul>\r\n\r\n            <ul class="pagination" id="J_Page"></ul>\r\n        </div>\r\n    </div>\r\n';
            return buffer;
        }
        function program4(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += '\r\n                    <li class="list-item" data-userid="';
            if (stack1 = helpers.userId) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.userId;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">\r\n                        <div class="pic-box"><img src="';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getAvatars, stack1 ? stack1.call(depth0, depth0.userId, options) : helperMissing.call(depth0, "getAvatars", depth0.userId, options))) + '" width="40" height="40" alt="" class="pic-user"></div>\r\n                        <div class="info name" title="';
            if (stack2 = helpers.userName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.userName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">';
            if (stack2 = helpers.userName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.userName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</div>\r\n                        <div class="info w-15">';
            if (stack2 = helpers.cellphone) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.cellphone;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</div>\r\n                        <div class="info">';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.fDate, stack1 ? stack1.call(depth0, depth0.focusTime, options) : helperMissing.call(depth0, "fDate", depth0.focusTime, options))) + '</div>\r\n                        <a href="javascript:;" class="btn btn-black2" data-role="outBlack" title="移出黑名单"></a>\r\n                    </li>\r\n                ';
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

define("app/service/user/select-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n    <option value="';
            if (stack1 = helpers.id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">';
            if (stack1 = helpers.userGroupName) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.userGroupName;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "</option>\r\n";
            return buffer;
        }
        stack1 = helpers.each.call(depth0, depth0.userGroupList, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            return stack1;
        } else {
            return "";
        }
    });
});

define("app/service/user/userGroupDialog-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
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
            buffer += '\r\n        <input type="hidden" name="userGroupId" value="' + escapeExpression((stack1 = (stack1 = depth0.userGroup, 
            stack1 == null || stack1 === false ? stack1 : stack1.id), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" />\r\n    ';
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n                        <input type="text" class="form-control" name="userGroupName" value="' + escapeExpression((stack1 = (stack1 = depth0.userGroup, 
            stack1 == null || stack1 === false ? stack1 : stack1.userGroupName), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" />\r\n                    ';
            return buffer;
        }
        function program5(depth0, data) {
            return '\r\n                        <input type="text" class="form-control" name="userGroupName" />\r\n                    ';
        }
        buffer += '<form id="J_UserGroupDialog_Form">\r\n    ';
        stack1 = helpers["if"].call(depth0, depth0.userGroup, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\r\n    <table class="comm-table">\r\n        <tbody>\r\n        <tr>\r\n            <th>分组名称</th>\r\n            <td>\r\n                <div class="form-group">\r\n                    ';
        stack1 = helpers["if"].call(depth0, depth0.userGroup, {
            hash: {},
            inverse: self.program(5, program5, data),
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\r\n                </div>\r\n            </td>\r\n        </tr>\r\n        <tr>\r\n            <th></th>\r\n            <td>\r\n                <div class="form-group form-group-inline has-error">\r\n                    <p class="validatorError help-block">&nbsp;</p>\r\n                </div>\r\n            </td>\r\n        </tr>\r\n        </tbody>\r\n    </table>\r\n</form>';
        return buffer;
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

define("keenwon/select2/3.5.2/select2-debug", [ "$" ], function(require) {
    var jQuery = require("$");
    require("./select2-debug.css");
    /*
     Copyright 2012 Igor Vaynberg

     Version: 3.5.2 Timestamp: Sat Nov  1 14:43:36 EDT 2014

     This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
     General Public License version 2 (the "GPL License"). You may choose either license to govern your
     use of this software only upon the condition that you accept all of the terms of either the Apache
     License or the GPL License.

     You may obtain a copy of the Apache License and the GPL License at:

     http://www.apache.org/licenses/LICENSE-2.0
     http://www.gnu.org/licenses/gpl-2.0.html

     Unless required by applicable law or agreed to in writing, software distributed under the
     Apache License or the GPL License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
     CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for
     the specific language governing permissions and limitations under the Apache License and the GPL License.
     */
    (function($) {
        if (typeof $.fn.each2 == "undefined") {
            $.extend($.fn, {
                /*
                 * 4-10 times faster .each replacement
                 * use it carefully, as it overrides jQuery context of element on each iteration
                 */
                each2: function(c) {
                    var j = $([ 0 ]), i = -1, l = this.length;
                    while (++i < l && (j.context = j[0] = this[i]) && c.call(j[0], i, j) !== false) ;
                    return this;
                }
            });
        }
    })(jQuery);
    (function($, undefined) {
        "use strict";
        /*global document, window, jQuery, console */
        if (window.Select2 !== undefined) {
            return;
        }
        var AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer, lastMousePosition = {
            x: 0,
            y: 0
        }, $document, scrollBarDimensions, KEY = {
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            SPACE: 32,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            HOME: 36,
            END: 35,
            BACKSPACE: 8,
            DELETE: 46,
            isArrow: function(k) {
                k = k.which ? k.which : k;
                switch (k) {
                  case KEY.LEFT:
                  case KEY.RIGHT:
                  case KEY.UP:
                  case KEY.DOWN:
                    return true;
                }
                return false;
            },
            isControl: function(e) {
                var k = e.which;
                switch (k) {
                  case KEY.SHIFT:
                  case KEY.CTRL:
                  case KEY.ALT:
                    return true;
                }
                if (e.metaKey) return true;
                return false;
            },
            isFunctionKey: function(k) {
                k = k.which ? k.which : k;
                return k >= 112 && k <= 123;
            }
        }, MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>", DIACRITICS = {
            "Ⓐ": "A",
            "Ａ": "A",
            "À": "A",
            "Á": "A",
            "Â": "A",
            "Ầ": "A",
            "Ấ": "A",
            "Ẫ": "A",
            "Ẩ": "A",
            "Ã": "A",
            "Ā": "A",
            "Ă": "A",
            "Ằ": "A",
            "Ắ": "A",
            "Ẵ": "A",
            "Ẳ": "A",
            "Ȧ": "A",
            "Ǡ": "A",
            "Ä": "A",
            "Ǟ": "A",
            "Ả": "A",
            "Å": "A",
            "Ǻ": "A",
            "Ǎ": "A",
            "Ȁ": "A",
            "Ȃ": "A",
            "Ạ": "A",
            "Ậ": "A",
            "Ặ": "A",
            "Ḁ": "A",
            "Ą": "A",
            "Ⱥ": "A",
            "Ɐ": "A",
            "Ꜳ": "AA",
            "Æ": "AE",
            "Ǽ": "AE",
            "Ǣ": "AE",
            "Ꜵ": "AO",
            "Ꜷ": "AU",
            "Ꜹ": "AV",
            "Ꜻ": "AV",
            "Ꜽ": "AY",
            "Ⓑ": "B",
            "Ｂ": "B",
            "Ḃ": "B",
            "Ḅ": "B",
            "Ḇ": "B",
            "Ƀ": "B",
            "Ƃ": "B",
            "Ɓ": "B",
            "Ⓒ": "C",
            "Ｃ": "C",
            "Ć": "C",
            "Ĉ": "C",
            "Ċ": "C",
            "Č": "C",
            "Ç": "C",
            "Ḉ": "C",
            "Ƈ": "C",
            "Ȼ": "C",
            "Ꜿ": "C",
            "Ⓓ": "D",
            "Ｄ": "D",
            "Ḋ": "D",
            "Ď": "D",
            "Ḍ": "D",
            "Ḑ": "D",
            "Ḓ": "D",
            "Ḏ": "D",
            "Đ": "D",
            "Ƌ": "D",
            "Ɗ": "D",
            "Ɖ": "D",
            "Ꝺ": "D",
            "Ǳ": "DZ",
            "Ǆ": "DZ",
            "ǲ": "Dz",
            "ǅ": "Dz",
            "Ⓔ": "E",
            "Ｅ": "E",
            "È": "E",
            "É": "E",
            "Ê": "E",
            "Ề": "E",
            "Ế": "E",
            "Ễ": "E",
            "Ể": "E",
            "Ẽ": "E",
            "Ē": "E",
            "Ḕ": "E",
            "Ḗ": "E",
            "Ĕ": "E",
            "Ė": "E",
            "Ë": "E",
            "Ẻ": "E",
            "Ě": "E",
            "Ȅ": "E",
            "Ȇ": "E",
            "Ẹ": "E",
            "Ệ": "E",
            "Ȩ": "E",
            "Ḝ": "E",
            "Ę": "E",
            "Ḙ": "E",
            "Ḛ": "E",
            "Ɛ": "E",
            "Ǝ": "E",
            "Ⓕ": "F",
            "Ｆ": "F",
            "Ḟ": "F",
            "Ƒ": "F",
            "Ꝼ": "F",
            "Ⓖ": "G",
            "Ｇ": "G",
            "Ǵ": "G",
            "Ĝ": "G",
            "Ḡ": "G",
            "Ğ": "G",
            "Ġ": "G",
            "Ǧ": "G",
            "Ģ": "G",
            "Ǥ": "G",
            "Ɠ": "G",
            "Ꞡ": "G",
            "Ᵹ": "G",
            "Ꝿ": "G",
            "Ⓗ": "H",
            "Ｈ": "H",
            "Ĥ": "H",
            "Ḣ": "H",
            "Ḧ": "H",
            "Ȟ": "H",
            "Ḥ": "H",
            "Ḩ": "H",
            "Ḫ": "H",
            "Ħ": "H",
            "Ⱨ": "H",
            "Ⱶ": "H",
            "Ɥ": "H",
            "Ⓘ": "I",
            "Ｉ": "I",
            "Ì": "I",
            "Í": "I",
            "Î": "I",
            "Ĩ": "I",
            "Ī": "I",
            "Ĭ": "I",
            "İ": "I",
            "Ï": "I",
            "Ḯ": "I",
            "Ỉ": "I",
            "Ǐ": "I",
            "Ȉ": "I",
            "Ȋ": "I",
            "Ị": "I",
            "Į": "I",
            "Ḭ": "I",
            "Ɨ": "I",
            "Ⓙ": "J",
            "Ｊ": "J",
            "Ĵ": "J",
            "Ɉ": "J",
            "Ⓚ": "K",
            "Ｋ": "K",
            "Ḱ": "K",
            "Ǩ": "K",
            "Ḳ": "K",
            "Ķ": "K",
            "Ḵ": "K",
            "Ƙ": "K",
            "Ⱪ": "K",
            "Ꝁ": "K",
            "Ꝃ": "K",
            "Ꝅ": "K",
            "Ꞣ": "K",
            "Ⓛ": "L",
            "Ｌ": "L",
            "Ŀ": "L",
            "Ĺ": "L",
            "Ľ": "L",
            "Ḷ": "L",
            "Ḹ": "L",
            "Ļ": "L",
            "Ḽ": "L",
            "Ḻ": "L",
            "Ł": "L",
            "Ƚ": "L",
            "Ɫ": "L",
            "Ⱡ": "L",
            "Ꝉ": "L",
            "Ꝇ": "L",
            "Ꞁ": "L",
            "Ǉ": "LJ",
            "ǈ": "Lj",
            "Ⓜ": "M",
            "Ｍ": "M",
            "Ḿ": "M",
            "Ṁ": "M",
            "Ṃ": "M",
            "Ɱ": "M",
            "Ɯ": "M",
            "Ⓝ": "N",
            "Ｎ": "N",
            "Ǹ": "N",
            "Ń": "N",
            "Ñ": "N",
            "Ṅ": "N",
            "Ň": "N",
            "Ṇ": "N",
            "Ņ": "N",
            "Ṋ": "N",
            "Ṉ": "N",
            "Ƞ": "N",
            "Ɲ": "N",
            "Ꞑ": "N",
            "Ꞥ": "N",
            "Ǌ": "NJ",
            "ǋ": "Nj",
            "Ⓞ": "O",
            "Ｏ": "O",
            "Ò": "O",
            "Ó": "O",
            "Ô": "O",
            "Ồ": "O",
            "Ố": "O",
            "Ỗ": "O",
            "Ổ": "O",
            "Õ": "O",
            "Ṍ": "O",
            "Ȭ": "O",
            "Ṏ": "O",
            "Ō": "O",
            "Ṑ": "O",
            "Ṓ": "O",
            "Ŏ": "O",
            "Ȯ": "O",
            "Ȱ": "O",
            "Ö": "O",
            "Ȫ": "O",
            "Ỏ": "O",
            "Ő": "O",
            "Ǒ": "O",
            "Ȍ": "O",
            "Ȏ": "O",
            "Ơ": "O",
            "Ờ": "O",
            "Ớ": "O",
            "Ỡ": "O",
            "Ở": "O",
            "Ợ": "O",
            "Ọ": "O",
            "Ộ": "O",
            "Ǫ": "O",
            "Ǭ": "O",
            "Ø": "O",
            "Ǿ": "O",
            "Ɔ": "O",
            "Ɵ": "O",
            "Ꝋ": "O",
            "Ꝍ": "O",
            "Ƣ": "OI",
            "Ꝏ": "OO",
            "Ȣ": "OU",
            "Ⓟ": "P",
            "Ｐ": "P",
            "Ṕ": "P",
            "Ṗ": "P",
            "Ƥ": "P",
            "Ᵽ": "P",
            "Ꝑ": "P",
            "Ꝓ": "P",
            "Ꝕ": "P",
            "Ⓠ": "Q",
            "Ｑ": "Q",
            "Ꝗ": "Q",
            "Ꝙ": "Q",
            "Ɋ": "Q",
            "Ⓡ": "R",
            "Ｒ": "R",
            "Ŕ": "R",
            "Ṙ": "R",
            "Ř": "R",
            "Ȑ": "R",
            "Ȓ": "R",
            "Ṛ": "R",
            "Ṝ": "R",
            "Ŗ": "R",
            "Ṟ": "R",
            "Ɍ": "R",
            "Ɽ": "R",
            "Ꝛ": "R",
            "Ꞧ": "R",
            "Ꞃ": "R",
            "Ⓢ": "S",
            "Ｓ": "S",
            "ẞ": "S",
            "Ś": "S",
            "Ṥ": "S",
            "Ŝ": "S",
            "Ṡ": "S",
            "Š": "S",
            "Ṧ": "S",
            "Ṣ": "S",
            "Ṩ": "S",
            "Ș": "S",
            "Ş": "S",
            "Ȿ": "S",
            "Ꞩ": "S",
            "Ꞅ": "S",
            "Ⓣ": "T",
            "Ｔ": "T",
            "Ṫ": "T",
            "Ť": "T",
            "Ṭ": "T",
            "Ț": "T",
            "Ţ": "T",
            "Ṱ": "T",
            "Ṯ": "T",
            "Ŧ": "T",
            "Ƭ": "T",
            "Ʈ": "T",
            "Ⱦ": "T",
            "Ꞇ": "T",
            "Ꜩ": "TZ",
            "Ⓤ": "U",
            "Ｕ": "U",
            "Ù": "U",
            "Ú": "U",
            "Û": "U",
            "Ũ": "U",
            "Ṹ": "U",
            "Ū": "U",
            "Ṻ": "U",
            "Ŭ": "U",
            "Ü": "U",
            "Ǜ": "U",
            "Ǘ": "U",
            "Ǖ": "U",
            "Ǚ": "U",
            "Ủ": "U",
            "Ů": "U",
            "Ű": "U",
            "Ǔ": "U",
            "Ȕ": "U",
            "Ȗ": "U",
            "Ư": "U",
            "Ừ": "U",
            "Ứ": "U",
            "Ữ": "U",
            "Ử": "U",
            "Ự": "U",
            "Ụ": "U",
            "Ṳ": "U",
            "Ų": "U",
            "Ṷ": "U",
            "Ṵ": "U",
            "Ʉ": "U",
            "Ⓥ": "V",
            "Ｖ": "V",
            "Ṽ": "V",
            "Ṿ": "V",
            "Ʋ": "V",
            "Ꝟ": "V",
            "Ʌ": "V",
            "Ꝡ": "VY",
            "Ⓦ": "W",
            "Ｗ": "W",
            "Ẁ": "W",
            "Ẃ": "W",
            "Ŵ": "W",
            "Ẇ": "W",
            "Ẅ": "W",
            "Ẉ": "W",
            "Ⱳ": "W",
            "Ⓧ": "X",
            "Ｘ": "X",
            "Ẋ": "X",
            "Ẍ": "X",
            "Ⓨ": "Y",
            "Ｙ": "Y",
            "Ỳ": "Y",
            "Ý": "Y",
            "Ŷ": "Y",
            "Ỹ": "Y",
            "Ȳ": "Y",
            "Ẏ": "Y",
            "Ÿ": "Y",
            "Ỷ": "Y",
            "Ỵ": "Y",
            "Ƴ": "Y",
            "Ɏ": "Y",
            "Ỿ": "Y",
            "Ⓩ": "Z",
            "Ｚ": "Z",
            "Ź": "Z",
            "Ẑ": "Z",
            "Ż": "Z",
            "Ž": "Z",
            "Ẓ": "Z",
            "Ẕ": "Z",
            "Ƶ": "Z",
            "Ȥ": "Z",
            "Ɀ": "Z",
            "Ⱬ": "Z",
            "Ꝣ": "Z",
            "ⓐ": "a",
            "ａ": "a",
            "ẚ": "a",
            "à": "a",
            "á": "a",
            "â": "a",
            "ầ": "a",
            "ấ": "a",
            "ẫ": "a",
            "ẩ": "a",
            "ã": "a",
            "ā": "a",
            "ă": "a",
            "ằ": "a",
            "ắ": "a",
            "ẵ": "a",
            "ẳ": "a",
            "ȧ": "a",
            "ǡ": "a",
            "ä": "a",
            "ǟ": "a",
            "ả": "a",
            "å": "a",
            "ǻ": "a",
            "ǎ": "a",
            "ȁ": "a",
            "ȃ": "a",
            "ạ": "a",
            "ậ": "a",
            "ặ": "a",
            "ḁ": "a",
            "ą": "a",
            "ⱥ": "a",
            "ɐ": "a",
            "ꜳ": "aa",
            "æ": "ae",
            "ǽ": "ae",
            "ǣ": "ae",
            "ꜵ": "ao",
            "ꜷ": "au",
            "ꜹ": "av",
            "ꜻ": "av",
            "ꜽ": "ay",
            "ⓑ": "b",
            "ｂ": "b",
            "ḃ": "b",
            "ḅ": "b",
            "ḇ": "b",
            "ƀ": "b",
            "ƃ": "b",
            "ɓ": "b",
            "ⓒ": "c",
            "ｃ": "c",
            "ć": "c",
            "ĉ": "c",
            "ċ": "c",
            "č": "c",
            "ç": "c",
            "ḉ": "c",
            "ƈ": "c",
            "ȼ": "c",
            "ꜿ": "c",
            "ↄ": "c",
            "ⓓ": "d",
            "ｄ": "d",
            "ḋ": "d",
            "ď": "d",
            "ḍ": "d",
            "ḑ": "d",
            "ḓ": "d",
            "ḏ": "d",
            "đ": "d",
            "ƌ": "d",
            "ɖ": "d",
            "ɗ": "d",
            "ꝺ": "d",
            "ǳ": "dz",
            "ǆ": "dz",
            "ⓔ": "e",
            "ｅ": "e",
            "è": "e",
            "é": "e",
            "ê": "e",
            "ề": "e",
            "ế": "e",
            "ễ": "e",
            "ể": "e",
            "ẽ": "e",
            "ē": "e",
            "ḕ": "e",
            "ḗ": "e",
            "ĕ": "e",
            "ė": "e",
            "ë": "e",
            "ẻ": "e",
            "ě": "e",
            "ȅ": "e",
            "ȇ": "e",
            "ẹ": "e",
            "ệ": "e",
            "ȩ": "e",
            "ḝ": "e",
            "ę": "e",
            "ḙ": "e",
            "ḛ": "e",
            "ɇ": "e",
            "ɛ": "e",
            "ǝ": "e",
            "ⓕ": "f",
            "ｆ": "f",
            "ḟ": "f",
            "ƒ": "f",
            "ꝼ": "f",
            "ⓖ": "g",
            "ｇ": "g",
            "ǵ": "g",
            "ĝ": "g",
            "ḡ": "g",
            "ğ": "g",
            "ġ": "g",
            "ǧ": "g",
            "ģ": "g",
            "ǥ": "g",
            "ɠ": "g",
            "ꞡ": "g",
            "ᵹ": "g",
            "ꝿ": "g",
            "ⓗ": "h",
            "ｈ": "h",
            "ĥ": "h",
            "ḣ": "h",
            "ḧ": "h",
            "ȟ": "h",
            "ḥ": "h",
            "ḩ": "h",
            "ḫ": "h",
            "ẖ": "h",
            "ħ": "h",
            "ⱨ": "h",
            "ⱶ": "h",
            "ɥ": "h",
            "ƕ": "hv",
            "ⓘ": "i",
            "ｉ": "i",
            "ì": "i",
            "í": "i",
            "î": "i",
            "ĩ": "i",
            "ī": "i",
            "ĭ": "i",
            "ï": "i",
            "ḯ": "i",
            "ỉ": "i",
            "ǐ": "i",
            "ȉ": "i",
            "ȋ": "i",
            "ị": "i",
            "į": "i",
            "ḭ": "i",
            "ɨ": "i",
            "ı": "i",
            "ⓙ": "j",
            "ｊ": "j",
            "ĵ": "j",
            "ǰ": "j",
            "ɉ": "j",
            "ⓚ": "k",
            "ｋ": "k",
            "ḱ": "k",
            "ǩ": "k",
            "ḳ": "k",
            "ķ": "k",
            "ḵ": "k",
            "ƙ": "k",
            "ⱪ": "k",
            "ꝁ": "k",
            "ꝃ": "k",
            "ꝅ": "k",
            "ꞣ": "k",
            "ⓛ": "l",
            "ｌ": "l",
            "ŀ": "l",
            "ĺ": "l",
            "ľ": "l",
            "ḷ": "l",
            "ḹ": "l",
            "ļ": "l",
            "ḽ": "l",
            "ḻ": "l",
            "ſ": "l",
            "ł": "l",
            "ƚ": "l",
            "ɫ": "l",
            "ⱡ": "l",
            "ꝉ": "l",
            "ꞁ": "l",
            "ꝇ": "l",
            "ǉ": "lj",
            "ⓜ": "m",
            "ｍ": "m",
            "ḿ": "m",
            "ṁ": "m",
            "ṃ": "m",
            "ɱ": "m",
            "ɯ": "m",
            "ⓝ": "n",
            "ｎ": "n",
            "ǹ": "n",
            "ń": "n",
            "ñ": "n",
            "ṅ": "n",
            "ň": "n",
            "ṇ": "n",
            "ņ": "n",
            "ṋ": "n",
            "ṉ": "n",
            "ƞ": "n",
            "ɲ": "n",
            "ŉ": "n",
            "ꞑ": "n",
            "ꞥ": "n",
            "ǌ": "nj",
            "ⓞ": "o",
            "ｏ": "o",
            "ò": "o",
            "ó": "o",
            "ô": "o",
            "ồ": "o",
            "ố": "o",
            "ỗ": "o",
            "ổ": "o",
            "õ": "o",
            "ṍ": "o",
            "ȭ": "o",
            "ṏ": "o",
            "ō": "o",
            "ṑ": "o",
            "ṓ": "o",
            "ŏ": "o",
            "ȯ": "o",
            "ȱ": "o",
            "ö": "o",
            "ȫ": "o",
            "ỏ": "o",
            "ő": "o",
            "ǒ": "o",
            "ȍ": "o",
            "ȏ": "o",
            "ơ": "o",
            "ờ": "o",
            "ớ": "o",
            "ỡ": "o",
            "ở": "o",
            "ợ": "o",
            "ọ": "o",
            "ộ": "o",
            "ǫ": "o",
            "ǭ": "o",
            "ø": "o",
            "ǿ": "o",
            "ɔ": "o",
            "ꝋ": "o",
            "ꝍ": "o",
            "ɵ": "o",
            "ƣ": "oi",
            "ȣ": "ou",
            "ꝏ": "oo",
            "ⓟ": "p",
            "ｐ": "p",
            "ṕ": "p",
            "ṗ": "p",
            "ƥ": "p",
            "ᵽ": "p",
            "ꝑ": "p",
            "ꝓ": "p",
            "ꝕ": "p",
            "ⓠ": "q",
            "ｑ": "q",
            "ɋ": "q",
            "ꝗ": "q",
            "ꝙ": "q",
            "ⓡ": "r",
            "ｒ": "r",
            "ŕ": "r",
            "ṙ": "r",
            "ř": "r",
            "ȑ": "r",
            "ȓ": "r",
            "ṛ": "r",
            "ṝ": "r",
            "ŗ": "r",
            "ṟ": "r",
            "ɍ": "r",
            "ɽ": "r",
            "ꝛ": "r",
            "ꞧ": "r",
            "ꞃ": "r",
            "ⓢ": "s",
            "ｓ": "s",
            "ß": "s",
            "ś": "s",
            "ṥ": "s",
            "ŝ": "s",
            "ṡ": "s",
            "š": "s",
            "ṧ": "s",
            "ṣ": "s",
            "ṩ": "s",
            "ș": "s",
            "ş": "s",
            "ȿ": "s",
            "ꞩ": "s",
            "ꞅ": "s",
            "ẛ": "s",
            "ⓣ": "t",
            "ｔ": "t",
            "ṫ": "t",
            "ẗ": "t",
            "ť": "t",
            "ṭ": "t",
            "ț": "t",
            "ţ": "t",
            "ṱ": "t",
            "ṯ": "t",
            "ŧ": "t",
            "ƭ": "t",
            "ʈ": "t",
            "ⱦ": "t",
            "ꞇ": "t",
            "ꜩ": "tz",
            "ⓤ": "u",
            "ｕ": "u",
            "ù": "u",
            "ú": "u",
            "û": "u",
            "ũ": "u",
            "ṹ": "u",
            "ū": "u",
            "ṻ": "u",
            "ŭ": "u",
            "ü": "u",
            "ǜ": "u",
            "ǘ": "u",
            "ǖ": "u",
            "ǚ": "u",
            "ủ": "u",
            "ů": "u",
            "ű": "u",
            "ǔ": "u",
            "ȕ": "u",
            "ȗ": "u",
            "ư": "u",
            "ừ": "u",
            "ứ": "u",
            "ữ": "u",
            "ử": "u",
            "ự": "u",
            "ụ": "u",
            "ṳ": "u",
            "ų": "u",
            "ṷ": "u",
            "ṵ": "u",
            "ʉ": "u",
            "ⓥ": "v",
            "ｖ": "v",
            "ṽ": "v",
            "ṿ": "v",
            "ʋ": "v",
            "ꝟ": "v",
            "ʌ": "v",
            "ꝡ": "vy",
            "ⓦ": "w",
            "ｗ": "w",
            "ẁ": "w",
            "ẃ": "w",
            "ŵ": "w",
            "ẇ": "w",
            "ẅ": "w",
            "ẘ": "w",
            "ẉ": "w",
            "ⱳ": "w",
            "ⓧ": "x",
            "ｘ": "x",
            "ẋ": "x",
            "ẍ": "x",
            "ⓨ": "y",
            "ｙ": "y",
            "ỳ": "y",
            "ý": "y",
            "ŷ": "y",
            "ỹ": "y",
            "ȳ": "y",
            "ẏ": "y",
            "ÿ": "y",
            "ỷ": "y",
            "ẙ": "y",
            "ỵ": "y",
            "ƴ": "y",
            "ɏ": "y",
            "ỿ": "y",
            "ⓩ": "z",
            "ｚ": "z",
            "ź": "z",
            "ẑ": "z",
            "ż": "z",
            "ž": "z",
            "ẓ": "z",
            "ẕ": "z",
            "ƶ": "z",
            "ȥ": "z",
            "ɀ": "z",
            "ⱬ": "z",
            "ꝣ": "z",
            "Ά": "Α",
            "Έ": "Ε",
            "Ή": "Η",
            "Ί": "Ι",
            "Ϊ": "Ι",
            "Ό": "Ο",
            "Ύ": "Υ",
            "Ϋ": "Υ",
            "Ώ": "Ω",
            "ά": "α",
            "έ": "ε",
            "ή": "η",
            "ί": "ι",
            "ϊ": "ι",
            "ΐ": "ι",
            "ό": "ο",
            "ύ": "υ",
            "ϋ": "υ",
            "ΰ": "υ",
            "ω": "ω",
            "ς": "σ"
        };
        $document = $(document);
        nextUid = function() {
            var counter = 1;
            return function() {
                return counter++;
            };
        }();
        function reinsertElement(element) {
            var placeholder = $(document.createTextNode(""));
            element.before(placeholder);
            placeholder.before(element);
            placeholder.remove();
        }
        function stripDiacritics(str) {
            // Used 'uni range + named function' from http://jsperf.com/diacritics/18
            function match(a) {
                return DIACRITICS[a] || a;
            }
            return str.replace(/[^\u0000-\u007E]/g, match);
        }
        function indexOf(value, array) {
            var i = 0, l = array.length;
            for (;i < l; i = i + 1) {
                if (equal(value, array[i])) return i;
            }
            return -1;
        }
        function measureScrollbar() {
            var $template = $(MEASURE_SCROLLBAR_TEMPLATE);
            $template.appendTo(document.body);
            var dim = {
                width: $template.width() - $template[0].clientWidth,
                height: $template.height() - $template[0].clientHeight
            };
            $template.remove();
            return dim;
        }
        /**
         * Compares equality of a and b
         * @param a
         * @param b
         */
        function equal(a, b) {
            if (a === b) return true;
            if (a === undefined || b === undefined) return false;
            if (a === null || b === null) return false;
            // Check whether 'a' or 'b' is a string (primitive or object).
            // The concatenation of an empty string (+'') converts its argument to a string's primitive.
            if (a.constructor === String) return a + "" === b + "";
            // a+'' - in case 'a' is a String object
            if (b.constructor === String) return b + "" === a + "";
            // b+'' - in case 'b' is a String object
            return false;
        }
        /**
         * Splits the string into an array of values, transforming each value. An empty array is returned for nulls or empty
         * strings
         * @param string
         * @param separator
         */
        function splitVal(string, separator, transform) {
            var val, i, l;
            if (string === null || string.length < 1) return [];
            val = string.split(separator);
            for (i = 0, l = val.length; i < l; i = i + 1) val[i] = transform(val[i]);
            return val;
        }
        function getSideBorderPadding(element) {
            return element.outerWidth(false) - element.width();
        }
        function installKeyUpChangeEvent(element) {
            var key = "keyup-change-value";
            element.on("keydown", function() {
                if ($.data(element, key) === undefined) {
                    $.data(element, key, element.val());
                }
            });
            element.on("keyup", function() {
                var val = $.data(element, key);
                if (val !== undefined && element.val() !== val) {
                    $.removeData(element, key);
                    element.trigger("keyup-change");
                }
            });
        }
        /**
         * filters mouse events so an event is fired only if the mouse moved.
         *
         * filters out mouse events that occur when mouse is stationary but
         * the elements under the pointer are scrolled.
         */
        function installFilteredMouseMove(element) {
            element.on("mousemove", function(e) {
                var lastpos = lastMousePosition;
                if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                    $(e.target).trigger("mousemove-filtered", e);
                }
            });
        }
        /**
         * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
         * within the last quietMillis milliseconds.
         *
         * @param quietMillis number of milliseconds to wait before invoking fn
         * @param fn function to be debounced
         * @param ctx object to be used as this reference within fn
         * @return debounced version of fn
         */
        function debounce(quietMillis, fn, ctx) {
            ctx = ctx || undefined;
            var timeout;
            return function() {
                var args = arguments;
                window.clearTimeout(timeout);
                timeout = window.setTimeout(function() {
                    fn.apply(ctx, args);
                }, quietMillis);
            };
        }
        function installDebouncedScroll(threshold, element) {
            var notify = debounce(threshold, function(e) {
                element.trigger("scroll-debounced", e);
            });
            element.on("scroll", function(e) {
                if (indexOf(e.target, element.get()) >= 0) notify(e);
            });
        }
        function focus($el) {
            if ($el[0] === document.activeElement) return;
            /* set the focus in a 0 timeout - that way the focus is set after the processing
             of the current event has finished - which seems like the only reliable way
             to set focus */
            window.setTimeout(function() {
                var el = $el[0], pos = $el.val().length, range;
                $el.focus();
                /* make sure el received focus so we do not error out when trying to manipulate the caret.
                 sometimes modals or others listeners may steal it after its set */
                var isVisible = el.offsetWidth > 0 || el.offsetHeight > 0;
                if (isVisible && el === document.activeElement) {
                    /* after the focus is set move the caret to the end, necessary when we val()
                     just before setting focus */
                    if (el.setSelectionRange) {
                        el.setSelectionRange(pos, pos);
                    } else if (el.createTextRange) {
                        range = el.createTextRange();
                        range.collapse(false);
                        range.select();
                    }
                }
            }, 0);
        }
        function getCursorInfo(el) {
            el = $(el)[0];
            var offset = 0;
            var length = 0;
            if ("selectionStart" in el) {
                offset = el.selectionStart;
                length = el.selectionEnd - offset;
            } else if ("selection" in document) {
                el.focus();
                var sel = document.selection.createRange();
                length = document.selection.createRange().text.length;
                sel.moveStart("character", -el.value.length);
                offset = sel.text.length - length;
            }
            return {
                offset: offset,
                length: length
            };
        }
        function killEvent(event) {
            event.preventDefault();
            event.stopPropagation();
        }
        function killEventImmediately(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
        function measureTextWidth(e) {
            if (!sizer) {
                var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
                sizer = $(document.createElement("div")).css({
                    position: "absolute",
                    left: "-10000px",
                    top: "-10000px",
                    display: "none",
                    fontSize: style.fontSize,
                    fontFamily: style.fontFamily,
                    fontStyle: style.fontStyle,
                    fontWeight: style.fontWeight,
                    letterSpacing: style.letterSpacing,
                    textTransform: style.textTransform,
                    whiteSpace: "nowrap"
                });
                sizer.attr("class", "select2-sizer");
                $(document.body).append(sizer);
            }
            sizer.text(e.val());
            return sizer.width();
        }
        function syncCssClasses(dest, src, adapter) {
            var classes, replacements = [], adapted;
            classes = $.trim(dest.attr("class"));
            if (classes) {
                classes = "" + classes;
                // for IE which returns object
                $(classes.split(/\s+/)).each2(function() {
                    if (this.indexOf("select2-") === 0) {
                        replacements.push(this);
                    }
                });
            }
            classes = $.trim(src.attr("class"));
            if (classes) {
                classes = "" + classes;
                // for IE which returns object
                $(classes.split(/\s+/)).each2(function() {
                    if (this.indexOf("select2-") !== 0) {
                        adapted = adapter(this);
                        if (adapted) {
                            replacements.push(adapted);
                        }
                    }
                });
            }
            dest.attr("class", replacements.join(" "));
        }
        function markMatch(text, term, markup, escapeMarkup) {
            var match = stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())), tl = term.length;
            if (match < 0) {
                markup.push(escapeMarkup(text));
                return;
            }
            markup.push(escapeMarkup(text.substring(0, match)));
            markup.push("<span class='select2-match'>");
            markup.push(escapeMarkup(text.substring(match, match + tl)));
            markup.push("</span>");
            markup.push(escapeMarkup(text.substring(match + tl, text.length)));
        }
        function defaultEscapeMarkup(markup) {
            var replace_map = {
                "\\": "&#92;",
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
                "/": "&#47;"
            };
            return String(markup).replace(/[&<>"'\/\\]/g, function(match) {
                return replace_map[match];
            });
        }
        /**
         * Produces an ajax-based query function
         *
         * @param options object containing configuration parameters
         * @param options.params parameter map for the transport ajax call, can contain such options as cache, jsonpCallback, etc. see $.ajax
         * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
         * @param options.url url for the data
         * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
         * @param options.dataType request data type: ajax, jsonp, other datatypes supported by jQuery's $.ajax function or the transport function if specified
         * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
         * @param options.results a function(remoteData, pageNumber, query) that converts data returned form the remote request to the format expected by Select2.
         *      The expected format is an object containing the following keys:
         *      results array of objects that will be used as choices
         *      more (optional) boolean indicating whether there are more results available
         *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
         */
        function ajax(options) {
            var timeout, // current scheduled but not yet executed request
            handler = null, quietMillis = options.quietMillis || 100, ajaxUrl = options.url, self = this;
            return function(query) {
                window.clearTimeout(timeout);
                timeout = window.setTimeout(function() {
                    var data = options.data, // ajax data function
                    url = ajaxUrl, // ajax url string or function
                    transport = options.transport || $.fn.select2.ajaxDefaults.transport, // deprecated - to be removed in 4.0  - use params instead
                    deprecated = {
                        type: options.type || "GET",
                        // set type of request (GET or POST)
                        cache: options.cache || false,
                        jsonpCallback: options.jsonpCallback || undefined,
                        dataType: options.dataType || "json"
                    }, params = $.extend({}, $.fn.select2.ajaxDefaults.params, deprecated);
                    data = data ? data.call(self, query.term, query.page, query.context) : null;
                    url = typeof url === "function" ? url.call(self, query.term, query.page, query.context) : url;
                    if (handler && typeof handler.abort === "function") {
                        handler.abort();
                    }
                    if (options.params) {
                        if ($.isFunction(options.params)) {
                            $.extend(params, options.params.call(self));
                        } else {
                            $.extend(params, options.params);
                        }
                    }
                    $.extend(params, {
                        url: url,
                        dataType: options.dataType,
                        data: data,
                        success: function(data) {
                            // TODO - replace query.page with query so users have access to term, page, etc.
                            // added query as third paramter to keep backwards compatibility
                            var results = options.results(data, query.page, query);
                            query.callback(results);
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            var results = {
                                hasError: true,
                                jqXHR: jqXHR,
                                textStatus: textStatus,
                                errorThrown: errorThrown
                            };
                            query.callback(results);
                        }
                    });
                    handler = transport.call(self, params);
                }, quietMillis);
            };
        }
        /**
         * Produces a query function that works with a local array
         *
         * @param options object containing configuration parameters. The options parameter can either be an array or an
         * object.
         *
         * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
         *
         * If the object form is used it is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
         * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
         * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
         * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
         * the text.
         */
        function local(options) {
            var data = options, // data elements
            dataText, tmp, text = function(item) {
                return "" + item.text;
            };
            // function used to retrieve the text portion of a data item that is matched against the search
            if ($.isArray(data)) {
                tmp = data;
                data = {
                    results: tmp
                };
            }
            if ($.isFunction(data) === false) {
                tmp = data;
                data = function() {
                    return tmp;
                };
            }
            var dataItem = data();
            if (dataItem.text) {
                text = dataItem.text;
                // if text is not a function we assume it to be a key name
                if (!$.isFunction(text)) {
                    dataText = dataItem.text;
                    // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
                    text = function(item) {
                        return item[dataText];
                    };
                }
            }
            return function(query) {
                var t = query.term, filtered = {
                    results: []
                }, process;
                if (t === "") {
                    query.callback(data());
                    return;
                }
                process = function(datum, collection) {
                    var group, attr;
                    datum = datum[0];
                    if (datum.children) {
                        group = {};
                        for (attr in datum) {
                            if (datum.hasOwnProperty(attr)) group[attr] = datum[attr];
                        }
                        group.children = [];
                        $(datum.children).each2(function(i, childDatum) {
                            process(childDatum, group.children);
                        });
                        if (group.children.length || query.matcher(t, text(group), datum)) {
                            collection.push(group);
                        }
                    } else {
                        if (query.matcher(t, text(datum), datum)) {
                            collection.push(datum);
                        }
                    }
                };
                $(data().results).each2(function(i, datum) {
                    process(datum, filtered.results);
                });
                query.callback(filtered);
            };
        }
        // TODO javadoc
        function tags(data) {
            var isFunc = $.isFunction(data);
            return function(query) {
                var t = query.term, filtered = {
                    results: []
                };
                var result = isFunc ? data(query) : data;
                if ($.isArray(result)) {
                    $(result).each(function() {
                        var isObject = this.text !== undefined, text = isObject ? this.text : this;
                        if (t === "" || query.matcher(t, text)) {
                            filtered.results.push(isObject ? this : {
                                id: this,
                                text: this
                            });
                        }
                    });
                    query.callback(filtered);
                }
            };
        }
        /**
         * Checks if the formatter function should be used.
         *
         * Throws an error if it is not a function. Returns true if it should be used,
         * false if no formatting should be performed.
         *
         * @param formatter
         */
        function checkFormatter(formatter, formatterName) {
            if ($.isFunction(formatter)) return true;
            if (!formatter) return false;
            if (typeof formatter === "string") return true;
            throw new Error(formatterName + " must be a string, function, or falsy value");
        }
        /**
         * Returns a given value
         * If given a function, returns its output
         *
         * @param val string|function
         * @param context value of "this" to be passed to function
         * @returns {*}
         */
        function evaluate(val, context) {
            if ($.isFunction(val)) {
                var args = Array.prototype.slice.call(arguments, 2);
                return val.apply(context, args);
            }
            return val;
        }
        function countResults(results) {
            var count = 0;
            $.each(results, function(i, item) {
                if (item.children) {
                    count += countResults(item.children);
                } else {
                    count++;
                }
            });
            return count;
        }
        /**
         * Default tokenizer. This function uses breaks the input on substring match of any string from the
         * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
         * two options have to be defined in order for the tokenizer to work.
         *
         * @param input text user has typed so far or pasted into the search field
         * @param selection currently selected choices
         * @param selectCallback function(choice) callback tho add the choice to selection
         * @param opts select2's opts
         * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
         */
        function defaultTokenizer(input, selection, selectCallback, opts) {
            var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice
            token, // token
            index, // position at which the separator was found
            i, l, // looping variables
            separator;
            // the matched separator
            if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;
            while (true) {
                index = -1;
                for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                    separator = opts.tokenSeparators[i];
                    index = input.indexOf(separator);
                    if (index >= 0) break;
                }
                if (index < 0) break;
                // did not find any token separator in the input string, bail
                token = input.substring(0, index);
                input = input.substring(index + separator.length);
                if (token.length > 0) {
                    token = opts.createSearchChoice.call(this, token, selection);
                    if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                        dupe = false;
                        for (i = 0, l = selection.length; i < l; i++) {
                            if (equal(opts.id(token), opts.id(selection[i]))) {
                                dupe = true;
                                break;
                            }
                        }
                        if (!dupe) selectCallback(token);
                    }
                }
            }
            if (original !== input) return input;
        }
        function cleanupJQueryElements() {
            var self = this;
            $.each(arguments, function(i, element) {
                self[element].remove();
                self[element] = null;
            });
        }
        /**
         * Creates a new class
         *
         * @param superClass
         * @param methods
         */
        function clazz(SuperClass, methods) {
            var constructor = function() {};
            constructor.prototype = new SuperClass();
            constructor.prototype.constructor = constructor;
            constructor.prototype.parent = SuperClass.prototype;
            constructor.prototype = $.extend(constructor.prototype, methods);
            return constructor;
        }
        AbstractSelect2 = clazz(Object, {
            // abstract
            bind: function(func) {
                var self = this;
                return function() {
                    func.apply(self, arguments);
                };
            },
            // abstract
            init: function(opts) {
                var results, search, resultsSelector = ".select2-results";
                // prepare options
                this.opts = opts = this.prepareOpts(opts);
                this.id = opts.id;
                // destroy if called on an existing component
                if (opts.element.data("select2") !== undefined && opts.element.data("select2") !== null) {
                    opts.element.data("select2").destroy();
                }
                this.container = this.createContainer();
                this.liveRegion = $(".select2-hidden-accessible");
                if (this.liveRegion.length == 0) {
                    this.liveRegion = $("<span>", {
                        role: "status",
                        "aria-live": "polite"
                    }).addClass("select2-hidden-accessible").appendTo(document.body);
                }
                this.containerId = "s2id_" + (opts.element.attr("id") || "autogen" + nextUid());
                this.containerEventName = this.containerId.replace(/([.])/g, "_").replace(/([;&,\-\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, "\\$1");
                this.container.attr("id", this.containerId);
                this.container.attr("title", opts.element.attr("title"));
                this.body = $(document.body);
                syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                this.container.attr("style", opts.element.attr("style"));
                this.container.css(evaluate(opts.containerCss, this.opts.element));
                this.container.addClass(evaluate(opts.containerCssClass, this.opts.element));
                this.elementTabIndex = this.opts.element.attr("tabindex");
                // swap container for the element
                this.opts.element.data("select2", this).attr("tabindex", "-1").before(this.container).on("click.select2", killEvent);
                // do not leak click events
                this.container.data("select2", this);
                this.dropdown = this.container.find(".select2-drop");
                syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                this.dropdown.addClass(evaluate(opts.dropdownCssClass, this.opts.element));
                this.dropdown.data("select2", this);
                this.dropdown.on("click", killEvent);
                this.results = results = this.container.find(resultsSelector);
                this.search = search = this.container.find("input.select2-input");
                this.queryCount = 0;
                this.resultsPage = 0;
                this.context = null;
                // initialize the container
                this.initContainer();
                this.container.on("click", killEvent);
                installFilteredMouseMove(this.results);
                this.dropdown.on("mousemove-filtered", resultsSelector, this.bind(this.highlightUnderEvent));
                this.dropdown.on("touchstart touchmove touchend", resultsSelector, this.bind(function(event) {
                    this._touchEvent = true;
                    this.highlightUnderEvent(event);
                }));
                this.dropdown.on("touchmove", resultsSelector, this.bind(this.touchMoved));
                this.dropdown.on("touchstart touchend", resultsSelector, this.bind(this.clearTouchMoved));
                // Waiting for a click event on touch devices to select option and hide dropdown
                // otherwise click will be triggered on an underlying element
                this.dropdown.on("click", this.bind(function(event) {
                    if (this._touchEvent) {
                        this._touchEvent = false;
                        this.selectHighlighted();
                    }
                }));
                installDebouncedScroll(80, this.results);
                this.dropdown.on("scroll-debounced", resultsSelector, this.bind(this.loadMoreIfNeeded));
                // do not propagate change event from the search field out of the component
                $(this.container).on("change", ".select2-input", function(e) {
                    e.stopPropagation();
                });
                $(this.dropdown).on("change", ".select2-input", function(e) {
                    e.stopPropagation();
                });
                // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
                if ($.fn.mousewheel) {
                    results.mousewheel(function(e, delta, deltaX, deltaY) {
                        var top = results.scrollTop();
                        if (deltaY > 0 && top - deltaY <= 0) {
                            results.scrollTop(0);
                            killEvent(e);
                        } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                            results.scrollTop(results.get(0).scrollHeight - results.height());
                            killEvent(e);
                        }
                    });
                }
                installKeyUpChangeEvent(search);
                search.on("keyup-change input paste", this.bind(this.updateResults));
                search.on("focus", function() {
                    search.addClass("select2-focused");
                });
                search.on("blur", function() {
                    search.removeClass("select2-focused");
                });
                this.dropdown.on("mouseup", resultsSelector, this.bind(function(e) {
                    if ($(e.target).closest(".select2-result-selectable").length > 0) {
                        this.highlightUnderEvent(e);
                        this.selectHighlighted(e);
                    }
                }));
                // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
                // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
                // dom it will trigger the popup close, which is not what we want
                // focusin can cause focus wars between modals and select2 since the dropdown is outside the modal.
                this.dropdown.on("click mouseup mousedown touchstart touchend focusin", function(e) {
                    e.stopPropagation();
                });
                this.nextSearchTerm = undefined;
                if ($.isFunction(this.opts.initSelection)) {
                    // initialize selection based on the current value of the source element
                    this.initSelection();
                    // if the user has provided a function that can set selection based on the value of the source element
                    // we monitor the change event on the element and trigger it, allowing for two way synchronization
                    this.monitorSource();
                }
                if (opts.maximumInputLength !== null) {
                    this.search.attr("maxlength", opts.maximumInputLength);
                }
                var disabled = opts.element.prop("disabled");
                if (disabled === undefined) disabled = false;
                this.enable(!disabled);
                var readonly = opts.element.prop("readonly");
                if (readonly === undefined) readonly = false;
                this.readonly(readonly);
                // Calculate size of scrollbar
                scrollBarDimensions = scrollBarDimensions || measureScrollbar();
                this.autofocus = opts.element.prop("autofocus");
                opts.element.prop("autofocus", false);
                if (this.autofocus) this.focus();
                this.search.attr("placeholder", opts.searchInputPlaceholder);
            },
            // abstract
            destroy: function() {
                var element = this.opts.element, select2 = element.data("select2"), self = this;
                this.close();
                if (element.length && element[0].detachEvent && self._sync) {
                    element.each(function() {
                        if (self._sync) {
                            this.detachEvent("onpropertychange", self._sync);
                        }
                    });
                }
                if (this.propertyObserver) {
                    this.propertyObserver.disconnect();
                    this.propertyObserver = null;
                }
                this._sync = null;
                if (select2 !== undefined) {
                    select2.container.remove();
                    select2.liveRegion.remove();
                    select2.dropdown.remove();
                    element.show().removeData("select2").off(".select2").prop("autofocus", this.autofocus || false);
                    if (this.elementTabIndex) {
                        element.attr({
                            tabindex: this.elementTabIndex
                        });
                    } else {
                        element.removeAttr("tabindex");
                    }
                    element.show();
                }
                cleanupJQueryElements.call(this, "container", "liveRegion", "dropdown", "results", "search");
            },
            // abstract
            optionToData: function(element) {
                if (element.is("option")) {
                    return {
                        id: element.prop("value"),
                        text: element.text(),
                        element: element.get(),
                        css: element.attr("class"),
                        disabled: element.prop("disabled"),
                        locked: equal(element.attr("locked"), "locked") || equal(element.data("locked"), true)
                    };
                } else if (element.is("optgroup")) {
                    return {
                        text: element.attr("label"),
                        children: [],
                        element: element.get(),
                        css: element.attr("class")
                    };
                }
            },
            // abstract
            prepareOpts: function(opts) {
                var element, select, idKey, ajaxUrl, self = this;
                element = opts.element;
                if (element.get(0).tagName.toLowerCase() === "select") {
                    this.select = select = opts.element;
                }
                if (select) {
                    // these options are not allowed when attached to a select because they are picked up off the element itself
                    $.each([ "id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags" ], function() {
                        if (this in opts) {
                            throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                        }
                    });
                }
                opts = $.extend({}, {
                    populateResults: function(container, results, query) {
                        var populate, id = this.opts.id, liveRegion = this.liveRegion;
                        populate = function(results, container, depth) {
                            var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;
                            results = opts.sortResults(results, container, query);
                            // collect the created nodes for bulk append
                            var nodes = [];
                            for (i = 0, l = results.length; i < l; i = i + 1) {
                                result = results[i];
                                disabled = result.disabled === true;
                                selectable = !disabled && id(result) !== undefined;
                                compound = result.children && result.children.length > 0;
                                node = $("<li></li>");
                                node.addClass("select2-results-dept-" + depth);
                                node.addClass("select2-result");
                                node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                                if (disabled) {
                                    node.addClass("select2-disabled");
                                }
                                if (compound) {
                                    node.addClass("select2-result-with-children");
                                }
                                node.addClass(self.opts.formatResultCssClass(result));
                                node.attr("role", "presentation");
                                label = $(document.createElement("div"));
                                label.addClass("select2-result-label");
                                label.attr("id", "select2-result-label-" + nextUid());
                                label.attr("role", "option");
                                formatted = opts.formatResult(result, label, query, self.opts.escapeMarkup);
                                if (formatted !== undefined) {
                                    label.html(formatted);
                                    node.append(label);
                                }
                                if (compound) {
                                    innerContainer = $("<ul></ul>");
                                    innerContainer.addClass("select2-result-sub");
                                    populate(result.children, innerContainer, depth + 1);
                                    node.append(innerContainer);
                                }
                                node.data("select2-data", result);
                                nodes.push(node[0]);
                            }
                            // bulk append the created nodes
                            container.append(nodes);
                            liveRegion.text(opts.formatMatches(results.length));
                        };
                        populate(results, container, 0);
                    }
                }, $.fn.select2.defaults, opts);
                if (typeof opts.id !== "function") {
                    idKey = opts.id;
                    opts.id = function(e) {
                        return e[idKey];
                    };
                }
                if ($.isArray(opts.element.data("select2Tags"))) {
                    if ("tags" in opts) {
                        throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                    }
                    opts.tags = opts.element.data("select2Tags");
                }
                if (select) {
                    opts.query = this.bind(function(query) {
                        var data = {
                            results: [],
                            more: false
                        }, term = query.term, children, placeholderOption, process;
                        process = function(element, collection) {
                            var group;
                            if (element.is("option")) {
                                if (query.matcher(term, element.text(), element)) {
                                    collection.push(self.optionToData(element));
                                }
                            } else if (element.is("optgroup")) {
                                group = self.optionToData(element);
                                element.children().each2(function(i, elm) {
                                    process(elm, group.children);
                                });
                                if (group.children.length > 0) {
                                    collection.push(group);
                                }
                            }
                        };
                        children = element.children();
                        // ignore the placeholder option if there is one
                        if (this.getPlaceholder() !== undefined && children.length > 0) {
                            placeholderOption = this.getPlaceholderOption();
                            if (placeholderOption) {
                                children = children.not(placeholderOption);
                            }
                        }
                        children.each2(function(i, elm) {
                            process(elm, data.results);
                        });
                        query.callback(data);
                    });
                    // this is needed because inside val() we construct choices from options and their id is hardcoded
                    opts.id = function(e) {
                        return e.id;
                    };
                } else {
                    if (!("query" in opts)) {
                        if ("ajax" in opts) {
                            ajaxUrl = opts.element.data("ajax-url");
                            if (ajaxUrl && ajaxUrl.length > 0) {
                                opts.ajax.url = ajaxUrl;
                            }
                            opts.query = ajax.call(opts.element, opts.ajax);
                        } else if ("data" in opts) {
                            opts.query = local(opts.data);
                        } else if ("tags" in opts) {
                            opts.query = tags(opts.tags);
                            if (opts.createSearchChoice === undefined) {
                                opts.createSearchChoice = function(term) {
                                    return {
                                        id: $.trim(term),
                                        text: $.trim(term)
                                    };
                                };
                            }
                            if (opts.initSelection === undefined) {
                                opts.initSelection = function(element, callback) {
                                    var data = [];
                                    $(splitVal(element.val(), opts.separator, opts.transformVal)).each(function() {
                                        var obj = {
                                            id: this,
                                            text: this
                                        }, tags = opts.tags;
                                        if ($.isFunction(tags)) tags = tags();
                                        $(tags).each(function() {
                                            if (equal(this.id, obj.id)) {
                                                obj = this;
                                                return false;
                                            }
                                        });
                                        data.push(obj);
                                    });
                                    callback(data);
                                };
                            }
                        }
                    }
                }
                if (typeof opts.query !== "function") {
                    throw "query function not defined for Select2 " + opts.element.attr("id");
                }
                if (opts.createSearchChoicePosition === "top") {
                    opts.createSearchChoicePosition = function(list, item) {
                        list.unshift(item);
                    };
                } else if (opts.createSearchChoicePosition === "bottom") {
                    opts.createSearchChoicePosition = function(list, item) {
                        list.push(item);
                    };
                } else if (typeof opts.createSearchChoicePosition !== "function") {
                    throw "invalid createSearchChoicePosition option must be 'top', 'bottom' or a custom function";
                }
                return opts;
            },
            /**
             * Monitor the original element for changes and update select2 accordingly
             */
            // abstract
            monitorSource: function() {
                var el = this.opts.element, observer, self = this;
                el.on("change.select2", this.bind(function(e) {
                    if (this.opts.element.data("select2-change-triggered") !== true) {
                        this.initSelection();
                    }
                }));
                this._sync = this.bind(function() {
                    // sync enabled state
                    var disabled = el.prop("disabled");
                    if (disabled === undefined) disabled = false;
                    this.enable(!disabled);
                    var readonly = el.prop("readonly");
                    if (readonly === undefined) readonly = false;
                    this.readonly(readonly);
                    if (this.container) {
                        syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                        this.container.addClass(evaluate(this.opts.containerCssClass, this.opts.element));
                    }
                    if (this.dropdown) {
                        syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                        this.dropdown.addClass(evaluate(this.opts.dropdownCssClass, this.opts.element));
                    }
                });
                // IE8-10 (IE9/10 won't fire propertyChange via attachEventListener)
                if (el.length && el[0].attachEvent) {
                    el.each(function() {
                        this.attachEvent("onpropertychange", self._sync);
                    });
                }
                // safari, chrome, firefox, IE11
                observer = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                if (observer !== undefined) {
                    if (this.propertyObserver) {
                        delete this.propertyObserver;
                        this.propertyObserver = null;
                    }
                    this.propertyObserver = new observer(function(mutations) {
                        $.each(mutations, self._sync);
                    });
                    this.propertyObserver.observe(el.get(0), {
                        attributes: true,
                        subtree: false
                    });
                }
            },
            // abstract
            triggerSelect: function(data) {
                var evt = $.Event("select2-selecting", {
                    val: this.id(data),
                    object: data,
                    choice: data
                });
                this.opts.element.trigger(evt);
                return !evt.isDefaultPrevented();
            },
            /**
             * Triggers the change event on the source element
             */
            // abstract
            triggerChange: function(details) {
                details = details || {};
                details = $.extend({}, details, {
                    type: "change",
                    val: this.val()
                });
                // prevents recursive triggering
                this.opts.element.data("select2-change-triggered", true);
                this.opts.element.trigger(details);
                this.opts.element.data("select2-change-triggered", false);
                // some validation frameworks ignore the change event and listen instead to keyup, click for selects
                // so here we trigger the click event manually
                this.opts.element.click();
                // ValidationEngine ignores the change event and listens instead to blur
                // so here we trigger the blur event manually if so desired
                if (this.opts.blurOnChange) this.opts.element.blur();
            },
            //abstract
            isInterfaceEnabled: function() {
                return this.enabledInterface === true;
            },
            // abstract
            enableInterface: function() {
                var enabled = this._enabled && !this._readonly, disabled = !enabled;
                if (enabled === this.enabledInterface) return false;
                this.container.toggleClass("select2-container-disabled", disabled);
                this.close();
                this.enabledInterface = enabled;
                return true;
            },
            // abstract
            enable: function(enabled) {
                if (enabled === undefined) enabled = true;
                if (this._enabled === enabled) return;
                this._enabled = enabled;
                this.opts.element.prop("disabled", !enabled);
                this.enableInterface();
            },
            // abstract
            disable: function() {
                this.enable(false);
            },
            // abstract
            readonly: function(enabled) {
                if (enabled === undefined) enabled = false;
                if (this._readonly === enabled) return;
                this._readonly = enabled;
                this.opts.element.prop("readonly", enabled);
                this.enableInterface();
            },
            // abstract
            opened: function() {
                return this.container ? this.container.hasClass("select2-dropdown-open") : false;
            },
            // abstract
            positionDropdown: function() {
                var $dropdown = this.dropdown, container = this.container, offset = container.offset(), height = container.outerHeight(false), width = container.outerWidth(false), dropHeight = $dropdown.outerHeight(false), $window = $(window), windowWidth = $window.width(), windowHeight = $window.height(), viewPortRight = $window.scrollLeft() + windowWidth, viewportBottom = $window.scrollTop() + windowHeight, dropTop = offset.top + height, dropLeft = offset.left, enoughRoomBelow = dropTop + dropHeight <= viewportBottom, enoughRoomAbove = offset.top - dropHeight >= $window.scrollTop(), dropWidth = $dropdown.outerWidth(false), enoughRoomOnRight = function() {
                    return dropLeft + dropWidth <= viewPortRight;
                }, enoughRoomOnLeft = function() {
                    return offset.left + viewPortRight + container.outerWidth(false) > dropWidth;
                }, aboveNow = $dropdown.hasClass("select2-drop-above"), bodyOffset, above, changeDirection, css, resultsListNode;
                // always prefer the current above/below alignment, unless there is not enough room
                if (aboveNow) {
                    above = true;
                    if (!enoughRoomAbove && enoughRoomBelow) {
                        changeDirection = true;
                        above = false;
                    }
                } else {
                    above = false;
                    if (!enoughRoomBelow && enoughRoomAbove) {
                        changeDirection = true;
                        above = true;
                    }
                }
                //if we are changing direction we need to get positions when dropdown is hidden;
                if (changeDirection) {
                    $dropdown.hide();
                    offset = this.container.offset();
                    height = this.container.outerHeight(false);
                    width = this.container.outerWidth(false);
                    dropHeight = $dropdown.outerHeight(false);
                    viewPortRight = $window.scrollLeft() + windowWidth;
                    viewportBottom = $window.scrollTop() + windowHeight;
                    dropTop = offset.top + height;
                    dropLeft = offset.left;
                    dropWidth = $dropdown.outerWidth(false);
                    $dropdown.show();
                    // fix so the cursor does not move to the left within the search-textbox in IE
                    this.focusSearch();
                }
                if (this.opts.dropdownAutoWidth) {
                    resultsListNode = $(".select2-results", $dropdown)[0];
                    $dropdown.addClass("select2-drop-auto-width");
                    $dropdown.css("width", "");
                    // Add scrollbar width to dropdown if vertical scrollbar is present
                    dropWidth = $dropdown.outerWidth(false) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width);
                    dropWidth > width ? width = dropWidth : dropWidth = width;
                    dropHeight = $dropdown.outerHeight(false);
                } else {
                    this.container.removeClass("select2-drop-auto-width");
                }
                //console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
                //console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body.scrollTop(), "enough?", enoughRoomAbove);
                // fix positioning when body has an offset and is not position: static
                if (this.body.css("position") !== "static") {
                    bodyOffset = this.body.offset();
                    dropTop -= bodyOffset.top;
                    dropLeft -= bodyOffset.left;
                }
                if (!enoughRoomOnRight() && enoughRoomOnLeft()) {
                    dropLeft = offset.left + this.container.outerWidth(false) - dropWidth;
                }
                css = {
                    left: dropLeft,
                    width: width
                };
                if (above) {
                    css.top = offset.top - dropHeight;
                    css.bottom = "auto";
                    this.container.addClass("select2-drop-above");
                    $dropdown.addClass("select2-drop-above");
                } else {
                    css.top = dropTop;
                    css.bottom = "auto";
                    this.container.removeClass("select2-drop-above");
                    $dropdown.removeClass("select2-drop-above");
                }
                css = $.extend(css, evaluate(this.opts.dropdownCss, this.opts.element));
                $dropdown.css(css);
            },
            // abstract
            shouldOpen: function() {
                var event;
                if (this.opened()) return false;
                if (this._enabled === false || this._readonly === true) return false;
                event = $.Event("select2-opening");
                this.opts.element.trigger(event);
                return !event.isDefaultPrevented();
            },
            // abstract
            clearDropdownAlignmentPreference: function() {
                // clear the classes used to figure out the preference of where the dropdown should be opened
                this.container.removeClass("select2-drop-above");
                this.dropdown.removeClass("select2-drop-above");
            },
            /**
             * Opens the dropdown
             *
             * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
             * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
             */
            // abstract
            open: function() {
                if (!this.shouldOpen()) return false;
                this.opening();
                // Only bind the document mousemove when the dropdown is visible
                $document.on("mousemove.select2Event", function(e) {
                    lastMousePosition.x = e.pageX;
                    lastMousePosition.y = e.pageY;
                });
                return true;
            },
            /**
             * Performs the opening of the dropdown
             */
            // abstract
            opening: function() {
                var cid = this.containerEventName, scroll = "scroll." + cid, resize = "resize." + cid, orient = "orientationchange." + cid, mask;
                this.container.addClass("select2-dropdown-open").addClass("select2-container-active");
                this.clearDropdownAlignmentPreference();
                if (this.dropdown[0] !== this.body.children().last()[0]) {
                    this.dropdown.detach().appendTo(this.body);
                }
                // create the dropdown mask if doesn't already exist
                mask = $("#select2-drop-mask");
                if (mask.length === 0) {
                    mask = $(document.createElement("div"));
                    mask.attr("id", "select2-drop-mask").attr("class", "select2-drop-mask");
                    mask.hide();
                    mask.appendTo(this.body);
                    mask.on("mousedown touchstart click", function(e) {
                        // Prevent IE from generating a click event on the body
                        reinsertElement(mask);
                        var dropdown = $("#select2-drop"), self;
                        if (dropdown.length > 0) {
                            self = dropdown.data("select2");
                            if (self.opts.selectOnBlur) {
                                self.selectHighlighted({
                                    noFocus: true
                                });
                            }
                            self.close();
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    });
                }
                // ensure the mask is always right before the dropdown
                if (this.dropdown.prev()[0] !== mask[0]) {
                    this.dropdown.before(mask);
                }
                // move the global id to the correct dropdown
                $("#select2-drop").removeAttr("id");
                this.dropdown.attr("id", "select2-drop");
                // show the elements
                mask.show();
                this.positionDropdown();
                this.dropdown.show();
                this.positionDropdown();
                this.dropdown.addClass("select2-drop-active");
                // attach listeners to events that can change the position of the container and thus require
                // the position of the dropdown to be updated as well so it does not come unglued from the container
                var that = this;
                this.container.parents().add(window).each(function() {
                    $(this).on(resize + " " + scroll + " " + orient, function(e) {
                        if (that.opened()) that.positionDropdown();
                    });
                });
            },
            // abstract
            close: function() {
                if (!this.opened()) return;
                var cid = this.containerEventName, scroll = "scroll." + cid, resize = "resize." + cid, orient = "orientationchange." + cid;
                // unbind event listeners
                this.container.parents().add(window).each(function() {
                    $(this).off(scroll).off(resize).off(orient);
                });
                this.clearDropdownAlignmentPreference();
                $("#select2-drop-mask").hide();
                this.dropdown.removeAttr("id");
                // only the active dropdown has the select2-drop id
                this.dropdown.hide();
                this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");
                this.results.empty();
                // Now that the dropdown is closed, unbind the global document mousemove event
                $document.off("mousemove.select2Event");
                this.clearSearch();
                this.search.removeClass("select2-active");
                this.opts.element.trigger($.Event("select2-close"));
            },
            /**
             * Opens control, sets input value, and updates results.
             */
            // abstract
            externalSearch: function(term) {
                this.open();
                this.search.val(term);
                this.updateResults(false);
            },
            // abstract
            clearSearch: function() {},
            //abstract
            getMaximumSelectionSize: function() {
                return evaluate(this.opts.maximumSelectionSize, this.opts.element);
            },
            // abstract
            ensureHighlightVisible: function() {
                var results = this.results, children, index, child, hb, rb, y, more, topOffset;
                index = this.highlight();
                if (index < 0) return;
                if (index == 0) {
                    // if the first element is highlighted scroll all the way to the top,
                    // that way any unselectable headers above it will also be scrolled
                    // into view
                    results.scrollTop(0);
                    return;
                }
                children = this.findHighlightableChoices().find(".select2-result-label");
                child = $(children[index]);
                topOffset = (child.offset() || {}).top || 0;
                hb = topOffset + child.outerHeight(true);
                // if this is the last child lets also make sure select2-more-results is visible
                if (index === children.length - 1) {
                    more = results.find("li.select2-more-results");
                    if (more.length > 0) {
                        hb = more.offset().top + more.outerHeight(true);
                    }
                }
                rb = results.offset().top + results.outerHeight(false);
                if (hb > rb) {
                    results.scrollTop(results.scrollTop() + (hb - rb));
                }
                y = topOffset - results.offset().top;
                // make sure the top of the element is visible
                if (y < 0 && child.css("display") != "none") {
                    results.scrollTop(results.scrollTop() + y);
                }
            },
            // abstract
            findHighlightableChoices: function() {
                return this.results.find(".select2-result-selectable:not(.select2-disabled):not(.select2-selected)");
            },
            // abstract
            moveHighlight: function(delta) {
                var choices = this.findHighlightableChoices(), index = this.highlight();
                while (index > -1 && index < choices.length) {
                    index += delta;
                    var choice = $(choices[index]);
                    if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                        this.highlight(index);
                        break;
                    }
                }
            },
            // abstract
            highlight: function(index) {
                var choices = this.findHighlightableChoices(), choice, data;
                if (arguments.length === 0) {
                    return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
                }
                if (index >= choices.length) index = choices.length - 1;
                if (index < 0) index = 0;
                this.removeHighlight();
                choice = $(choices[index]);
                choice.addClass("select2-highlighted");
                // ensure assistive technology can determine the active choice
                this.search.attr("aria-activedescendant", choice.find(".select2-result-label").attr("id"));
                this.ensureHighlightVisible();
                this.liveRegion.text(choice.text());
                data = choice.data("select2-data");
                if (data) {
                    this.opts.element.trigger({
                        type: "select2-highlight",
                        val: this.id(data),
                        choice: data
                    });
                }
            },
            removeHighlight: function() {
                this.results.find(".select2-highlighted").removeClass("select2-highlighted");
            },
            touchMoved: function() {
                this._touchMoved = true;
            },
            clearTouchMoved: function() {
                this._touchMoved = false;
            },
            // abstract
            countSelectableResults: function() {
                return this.findHighlightableChoices().length;
            },
            // abstract
            highlightUnderEvent: function(event) {
                var el = $(event.target).closest(".select2-result-selectable");
                if (el.length > 0 && !el.is(".select2-highlighted")) {
                    var choices = this.findHighlightableChoices();
                    this.highlight(choices.index(el));
                } else if (el.length == 0) {
                    // if we are over an unselectable item remove all highlights
                    this.removeHighlight();
                }
            },
            // abstract
            loadMoreIfNeeded: function() {
                var results = this.results, more = results.find("li.select2-more-results"), below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                page = this.resultsPage + 1, self = this, term = this.search.val(), context = this.context;
                if (more.length === 0) return;
                below = more.offset().top - results.offset().top - results.height();
                if (below <= this.opts.loadMorePadding) {
                    more.addClass("select2-active");
                    this.opts.query({
                        element: this.opts.element,
                        term: term,
                        page: page,
                        context: context,
                        matcher: this.opts.matcher,
                        callback: this.bind(function(data) {
                            // ignore a response if the select2 has been closed before it was received
                            if (!self.opened()) return;
                            self.opts.populateResults.call(this, results, data.results, {
                                term: term,
                                page: page,
                                context: context
                            });
                            self.postprocessResults(data, false, false);
                            if (data.more === true) {
                                more.detach().appendTo(results).html(self.opts.escapeMarkup(evaluate(self.opts.formatLoadMore, self.opts.element, page + 1)));
                                window.setTimeout(function() {
                                    self.loadMoreIfNeeded();
                                }, 10);
                            } else {
                                more.remove();
                            }
                            self.positionDropdown();
                            self.resultsPage = page;
                            self.context = data.context;
                            this.opts.element.trigger({
                                type: "select2-loaded",
                                items: data
                            });
                        })
                    });
                }
            },
            /**
             * Default tokenizer function which does nothing
             */
            tokenize: function() {},
            /**
             * @param initial whether or not this is the call to this method right after the dropdown has been opened
             */
            // abstract
            updateResults: function(initial) {
                var search = this.search, results = this.results, opts = this.opts, data, self = this, input, term = search.val(), lastTerm = $.data(this.container, "select2-last-term"), // sequence number used to drop out-of-order responses
                queryNumber;
                // prevent duplicate queries against the same term
                if (initial !== true && lastTerm && equal(term, lastTerm)) return;
                $.data(this.container, "select2-last-term", term);
                // if the search is currently hidden we do not alter the results
                if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                    return;
                }
                function postRender() {
                    search.removeClass("select2-active");
                    self.positionDropdown();
                    if (results.find(".select2-no-results,.select2-selection-limit,.select2-searching").length) {
                        self.liveRegion.text(results.text());
                    } else {
                        self.liveRegion.text(self.opts.formatMatches(results.find('.select2-result-selectable:not(".select2-selected")').length));
                    }
                }
                function render(html) {
                    results.html(html);
                    postRender();
                }
                queryNumber = ++this.queryCount;
                var maxSelSize = this.getMaximumSelectionSize();
                if (maxSelSize >= 1) {
                    data = this.data();
                    if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                        render("<li class='select2-selection-limit'>" + evaluate(opts.formatSelectionTooBig, opts.element, maxSelSize) + "</li>");
                        return;
                    }
                }
                if (search.val().length < opts.minimumInputLength) {
                    if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                        render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooShort, opts.element, search.val(), opts.minimumInputLength) + "</li>");
                    } else {
                        render("");
                    }
                    if (initial && this.showSearch) this.showSearch(true);
                    return;
                }
                if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
                    if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
                        render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooLong, opts.element, search.val(), opts.maximumInputLength) + "</li>");
                    } else {
                        render("");
                    }
                    return;
                }
                if (opts.formatSearching && this.findHighlightableChoices().length === 0) {
                    render("<li class='select2-searching'>" + evaluate(opts.formatSearching, opts.element) + "</li>");
                }
                search.addClass("select2-active");
                this.removeHighlight();
                // give the tokenizer a chance to pre-process the input
                input = this.tokenize();
                if (input != undefined && input != null) {
                    search.val(input);
                }
                this.resultsPage = 1;
                opts.query({
                    element: opts.element,
                    term: search.val(),
                    page: this.resultsPage,
                    context: null,
                    matcher: opts.matcher,
                    callback: this.bind(function(data) {
                        var def;
                        // default choice
                        // ignore old responses
                        if (queryNumber != this.queryCount) {
                            return;
                        }
                        // ignore a response if the select2 has been closed before it was received
                        if (!this.opened()) {
                            this.search.removeClass("select2-active");
                            return;
                        }
                        // handle ajax error
                        if (data.hasError !== undefined && checkFormatter(opts.formatAjaxError, "formatAjaxError")) {
                            render("<li class='select2-ajax-error'>" + evaluate(opts.formatAjaxError, opts.element, data.jqXHR, data.textStatus, data.errorThrown) + "</li>");
                            return;
                        }
                        // save context, if any
                        this.context = data.context === undefined ? null : data.context;
                        // create a default choice and prepend it to the list
                        if (this.opts.createSearchChoice && search.val() !== "") {
                            def = this.opts.createSearchChoice.call(self, search.val(), data.results);
                            if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                                if ($(data.results).filter(function() {
                                    return equal(self.id(this), self.id(def));
                                }).length === 0) {
                                    this.opts.createSearchChoicePosition(data.results, def);
                                }
                            }
                        }
                        if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                            render("<li class='select2-no-results'>" + evaluate(opts.formatNoMatches, opts.element, search.val()) + "</li>");
                            return;
                        }
                        results.empty();
                        self.opts.populateResults.call(this, results, data.results, {
                            term: search.val(),
                            page: this.resultsPage,
                            context: null
                        });
                        if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                            results.append("<li class='select2-more-results'>" + opts.escapeMarkup(evaluate(opts.formatLoadMore, opts.element, this.resultsPage)) + "</li>");
                            window.setTimeout(function() {
                                self.loadMoreIfNeeded();
                            }, 10);
                        }
                        this.postprocessResults(data, initial);
                        postRender();
                        this.opts.element.trigger({
                            type: "select2-loaded",
                            items: data
                        });
                    })
                });
            },
            // abstract
            cancel: function() {
                this.close();
            },
            // abstract
            blur: function() {
                // if selectOnBlur == true, select the currently highlighted option
                if (this.opts.selectOnBlur) this.selectHighlighted({
                    noFocus: true
                });
                this.close();
                this.container.removeClass("select2-container-active");
                // synonymous to .is(':focus'), which is available in jquery >= 1.6
                if (this.search[0] === document.activeElement) {
                    this.search.blur();
                }
                this.clearSearch();
                this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
            },
            // abstract
            focusSearch: function() {
                focus(this.search);
            },
            // abstract
            selectHighlighted: function(options) {
                if (this._touchMoved) {
                    this.clearTouchMoved();
                    return;
                }
                var index = this.highlight(), highlighted = this.results.find(".select2-highlighted"), data = highlighted.closest(".select2-result").data("select2-data");
                if (data) {
                    this.highlight(index);
                    this.onSelect(data, options);
                } else if (options && options.noFocus) {
                    this.close();
                }
            },
            // abstract
            getPlaceholder: function() {
                var placeholderOption;
                return this.opts.element.attr("placeholder") || this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
                this.opts.element.data("placeholder") || this.opts.placeholder || ((placeholderOption = this.getPlaceholderOption()) !== undefined ? placeholderOption.text() : undefined);
            },
            // abstract
            getPlaceholderOption: function() {
                if (this.select) {
                    var firstOption = this.select.children("option").first();
                    if (this.opts.placeholderOption !== undefined) {
                        //Determine the placeholder option based on the specified placeholderOption setting
                        return this.opts.placeholderOption === "first" && firstOption || typeof this.opts.placeholderOption === "function" && this.opts.placeholderOption(this.select);
                    } else if ($.trim(firstOption.text()) === "" && firstOption.val() === "") {
                        //No explicit placeholder option specified, use the first if it's blank
                        return firstOption;
                    }
                }
            },
            /**
             * Get the desired width for the container element.  This is
             * derived first from option `width` passed to select2, then
             * the inline 'style' on the original element, and finally
             * falls back to the jQuery calculated element width.
             */
            // abstract
            initContainerWidth: function() {
                function resolveContainerWidth() {
                    var style, attrs, matches, i, l, attr;
                    if (this.opts.width === "off") {
                        return null;
                    } else if (this.opts.width === "element") {
                        return this.opts.element.outerWidth(false) === 0 ? "auto" : this.opts.element.outerWidth(false) + "px";
                    } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                        // check if there is inline style on the element that contains width
                        style = this.opts.element.attr("style");
                        if (style !== undefined) {
                            attrs = style.split(";");
                            for (i = 0, l = attrs.length; i < l; i = i + 1) {
                                attr = attrs[i].replace(/\s/g, "");
                                matches = attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);
                                if (matches !== null && matches.length >= 1) return matches[1];
                            }
                        }
                        if (this.opts.width === "resolve") {
                            // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                            // when attached to input type=hidden or elements hidden via css
                            style = this.opts.element.css("width");
                            if (style.indexOf("%") > 0) return style;
                            // finally, fallback on the calculated width of the element
                            return this.opts.element.outerWidth(false) === 0 ? "auto" : this.opts.element.outerWidth(false) + "px";
                        }
                        return null;
                    } else if ($.isFunction(this.opts.width)) {
                        return this.opts.width();
                    } else {
                        return this.opts.width;
                    }
                }
                var width = resolveContainerWidth.call(this);
                if (width !== null) {
                    this.container.css("width", width);
                }
            }
        });
        SingleSelect2 = clazz(AbstractSelect2, {
            // single
            createContainer: function() {
                var container = $(document.createElement("div")).attr({
                    "class": "select2-container"
                }).html([ "<a href='javascript:void(0)' class='select2-choice' tabindex='-1'>", "   <span class='select2-chosen'>&#160;</span><abbr class='select2-search-choice-close'></abbr>", "   <span class='select2-arrow' role='presentation'><b role='presentation'></b></span>", "</a>", "<label for='' class='select2-offscreen'></label>", "<input class='select2-focusser select2-offscreen' type='text' aria-haspopup='true' role='button' />", "<div class='select2-drop select2-display-none'>", "   <div class='select2-search'>", "       <label for='' class='select2-offscreen'></label>", "       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input' role='combobox' aria-expanded='true'", "       aria-autocomplete='list' />", "   </div>", "   <ul class='select2-results' role='listbox'>", "   </ul>", "</div>" ].join(""));
                return container;
            },
            // single
            enableInterface: function() {
                if (this.parent.enableInterface.apply(this, arguments)) {
                    this.focusser.prop("disabled", !this.isInterfaceEnabled());
                }
            },
            // single
            opening: function() {
                var el, range, len;
                if (this.opts.minimumResultsForSearch >= 0) {
                    this.showSearch(true);
                }
                this.parent.opening.apply(this, arguments);
                if (this.showSearchInput !== false) {
                    // IE appends focusser.val() at the end of field :/ so we manually insert it at the beginning using a range
                    // all other browsers handle this just fine
                    this.search.val(this.focusser.val());
                }
                if (this.opts.shouldFocusInput(this)) {
                    this.search.focus();
                    // move the cursor to the end after focussing, otherwise it will be at the beginning and
                    // new text will appear *before* focusser.val()
                    el = this.search.get(0);
                    if (el.createTextRange) {
                        range = el.createTextRange();
                        range.collapse(false);
                        range.select();
                    } else if (el.setSelectionRange) {
                        len = this.search.val().length;
                        el.setSelectionRange(len, len);
                    }
                }
                // initializes search's value with nextSearchTerm (if defined by user)
                // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
                if (this.search.val() === "") {
                    if (this.nextSearchTerm != undefined) {
                        this.search.val(this.nextSearchTerm);
                        this.search.select();
                    }
                }
                this.focusser.prop("disabled", true).val("");
                this.updateResults(true);
                this.opts.element.trigger($.Event("select2-open"));
            },
            // single
            close: function() {
                if (!this.opened()) return;
                this.parent.close.apply(this, arguments);
                this.focusser.prop("disabled", false);
                if (this.opts.shouldFocusInput(this)) {
                    this.focusser.focus();
                }
            },
            // single
            focus: function() {
                if (this.opened()) {
                    this.close();
                } else {
                    this.focusser.prop("disabled", false);
                    if (this.opts.shouldFocusInput(this)) {
                        this.focusser.focus();
                    }
                }
            },
            // single
            isFocused: function() {
                return this.container.hasClass("select2-container-active");
            },
            // single
            cancel: function() {
                this.parent.cancel.apply(this, arguments);
                this.focusser.prop("disabled", false);
                if (this.opts.shouldFocusInput(this)) {
                    this.focusser.focus();
                }
            },
            // single
            destroy: function() {
                $("label[for='" + this.focusser.attr("id") + "']").attr("for", this.opts.element.attr("id"));
                this.parent.destroy.apply(this, arguments);
                cleanupJQueryElements.call(this, "selection", "focusser");
            },
            // single
            initContainer: function() {
                var selection, container = this.container, dropdown = this.dropdown, idSuffix = nextUid(), elementLabel;
                if (this.opts.minimumResultsForSearch < 0) {
                    this.showSearch(false);
                } else {
                    this.showSearch(true);
                }
                this.selection = selection = container.find(".select2-choice");
                this.focusser = container.find(".select2-focusser");
                // add aria associations
                selection.find(".select2-chosen").attr("id", "select2-chosen-" + idSuffix);
                this.focusser.attr("aria-labelledby", "select2-chosen-" + idSuffix);
                this.results.attr("id", "select2-results-" + idSuffix);
                this.search.attr("aria-owns", "select2-results-" + idSuffix);
                // rewrite labels from original element to focusser
                this.focusser.attr("id", "s2id_autogen" + idSuffix);
                elementLabel = $("label[for='" + this.opts.element.attr("id") + "']");
                this.opts.element.focus(this.bind(function() {
                    this.focus();
                }));
                this.focusser.prev().text(elementLabel.text()).attr("for", this.focusser.attr("id"));
                // Ensure the original element retains an accessible name
                var originalTitle = this.opts.element.attr("title");
                this.opts.element.attr("title", originalTitle || elementLabel.text());
                this.focusser.attr("tabindex", this.elementTabIndex);
                // write label for search field using the label from the focusser element
                this.search.attr("id", this.focusser.attr("id") + "_search");
                this.search.prev().text($("label[for='" + this.focusser.attr("id") + "']").text()).attr("for", this.search.attr("id"));
                this.search.on("keydown", this.bind(function(e) {
                    if (!this.isInterfaceEnabled()) return;
                    // filter 229 keyCodes (input method editor is processing key input)
                    if (229 == e.keyCode) return;
                    if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                        // prevent the page from scrolling
                        killEvent(e);
                        return;
                    }
                    switch (e.which) {
                      case KEY.UP:
                      case KEY.DOWN:
                        this.moveHighlight(e.which === KEY.UP ? -1 : 1);
                        killEvent(e);
                        return;

                      case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;

                      case KEY.TAB:
                        this.selectHighlighted({
                            noFocus: true
                        });
                        return;

                      case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                    }
                }));
                this.search.on("blur", this.bind(function(e) {
                    // a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
                    // without this the search field loses focus which is annoying
                    if (document.activeElement === this.body.get(0)) {
                        window.setTimeout(this.bind(function() {
                            if (this.opened()) {
                                this.search.focus();
                            }
                        }), 0);
                    }
                }));
                this.focusser.on("keydown", this.bind(function(e) {
                    if (!this.isInterfaceEnabled()) return;
                    if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                        return;
                    }
                    if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                        killEvent(e);
                        return;
                    }
                    if (e.which == KEY.DOWN || e.which == KEY.UP || e.which == KEY.ENTER && this.opts.openOnEnter) {
                        if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;
                        this.open();
                        killEvent(e);
                        return;
                    }
                    if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                        if (this.opts.allowClear) {
                            this.clear();
                        }
                        killEvent(e);
                        return;
                    }
                }));
                installKeyUpChangeEvent(this.focusser);
                this.focusser.on("keyup-change input", this.bind(function(e) {
                    if (this.opts.minimumResultsForSearch >= 0) {
                        e.stopPropagation();
                        if (this.opened()) return;
                        this.open();
                    }
                }));
                selection.on("mousedown touchstart", "abbr", this.bind(function(e) {
                    if (!this.isInterfaceEnabled()) {
                        return;
                    }
                    this.clear();
                    killEventImmediately(e);
                    this.close();
                    if (this.selection) {
                        this.selection.focus();
                    }
                }));
                selection.on("mousedown touchstart", this.bind(function(e) {
                    // Prevent IE from generating a click event on the body
                    reinsertElement(selection);
                    if (!this.container.hasClass("select2-container-active")) {
                        this.opts.element.trigger($.Event("select2-focus"));
                    }
                    if (this.opened()) {
                        this.close();
                    } else if (this.isInterfaceEnabled()) {
                        this.open();
                    }
                    killEvent(e);
                }));
                dropdown.on("mousedown touchstart", this.bind(function() {
                    if (this.opts.shouldFocusInput(this)) {
                        this.search.focus();
                    }
                }));
                selection.on("focus", this.bind(function(e) {
                    killEvent(e);
                }));
                this.focusser.on("focus", this.bind(function() {
                    if (!this.container.hasClass("select2-container-active")) {
                        this.opts.element.trigger($.Event("select2-focus"));
                    }
                    this.container.addClass("select2-container-active");
                })).on("blur", this.bind(function() {
                    if (!this.opened()) {
                        this.container.removeClass("select2-container-active");
                        this.opts.element.trigger($.Event("select2-blur"));
                    }
                }));
                this.search.on("focus", this.bind(function() {
                    if (!this.container.hasClass("select2-container-active")) {
                        this.opts.element.trigger($.Event("select2-focus"));
                    }
                    this.container.addClass("select2-container-active");
                }));
                this.initContainerWidth();
                this.opts.element.hide();
                this.setPlaceholder();
            },
            // single
            clear: function(triggerChange) {
                var data = this.selection.data("select2-data");
                if (data) {
                    // guard against queued quick consecutive clicks
                    var evt = $.Event("select2-clearing");
                    this.opts.element.trigger(evt);
                    if (evt.isDefaultPrevented()) {
                        return;
                    }
                    var placeholderOption = this.getPlaceholderOption();
                    this.opts.element.val(placeholderOption ? placeholderOption.val() : "");
                    this.selection.find(".select2-chosen").empty();
                    this.selection.removeData("select2-data");
                    this.setPlaceholder();
                    if (triggerChange !== false) {
                        this.opts.element.trigger({
                            type: "select2-removed",
                            val: this.id(data),
                            choice: data
                        });
                        this.triggerChange({
                            removed: data
                        });
                    }
                }
            },
            /**
             * Sets selection based on source element's value
             */
            // single
            initSelection: function() {
                var selected;
                if (this.isPlaceholderOptionSelected()) {
                    this.updateSelection(null);
                    this.close();
                    this.setPlaceholder();
                } else {
                    var self = this;
                    this.opts.initSelection.call(null, this.opts.element, function(selected) {
                        if (selected !== undefined && selected !== null) {
                            self.updateSelection(selected);
                            self.close();
                            self.setPlaceholder();
                            self.nextSearchTerm = self.opts.nextSearchTerm(selected, self.search.val());
                        }
                    });
                }
            },
            isPlaceholderOptionSelected: function() {
                var placeholderOption;
                if (this.getPlaceholder() === undefined) return false;
                // no placeholder specified so no option should be considered
                return (placeholderOption = this.getPlaceholderOption()) !== undefined && placeholderOption.prop("selected") || this.opts.element.val() === "" || this.opts.element.val() === undefined || this.opts.element.val() === null;
            },
            // single
            prepareOpts: function() {
                var opts = this.parent.prepareOpts.apply(this, arguments), self = this;
                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    // install the selection initializer
                    opts.initSelection = function(element, callback) {
                        var selected = element.find("option").filter(function() {
                            return this.selected && !this.disabled;
                        });
                        // a single select box always has a value, no need to null check 'selected'
                        callback(self.optionToData(selected));
                    };
                } else if ("data" in opts) {
                    // install default initSelection when applied to hidden input and data is local
                    opts.initSelection = opts.initSelection || function(element, callback) {
                        var id = element.val();
                        //search in data by id, storing the actual matching item
                        var match = null;
                        opts.query({
                            matcher: function(term, text, el) {
                                var is_match = equal(id, opts.id(el));
                                if (is_match) {
                                    match = el;
                                }
                                return is_match;
                            },
                            callback: !$.isFunction(callback) ? $.noop : function() {
                                callback(match);
                            }
                        });
                    };
                }
                return opts;
            },
            // single
            getPlaceholder: function() {
                // if a placeholder is specified on a single select without a valid placeholder option ignore it
                if (this.select) {
                    if (this.getPlaceholderOption() === undefined) {
                        return undefined;
                    }
                }
                return this.parent.getPlaceholder.apply(this, arguments);
            },
            // single
            setPlaceholder: function() {
                var placeholder = this.getPlaceholder();
                if (this.isPlaceholderOptionSelected() && placeholder !== undefined) {
                    // check for a placeholder option if attached to a select
                    if (this.select && this.getPlaceholderOption() === undefined) return;
                    this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(placeholder));
                    this.selection.addClass("select2-default");
                    this.container.removeClass("select2-allowclear");
                }
            },
            // single
            postprocessResults: function(data, initial, noHighlightUpdate) {
                var selected = 0, self = this, showSearchInput = true;
                // find the selected element in the result list
                this.findHighlightableChoices().each2(function(i, elm) {
                    if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                        selected = i;
                        return false;
                    }
                });
                // and highlight it
                if (noHighlightUpdate !== false) {
                    if (initial === true && selected >= 0) {
                        this.highlight(selected);
                    } else {
                        this.highlight(0);
                    }
                }
                // hide the search box if this is the first we got the results and there are enough of them for search
                if (initial === true) {
                    var min = this.opts.minimumResultsForSearch;
                    if (min >= 0) {
                        this.showSearch(countResults(data.results) >= min);
                    }
                }
            },
            // single
            showSearch: function(showSearchInput) {
                if (this.showSearchInput === showSearchInput) return;
                this.showSearchInput = showSearchInput;
                this.dropdown.find(".select2-search").toggleClass("select2-search-hidden", !showSearchInput);
                this.dropdown.find(".select2-search").toggleClass("select2-offscreen", !showSearchInput);
                //add "select2-with-searchbox" to the container if search box is shown
                $(this.dropdown, this.container).toggleClass("select2-with-searchbox", showSearchInput);
            },
            // single
            onSelect: function(data, options) {
                if (!this.triggerSelect(data)) {
                    return;
                }
                var old = this.opts.element.val(), oldData = this.data();
                this.opts.element.val(this.id(data));
                this.updateSelection(data);
                this.opts.element.trigger({
                    type: "select2-selected",
                    val: this.id(data),
                    choice: data
                });
                this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
                this.close();
                if ((!options || !options.noFocus) && this.opts.shouldFocusInput(this)) {
                    this.focusser.focus();
                }
                if (!equal(old, this.id(data))) {
                    this.triggerChange({
                        added: data,
                        removed: oldData
                    });
                }
            },
            // single
            updateSelection: function(data) {
                var container = this.selection.find(".select2-chosen"), formatted, cssClass;
                this.selection.data("select2-data", data);
                container.empty();
                if (data !== null) {
                    formatted = this.opts.formatSelection(data, container, this.opts.escapeMarkup);
                }
                if (formatted !== undefined) {
                    container.append(formatted);
                }
                cssClass = this.opts.formatSelectionCssClass(data, container);
                if (cssClass !== undefined) {
                    container.addClass(cssClass);
                }
                this.selection.removeClass("select2-default");
                if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                    this.container.addClass("select2-allowclear");
                }
            },
            // single
            val: function() {
                var val, triggerChange = false, data = null, self = this, oldData = this.data();
                if (arguments.length === 0) {
                    return this.opts.element.val();
                }
                val = arguments[0];
                if (arguments.length > 1) {
                    triggerChange = arguments[1];
                }
                if (this.select) {
                    this.select.val(val).find("option").filter(function() {
                        return this.selected;
                    }).each2(function(i, elm) {
                        data = self.optionToData(elm);
                        return false;
                    });
                    this.updateSelection(data);
                    this.setPlaceholder();
                    if (triggerChange) {
                        this.triggerChange({
                            added: data,
                            removed: oldData
                        });
                    }
                } else {
                    // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                    if (!val && val !== 0) {
                        this.clear(triggerChange);
                        return;
                    }
                    if (this.opts.initSelection === undefined) {
                        throw new Error("cannot call val() if initSelection() is not defined");
                    }
                    this.opts.element.val(val);
                    this.opts.initSelection(this.opts.element, function(data) {
                        self.opts.element.val(!data ? "" : self.id(data));
                        self.updateSelection(data);
                        self.setPlaceholder();
                        if (triggerChange) {
                            self.triggerChange({
                                added: data,
                                removed: oldData
                            });
                        }
                    });
                }
            },
            // single
            clearSearch: function() {
                this.search.val("");
                this.focusser.val("");
            },
            // single
            data: function(value) {
                var data, triggerChange = false;
                if (arguments.length === 0) {
                    data = this.selection.data("select2-data");
                    if (data == undefined) data = null;
                    return data;
                } else {
                    if (arguments.length > 1) {
                        triggerChange = arguments[1];
                    }
                    if (!value) {
                        this.clear(triggerChange);
                    } else {
                        data = this.data();
                        this.opts.element.val(!value ? "" : this.id(value));
                        this.updateSelection(value);
                        if (triggerChange) {
                            this.triggerChange({
                                added: value,
                                removed: data
                            });
                        }
                    }
                }
            }
        });
        MultiSelect2 = clazz(AbstractSelect2, {
            // multi
            createContainer: function() {
                var container = $(document.createElement("div")).attr({
                    "class": "select2-container select2-container-multi"
                }).html([ "<ul class='select2-choices'>", "  <li class='select2-search-field'>", "    <label for='' class='select2-offscreen'></label>", "    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>", "  </li>", "</ul>", "<div class='select2-drop select2-drop-multi select2-display-none'>", "   <ul class='select2-results'>", "   </ul>", "</div>" ].join(""));
                return container;
            },
            // multi
            prepareOpts: function() {
                var opts = this.parent.prepareOpts.apply(this, arguments), self = this;
                // TODO validate placeholder is a string if specified
                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    // install the selection initializer
                    opts.initSelection = function(element, callback) {
                        var data = [];
                        element.find("option").filter(function() {
                            return this.selected && !this.disabled;
                        }).each2(function(i, elm) {
                            data.push(self.optionToData(elm));
                        });
                        callback(data);
                    };
                } else if ("data" in opts) {
                    // install default initSelection when applied to hidden input and data is local
                    opts.initSelection = opts.initSelection || function(element, callback) {
                        var ids = splitVal(element.val(), opts.separator, opts.transformVal);
                        //search in data by array of ids, storing matching items in a list
                        var matches = [];
                        opts.query({
                            matcher: function(term, text, el) {
                                var is_match = $.grep(ids, function(id) {
                                    return equal(id, opts.id(el));
                                }).length;
                                if (is_match) {
                                    matches.push(el);
                                }
                                return is_match;
                            },
                            callback: !$.isFunction(callback) ? $.noop : function() {
                                // reorder matches based on the order they appear in the ids array because right now
                                // they are in the order in which they appear in data array
                                var ordered = [];
                                for (var i = 0; i < ids.length; i++) {
                                    var id = ids[i];
                                    for (var j = 0; j < matches.length; j++) {
                                        var match = matches[j];
                                        if (equal(id, opts.id(match))) {
                                            ordered.push(match);
                                            matches.splice(j, 1);
                                            break;
                                        }
                                    }
                                }
                                callback(ordered);
                            }
                        });
                    };
                }
                return opts;
            },
            // multi
            selectChoice: function(choice) {
                var selected = this.container.find(".select2-search-choice-focus");
                if (selected.length && choice && choice[0] == selected[0]) {} else {
                    if (selected.length) {
                        this.opts.element.trigger("choice-deselected", selected);
                    }
                    selected.removeClass("select2-search-choice-focus");
                    if (choice && choice.length) {
                        this.close();
                        choice.addClass("select2-search-choice-focus");
                        this.opts.element.trigger("choice-selected", choice);
                    }
                }
            },
            // multi
            destroy: function() {
                $("label[for='" + this.search.attr("id") + "']").attr("for", this.opts.element.attr("id"));
                this.parent.destroy.apply(this, arguments);
                cleanupJQueryElements.call(this, "searchContainer", "selection");
            },
            // multi
            initContainer: function() {
                var selector = ".select2-choices", selection;
                this.searchContainer = this.container.find(".select2-search-field");
                this.selection = selection = this.container.find(selector);
                var _this = this;
                this.selection.on("click", ".select2-container:not(.select2-container-disabled) .select2-search-choice:not(.select2-locked)", function(e) {
                    _this.search[0].focus();
                    _this.selectChoice($(this));
                });
                // rewrite labels from original element to focusser
                this.search.attr("id", "s2id_autogen" + nextUid());
                this.search.prev().text($("label[for='" + this.opts.element.attr("id") + "']").text()).attr("for", this.search.attr("id"));
                this.opts.element.focus(this.bind(function() {
                    this.focus();
                }));
                this.search.on("input paste", this.bind(function() {
                    if (this.search.attr("placeholder") && this.search.val().length == 0) return;
                    if (!this.isInterfaceEnabled()) return;
                    if (!this.opened()) {
                        this.open();
                    }
                }));
                this.search.attr("tabindex", this.elementTabIndex);
                this.keydowns = 0;
                this.search.on("keydown", this.bind(function(e) {
                    if (!this.isInterfaceEnabled()) return;
                    ++this.keydowns;
                    var selected = selection.find(".select2-search-choice-focus");
                    var prev = selected.prev(".select2-search-choice:not(.select2-locked)");
                    var next = selected.next(".select2-search-choice:not(.select2-locked)");
                    var pos = getCursorInfo(this.search);
                    if (selected.length && (e.which == KEY.LEFT || e.which == KEY.RIGHT || e.which == KEY.BACKSPACE || e.which == KEY.DELETE || e.which == KEY.ENTER)) {
                        var selectedChoice = selected;
                        if (e.which == KEY.LEFT && prev.length) {
                            selectedChoice = prev;
                        } else if (e.which == KEY.RIGHT) {
                            selectedChoice = next.length ? next : null;
                        } else if (e.which === KEY.BACKSPACE) {
                            if (this.unselect(selected.first())) {
                                this.search.width(10);
                                selectedChoice = prev.length ? prev : next;
                            }
                        } else if (e.which == KEY.DELETE) {
                            if (this.unselect(selected.first())) {
                                this.search.width(10);
                                selectedChoice = next.length ? next : null;
                            }
                        } else if (e.which == KEY.ENTER) {
                            selectedChoice = null;
                        }
                        this.selectChoice(selectedChoice);
                        killEvent(e);
                        if (!selectedChoice || !selectedChoice.length) {
                            this.open();
                        }
                        return;
                    } else if ((e.which === KEY.BACKSPACE && this.keydowns == 1 || e.which == KEY.LEFT) && pos.offset == 0 && !pos.length) {
                        this.selectChoice(selection.find(".select2-search-choice:not(.select2-locked)").last());
                        killEvent(e);
                        return;
                    } else {
                        this.selectChoice(null);
                    }
                    if (this.opened()) {
                        switch (e.which) {
                          case KEY.UP:
                          case KEY.DOWN:
                            this.moveHighlight(e.which === KEY.UP ? -1 : 1);
                            killEvent(e);
                            return;

                          case KEY.ENTER:
                            this.selectHighlighted();
                            killEvent(e);
                            return;

                          case KEY.TAB:
                            this.selectHighlighted({
                                noFocus: true
                            });
                            this.close();
                            return;

                          case KEY.ESC:
                            this.cancel(e);
                            killEvent(e);
                            return;
                        }
                    }
                    if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                        return;
                    }
                    if (e.which === KEY.ENTER) {
                        if (this.opts.openOnEnter === false) {
                            return;
                        } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
                            return;
                        }
                    }
                    this.open();
                    if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                        // prevent the page from scrolling
                        killEvent(e);
                    }
                    if (e.which === KEY.ENTER) {
                        // prevent form from being submitted
                        killEvent(e);
                    }
                }));
                this.search.on("keyup", this.bind(function(e) {
                    this.keydowns = 0;
                    this.resizeSearch();
                }));
                this.search.on("blur", this.bind(function(e) {
                    this.container.removeClass("select2-container-active");
                    this.search.removeClass("select2-focused");
                    this.selectChoice(null);
                    if (!this.opened()) this.clearSearch();
                    e.stopImmediatePropagation();
                    this.opts.element.trigger($.Event("select2-blur"));
                }));
                this.container.on("click", selector, this.bind(function(e) {
                    if (!this.isInterfaceEnabled()) return;
                    if ($(e.target).closest(".select2-search-choice").length > 0) {
                        // clicked inside a select2 search choice, do not open
                        return;
                    }
                    this.selectChoice(null);
                    this.clearPlaceholder();
                    if (!this.container.hasClass("select2-container-active")) {
                        this.opts.element.trigger($.Event("select2-focus"));
                    }
                    this.open();
                    this.focusSearch();
                    e.preventDefault();
                }));
                this.container.on("focus", selector, this.bind(function() {
                    if (!this.isInterfaceEnabled()) return;
                    if (!this.container.hasClass("select2-container-active")) {
                        this.opts.element.trigger($.Event("select2-focus"));
                    }
                    this.container.addClass("select2-container-active");
                    this.dropdown.addClass("select2-drop-active");
                    this.clearPlaceholder();
                }));
                this.initContainerWidth();
                this.opts.element.hide();
                // set the placeholder if necessary
                this.clearSearch();
            },
            // multi
            enableInterface: function() {
                if (this.parent.enableInterface.apply(this, arguments)) {
                    this.search.prop("disabled", !this.isInterfaceEnabled());
                }
            },
            // multi
            initSelection: function() {
                var data;
                if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                    this.updateSelection([]);
                    this.close();
                    // set the placeholder if necessary
                    this.clearSearch();
                }
                if (this.select || this.opts.element.val() !== "") {
                    var self = this;
                    this.opts.initSelection.call(null, this.opts.element, function(data) {
                        if (data !== undefined && data !== null) {
                            self.updateSelection(data);
                            self.close();
                            // set the placeholder if necessary
                            self.clearSearch();
                        }
                    });
                }
            },
            // multi
            clearSearch: function() {
                var placeholder = this.getPlaceholder(), maxWidth = this.getMaxSearchWidth();
                if (placeholder !== undefined && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                    this.search.val(placeholder).addClass("select2-default");
                    // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                    // we could call this.resizeSearch(), but we do not because that requires a sizer and we do not want to create one so early because of a firefox bug, see #944
                    this.search.width(maxWidth > 0 ? maxWidth : this.container.css("width"));
                } else {
                    this.search.val("").width(10);
                }
            },
            // multi
            clearPlaceholder: function() {
                if (this.search.hasClass("select2-default")) {
                    this.search.val("").removeClass("select2-default");
                }
            },
            // multi
            opening: function() {
                this.clearPlaceholder();
                // should be done before super so placeholder is not used to search
                this.resizeSearch();
                this.parent.opening.apply(this, arguments);
                this.focusSearch();
                // initializes search's value with nextSearchTerm (if defined by user)
                // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
                if (this.search.val() === "") {
                    if (this.nextSearchTerm != undefined) {
                        this.search.val(this.nextSearchTerm);
                        this.search.select();
                    }
                }
                this.updateResults(true);
                if (this.opts.shouldFocusInput(this)) {
                    this.search.focus();
                }
                this.opts.element.trigger($.Event("select2-open"));
            },
            // multi
            close: function() {
                if (!this.opened()) return;
                this.parent.close.apply(this, arguments);
            },
            // multi
            focus: function() {
                this.close();
                this.search.focus();
            },
            // multi
            isFocused: function() {
                return this.search.hasClass("select2-focused");
            },
            // multi
            updateSelection: function(data) {
                var ids = [], filtered = [], self = this;
                // filter out duplicates
                $(data).each(function() {
                    if (indexOf(self.id(this), ids) < 0) {
                        ids.push(self.id(this));
                        filtered.push(this);
                    }
                });
                data = filtered;
                this.selection.find(".select2-search-choice").remove();
                $(data).each(function() {
                    self.addSelectedChoice(this);
                });
                self.postprocessResults();
            },
            // multi
            tokenize: function() {
                var input = this.search.val();
                input = this.opts.tokenizer.call(this, input, this.data(), this.bind(this.onSelect), this.opts);
                if (input != null && input != undefined) {
                    this.search.val(input);
                    if (input.length > 0) {
                        this.open();
                    }
                }
            },
            // multi
            onSelect: function(data, options) {
                if (!this.triggerSelect(data) || data.text === "") {
                    return;
                }
                this.addSelectedChoice(data);
                this.opts.element.trigger({
                    type: "selected",
                    val: this.id(data),
                    choice: data
                });
                // keep track of the search's value before it gets cleared
                this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
                this.clearSearch();
                this.updateResults();
                if (this.select || !this.opts.closeOnSelect) this.postprocessResults(data, false, this.opts.closeOnSelect === true);
                if (this.opts.closeOnSelect) {
                    this.close();
                    this.search.width(10);
                } else {
                    if (this.countSelectableResults() > 0) {
                        this.search.width(10);
                        this.resizeSearch();
                        if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) {
                            // if we reached max selection size repaint the results so choices
                            // are replaced with the max selection reached message
                            this.updateResults(true);
                        } else {
                            // initializes search's value with nextSearchTerm and update search result
                            if (this.nextSearchTerm != undefined) {
                                this.search.val(this.nextSearchTerm);
                                this.updateResults();
                                this.search.select();
                            }
                        }
                        this.positionDropdown();
                    } else {
                        // if nothing left to select close
                        this.close();
                        this.search.width(10);
                    }
                }
                // since its not possible to select an element that has already been
                // added we do not need to check if this is a new element before firing change
                this.triggerChange({
                    added: data
                });
                if (!options || !options.noFocus) this.focusSearch();
            },
            // multi
            cancel: function() {
                this.close();
                this.focusSearch();
            },
            addSelectedChoice: function(data) {
                var enableChoice = !data.locked, enabledItem = $("<li class='select2-search-choice'>" + "    <div></div>" + "    <a href='#' class='select2-search-choice-close' tabindex='-1'></a>" + "</li>"), disabledItem = $("<li class='select2-search-choice select2-locked'>" + "<div></div>" + "</li>");
                var choice = enableChoice ? enabledItem : disabledItem, id = this.id(data), val = this.getVal(), formatted, cssClass;
                formatted = this.opts.formatSelection(data, choice.find("div"), this.opts.escapeMarkup);
                if (formatted != undefined) {
                    choice.find("div").replaceWith($("<div></div>").html(formatted));
                }
                cssClass = this.opts.formatSelectionCssClass(data, choice.find("div"));
                if (cssClass != undefined) {
                    choice.addClass(cssClass);
                }
                if (enableChoice) {
                    choice.find(".select2-search-choice-close").on("mousedown", killEvent).on("click dblclick", this.bind(function(e) {
                        if (!this.isInterfaceEnabled()) return;
                        this.unselect($(e.target));
                        this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                        killEvent(e);
                        this.close();
                        this.focusSearch();
                    })).on("focus", this.bind(function() {
                        if (!this.isInterfaceEnabled()) return;
                        this.container.addClass("select2-container-active");
                        this.dropdown.addClass("select2-drop-active");
                    }));
                }
                choice.data("select2-data", data);
                choice.insertBefore(this.searchContainer);
                val.push(id);
                this.setVal(val);
            },
            // multi
            unselect: function(selected) {
                var val = this.getVal(), data, index;
                selected = selected.closest(".select2-search-choice");
                if (selected.length === 0) {
                    throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
                }
                data = selected.data("select2-data");
                if (!data) {
                    // prevent a race condition when the 'x' is clicked really fast repeatedly the event can be queued
                    // and invoked on an element already removed
                    return;
                }
                var evt = $.Event("select2-removing");
                evt.val = this.id(data);
                evt.choice = data;
                this.opts.element.trigger(evt);
                if (evt.isDefaultPrevented()) {
                    return false;
                }
                while ((index = indexOf(this.id(data), val)) >= 0) {
                    val.splice(index, 1);
                    this.setVal(val);
                    if (this.select) this.postprocessResults();
                }
                selected.remove();
                this.opts.element.trigger({
                    type: "select2-removed",
                    val: this.id(data),
                    choice: data
                });
                this.triggerChange({
                    removed: data
                });
                return true;
            },
            // multi
            postprocessResults: function(data, initial, noHighlightUpdate) {
                var val = this.getVal(), choices = this.results.find(".select2-result"), compound = this.results.find(".select2-result-with-children"), self = this;
                choices.each2(function(i, choice) {
                    var id = self.id(choice.data("select2-data"));
                    if (indexOf(id, val) >= 0) {
                        choice.addClass("select2-selected");
                        // mark all children of the selected parent as selected
                        choice.find(".select2-result-selectable").addClass("select2-selected");
                    }
                });
                compound.each2(function(i, choice) {
                    // hide an optgroup if it doesn't have any selectable children
                    if (!choice.is(".select2-result-selectable") && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {
                        choice.addClass("select2-selected");
                    }
                });
                if (this.highlight() == -1 && noHighlightUpdate !== false && this.opts.closeOnSelect === true) {
                    self.highlight(0);
                }
                //If all results are chosen render formatNoMatches
                if (!this.opts.createSearchChoice && !choices.filter(".select2-result:not(.select2-selected)").length > 0) {
                    if (!data || data && !data.more && this.results.find(".select2-no-results").length === 0) {
                        if (checkFormatter(self.opts.formatNoMatches, "formatNoMatches")) {
                            this.results.append("<li class='select2-no-results'>" + evaluate(self.opts.formatNoMatches, self.opts.element, self.search.val()) + "</li>");
                        }
                    }
                }
            },
            // multi
            getMaxSearchWidth: function() {
                return this.selection.width() - getSideBorderPadding(this.search);
            },
            // multi
            resizeSearch: function() {
                var minimumWidth, left, maxWidth, containerLeft, searchWidth, sideBorderPadding = getSideBorderPadding(this.search);
                minimumWidth = measureTextWidth(this.search) + 10;
                left = this.search.offset().left;
                maxWidth = this.selection.width();
                containerLeft = this.selection.offset().left;
                searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;
                if (searchWidth < minimumWidth) {
                    searchWidth = maxWidth - sideBorderPadding;
                }
                if (searchWidth < 40) {
                    searchWidth = maxWidth - sideBorderPadding;
                }
                if (searchWidth <= 0) {
                    searchWidth = minimumWidth;
                }
                this.search.width(Math.floor(searchWidth));
            },
            // multi
            getVal: function() {
                var val;
                if (this.select) {
                    val = this.select.val();
                    return val === null ? [] : val;
                } else {
                    val = this.opts.element.val();
                    return splitVal(val, this.opts.separator, this.opts.transformVal);
                }
            },
            // multi
            setVal: function(val) {
                var unique;
                if (this.select) {
                    this.select.val(val);
                } else {
                    unique = [];
                    // filter out duplicates
                    $(val).each(function() {
                        if (indexOf(this, unique) < 0) unique.push(this);
                    });
                    this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
                }
            },
            // multi
            buildChangeDetails: function(old, current) {
                var current = current.slice(0), old = old.slice(0);
                // remove intersection from each array
                for (var i = 0; i < current.length; i++) {
                    for (var j = 0; j < old.length; j++) {
                        if (equal(this.opts.id(current[i]), this.opts.id(old[j]))) {
                            current.splice(i, 1);
                            if (i > 0) {
                                i--;
                            }
                            old.splice(j, 1);
                            j--;
                        }
                    }
                }
                return {
                    added: current,
                    removed: old
                };
            },
            // multi
            val: function(val, triggerChange) {
                var oldData, self = this;
                if (arguments.length === 0) {
                    return this.getVal();
                }
                oldData = this.data();
                if (!oldData.length) oldData = [];
                // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                if (!val && val !== 0) {
                    this.opts.element.val("");
                    this.updateSelection([]);
                    this.clearSearch();
                    if (triggerChange) {
                        this.triggerChange({
                            added: this.data(),
                            removed: oldData
                        });
                    }
                    return;
                }
                // val is a list of ids
                this.setVal(val);
                if (this.select) {
                    this.opts.initSelection(this.select, this.bind(this.updateSelection));
                    if (triggerChange) {
                        this.triggerChange(this.buildChangeDetails(oldData, this.data()));
                    }
                } else {
                    if (this.opts.initSelection === undefined) {
                        throw new Error("val() cannot be called if initSelection() is not defined");
                    }
                    this.opts.initSelection(this.opts.element, function(data) {
                        var ids = $.map(data, self.id);
                        self.setVal(ids);
                        self.updateSelection(data);
                        self.clearSearch();
                        if (triggerChange) {
                            self.triggerChange(self.buildChangeDetails(oldData, self.data()));
                        }
                    });
                }
                this.clearSearch();
            },
            // multi
            onSortStart: function() {
                if (this.select) {
                    throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
                }
                // collapse search field into 0 width so its container can be collapsed as well
                this.search.width(0);
                // hide the container
                this.searchContainer.hide();
            },
            // multi
            onSortEnd: function() {
                var val = [], self = this;
                // show search and move it to the end of the list
                this.searchContainer.show();
                // make sure the search container is the last item in the list
                this.searchContainer.appendTo(this.searchContainer.parent());
                // since we collapsed the width in dragStarted, we resize it here
                this.resizeSearch();
                // update selection
                this.selection.find(".select2-search-choice").each(function() {
                    val.push(self.opts.id($(this).data("select2-data")));
                });
                this.setVal(val);
                this.triggerChange();
            },
            // multi
            data: function(values, triggerChange) {
                var self = this, ids, old;
                if (arguments.length === 0) {
                    return this.selection.children(".select2-search-choice").map(function() {
                        return $(this).data("select2-data");
                    }).get();
                } else {
                    old = this.data();
                    if (!values) {
                        values = [];
                    }
                    ids = $.map(values, function(e) {
                        return self.opts.id(e);
                    });
                    this.setVal(ids);
                    this.updateSelection(values);
                    this.clearSearch();
                    if (triggerChange) {
                        this.triggerChange(this.buildChangeDetails(old, this.data()));
                    }
                }
            }
        });
        $.fn.select2 = function() {
            var args = Array.prototype.slice.call(arguments, 0), opts, select2, method, value, multiple, allowedMethods = [ "val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "dropdown", "onSortStart", "onSortEnd", "enable", "disable", "readonly", "positionDropdown", "data", "search" ], valueMethods = [ "opened", "isFocused", "container", "dropdown" ], propertyMethods = [ "val", "data" ], methodsMap = {
                search: "externalSearch"
            };
            this.each(function() {
                if (args.length === 0 || typeof args[0] === "object") {
                    opts = args.length === 0 ? {} : $.extend({}, args[0]);
                    opts.element = $(this);
                    if (opts.element.get(0).tagName.toLowerCase() === "select") {
                        multiple = opts.element.prop("multiple");
                    } else {
                        multiple = opts.multiple || false;
                        if ("tags" in opts) {
                            opts.multiple = multiple = true;
                        }
                    }
                    select2 = multiple ? new window.Select2["class"].multi() : new window.Select2["class"].single();
                    select2.init(opts);
                } else if (typeof args[0] === "string") {
                    if (indexOf(args[0], allowedMethods) < 0) {
                        throw "Unknown method: " + args[0];
                    }
                    value = undefined;
                    select2 = $(this).data("select2");
                    if (select2 === undefined) return;
                    method = args[0];
                    if (method === "container") {
                        value = select2.container;
                    } else if (method === "dropdown") {
                        value = select2.dropdown;
                    } else {
                        if (methodsMap[method]) method = methodsMap[method];
                        value = select2[method].apply(select2, args.slice(1));
                    }
                    if (indexOf(args[0], valueMethods) >= 0 || indexOf(args[0], propertyMethods) >= 0 && args.length == 1) {
                        return false;
                    }
                } else {
                    throw "Invalid arguments to select2 plugin: " + args;
                }
            });
            return value === undefined ? this : value;
        };
        // plugin defaults, accessible to users
        $.fn.select2.defaults = {
            width: "copy",
            loadMorePadding: 0,
            closeOnSelect: true,
            openOnEnter: true,
            containerCss: {},
            dropdownCss: {},
            containerCssClass: "",
            dropdownCssClass: "",
            formatResult: function(result, container, query, escapeMarkup) {
                var markup = [];
                markMatch(this.text(result), query.term, markup, escapeMarkup);
                return markup.join("");
            },
            transformVal: function(val) {
                return $.trim(val);
            },
            formatSelection: function(data, container, escapeMarkup) {
                return data ? escapeMarkup(this.text(data)) : undefined;
            },
            sortResults: function(results, container, query) {
                return results;
            },
            formatResultCssClass: function(data) {
                return data.css;
            },
            formatSelectionCssClass: function(data, container) {
                return undefined;
            },
            minimumResultsForSearch: 0,
            minimumInputLength: 0,
            maximumInputLength: null,
            maximumSelectionSize: 0,
            id: function(e) {
                return e == undefined ? null : e.id;
            },
            text: function(e) {
                if (e && this.data && this.data.text) {
                    if ($.isFunction(this.data.text)) {
                        return this.data.text(e);
                    } else {
                        return e[this.data.text];
                    }
                } else {
                    return e.text;
                }
            },
            matcher: function(term, text) {
                return stripDiacritics("" + text).toUpperCase().indexOf(stripDiacritics("" + term).toUpperCase()) >= 0;
            },
            separator: ",",
            tokenSeparators: [],
            tokenizer: defaultTokenizer,
            escapeMarkup: defaultEscapeMarkup,
            blurOnChange: false,
            selectOnBlur: false,
            adaptContainerCssClass: function(c) {
                return c;
            },
            adaptDropdownCssClass: function(c) {
                return null;
            },
            nextSearchTerm: function(selectedObject, currentSearchTerm) {
                return undefined;
            },
            searchInputPlaceholder: "",
            createSearchChoicePosition: "top",
            shouldFocusInput: function(instance) {
                // Attempt to detect touch devices
                var supportsTouchEvents = "ontouchstart" in window || navigator.msMaxTouchPoints > 0;
                // Only devices which support touch events should be special cased
                if (!supportsTouchEvents) {
                    return true;
                }
                // Never focus the input if search is disabled
                if (instance.opts.minimumResultsForSearch < 0) {
                    return false;
                }
                return true;
            }
        };
        $.fn.select2.locales = [];
        $.fn.select2.locales["en"] = {
            formatMatches: function(matches) {
                if (matches === 1) {
                    return "One result is available, press enter to select it.";
                }
                return matches + " results are available, use up and down arrow keys to navigate.";
            },
            formatNoMatches: function() {
                return "No matches found";
            },
            formatAjaxError: function(jqXHR, textStatus, errorThrown) {
                return "Loading failed";
            },
            formatInputTooShort: function(input, min) {
                var n = min - input.length;
                return "Please enter " + n + " or more character" + (n == 1 ? "" : "s");
            },
            formatInputTooLong: function(input, max) {
                var n = input.length - max;
                return "Please delete " + n + " character" + (n == 1 ? "" : "s");
            },
            formatSelectionTooBig: function(limit) {
                return "You can only select " + limit + " item" + (limit == 1 ? "" : "s");
            },
            formatLoadMore: function(pageNumber) {
                return "Loading more resultsâ€¦";
            },
            formatSearching: function() {
                return "Searchingâ€¦";
            }
        };
        $.extend($.fn.select2.defaults, $.fn.select2.locales["en"]);
        $.fn.select2.ajaxDefaults = {
            transport: $.ajax,
            params: {
                type: "GET",
                cache: false,
                dataType: "json"
            }
        };
        // exports
        window.Select2 = {
            query: {
                ajax: ajax,
                local: local,
                tags: tags
            },
            util: {
                debounce: debounce,
                markMatch: markMatch,
                escapeMarkup: defaultEscapeMarkup,
                stripDiacritics: stripDiacritics
            },
            "class": {
                "abstract": AbstractSelect2,
                single: SingleSelect2,
                multi: MultiSelect2
            }
        };
    })(jQuery);
});

define("keenwon/select2/3.5.2/select2-debug.css", [], function() {
    seajs.importStyle(".select2-container{margin:0;position:relative;display:inline-block;zoom:1;vertical-align:middle}.select2-container,.select2-drop,.select2-search,.select2-search input{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.select2-container .select2-choice{display:block;height:28px;padding:0 0 0 10px;overflow:hidden;position:relative;border:1px solid #c1c9d5;white-space:nowrap;line-height:28px;color:#4b596d;text-decoration:none;background-clip:padding-box;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:#fff}html[dir=rtl] .select2-container .select2-choice{padding:0 10px 0 0}.select2-container.select2-drop-above .select2-choice{border-bottom-color:#aaa;border-radius:0 0 4px 4px;background-image:-webkit-gradient(linear,left bottom,left top,color-stop(0,#eee),color-stop(0.9,#fff));background-image:-webkit-linear-gradient(center bottom,#eee 0,#fff 90%);background-image:-moz-linear-gradient(center bottom,#eee 0,#fff 90%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#eeeeee', GradientType=0);background-image:linear-gradient(to bottom,#eee 0,#fff 90%)}.select2-container.select2-allowclear .select2-choice .select2-chosen{margin-right:42px}.select2-container .select2-choice>.select2-chosen{margin-right:28px;display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;float:none;width:auto}html[dir=rtl] .select2-container .select2-choice>.select2-chosen{margin-left:30px;margin-right:0}.select2-container .select2-choice abbr{display:none;width:12px;height:12px;position:absolute;right:24px;top:8px;font-size:1px;text-decoration:none;border:0;background:url(http://ue.17173cdn.com/a/2035/open/2014/img/select2.png) right top no-repeat;cursor:pointer;outline:0}.select2-container.select2-allowclear .select2-choice abbr{display:inline-block}.select2-container .select2-choice abbr:hover{background-position:right -11px;cursor:pointer}.select2-drop-mask{border:0;margin:0;padding:0;position:fixed;left:0;top:0;min-height:100%;min-width:100%;height:auto;width:auto;opacity:0;z-index:9998;background-color:#fff;filter:alpha(opacity=0)}.select2-drop{width:100%;margin-top:-1px;position:absolute;z-index:9999;top:100%;background:#fff;color:#4b596d;border:1px solid #c1c9d5;border-top:0}.select2-drop.select2-drop-above{margin-top:1px;border-top:1px solid #aaa;border-bottom:0;border-radius:4px 4px 0 0;-webkit-box-shadow:0 -4px 5px rgba(0,0,0,.15);box-shadow:0 -4px 5px rgba(0,0,0,.15)}.select2-drop-active{border:1px solid #ffa019;border-top:0}.select2-drop.select2-drop-above.select2-drop-active{border-top:1px solid #5897fb}.select2-drop-auto-width{border-top:1px solid #aaa;width:auto}.select2-drop-auto-width .select2-search{padding-top:4px}.select2-container .select2-choice .select2-arrow{display:inline-block;width:28px;height:100%;position:absolute;right:0;top:0}html[dir=rtl] .select2-container .select2-choice .select2-arrow{left:0;right:auto;border-left:0;border-right:1px solid #aaa;border-radius:4px 0 0 4px}.select2-container .select2-choice .select2-arrow b{display:block;width:100%;height:100%;background:url(http://ue1.17173cdn.com/a/2035/open/2014/img/b2.png) 0 -80px no-repeat}html[dir=rtl] .select2-container .select2-choice .select2-arrow b{background-position:2px -80px}.select2-search{display:inline-block;width:100%;min-height:26px;margin:0;padding-left:2px;padding-right:2px;position:relative;z-index:10000;white-space:nowrap}.select2-search input{width:100%;height:auto!important;min-height:26px;padding:4px 20px 4px 5px;margin:0;outline:0;font-family:sans-serif;font-size:1em;border:1px solid #aaa;border-radius:0;-webkit-box-shadow:none;box-shadow:none;background:url(http://ue.17173cdn.com/a/2035/open/2014/img/select2.png) 100% -22px no-repeat #fff;background:url(http://ue.17173cdn.com/a/2035/open/2014/img/select2.png) 100% -22px no-repeat,linear-gradient(to bottom,#fff 85%,#eee 99%)}html[dir=rtl] .select2-search input{padding:4px 5px 4px 20px;background:url(http://ue.17173cdn.com/a/2035/open/2014/img/select2.png) -37px -22px no-repeat #fff;background:url(http://ue.17173cdn.com/a/2035/open/2014/img/select2.png) -37px -22px no-repeat,linear-gradient(to bottom,#fff 85%,#eee 99%)}.select2-drop.select2-drop-above .select2-search input{margin-top:4px}.select2-search input.select2-active{background:url(http://ue.17173cdn.com/a/2035/open/2014/img/select2-spinner.gif) no-repeat 100% #fff;background:url(http://ue.17173cdn.com/a/2035/open/2014/img/select2-spinner.gif) no-repeat 100%,linear-gradient(to bottom,#fff 85%,#eee 99%)}.select2-container-active .select2-choice,.select2-container-active .select2-choices{border:1px solid #ffa019;outline:0}.select2-dropdown-open .select2-choice{border-bottom-color:transparent}.select2-dropdown-open.select2-drop-above .select2-choice,.select2-dropdown-open.select2-drop-above .select2-choices{border:1px solid #5897fb;border-top-color:transparent;background-image:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(0.5,#eee));background-image:-webkit-linear-gradient(center top,#fff 0,#eee 50%);background-image:-moz-linear-gradient(center top,#fff 0,#eee 50%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#eeeeee', endColorstr='#ffffff', GradientType=0);background-image:linear-gradient(to bottom,#fff 0,#eee 50%)}.select2-dropdown-open .select2-choice .select2-arrow{background:0 0;border-left:0;filter:none}html[dir=rtl] .select2-dropdown-open .select2-choice .select2-arrow{border-right:0}.select2-dropdown-open .select2-choice .select2-arrow b{background-position:0 -110px}html[dir=rtl] .select2-dropdown-open .select2-choice .select2-arrow b{background-position:2px -110px}.select2-hidden-accessible{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.select2-results{max-height:200px;padding:0 0 0 2px;margin:2px 2px 2px 0;position:relative;overflow-x:hidden;overflow-y:auto;-webkit-tap-highlight-color:transparent}html[dir=rtl] .select2-results{padding:0 4px 0 0;margin:4px 0 4px 4px}.select2-results ul.select2-result-sub{margin:0;padding-left:0}.select2-results li{list-style:none;display:list-item;background-image:none}.select2-results li.select2-result-with-children>.select2-result-label{font-weight:700}.select2-results .select2-result-label{line-height:30px;padding:0 10px;margin:0;cursor:pointer;min-height:1em;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.select2-results-dept-1 .select2-result-label{padding-left:20px}.select2-results-dept-2 .select2-result-label{padding-left:40px}.select2-results-dept-3 .select2-result-label{padding-left:60px}.select2-results-dept-4 .select2-result-label{padding-left:80px}.select2-results-dept-5 .select2-result-label{padding-left:100px}.select2-results-dept-6 .select2-result-label{padding-left:110px}.select2-results-dept-7 .select2-result-label{padding-left:120px}.select2-results .select2-highlighted{background:#ffa019;color:#fff}.select2-results li em{background:#feffde;font-style:normal}.select2-results .select2-highlighted em{background:0 0}.select2-results .select2-highlighted ul{background:#fff;color:#000}.select2-results .select2-ajax-error,.select2-results .select2-no-results,.select2-results .select2-searching,.select2-results .select2-selection-limit{display:list-item;padding-left:5px}aaaa .select2-results .select2-disabled.select2-highlighted{color:#666;background:#f4f4f4;display:list-item;cursor:default}.select2-results .select2-disabled{background:#f4f4f4;display:list-item;cursor:default}.select2-results .select2-selected{display:none}.select2-more-results.select2-active{background:url(http://ue.17173cdn.com/a/2035/open/2014/img/select2-spinner.gif) no-repeat 100% #f4f4f4}.select2-results .select2-ajax-error{background:rgba(255,50,50,.2)}.select2-more-results{background:#f4f4f4;display:list-item}.select2-container.select2-container-disabled .select2-choice{background-color:#f4f4f4;background-image:none;border:1px solid #ddd;cursor:default}.select2-container.select2-container-disabled .select2-choice .select2-arrow{background-color:#f4f4f4;background-image:none;border-left:0}.select2-container.select2-container-disabled .select2-choice abbr{display:none}.select2-container-multi .select2-choices{height:auto!important;height:1%;margin:0;padding:0 5px 0 0;position:relative;border:1px solid #aaa;cursor:text;overflow:hidden;background-color:#fff;background-image:-webkit-gradient(linear,0 0,0 100%,color-stop(1%,#eee),color-stop(15%,#fff));background-image:-webkit-linear-gradient(top,#eee 1%,#fff 15%);background-image:-moz-linear-gradient(top,#eee 1%,#fff 15%);background-image:linear-gradient(to bottom,#eee 1%,#fff 15%)}html[dir=rtl] .select2-container-multi .select2-choices{padding:0 0 0 5px}.select2-locked{padding:3px 5px!important}.select2-container-multi .select2-choices{min-height:26px}.select2-container-multi.select2-container-active .select2-choices{border:1px solid #5897fb;outline:0;-webkit-box-shadow:0 0 5px rgba(0,0,0,.3);box-shadow:0 0 5px rgba(0,0,0,.3)}.select2-container-multi .select2-choices li{float:left;list-style:none}html[dir=rtl] .select2-container-multi .select2-choices li{float:right}.select2-container-multi .select2-choices .select2-search-field{margin:0;padding:0;white-space:nowrap}.select2-container-multi .select2-choices .select2-search-field input{padding:5px;margin:1px 0;font-family:sans-serif;font-size:100%;color:#666;outline:0;border:0;-webkit-box-shadow:none;box-shadow:none;background:0 0!important}.select2-container-multi .select2-choices .select2-search-field input.select2-active{background:url(http://ue.17173cdn.com/a/2035/open/2014/img/select2-spinner.gif) no-repeat 100% #fff!important}.select2-default{color:#999!important}.select2-container-multi .select2-choices .select2-search-choice{padding:3px 5px 3px 18px;margin:3px 0 3px 5px;position:relative;line-height:13px;color:#333;cursor:default;border:1px solid #aaa;border-radius:3px;-webkit-box-shadow:0 0 2px #fff inset,0 1px 0 rgba(0,0,0,.05);box-shadow:0 0 2px #fff inset,0 1px 0 rgba(0,0,0,.05);background-clip:padding-box;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:#e4e4e4;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#eeeeee', endColorstr='#f4f4f4', GradientType=0);background-image:-webkit-gradient(linear,0 0,0 100%,color-stop(20%,#f4f4f4),color-stop(50%,#f0f0f0),color-stop(52%,#e8e8e8),color-stop(100%,#eee));background-image:-webkit-linear-gradient(top,#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);background-image:-moz-linear-gradient(top,#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);background-image:linear-gradient(to bottom,#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%)}html[dir=rtl] .select2-container-multi .select2-choices .select2-search-choice{margin:3px 5px 3px 0;padding:3px 18px 3px 5px}.select2-container-multi .select2-choices .select2-search-choice .select2-chosen{cursor:default}.select2-container-multi .select2-choices .select2-search-choice-focus{background:#d4d4d4}.select2-search-choice-close{display:block;width:12px;height:13px;position:absolute;right:3px;top:4px;font-size:1px;outline:0;background:url(http://ue.17173cdn.com/a/2035/open/2014/img/select2.png) right top no-repeat}html[dir=rtl] .select2-search-choice-close{right:auto;left:3px}.select2-container-multi .select2-search-choice-close{left:3px}html[dir=rtl] .select2-container-multi .select2-search-choice-close{left:auto;right:2px}.select2-container-multi .select2-choices .select2-search-choice .select2-search-choice-close:hover,.select2-container-multi .select2-choices .select2-search-choice-focus .select2-search-choice-close{background-position:right -11px}.select2-container-multi.select2-container-disabled .select2-choices{background-color:#f4f4f4;background-image:none;border:1px solid #ddd;cursor:default}.select2-container-multi.select2-container-disabled .select2-choices .select2-search-choice{padding:3px 5px;border:1px solid #ddd;background-image:none;background-color:#f4f4f4}.select2-container-multi.select2-container-disabled .select2-choices .select2-search-choice .select2-search-choice-close{display:none;background:0 0}.select2-result-selectable .select2-match,.select2-result-unselectable .select2-match{text-decoration:underline}.select2-offscreen,.select2-offscreen:focus{clip:rect(0 0 0 0)!important;width:1px!important;height:1px!important;border:0!important;margin:0!important;padding:0!important;overflow:hidden!important;position:absolute!important;outline:0!important;left:0!important;top:0!important}.select2-display-none{display:none}.select2-measure-scrollbar{position:absolute;top:-10000px;left:-10000px;width:100px;height:100px;overflow:scroll}@media only screen and (-webkit-min-device-pixel-ratio:1.5),only screen and (min-resolution:2dppx){.select2-container .select2-choice .select2-arrow b,.select2-container .select2-choice abbr,.select2-search input,.select2-search-choice-close{background-image:url(http://ue.17173cdn.com/a/2035/open/2014/img/select2x2.png)!important;background-repeat:no-repeat!important;background-size:60px 40px!important}.select2-search input{background-position:100% -21px!important}}");
});
