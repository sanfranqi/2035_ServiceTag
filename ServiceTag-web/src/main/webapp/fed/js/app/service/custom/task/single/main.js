define(function (require) {
    'use strict';

    var $ = require('$'),
        Uploader = require('upload'),
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

        return /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/g.test(val);
    }, '{{display}}格式错误');

    Validator.addRule('future', function (options) {
        var $el = $(options.element),
            val = $el.val(),
            valTimestamp = Date.parse(val.replace(/-/g, '/')),
            old = $el.data('old');

        return !val || Math.abs(valTimestamp - old) <= 60 * 1000 || +new Date() <= valTimestamp;
    }, '{{display}}必须大于当前时间');

    Validator.addRule('validTime', function () {
        var startTime = Date.parse($('#J_StartTime').val().replace(/-/g, '/'));
        var auctionTime = Date.parse($('#J_EndTime').val().replace(/-/g, '/'));

        return !startTime || startTime < auctionTime;
    }, '开始时间须小于结束时间');

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

    var app = {

        serviceBaseId: null,

        model: {
            'serviceBaseVo.id': '',
            'serviceBaseVo.businessId': '',
            'serviceBaseVo.serviceName': '',
            'serviceBaseVo.serviceDescribe': '',
            'detailsAddition["startTime"]': '',
            'detailsAddition["endTime"]': '',
            'attachFiles1': '',
            'attachFiles2': '',
            'attachFiles3': ''
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
                previewHtml;

            if (self.serviceBaseId) {
                io.syncGet(util.getUrl('getServiceDetail'), {serviceBaseId: self.serviceBaseId}, function () {
                    result = this.data;
                });
            }

            mainHtml = mainTemplate(result, {helpers: helpers});
            self.$main.html(mainHtml);

            previewHtml = previewTemplate(result, {helpers: helpers});
            $('#J_Preview').html(previewHtml);

            self.initDateTimePicker();

            // 记录最初的开始时间和结束时间
            $('#J_StartTime').data('old', result ? result.detailsAddition.startTime : '');
            $('#J_EndTime').data('old', result ? result.detailsAddition.endTime : '');

            // 已经开始的任务，不能修改开始时间
            if (result && result.serviceBaseVo.status === '11' && +new Date() > result.detailsAddition.startTime) {
                $('#J_StartTime').on('click', function () {
                    ConfirmBox.alert('任务已开始，开始时间不可编辑');
                }).addClass('form-control-disabled').datetimepicker('destroy');
            }

            self.previewStart();
            self.initUploader();
            self.initValidator();
        },

        initUploader: function () {
            var self = this;
            var uploader = new Uploader({
                trigger: '#J_Uploader',
                name: 'file',
                action: util.getUrl('uploadAddtionFiles'),
                accept: '*'
            });
            uploader.change(function() {
                if (self.model['attachFiles1'] && self.model['attachFiles2'] && self.model['attachFiles3']) {
                    ConfirmBox.alert('最多上传3个附件');
                    return;
                }
                util.showLoading();
                uploader.submit();
            });
            uploader.success(function (response) {
                //bug: IE9会下载json数据，所以接口响应类型改为text/html 手动解析json
                response = $.parseJSON(response);
                io.processor(response, {
                    success: function () {
                        var result = this.data,
                            $input,
                            $previewImg,
                            fileArray = ['attachFiles1', 'attachFiles2', 'attachFiles3'];

                        for (var i = 0, j = fileArray.length; i < j; i++) {
                            $input = $('[name="' + fileArray[i] + '"]');
                            $previewImg = $('img[data-name="' + fileArray[i] + '"]');
                            if (!$input.val()) {
                                $input.val(result);
                                $previewImg.attr({src: self.getFileIcon(result), title: self.getFileIcon(result)});
                                $previewImg.after('<a href="javascript:;" class="btn-close"></a>');
                                break;
                            }
                        }
                        util.hideLoading();
                    },
                    error: function (msg) {
                        $('.validatorError').html('<i class="ico ico-error"></i>' + msg);
                        util.hideLoading();
                    }
                });
            });
            uploader.error(function () {
                $('.validatorError').html('<i class="ico ico-error"></i>上传出错，稍后再试！');
            });
        },

        getFileIcon: function (fileName) {
            var o = fileName.split('.'),
                fileType = o[o.length - 1].toString().toLowerCase(),
                baseUrl = 'http://ue1.17173cdn.com/a/2035/open/2014/img/',
                imgName;

            switch (fileType) {
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'bmp':
                    imgName = fileName;
                    break;
                case 'doc':
                    imgName = baseUrl + 'f1.jpg';
                    break;
                case 'txt':
                    imgName = baseUrl + 'f2.jpg';
                    break;
                case 'xls':
                    imgName = baseUrl + 'f3.jpg';
                    break;
                case 'pdf':
                    imgName = baseUrl + 'f4.jpg';
                    break;
                case 'ppt':
                    imgName = baseUrl + 'f5.jpg';
                    break;
                case 'rar':
                    imgName = baseUrl + 'f6.jpg';
                    break;
                case 'zip':
                    imgName = baseUrl + 'f7.jpg';
                    break;
                case 'mp3':
                    imgName = baseUrl + 'f8.jpg';
                    break;
                default :
                    imgName = baseUrl + 'f9.jpg';
                    break;
            }

            return imgName;
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
                display: '开始时间',
                rule: 'customTime future'
            }).addItem({
                element: '#J_EndTime',
                display: '结束时间',
                rule: 'customTime future validTime',
                required: true
            });
        },

        initDateTimePicker: function () {
            $('#J_StartTime').datetimepicker({
                lang: 'ch',
                format: 'Y-m-d H:i',
                step: 5
            });

            $('#J_EndTime').datetimepicker({
                lang: 'ch',
                format: 'Y-m-d H:i',
                step: 5
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
                $preview = $('#J_Preview');

            // 新旧数据对比
            self.oldModel = $.extend({}, self.model);
            self.model = $.extend({}, data);
            if (self.model['detailsAddition["startTime"]'] === self.oldModel['detailsAddition["startTime"]'] &&
                self.model['detailsAddition["endTime"]'] === self.oldModel['detailsAddition["endTime"]'] &&
                self.model['serviceBaseVo.serviceName'] === self.oldModel['serviceBaseVo.serviceName'] &&
                self.model['serviceBaseVo.serviceDescribe'] === self.oldModel['serviceBaseVo.serviceDescribe'] &&
                self.model['attachFiles1'] === self.oldModel['attachFiles1'] &&
                self.model['attachFiles2'] === self.oldModel['attachFiles2'] &&
                self.model['attachFiles3'] === self.oldModel['attachFiles3']) {
                return;
            }

            if (!data['detailsAddition["startTime"]'] && !data['detailsAddition["endTime"]'] &&
                !data['serviceBaseVo.serviceName'] && !data['serviceBaseVo.serviceDescribe'] &&
                !data['attachFiles1'] && !data['attachFiles2'] && !data['attachFiles3']) {
                $preview.html(previewTemplate(null, {helpers: helpers}));
                return;
            }

            data['detailsAddition["startTime"]'] = Date.parse(data['detailsAddition["startTime"]'].replace(/-/g, '/'));
            data['detailsAddition["endTime"]'] = Date.parse(data['detailsAddition["endTime"]'].replace(/-/g, '/'));

            $preview.html(previewTemplate({
                serviceBaseVo: {
                    id: data['serviceBaseVo.id'] || '',
                    serviceName: data['serviceBaseVo.serviceName'] || '<请输入标题>',
                    serviceDescribe: data['serviceBaseVo.serviceDescribe'] || '<请输入描述>'
                },
                detailsAddition: {
                    startTime: data['detailsAddition["startTime"]'],
                    endTime: data['detailsAddition["endTime"]'],
                    attachFiles1: data['attachFiles1'],
                    attachFiles2: data['attachFiles2'],
                    attachFiles3: data['attachFiles3']
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

                switch (type){
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

                // 坑
                self.model['detailsAddition["attachFiles1"]'] = self.model['attachFiles1'];
                self.model['detailsAddition["attachFiles2"]'] = self.model['attachFiles2'];
                self.model['detailsAddition["attachFiles3"]'] = self.model['attachFiles3'];

                self.model['detailsAddition["endTime"]'] = Date.parse(self.model['detailsAddition["endTime"]'].replace(/-/g, '/'));
                self.model['detailsAddition["startTime"]'] = Date.parse(self.model['detailsAddition["startTime"]'].replace(/-/g, '/')) || (+new Date() + 2 * 60 * 1000);
                self.model['serviceBaseVo.serviceTagId'] = serviceTagId;
                self.model['serviceBaseVo.serviceType'] = '100';

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

        removeFile: function (e) {
            var self = this,
                $obj = $(e.currentTarget),
                $previewImg = $obj.prev(),
                name = $previewImg.data('name');

            $previewImg.attr('src', 'http://ue1.17173cdn.com/a/2035/open/2014/img/f0.jpg');
            $('[name="' + name + '"]').val('');
            $obj.remove();
        },

        bindEvents: function () {
            var self = this;

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

            self.$main.on('click', '.btn-close', $.proxy(self.removeFile, self));
        }
    };

    app.init();
});