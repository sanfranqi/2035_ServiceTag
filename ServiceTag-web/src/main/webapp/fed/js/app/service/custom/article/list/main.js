define(function (require) {
    'use strict';

    var $ = require('$'),
        util = require('../../../../common/util'),
        io = require('../../../../common/io'),
        helpers = require('../../../../common/helpers'),
        ConfirmBox = require('../../../../common/dialog/confirmbox'),
        paginator = require('../../../../common/paginator'),
        Validator = require('../../../../common/validator').fixedValidator,

        listTemplate = require('./list.handlebars'),
        dialogTemplate = require('./dialog.handlebars');

    require('../../../../common/logout');
    require('handlebars');
    require('../../../../common/sidebar');

    var app = {

        model: {
            serviceTagId: serviceTagId,
            serviceType: ['104', '105'],
            serviceName: '',
            status: 'null',
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
            self.$search = $('#J_Search');
            self.$add = $('#J_Add');
            self.$list = $('#J_List');
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

            io.get(util.getUrl('queryService'), self.model, function () {
                var result = this.data,
                    listHtml = listTemplate(result, {helpers: helpers});

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
            });
        },

        addAndEdit: function (id) {
            var self = this,
                result = null;

            if (id) {
                io.syncGet(util.getUrl('getServiceDetail'), {serviceBaseId: id}, function () {
                    result = this.data;
                });
            }

            var cb = new ConfirmBox({
                title: result ? '编辑超链接' : '创建超链接',
                width: 650,
                message: dialogTemplate(result, {helpers: helpers}),
                confirmTpl: '<a href="javascript:;" class="comm-btn dialog-btn">保存</a>',
                cancelTpl: (result && result.serviceBaseVo.status === '11') ?
                    '<a href="javascript:;" class="comm-btn dialog-btn">保存并同步</a>' :
                    '<a href="javascript:;" class="comm-btn dialog-btn">保存并发布</a>',
                onConfirm: function () {
                    self.validator.execute(function (hasError) {
                        if (hasError) {
                            return;
                        }

                        var url = util.getUrl('saveService'),
                            data = util.packForm('#J_Dialog_Form');

                        data['serviceBaseVo.serviceTagId'] = serviceTagId;
                        data['serviceBaseVo.serviceType'] = '105';

                        io.post(url, data, function () {
                            self.proof();
                            cb.hide();
                        });
                    });
                },
                onCancel: function () {
                    self.validator.execute(function (hasError) {
                        if (hasError) {
                            return;
                        }

                        var url = result && result.serviceBaseVo.status === '11' ? util.getUrl('republishService') : util.getUrl('publishService'),
                            data = util.packForm('#J_Dialog_Form');

                        data['serviceBaseVo.serviceTagId'] = serviceTagId;
                        data['serviceBaseVo.serviceType'] = '105';

                        io.post(url, data, function () {
                            if (typeof this.data === 'string') {
                                util.showMessage(this.data);
                            }
                            self.proof();
                            cb.hide();
                        });
                    });
                }
            }).after('show', function () {
                self.initValidator();
            }).after('hide', function () {
                self.validator && self.validator.destroy();
                cb.destroy();
            }).show();
        },

        initValidator: function () {
            this.validator = new Validator({
                element: '#J_Dialog_Form'
            }).addItem({
                element: '[name="serviceBaseVo.serviceName"]',
                display: '标题',
                required: true
            }).addItem({
                element: '[name="serviceBaseVo.serviceDescribe"]',
                display: '链接地址',
                rule: 'url',
                required: true,
                errormessage: '链接格式错误，格式：http://www.17173.com'
            });
        },

        detail: function (e) {
            var self = this,
                id = $(e.currentTarget).closest('li').data('id'),
                type = $(e.currentTarget).closest('li').data('type');

            if (type === 104) {
                self.redirect(id);
            } else {
                self.addAndEdit(id);
            }
        },

        redirect: function (id) {
            window.location.href = singleUrl + '?serviceBaseId=' + id;
        },

        del: function (e) {
            var self = this,
                id = $(e.currentTarget).closest('li').data('id');

            ConfirmBox.alert('确认要删除该素材吗？', function () {
                io.post(util.getUrl('endService'), {serviceBaseId: id}, function () {
                    self.proof();
                });
            });
        },

        bindEvents: function () {
            var self = this;

            self.$search.on('click', $.proxy(self.proof, self));
            self.$form.on('submit', function () {
                self.proof();
                return false;
            });

            self.$add.on('click', function () {
                self.addAndEdit();
            });
            self.$list.on('click', '[data-role=get]', $.proxy(self.detail, self));
            self.$list.on('click', '[data-role=del]', $.proxy(self.del, self));
        }

    };

    app.init();
});