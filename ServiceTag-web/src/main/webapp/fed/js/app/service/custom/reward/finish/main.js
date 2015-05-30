define(function (require) {
    'use strict';

    var $ = require('$'),
        util = require('../../../../common/util'),
        io = require('../../../../common/io'),
        helpers = require('../../../../common/helpers'),
        ConfirmBox = require('../../../../common/dialog/confirmbox'),
        paginator = require('../../../../common/paginator'),

        rewardTemplate = require('./reward.handlebars'),
        listTemplate = require('./list.handlebars');

    require('../../../../common/logout');
    require('handlebars');
    require('../../../../common/sidebar');

    helpers = $.extend({}, helpers, {
        toHtml: function (str) {
            if (!str) {
                return '';
            }
            return str.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
        },
        isPic: function (fileName, options) {
            var dotIndex,
                type;

            if (!fileName) {
                return options.inverse(this);
            }

            dotIndex = fileName.indexOf('.');

            if (dotIndex === -1) {
                return options.inverse(this);
            } else {
                type = fileName.substring(dotIndex + 1, fileName.length).toLowerCase();
                if (type === 'jpg' || type === 'jpeg' || type === 'png' || type === 'gif' || type === 'bmp') {
                    return options.fn(this);
                }
            }

            return options.inverse(this);
        },
        notEmptyArray: function (ary, options) {
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

        init: function () {
            var self = this;

            self.urlParams();
            self.cacheElements();
            self.getDetail();
            self.getList();
            self.bindEvents();
        },

        urlParams: function () {
            var self = this,
                obj = util.urlParams();

            self.serviceBaseId = obj.serviceBaseId;
            self.model.rewardId = obj.rewardId;
        },

        cacheElements: function () {
            var self = this;

            self.$main = $('#J_Main');
            self.$reward = $('#J_Reward');
            self.$list = $('#J_List');
            self.$page = $('#J_Page');
        },

        getDetail: function () {
            var self = this,
                result;

            io.get(util.getUrl('getServiceDetail'), {serviceBaseId: self.serviceBaseId}, function () {
                result = this.data;
                for (var i = 0, j = result.additionFiles.length; i < j; i++) {
                    result.additionFiles[i].fileUrl = rewardDomainUrl + result.additionFiles[i].fileUrl;
                }
                self.$reward.html(rewardTemplate(result, {helpers: helpers}));
                self.$reward.show();
            });
        },

        getList: function () {
            var self = this;

            io.get(util.getUrl('queryAllIdeasAtEnd'), self.model, function () {
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
                            self.getList();
                        }
                    }
                });

                self.$list.closest('.mod-comment').show();
            });
        },

        preview: function (e) {
            var self = this,
                url = $(e.currentTarget).data('url'),
                width,
                winWidth = $(window).width(),
                img = new Image();

            img.onload = function () {
                if (img.width > winWidth - 100) {
                    width = winWidth - 100;
                    img.width = width-40;
                } else {
                    width = img.width + 40;
                }
                var cb = new ConfirmBox({
                    title: '图片预览',
                    width: width < 200 ? 200 : width,
                    message: '<div id="preview"></div>',
                    confirmTpl: ''
                }).after('show', function () {
                    $('#preview').append(img);
                }).after('hide', function () {
                    cb.destroy();
                }).show();
            };
            img.src = url;
        },

        bindEvents: function () {
            var self = this;

            self.$main.on('click', '[data-role=preview]', $.proxy(self.preview, self));
        }

    };

    app.init();
});