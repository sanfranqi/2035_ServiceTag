define(function (require) {
    var $ = require('$'),
        util = require('../../common/util'),
        io = require('../../common/io'),
        helpers = require('../../common/helpers'),
        ConfirmBox = require('../../common/dialog/confirmbox'),
        paginator = require('../../common/paginator'),

        listTemplate = require('./list.handlebars'),
        dialogTemplate = require('./dialog.handlebars'),
        auditDialogTemplate = require('./auditDialog.handlebars');

    require('../../common/logout');
    require('handlebars');

    var app = {

        isAll: true,

        model: {
            status: 'null', //坑
            serviceTagName: '',
            pageNo: 1,
            pageSize: 10,
            isAdminModel: true
        },

        init: function () {
            var self = this;

            self.cacheElements();
            self.proof();
            self.bindEvents();
        },

        cacheElements: function () {
            var self = this;

            self.$main = $('#J_Main');
            self.$tabs = $('#J_Tabs');
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
            var self = this,
                url = self.isAll ? util.getUrl('queryServiceTag') : util.getUrl('queryAuditServiceTags');

            io.get(url, self.model, function () {
                var result = this.data;

                result.isAll = self.isAll;
                self.$list.html(listTemplate(result, {helpers: helpers}));

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

        get: function (e) {
            var self = this,
                id = $(e.currentTarget).closest('li').data('id');

            if (self.isAll) {
                var url = util.getUrl('uodateServiceTag');
                io.get(util.getUrl('queryServiceTag'), {id: id, isAdminModel: true}, function () {
                    var obj = this.data.listData[0];

                    var cb = new ConfirmBox({
                        title: '审核服务号',
                        width: 300,
                        message: dialogTemplate(obj, {helpers: helpers}),
                        confirmTpl: (obj.status === '12' || obj.status === '13') ? '<a class="comm-btn" href="javascript:;">退回</a>' : '',
                        cancelTpl: (obj.status === '12' || obj.status === '13') ? '<a class="comm-btn" href="javascript:;">通过</a>' : '',
                        onConfirm: function () {
                            io.post(url, {serviceTagId: obj.id, status: '13'}, function () {
                                cb.hide();
                                self.proof();
                            });
                        },
                        onCancel: function () {
                            io.post(url, {serviceTagId: obj.id, status: '10'}, function () {
                                cb.hide();
                                self.proof();
                            });
                        }
                    }).after('hide', function () {
                        cb.destroy();
                    }).show();
                });
            } else {
                io.get(util.getUrl('getAuditVoDetails'), {auditId: id}, function () {
                    var obj = this.data;

                    var cb = new ConfirmBox({
                        title: '审核服务号',
                        width: 800,
                        message: auditDialogTemplate(obj, {helpers: helpers}),
                        confirmTpl: '<a class="comm-btn" href="javascript:;">退回</a>',
                        cancelTpl: '<a class="comm-btn" href="javascript:;">通过</a>',
                        onConfirm: function () {
                            io.post(util.getUrl('unCheckAuditServiceTag'), {id: id, serviceTagId: obj.serviceTagId}, function () {
                                cb.hide();
                                self.proof();
                            });
                        },
                        onCancel: function () {
                            io.post(util.getUrl('checkAuditServiceTag'), {id: id, serviceTagId: obj.serviceTagId}, function () {
                                cb.hide();
                                self.proof();
                            });
                        }
                    }).after('hide', function () {
                        cb.destroy();
                    }).show();
                });
            }
        },

        start: function (e) {
            var self = this,
                id = $(e.currentTarget).closest('li').data('id'),
                url = util.getUrl('uodateServiceTag');

            io.post(url, {serviceTagId: id, status: '10'}, function () {
                self.proof();
            });
        },

        stop: function (e) {
            var self = this,
                id = $(e.currentTarget).closest('li').data('id'),
                url = util.getUrl('uodateServiceTag');

            io.post(url, {serviceTagId: id, status: '11'}, function () {
                self.proof();
            });
        },

        del: function (e) {
            var self = this,
                id = $(e.currentTarget).closest('li').data('id');

            ConfirmBox.alert('确认删除此服务号吗？', function () {
                io.post(util.getUrl('removeServiceTag'), {serviceTagId: id}, function () {
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

            self.$tabs.on('click', 'li', function () {
                var $t = $(this),
                    isAll = $t.data('isall');

                self.isAll = isAll;
                self.$form.children('div').first().toggle(isAll);
                $t.siblings('li').removeClass('tab-active');
                $t.addClass('tab-active');

                self.$form.find('[name=status]').val('null');
                self.$form.find('[name=serviceTagName]').val('');
                self.proof();
            });

            self.$list.on('click', '[data-role=get]', $.proxy(self.get, self));
            self.$list.on('click', '[data-role=start]', $.proxy(self.start, self));
            self.$list.on('click', '[data-role=stop]', $.proxy(self.stop, self));
            self.$list.on('click', '[data-role=del]', $.proxy(self.del, self));
        }
    };

    app.init();
});
