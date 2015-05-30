define(function (require) {
    'use strict';

    var $ = require('$'),
        util = require('../../../common/util'),
        io = require('../../../common/io'),
        helpers = require('../../../common/helpers'),
        paginator = require('../../../common/paginator'),
        ConfirmBox = require('../../../common/dialog/confirmbox'),

        messageListTemplate = require('./messageList.handlebars'),
        detailDialogTemplate = require('./detailDialog.handlebars'),
        createDialogTemplate = require('./createDialog.handlebars');

    require('../../../common/logout');
    require('../../../common/sidebar');
    require('handlebars');

    var app = {

        model: {
            serviceTagId: serviceTagId,
            content: '',
            pageNo: 1,
            pageSize: 10
        },

        init: function () {
            var self = this;

            self.cacheElements();
            self.proof();
            self.bindEvents();
        },

        cacheElements: function () {
            var self = this;

            self.$form = $('#J_Form');
            self.$search = $('#J_Form_Search');
            self.$create = $('#J_Create');
            self.$list = $('#J_List');
            self.$content = $('#J_Content');
        },

        proof: function () {
            var self = this,
                data = util.packForm(self.$form);

            self.model = $.extend({}, self.model, data);
            self.model.pageNo = 1;

            self.search();
        },

        search: function () {
            var self = this;

            io.get(util.getUrl('queryGroupMessageList'), self.model, function () {
                var result = this.data,
                    listHtml = messageListTemplate(result, {helpers: helpers});

                self.$list.html(listHtml);

                // 坑
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
            });
        },

        getMessage: function (id) {
            var self = this,
                result;

            io.get(util.getUrl('getMessageDetail'), {messageId: id}, function () {
                result = this.data;

                var cb = new ConfirmBox({
                    title: '群发消息',
                    width: 400,
                    message: detailDialogTemplate(result, {helpers: helpers}),
                    onConfirm: function () {
                        cb.hide();
                    }
                }).after('hide',function(){
                    cb.destroy();
                }).show();
            });
        },

        createMessage: function () {
            var self = this,
                result;

            io.get(util.getUrl('queryGroupListExceptBlack'), {serviceTagId: serviceTagId}, function () {
                result = this.data;

                var $form, $selects, $textarea, $select1, $select2, $error, hasError,
                    data = {
                        serviceTagId: serviceTagId
                    };

                var cb = new ConfirmBox({
                    title: '群发消息',
                    width: 400,
                    message: createDialogTemplate(result, {helpers: helpers}),
                    confirmTpl: '<a class="comm-btn" href="javascript:;">发送</a>',
                    onConfirm: function () {
                        $textarea.trigger('blur');
                        if (hasError) {
                            return false;
                        }

                        data.userGroupId = $select1.val() === '0' ? 0 : +$select2.val();
                        data.content = $textarea.val();

                        io.post(util.getUrl('sendGroupMessage'), data, function () {
                            self.proof();
                            cb.hide();
                        });
                    }
                }).after('show', function () {
                    $form = $('#J_Create_Form');
                    $textarea = $form.find('textarea');
                    $selects = $form.find('select');
                    $select1 = $selects.first();
                    $select2 = $selects.last();
                    $error = $form.find('.validatorError');

                    $select1.on('change', function () {
                        $select2.toggle($select1.val() === '1');
                    });

                    $textarea.on('blur', function () {
                        if (!$.trim($textarea.val())) {
                            $error.html('<i class="ico ico-error"></i>请输入消息内容');
                            hasError = true;
                        } else {
                            $error.html('&nbsp;');
                            hasError = false;
                        }
                    });
                }).after('hide', function () {
                    cb.destroy();
                }).show();
            });
        },

        bindEvents: function () {
            var self = this;

            self.$form.on('submit', function () {
                self.proof();
                return false;
            });

            self.$search.on('click', function () {
                self.proof();
                return false;
            });

            self.$create.on('click', $.proxy(self.createMessage, self));

            self.$list.on('click', '[data-role=get]', function () {
                var id = $(this).closest('li').data('id');
                self.getMessage(id);
            });
        }
    };

    app.init();
});