define(function (require) {
    'use strict';

    var $ = require('$'),
        moment = require('moment'),
        util = require('../../../../common/util'),
        io = require('../../../../common/io'),
        helpers = require('../../../../common/helpers'),
        ConfirmBox = require('../../../../common/dialog/confirmbox'),
        Validator = require('../../../../common/validator').fixedValidator,

        mainTemplate = require('./main.handlebars'),
        previewTemplate = require('./preview.handlebars');

    require('../../../../common/logout');
    require('handlebars');
    require('datetimepicker');
    require('../../../../common/sidebar');

    Validator.addRule('customTime', function(options) {
        var $el = $(options.element),
            val = $el.val();

        return /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/g.test(val) || /^\d{2}:\d{2}$/g.test(val);
    }, '{{display}}格式错误');

    Validator.addRule('customShortDate', function(options) {
        var $el = $(options.element),
            val = $el.val();

        return /^\d{4}-\d{2}-\d{2}$/g.test(val);
    }, '{{display}}格式错误');

    Validator.addRule('validTime1', function () {
        var startTime = +$('#J_StartTime').val().replace(/[-\s:]/g, ''),
            endTime = +$('#J_EndTime').val().replace(/[-\s:]/g, '');

        return startTime < endTime;
    }, '时间段的开始时间须小于结束时间');

    Validator.addRule('validTime2', function () {
        var startTime = Date.parse($('#J_RepeatStartTime').val().replace(/-/g, '/')),
            endTime = Date.parse($('#J_RepeatEndTime').val().replace(/-/g, '/'));

        return !endTime || startTime <= endTime;
    }, '重复日期的结束时间不能小于开始时间');

    Validator.addRule('validTime3', function () {
        var startTime = +$('#J_StartTime').val().replace(/[-\s:]/g, ''),
            endTime = +$('#J_EndTime').val().replace(/[-\s:]/g, '');

        return startTime !== endTime;
    }, '时间段的开始时间不能等于结束时间');

    Validator.addRule('validTime4', function () {
        var startTime = +$('#J_StartTime').val().replace(/[-\s:]/g, ''),
            endTime = +$('#J_EndTime').val().replace(/[-\s:]/g, ''),
            repeatStartTime = $('#J_RepeatStartTime').val(),
            repeatEndTime = $('#J_RepeatEndTime').val();

        return !(repeatStartTime && repeatEndTime && repeatStartTime === repeatEndTime && startTime >= endTime);
    }, '重复日期相同时，时间段的开始时间须小于结束时间');

    var parseURL = function (url) {
        var a = document.createElement('a');
        a.href = url;

        var ret = {},
            seg = a.search.replace(/^\?/, '').split('&'),
            len = seg.length, i = 0, s;
        for (; i < len; i++) {
            if (!seg[i]) {
                continue;
            }
            s = seg[i].split('=');
            ret[s[0]] = s[1];
        }
        return ret;
    };

    var getTimestamp = function (value) {
        return Date.parse(value.replace(/-/g, '/'));
    };

    var app = {

        isRepeat: false,
        isAllDay: false,
        serviceBaseId: null,

        model: {
            'serviceBaseVo.id': '',
            'serviceBaseVo.businessId': '',
            'serviceBaseVo.serviceName': '',
            'serviceBaseVo.serviceDescribe': '',
            'serviceBaseVo.status': '',
            'detailsAddition["startTime"]': '',
            'detailsAddition["endTime"]': '',
            'detailsAddition["repeatStartTime"]': '',
            'detailsAddition["repeatEndTime"]': '',
            'detailsAddition["isRepeat"]': '',
            'detailsAddition["isAllDay"]': '',
            'detailsAddition["remind"]': '',
            'detailsAddition["uuId"]': ''
        },

        init: function () {
            var self = this;

            self.cacheElements();
            self.getParam();
            self.getDetail();
            self.bindEvents();
        },

        cacheElements: function () {
            var self = this;

            self.$main = $('#J_Main');
        },

        getParam: function () {
            var self = this,
                params = parseURL(window.location);

            if (params && params.serviceBaseId) {
                self.serviceBaseId = params.serviceBaseId;
            }
        },

        getDetail: function () {
            var self = this,
                result = null,
                mainHtml,
                previewHtml,
                $isRepeat,
                $isAllDay;

            if (self.serviceBaseId) {
                io.syncGet(util.getUrl('getServiceDetail'), {serviceBaseId: self.serviceBaseId}, function () {
                    result = this.data;
                });
            }

            mainHtml = mainTemplate(result, {helpers: helpers});
            self.$main.html(mainHtml);

            // 设置下拉框和复选框
            if (result) {
                $isRepeat = $('#J_IsRepeat');
                $isAllDay = $('#J_IsAllDay');

                if (result.detailsAddition.isRepeat === '1') {
                    $isRepeat.addClass('checked');
                    self.isRepeat = true;
                } else {
                    $isRepeat.removeClass('checked');
                    self.isRepeat = false;
                }

                if (result.detailsAddition.isAllDay === '1') {
                    $isAllDay.addClass('checked');
                    self.isAllDay = true;
                } else {
                    $isAllDay.removeClass('checked');
                    self.isAllDay = false;
                }

                $('#J_Remind').val(result.detailsAddition.remind);
                $('#J_IsSecrecy').val(result.detailsAddition.isSecrecy);
            }

            previewHtml = previewTemplate(result, {helpers: helpers});
            $('#J_Preview').html(previewHtml);

            self.initDateTimePicker();
            self.previewStart();
            self.initValidator();

            if (result && $isRepeat.hasClass('checked')) {
                self.addValidator();
            }
        },

        initDateTimePicker: function () {
            var self = this,
                $startTime = $('#J_StartTime'),
                $endTime = $('#J_EndTime'),
                $repeatStartTime = $('#J_RepeatStartTime'),
                $repeatEndTime = $('#J_RepeatEndTime');

            var timeConfig = {
                lang: 'ch',
                datepicker: false,
                format: 'H:i',
                step: 5
            };
            var shortDateConfig = {
                lang: 'ch',
                timepicker: false,
                format: 'Y-m-d'
            };
            var dateConfig = {
                lang: 'ch',
                format: 'Y-m-d H:i',
                step: 5
            };

            $startTime.datetimepicker('destroy');
            $endTime.datetimepicker('destroy');
            $repeatStartTime.datetimepicker('destroy');
            $repeatEndTime.datetimepicker('destroy');

            if (self.isRepeat && self.isAllDay) {
                $repeatStartTime.datetimepicker(shortDateConfig);
                $repeatEndTime.datetimepicker(shortDateConfig);
            } else if (self.isRepeat && !self.isAllDay) {
                $startTime.datetimepicker(timeConfig);
                $endTime.datetimepicker(timeConfig);
                $repeatStartTime.datetimepicker(shortDateConfig);
                $repeatEndTime.datetimepicker(shortDateConfig);
            } else if (!self.isRepeat && self.isAllDay) {
                $startTime.datetimepicker({
                    lang: 'ch',
                    timepicker: false,
                    format: 'Y-m-d 00:00'
                });
                $endTime.datetimepicker({
                    lang: 'ch',
                    timepicker: false,
                    format: 'Y-m-d 23:59'
                });
            } else if (!self.isRepeat && !self.isAllDay) {
                $startTime.datetimepicker(dateConfig);
                $endTime.datetimepicker(dateConfig);
            }
        },

        initValidator: function () {
            this.validator = new Validator({
                element: '#J_Form'
            }).addItem({
                element: '[name="serviceBaseVo.serviceName"]',
                display: '名称',
                required: true
            }).addItem({
                element: '#J_StartTime',
                display: '时间段开始时间',
                rule: 'customTime',
                required: true
            }).addItem({
                element: '#J_EndTime',
                display: '时间段结束时间',
                rule: 'customTime validTime1',
                required: true
            });
        },

        addValidator: function () {
            this.validator.removeItem('#J_EndTime').addItem({
                element: '#J_EndTime',
                display: '时间段结束时间',
                rule: 'customTime validTime3 validTime4',
                required: true
            }).addItem({
                element: '#J_RepeatStartTime',
                display: '重复日期开始时间',
                rule: 'customShortDate',
                required: true
            }).addItem({
                element: '#J_RepeatEndTime',
                display: '重复日期结束时间',
                rule: 'customShortDate validTime2'
            });
        },

        removeValidator: function () {
            this.validator.removeItem('#J_RepeatStartTime');
            this.validator.removeItem('#J_RepeatEndTime');
            this.validator.removeItem('#J_EndTime').addItem({
                element: '#J_EndTime',
                display: '时间段结束时间',
                rule: 'customTime validTime1',
                required: true
            });
        },

        previewStart: function () {
            var self = this;
            self.timer = setInterval($.proxy(self.preview, self), 1000);
        },

        previewEnd: function () {
            var self = this;
            if (self.timer) {
                clearInterval(self.timer);
                self.timer = null;
            }
        },

        preview: function () {
            var self = app,
                data = $.extend({}, self.model, util.packForm('#J_Form')),
                isAllDay = $('#J_IsAllDay').hasClass('checked') ? '1' : '0',
                isRepeat = $('#J_IsRepeat').hasClass('checked') ? '1' : '0',
                $preview = $('#J_Preview');

            // 新旧数据对比
            self.oldModel = $.extend({}, self.model);
            self.model = $.extend({}, data);
            if (self.model['serviceBaseVo.serviceName'] === self.oldModel['serviceBaseVo.serviceName'] &&
                self.model['serviceBaseVo.serviceDescribe'] === self.oldModel['serviceBaseVo.serviceDescribe'] &&
                self.model['detailsAddition["startTime"]'] === self.oldModel['detailsAddition["startTime"]'] &&
                self.model['detailsAddition["endTime"]'] === self.oldModel['detailsAddition["endTime"]'] &&
                self.model['detailsAddition["repeatStartTime"]'] === self.oldModel['detailsAddition["repeatStartTime"]'] &&
                self.model['detailsAddition["repeatEndTime"]'] === self.oldModel['detailsAddition["repeatEndTime"]'] &&
                self.model['detailsAddition["remind"]'] === self.oldModel['detailsAddition["remind"]'] &&
                self.model['detailsAddition["isSecrecy"]'] === self.oldModel['detailsAddition["isSecrecy"]']) {
                return;
            }

            // 验证数据完整性
            if (!data['serviceBaseVo.serviceName'] && !data['serviceBaseVo.serviceDescribe'] &&
                !data['detailsAddition["startTime"]'] && !data['detailsAddition["endTime"]'] &&
                !data['detailsAddition["repeatStartTime"]'] && !data['detailsAddition["repeatEndTime"]'] &&
                !data['detailsAddition["remind"]'] && !data['detailsAddition["isSecrecy"]']) {
                $preview.html(previewTemplate(null, {helpers: helpers}));
                return;
            }

            // 时间戳
            if (isRepeat === '1') {
                data['detailsAddition["startTime"]'] && (data['detailsAddition["startTime"]'] = (getTimestamp('2000-01-01 ' + data['detailsAddition["startTime"]']) - getTimestamp('2000-01-01 00:00:00')));
                data['detailsAddition["endTime"]'] && (data['detailsAddition["endTime"]'] = (getTimestamp('2000-01-01 ' + data['detailsAddition["endTime"]']) - getTimestamp('2000-01-01 00:00:00')));
            } else {
                data['detailsAddition["startTime"]'] && (data['detailsAddition["startTime"]'] = getTimestamp(data['detailsAddition["startTime"]']));
                data['detailsAddition["endTime"]'] && (data['detailsAddition["endTime"]'] = getTimestamp(data['detailsAddition["endTime"]']));
            }
            data['detailsAddition["repeatStartTime"]'] && (data['detailsAddition["repeatStartTime"]'] = getTimestamp(data['detailsAddition["repeatStartTime"]']));
            data['detailsAddition["repeatEndTime"]'] && (data['detailsAddition["repeatEndTime"]'] = getTimestamp(data['detailsAddition["repeatEndTime"]']));

            // 生成html
            $preview.html(previewTemplate({
                serviceBaseVo: {
                    id: data['serviceBaseVo.id'] || '',
                    serviceName: data['serviceBaseVo.serviceName'] || '<请输入标题>',
                    serviceDescribe: data['serviceBaseVo.serviceDescribe']
                },
                detailsAddition: {
                    startTime: data['detailsAddition["startTime"]'],
                    endTime: data['detailsAddition["endTime"]'],
                    repeatEndTime: data['detailsAddition["repeatEndTime"]'],
                    repeatStartTime: data['detailsAddition["repeatStartTime"]'],
                    isAllDay: isAllDay,
                    isRepeat: isRepeat,
                    isSecrecy: data['detailsAddition["isSecrecy"]'],
                    remind: data['detailsAddition["remind"]']
                }
            }, {helpers: helpers}));
        },

        save: function (type) {
            var self = this,
                url;

            self.validator.execute(function (hasError) {
                if (hasError) {
                    return;
                }

                util.showLoading();

                switch (type) {
                    case 'save':
                        url = util.getUrl('saveService');
                        break;
                    case 'saveAndPublish':
                        url = util.getUrl('publishService');
                        break;
                    case 'saveAndRepublish':
                        url = util.getUrl('republishService');
                        break;
                }

                self.model = $.extend({}, self.model, util.packForm('#J_Form'));
                self.model['detailsAddition["isRepeat"]'] = $('#J_IsRepeat').hasClass('checked') ? '1' : '0';
                self.model['detailsAddition["isAllDay"]'] = $('#J_IsAllDay').hasClass('checked') ? '1' : '0';
                if (self.model['detailsAddition["isRepeat"]'] === '1') {
                    self.model['detailsAddition["startTime"]'] && (self.model['detailsAddition["startTime"]'] = (getTimestamp('2000-01-01 ' + self.model['detailsAddition["startTime"]']) - getTimestamp('2000-01-01 00:00:00')));
                    self.model['detailsAddition["endTime"]'] && (self.model['detailsAddition["endTime"]'] = (getTimestamp('2000-01-01 ' + self.model['detailsAddition["endTime"]']) - getTimestamp('2000-01-01 00:00:00')));
                } else {
                    self.model['detailsAddition["startTime"]'] && (self.model['detailsAddition["startTime"]'] = getTimestamp(self.model['detailsAddition["startTime"]']));
                    self.model['detailsAddition["endTime"]'] && (self.model['detailsAddition["endTime"]'] = getTimestamp(self.model['detailsAddition["endTime"]']));
                }
                self.model['detailsAddition["repeatStartTime"]'] && (self.model['detailsAddition["repeatStartTime"]'] = getTimestamp(self.model['detailsAddition["repeatStartTime"]'] + ' 00:00:00'));
                self.model['detailsAddition["repeatEndTime"]'] && (self.model['detailsAddition["repeatEndTime"]'] = getTimestamp(self.model['detailsAddition["repeatEndTime"]'] + ' 23:59:59'));

                if (self.model['detailsAddition["isAllDay"]'] === '1') {
                    self.model['detailsAddition["endTime"]'] && (self.model['detailsAddition["endTime"]'] = self.model['detailsAddition["endTime"]'] + 59 * 1000);
                }

                self.model['serviceBaseVo.serviceTagId'] = serviceTagId;
                self.model['serviceBaseVo.serviceType'] = '101';

                //坑
                self.model['detailsAddition["uuId"]'] = self.model['uuId'];

                io.post(url, self.model, function () {
                    util.hideLoading();
                    var message = typeof this.data === 'string' ? this.data : '操作成功';
                    setTimeout(function () {
                        window.location.href = listUrl;
                    }, 1500);
                    util.showMessage(message);
                });
            });
        },

        cancel: function () {
            var self = this;

            ConfirmBox.alert('确认要放弃当前的修改并还原吗？', function () {
                self.previewEnd();
                self.validator && self.validator.destroy();
                $('#J_StartTime').datetimepicker('destroy');
                $('#J_EndTime').datetimepicker('destroy');
                $('#J_RepeatStartTime').datetimepicker('destroy');
                $('#J_RepeatEndTime').datetimepicker('destroy');

                self.getDetail();
            });
        },

//        del: function (e) {
//            var id = $(e.currentTarget).data('id');
//
//            ConfirmBox.alert('确认删除吗？', function () {
//                io.post(util.getUrl('endService'), {serviceBaseId: id}, function () {
//                    window.location.href = listUrl;
//                });
//            });
//        },

        onIsAllDayClick: function () {
            var self = this,
                $isAllDay = $('#J_IsAllDay');

            $isAllDay.toggleClass('checked');
            self.isAllDay = $isAllDay.hasClass('checked');
            self.initDateTimePicker();
            self.resetDate();
        },

        onIsRepeatClick: function () {
            var self = this,
                $isRepeat = $('#J_IsRepeat'),
                $repeat = $('#J_Repeat');

            $isRepeat.toggleClass('checked');
            if ($isRepeat.hasClass('checked')) {
                self.isRepeat = true;
                $repeat.show();
                self.addValidator();
            } else {
                self.isRepeat = false;
                $repeat.hide();
                self.removeValidator();
            }
            self.initDateTimePicker();
            self.resetDate();
        },

        resetDate: function () {
            var self = this,
                $startTime = $('#J_StartTime'),
                $endTime = $('#J_EndTime'),
                $repeatStartTime = $('#J_RepeatStartTime'),
                $repeatEndTime = $('#J_RepeatEndTime'),
                startTime = $.trim($startTime.val()),
                endTime = $.trim($endTime.val()),
                longReg = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/,
                shortReg = /^\d{2}:\d{2}$/,
                nowDate = moment().format('YYYY-MM-DD'),
                nowTime = moment().format('HH:mm');

            if (self.isRepeat && self.isAllDay) {
                $startTime.val('00:00');
                $endTime.val('23:59');
            } else if (self.isRepeat && !self.isAllDay) {

                if (startTime && longReg.test(startTime)) {
                    $startTime.val(startTime.split(' ')[1]);
                } else if (startTime && !shortReg.test(startTime)) {
                    $startTime.val(nowTime);
                }

                if (endTime && longReg.test(endTime)) {
                    $endTime.val(endTime.split(' ')[1]);
                } else if (endTime && !shortReg.test(endTime)) {
                    $endTime.val(nowTime);
                }

            } else if (!self.isRepeat && self.isAllDay) {

                if (longReg.test(startTime)) {
                    $startTime.val(startTime.split(' ')[0] + ' 00:00');
                } else {
                    $startTime.val(nowDate + ' 00:00');
                }


                if (longReg.test(endTime)) {
                    $endTime.val(endTime.split(' ')[0] + ' 23:59');
                } else {
                    $endTime.val(nowDate + ' 23:59');
                }

                $repeatStartTime.val('');
                $repeatEndTime.val('');
            } else {

                if (startTime) {
                    if (shortReg.test(startTime)) {
                        $startTime.val(nowDate + ' ' + startTime);
                    } else if (!longReg.test(startTime)) {
                        $startTime.val(nowDate + ' ' + nowTime);
                    }
                }

                if (endTime) {
                    if (shortReg.test(endTime)) {
                        $endTime.val(nowDate + ' ' + endTime);
                    } else if (!longReg.test(endTime)) {
                        $endTime.val(nowDate + ' ' + nowTime);
                    }
                }

                $repeatStartTime.val('');
                $repeatEndTime.val('');
            }
        },

        bindEvents: function () {
            var self = this;

            // checkbox
            self.$main.on('click', '#J_IsAllDay', $.proxy(self.onIsAllDayClick, self));
            self.$main.on('click', '#J_IsRepeat', $.proxy(self.onIsRepeatClick, self));

            self.$main.on('click', '[data-role=saveAndPublish]', function () {
                self.save('saveAndPublish');
            });
            self.$main.on('click', '[data-role=saveAndRepublish]', function () {
                self.save('saveAndRepublish');
            });
            self.$main.on('click', '[data-role=save]', function () {
                self.save('save');
            });

            self.$main.on('click', '[data-role=cancel]', $.proxy(self.cancel, self));
//            self.$main.on('click', '[data-role=del]', $.proxy(self.del, self));
        }

    };

    app.init();
});