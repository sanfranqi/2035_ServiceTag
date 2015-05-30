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
            title: '',
            status: '',
            pageNo: 1,
            pageSize: 10
        },

        init: function () {
            var self = this;

            //坑，转换服务号id
            window.serviceTagId = +serviceTagId + 20000000000;

            self.cacheElements();
            self.proof();
            self.bindEvents();
        },

        cacheElements: function () {
            var self = this;

            self.$form = $('#J_Form');
            self.$search = $('#J_Search');
            self.$list = $('#J_List');
            self.$add = $('#J_Add');
        },

        proof: function () {
            var self = this,
                data = util.packForm(self.$form);

            self.model = $.extend({}, self.model, data);
            self.model.serviceTagId = serviceTagId;
            self.model.pageNo = 1;

            self.search();
        },

        search: function () {
            var self = this;

            io.get(util.getUrl('queryQuestPageList'), self.model, function () {
                var result = this.data;

                // 帮填坑
                for (var i = 0, j = result.listData.length; i < j; i++) {
                    result.listData[i].editDate = +result.listData[i].editDate;
                }

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

        add: function () {
            var self = this,
                list;

            io.get(util.getUrl('getQuestClassList'), function () {
                list = this.data;
                var cb = new ConfirmBox({
                    title: '创建问卷',
                    width: 450,
                    message: dialogTemplate(list, {helpers: helpers}),
                    onConfirm: function () {
                        // 防止连续点击
                        if (self._isAddClick) {
                            return;
                        }
                        self._isAddClick = true;
                        self.validator.execute(function (hasError) {
                            if (hasError) {
                                self._isAddClick = false;
                                return;
                            }

                            var url = util.getUrl('addQuest'),
                                data = util.packForm('#J_Dialog_Form');

                            data.serviceTagId = serviceTagId;

                            io.post(url, data, function () {
                                self.proof();
                                cb.hide();
                                self._isAddClick = false;
                            });
                        });
                    }
                }).after('show', function () {
                    self.initValidator();
                }).after('hide', function () {
                    self.validator && self.validator.destroy();
                    cb.destroy();
                }).show();
            });
        },

        initValidator: function () {
            this.validator = new Validator({
                element: '#J_Dialog_Form'
            }).addItem({
                element: '[name=title]',
                display: '名称',
                required: true
            }).addItem({
                element: '[name=classId]',
                display: '分类',
                required: true
            });
        },

        sj: function (e) {
            var self = this,
                id = $(e.currentTarget).closest('li').data('id');

            var cb = new ConfirmBox({
                title: '问卷设计',
                width: 1080,
                confirmTpl: '<a class="comm-btn" href="javascript:;">关闭</a>',
                message: '<iframe width="1040" height="500" frameborder="0" src="' + questURL + '/fw.do?method=s&i=' + id + '&t=' + t + '&f=' + serviceTagId + '&m=' + m + '"></iframe>',
                onConfirm: function () {
                    cb.hide();
                }
            }).after('hide', function () {
                self.proof();
                cb.destroy();
            }).show();
        },

        fb: function (e) {
            var self = this,
                id = $(e.currentTarget).closest('li').data('id');

            io.post(util.getUrl('publishQuest'), {id: id, serviceTagId: serviceTagId}, function () {
                util.showMessage('发布成功');
                self.proof();
            });
        },

        fx: function (e) {
            var self = this,
                id = $(e.currentTarget).closest('li').data('id');

            var cb = new ConfirmBox({
                title: '问卷分析',
                width: 1080,
                confirmTpl: '<a class="comm-btn" href="javascript:;">关闭</a>',
                message: '<iframe width="1040" height="500" frameborder="0" src="' + questURL + '/page-result.jsp?i=' + id + '&t=' + t + '&f=' + serviceTagId + '&m=' + m + '"></iframe>',
                onConfirm: function () {
                    cb.hide();
                }
            }).after('hide', function () {
                self.proof();
                cb.destroy();
            }).show();
        },

        yl: function (e) {
            var self = this,
                id = $(e.currentTarget).closest('li').data('id');

            var cb = new ConfirmBox({
                title: '问卷预览',
                width: 1045,
                confirmTpl: '<a class="comm-btn" href="javascript:;">关闭</a>',
                message: '<iframe width="1010" height="500" frameborder="0" src="' + questURL + '/wjyl.do?method=content&id=' + id + '&t=' + t + '&f=' + serviceTagId + '&m=' + m + '"></iframe>',
                onConfirm: function () {
                    cb.hide();
                }
            }).after('hide', function () {
                self.proof();
                cb.destroy();
            }).show();
        },

        dj: function (e) {
            var self = this,
                id = $(e.currentTarget).closest('li').data('id');

            var cb = new ConfirmBox({
                title: '问卷答卷',
                width: 1080,
                confirmTpl: '<a class="comm-btn" href="javascript:;">关闭</a>',
                message: '<iframe width="1040" height="500" frameborder="0" src="' + questURL + '/fw.do?method=djlb&i=' + id + '&t=' + t + '&f=' + serviceTagId + '&m=' + m + '"></iframe>',
                onConfirm: function () {
                    cb.hide();
                }
            }).after('hide', function () {
                self.proof();
                cb.destroy();
            }).show();
        },

        del: function (e) {
            var self = this,
                id = $(e.currentTarget).closest('li').data('id');

            ConfirmBox.alert('确认删除吗？', function () {
                io.post(util.getUrl('delQuest'), {id: id, serviceTagId: serviceTagId}, function () {
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

            self.$add.on('click', $.proxy(self.add, self));

            self.$list.on('click', '[data-role=sj]', $.proxy(self.sj, self));
            self.$list.on('click', '[data-role=fb]', $.proxy(self.fb, self));
            self.$list.on('click', '[data-role=fx]', $.proxy(self.fx, self));
            self.$list.on('click', '[data-role=yl]', $.proxy(self.yl, self));
            self.$list.on('click', '[data-role=dj]', $.proxy(self.dj, self));
            self.$list.on('click', '[data-role=del]', $.proxy(self.del, self));
        }
    };

    app.init();
});