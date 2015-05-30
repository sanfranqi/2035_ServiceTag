define(function (require) {
    'use strict';

    var $ = require('$'),
        util = require('../../common/util'),
        io = require('../../common/io'),
        helpers = require('../../common/helpers'),
        ConfirmBox = require('../../common/dialog/confirmbox'),
        paginator = require('../../common/paginator'),
        Validator = require('../../common/validator').fixedValidator,

        userGrouplistTemplate = require('./userGroupList.handlebars'),
        userlistTemplate = require('./userList.handlebars'),
        blackUserListTemplate = require('./blackUserList.handlebars'),
        selectTemplate = require('./select.handlebars'),
        userGroupDialogTemplate = require('./userGroupDialog.handlebars');

    require('../../common/logout');
    require('../../common/sidebar');
    require('handlebars');
    require('select2');

    var app = {

        model: {
            pageNo: 1,
            pageSize: 10,
            nickName: '',
            userGroupId: -1
        },

        userGroup: {
            id: -1,
            userGroupName: '好友组',
            userGroupType: '10'
        },

        userGroupList: [],

        isInit: true,

        init: function () {
            var self = this;

            self.cacheElements();
            self.getUserGroupList();
            self.bindEvents();
        },

        cacheElements: function () {
            var self = this;

            self.$main = $('#J_Main');
            self.$form = $('#J_Form');
            self.$list = $('#J_List');
            self.$select = $('#J_Select');
            self.$userGroupName = $('#J_UserGroup_Name');
            self.$userGroupList = $('#J_UserGroup_List');
            self.$createUserGroup = $('#J_UserGroup_Create');
            self.$editUserGroup = $('#J_UserGroup_Edit');
            self.$delUserGroup = $('#J_UserGroup_Del');
        },

        getUserGroupList: function (callback) {
            var self = this,
                url = util.getUrl('queryUserGroupList'),
                result,
                userGrouplistHtml;

            io.get(url, {serviceTagId: serviceTagId}, function () {
                self.userGroupList = result = this.data;

                userGrouplistHtml = userGrouplistTemplate(result, {helpers: helpers});
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

        proof: function () {
            var self = this,
                data = util.packForm(self.$form);

            self.model = $.extend({}, self.model, data);
            self.model.pageNo = 1;
            self.model.userGroupId = self.userGroup.id;

            self.search();
        },

        search: function () {
            var self = this,
                url = util.getUrl('queryUserList'),
                result,
                listHtml;

            io.get(url, self.model, function () {
                result = this.data;

                if (self.userGroup.userGroupType === '11') {
                    listHtml = blackUserListTemplate(result, {helpers: helpers});
                } else {
                    listHtml = userlistTemplate(result, {helpers: helpers});
                }
                self.$list.html(listHtml);

                paginator({
                    obj: $('#J_Page'),
                    pageNo: result.pageNo,
                    pageSize: result.pageSize,
                    totalHit: result.totalHit,
                    callback: function (num, type) {
                        if (type === 'change' && self.model.pageNo != num) {
                            self.model.pageNo = num;
                            self.search();
                        }
                    }
                });

                //调整关注人数
                var $userGroup = $('[data-id="' + self.userGroup.id + '"]');
                $userGroup.text(self.userGroup.userGroupName + '（' + result.totalHit + '）');
            });
        },

        createUserGroup: function () {
            var self = this;

            var cb = new ConfirmBox({
                title: '创建分组',
                width: 400,
                height: 200,
                message: userGroupDialogTemplate({}),
                onConfirm: function () {
                    self.userGroupValidator.execute(function (hasError) {
                        if (!hasError) {
                            var url = util.getUrl('createUserGroup'),
                                data = util.packForm('#J_UserGroupDialog_Form');

                            data.serviceTagId = serviceTagId;

                            io.post(url, data, function () {
                                self.getUserGroupList();
                                cb.hide();
                            });
                        }
                    });
                }
            }).after('show', function () {
                self.initUserGroupValidator();
            }).after('hide',function(){
                self.userGroupValidator && self.userGroupValidator.destroy();
                cb.destroy();
            }).show();
        },

        editUserGroup: function () {
            var self = this;

            var cb = new ConfirmBox({
                title: '编辑分组',
                width: 400,
                height: 200,
                message: userGroupDialogTemplate({userGroup: self.userGroup}),
                onConfirm: function () {
                    self.userGroupValidator.execute(function (hasError) {
                        if (!hasError) {
                            var url = util.getUrl('editUserGroup'),
                                data = util.packForm('#J_UserGroupDialog_Form');

                            io.post(url, data, function () {
                                self.getUserGroupList(function () {
                                    $('[data-id="' + data.userGroupId + '"]').parent('li').trigger('click');
                                });
                                cb.hide();
                            });
                        }
                    });
                }
            }).after('show', function () {
                self.initUserGroupValidator();
            }).after('hide',function(){
                self.userGroupValidator && self.userGroupValidator.destroy();
                cb.destroy();
            }).show();
        },

        initUserGroupValidator: function () {
            this.userGroupValidator && this.userGroupValidator.destroy();
            this.userGroupValidator = new Validator({
                element: '#J_UserGroupDialog_Form'
            }).addItem({
                element: '[name=userGroupName]',
                display: '分组名称',
                rule: 'maxlength{max:8}',
                required: true
            });
        },

        delUserGroup: function () {
            var self = this;

            ConfirmBox.alert('确认要删除该分组吗？', function () {
                io.post(util.getUrl('delUserGroup'), {userGroupId: self.userGroup.id}, function () {
                    self.isInit = true;
                    self.getUserGroupList();
                });
            });
        },

        black: function (userId) {
            var self = this;

            ConfirmBox.alert('确认要将此用户加入黑名单吗？', function () {
                io.post(util.getUrl('moveToBlack'), {serviceTagId: serviceTagId, userId: userId}, function () {
                    self.getUserGroupList(function () {
                        $('[data-id="' + self.userGroup.id + '"]').parent('li').trigger('click');
                    });
                });
            });
        },

        outBlack: function (userId) {
            var self = this;

            ConfirmBox.alert('确认要将此用户移出黑名单吗？', function () {
                io.post(util.getUrl('moveOutBlack'), {serviceTagId: serviceTagId, userId: userId}, function () {
                    self.getUserGroupList(function () {
                        $('[data-id="' + self.userGroup.id + '"]').parent('li').trigger('click');
                    });
                });
            });
        },

        setCurrentUserGroup: function (userGroup) {
            var self = this,
                _userGroup,
                $t,
                userGroupList = ['<option value=""></option>'];

            self.userGroup.id = userGroup.id;
            self.userGroup.userGroupName = userGroup.userGroupName;
            self.userGroup.userGroupType = userGroup.userGroupType;

            self.$userGroupName.text(userGroup.userGroupName);

            $t = self.$userGroupList.find('[data-id=' + userGroup.id + ']').parent('li');
            $t.siblings('li').removeClass('current');
            $t.addClass('current');

            if (userGroup.userGroupType === '12') {
                self.$delUserGroup.show();
                self.$editUserGroup.show();
            } else {
                self.$delUserGroup.hide();
                self.$editUserGroup.hide();
            }

            if (self.userGroup.userGroupType === '11') {
                self.$select.select2('destroy');
                self.$select.hide();
            } else {
                for (var i = 0, j = self.userGroupList.length; i < j; i++) {
                    _userGroup = self.userGroupList[i];
                    if (_userGroup.userGroupType !== '11' && _userGroup.id !== self.userGroup.id) {
                        userGroupList.push(_userGroup);
                    }
                }

                if (userGroupList.length > 1) {
                    self.$list.removeClass('pn-nogroup');
                    self.$select.show();
                    self.$select.html(selectTemplate({userGroupList: userGroupList}, {helpers: helpers}));
                    self.initSelect();
                } else {
                    self.$list.addClass('pn-nogroup');
                    self.$select.select2('destroy');
                    self.$select.hide();
                }
            }
        },

        initSelect: function () {
            var self = this;

            self.$select.select2('destroy');

            self.$select.select2({
                placeholder: '请选择用户分组',
                minimumResultsForSearch: -1
            }).off('select2-selecting').on('select2-selecting', function (e) {
                var checkedItem = self.getCheckedItem();
                if (checkedItem.length <= 0) {
                    ConfirmBox.alert('请选择要移动的用户');
                } else {
                    io.post(util.getUrl('addUserToGroup'), {
                        serviceTagId: serviceTagId,
                        newGroupId: e.val,
                        userIds: checkedItem
                    }, function () {
                        self.getUserGroupList(function () {
                            $('[data-id="' + self.userGroup.id + '"]').parent('li').trigger('click');
                        });
                    });
                }
                self.$select.select2('close');
                return false;
            });
        },

        getCheckedItem: function () {
            var checkedItem = [];

            $('.check-box').not('.check-all').each(function () {
                if ($(this).hasClass('checked')) {
                    checkedItem.push($(this).closest('li').data('userid'));
                }
            });

            return checkedItem;
        },

        bindEvents: function () {
            var self = this;

            self.$userGroupList.on('click', 'li', function () {
                var $t = $(this),
                    $a = $t.children('a');

                self.setCurrentUserGroup({
                    id: $a.data('id'),
                    userGroupName: $a.data('name'),
                    userGroupType: $a.data('type').toString()
                });

                // 清空搜索
                self.$form.find('[name="nickName"]').val('');

                self.proof();
            });

            self.$createUserGroup.on('click', $.proxy(self.createUserGroup, self));

            self.$form.on('submit', function () {
                self.proof();
                return false;
            });

            self.$editUserGroup.on('click', $.proxy(self.editUserGroup, self));

            self.$delUserGroup.on('click', $.proxy(self.delUserGroup, self));

            self.$main.on('click', '.check-box', function () {
                var $t = $(this);

                if ($t.hasClass('check-all')) {
                    if ($t.hasClass('checked')) {
                        $('.check-box').removeClass('checked');
                    } else {
                        $('.check-box').addClass('checked');
                    }
                } else {
                    $t.toggleClass('checked');

                    var checkedAll = true;
                    $('.check-box').not('.check-all').each(function () {
                        if (!$(this).hasClass('checked')) {
                            checkedAll = false;
                            return;
                        }
                    });

                    if (checkedAll) {
                        $('.check-all').addClass('checked');
                    } else {
                        $('.check-all').removeClass('checked');
                    }
                }
            });

            self.$main.on('click', '[data-role=black]', function () {
                var userid = $(this).closest('li').data('userid');
                self.black(userid);
            });

            self.$main.on('click', '[data-role=outBlack]', function () {
                var userid = $(this).closest('li').data('userid');
                self.outBlack(userid);
            });
        }

    };

    app.init();
});