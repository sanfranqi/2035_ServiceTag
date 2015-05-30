define(function (require) {
    'use strict';

    var $ = require('$'),
        moment = require('moment'),
        util = require('../../../common/util'),
        io = require('../../../common/io'),
        helpers = require('../../../common/helpers'),
        ConfirmBox = require('../../../common/dialog/confirmbox'),

        messageItemTemplate = require('./messageItem.handlebars');

    require('waterfall');
    require('../../../common/logout');
    require('../../../common/sidebar');
    require('datetimepicker');
    require('handlebars');

    var app = {

        model: {
            serviceTagId: serviceTagId,
            startTime: '',
            endTime: '',
            pageNo: 1,
            pageSize: 10
        },

        init: function () {
            var self = this;

            self.cacheElements();
            self.initDateTimePicker();
            self.proof();
            self.bindEvents();
        },

        cacheElements: function () {
            var self = this;

            self.$form = $('#J_Form');
            self.$search = $('#J_Form_Search');
            self.$list = $('#J_List');
            self.$startTime = $('#J_StartTime');
            self.$endTime = $('#J_EndTime');
        },

        initDateTimePicker: function () {
            var self = this;

            self.$startTime.datetimepicker({
                lang: 'ch',
                timepicker: false,
                format: 'Y-m-d'
            });

            self.$endTime.datetimepicker({
                lang: 'ch',
                timepicker: false,
                format: 'Y-m-d',
                maxDate: new Date()
            });
        },

        verify: function () {
            var self = this,
                startTime = self.model.startTime,
                endTime = self.model.endTime,
                reg = /^\d{4}-\d{2}-\d{2}$/;

            if ((startTime && !reg.test(startTime)) || (endTime && !reg.test(endTime))) {
                util.showMessage('时间格式不正确!');
                return false;
            }

            startTime = startTime && Date.parse(startTime.replace(/-/g, '/') + ' 00:00:00');
            endTime = endTime && Date.parse(endTime.replace(/-/g, '/') + ' 23:59:59');

            if (startTime && endTime && startTime > endTime) {
                util.showMessage('开始时间必须小于结束时间!');
                return false;
            }

            self.model.startTime = startTime;
            self.model.endTime = endTime;

            return true;
        },

        proof: function () {
            var self = this,
                data = util.packForm(self.$form);

            self.model = $.extend({}, self.model, data);
            self.model.pageNo = 1;

            if (!self.verify()) {
                return;
            }

            self.$list.empty().append('<ul class="cascade-box"></ul>');
            self.search();
        },

        search: function () {
            var self = this;

            self.$list.children('ul').waterfall({
                itemCls: 'cascade-item',
                align: 'left',
                colWidth: 250,
                gutterWidth: 5,
                gutterHeight: 10,
                checkImagesLoaded: false,
                path: function (page) {
                    self.model.pageNo = page;

                    var params = [];
                    for (var i in self.model) {
                        params.push(i + '=' + self.model[i]);
                    }

                    return util.getUrl('queryMessageList') + '?' + params.join('&');
                },
                loadingMsg:'<div class="loading-box"><img src="http://ue1.17173cdn.com/a/2035/open/2014/img/loading.gif" alt="提交中" width="64" height="64"><div class="tit">卖力加载中...</div></div>',
                callbacks: {
                    renderData: function (result) {
                        if (result.data.listData.length <= 0) {
                            if (self.model.pageNo === 1) {
                                self.$list.children('ul').waterfall('pause', function () {
                                    $('#waterfall-message').html('<div class="nodata-box"><img src="http://ue1.17173cdn.com/a/2035/open/2014/img/nodata.jpg" alt="暂无数据" width="84" height="90"><div class="tit">暂无数据...</div></div>');
                                });
                            } else {
                                self.$list.children('ul').waterfall('pause', function () {
                                    $('#waterfall-message').html('<p>没有更多数据了</p>');
                                });
                            }
                        }

                        return messageItemTemplate(result.data, {helpers: helpers});
                    }
                }
            });
        },

        reply: function (e) {
            var self = this,
                $t = $(e.currentTarget),
                $li = $t.closest('.cascade-item'),
                $textarea = $li.find('textarea'),
                comment = $.trim($textarea.val());

            if (!comment) {
                util.showError('请输入回复内容！');
                return false;
            }

            if (comment.length > 300) {
                util.showError('最长300个字符！');
                return false;
            }

            io.post(util.getUrl('replyMessage'), {
                serviceTagId: serviceTagId,
                content: comment,
                messageId: $li.data('id'),
                userSendTime: $li.data('receivetime').toString(),
                receiveUserId: $li.data('senduserid')
            }, function () {
                $li.find('ul').append('<li class="reply-item">' + comment + '<div class="reply-time">' + moment().format('YYYY-MM-DD HH:mm') + '</div></li>');
                $textarea.val('');
                $textarea.trigger('keyup');
                self.$list.children('ul').waterfall('reLayout');
            });
        },

        black: function (e) {
            var self = this,
                $li = $(e.currentTarget).closest('li.cascade-item'),
                sendUserId = $li.data('senduserid');

            ConfirmBox.alert('确认要将该用户加入黑名单吗？', function () {
                io.post(util.getUrl('moveToBlack'), {serviceTagId: serviceTagId, userId: sendUserId}, function () {
                    self.proof();
                });
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

            self.$list.on('keyup', 'textarea', function () {
                var $t = $(this),
                    length = $.trim($t.val()).length,
                    $tip = $t.parent().next();

                $tip.text(length + '/300');
            });

            self.$list.on('click', '[data-role=reply]', $.proxy(self.reply, self));

            self.$list.on('click', '[data-role=black]', $.proxy(self.black, self));
        }
    };

    app.init();
});