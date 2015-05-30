define(function (require) {
    'use strict';

    var $ = require('$'),
        util = require('../../../../common/util'),
        io = require('../../../../common/io'),
        helpers = require('../../../../common/helpers'),
        ConfirmBox = require('../../../../common/dialog/confirmbox'),
        paginator = require('../../../../common/paginator'),

        listTemplate = require('./list.handlebars');

    require('../../../../common/logout');
    require('handlebars');
    require('../../../../common/sidebar');

    var app = {

        model: {
            serviceTagId: '',
            serviceType: '101',
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

        redirect: function (e) {
            var id = $(e.currentTarget).closest('li').data('id');
            window.location.href = singleUrl + '?serviceBaseId=' + id;
        },

        del: function (e) {
            var self = this,
                id = $(e.currentTarget).closest('li').data('id');

            ConfirmBox.alert('确认要删除该日程吗？', function () {
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

            self.$list.on('click', '[data-role=get]', $.proxy(self.redirect, self));
            self.$list.on('click', '[data-role=del]', $.proxy(self.del, self));
        }
    };

    app.init();
});