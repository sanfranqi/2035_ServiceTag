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
    require('../../../../common/sidebar');

    helpers = $.extend({}, helpers, {
        toHtml: function (str) {
            if (!str) {
                return '';
            }
            return str.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
        }
    });

    function parseURL(url) {
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
    }

    var app = {

        model: {
            'serviceBaseVo.id': '',
            'serviceBaseVo.serviceType': '102',
            'serviceBaseVo.status': '',
            'serviceBaseVo.businessId': '',
            'serviceBaseVo.serviceName': '',
            'serviceBaseVo.serviceDescribe': '',
            'origSecrecy': ''
        },

        additionFiles: [],
        oldAdditionFiles: [],

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
                    for (var i = 0, j = result.additionFiles.length; i < j; i++) {
                        result.additionFiles[i].fileUrl = rewardDomainUrl + result.additionFiles[i].fileUrl;
                    }
                    self.additionFiles = result.additionFiles;
                    result.serviceBaseVo.serviceDescribe = result.serviceBaseVo.serviceDescribe
                        .replace(/<br\/>/g, '\n')
                        .replace(/&nbsp;/g, ' ');
                });
            }

            mainHtml = mainTemplate(result, {helpers: helpers});
            self.$main.html(mainHtml);

            //设置select
            if (result) {
                $('[name=rewardType]').val(result.detailsAddition.rewardType);
                $('[name=origSecrecy]').val(result.detailsAddition.origSecrecy);
            }

            previewHtml = previewTemplate(result, {helpers: helpers});
            $('#J_Preview').html(previewHtml);

            self.previewStart();
            self.initUploader();
            self.initValidator();
        },

        initUploader: function () {
            var self = this;
            var uploader = new Uploader({
                trigger: '#J_Uploader',
                name: 'file',
                action: util.getUrl('uploadRewardFiles'),
                accept: '*'
            });
            uploader.change(function() {
                util.showLoading();
                uploader.submit();
            });
            uploader.success(function (response) {
                //bug: IE9会下载json数据，所以接口响应类型改为text/html 手动解析json
                response = $.parseJSON(response);
                io.processor(response, {
                    success: function () {
                        var result = this.data,
                            html;

                        result.fileUrl = rewardDomainUrl + result.fileUrl;

                        self.oldAdditionFiles = $.extend(true, {}, self.additionFiles);
                        self.additionFiles.push(result);
//                        for (var i = 0; i < 3; i++) {
//                            $urlInput = $('[name=file' + i + 'Url]');
//                            $nameInput = $('[name=file' + i + 'Name]');
//                            $previewImg = $('img[data-name="file' + i + 'Url"]');
//                            if (!$urlInput.val()) {
//                                $urlInput.val(result.fileUrl);
//                                $nameInput.val(result.fileName);
//                                $previewImg.attr({src: self.getFileIcon(result.fileUrl), title: result.fileName});
//                                $previewImg.after('<a href="javascript:;" class="btn-close"></a>');
//                                break;
//                            }
//                        }

                        html = '<div class="accessory"><img src="' + self.getFileIcon(result.fileUrl) +
                            '" class="pic-accessory" width="56" height="56"><a href="javascript:;" class="btn-close"></a></div>';
                        $('#J_Form').find('.accessory-box').append(html);

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

        initValidator: function () {
            this.validator = new Validator({
                element: '#J_Form'
            }).addItem({
                element: '[name="serviceBaseVo.serviceName"]',
                display: '主题',
                required: true
            }).addItem({
                element: '[name="serviceBaseVo.serviceDescribe"]',
                display: '详情',
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
                data = $.extend(true, {}, self.model, util.packForm('#J_Form')),
                $preview = $('#J_Preview');

            // 新旧数据对比
            self.oldModel = $.extend(true, {}, self.model);
            self.model = $.extend(true, {}, data);
            if (self.model['serviceBaseVo.serviceName'] === self.oldModel['serviceBaseVo.serviceName'] &&
                self.model['serviceBaseVo.serviceDescribe'] === self.oldModel['serviceBaseVo.serviceDescribe'] &&
                self.model['origSecrecy'] === self.oldModel['origSecrecy'] &&
                self.isSameArray(self.oldAdditionFiles, self.additionFiles)) {
                return;
            }

            self.oldAdditionFiles = $.extend([], self.additionFiles);

            if (!data['serviceBaseVo.serviceName'] && !data['serviceBaseVo.serviceDescribe'] && !data['origSecrecy'] &&
                !data['file0Url'] && !data['file1Url'] && !data['file2Url']) {
                $preview.html(previewTemplate(null, {helpers: helpers}));
                return;
            }

            $preview.html(previewTemplate({
                serviceBaseVo: {
                    id: data['serviceBaseVo.id'] || '',
                    serviceName: data['serviceBaseVo.serviceName'] || '<请输入主题>',
                    serviceDescribe: data['serviceBaseVo.serviceDescribe'] || '<请输入详情>'
                },
                detailsAddition: {
                    origSecrecy: data['origSecrecy'],
                    rewardType: data['rewardType'],
                    rewardCount: data['rewardCount']
                },
                additionFiles: self.additionFiles
            }, {helpers: helpers}));
        },

        save: function (type) {
            var self = this,
                url,
                data,
                reg;

            self.validator.execute(function (hasError) {
                if (hasError) {
                    return;
                }

                util.showLoading();

                switch (type){
                    case 'save':
                        url = util.getUrl('saveServiceReward');
                        break;
                    case 'saveAndPublish':
                        url = util.getUrl('publishServiceReward');
                        break;
                    case 'saveAndRepublish':
                        url = util.getUrl('republishServiceReward');
                        break;
                }

                // 坑
                data = $.extend({}, self.model, util.packForm('#J_Form'));

                reg = new RegExp(rewardDomainUrl, 'g');
                data['additionFiles'] = JSON.stringify(self.additionFiles).replace(reg, '');
                data['serviceBaseVo.serviceDescribe'] = data['serviceBaseVo.serviceDescribe'].replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
                data['detailsAddition["origSecrecy"]'] = data.origSecrecy;
                data['serviceBaseVo.serviceTagId'] = serviceTagId;
                delete data.origSecrecy;

                io.post(url, data, function () {
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

                self.getDetail();
            });
        },

        removeFile: function (e) {
            var self = this,
                $obj = $(e.currentTarget),
                url = $obj.prev().attr('src');

            $.each(self.additionFiles, function (i,n) {
                if (n.fileUrl === url) {
                    self.additionFiles.splice(i, 1);
                    return false;
                }
            });

            $obj.parent().remove();
        },

        isSameArray: function (a, b) {
            var result = true;
            if (a.length === b.length) {
                for (var i = 0, j = a.length; i < j; i++) {
                    if (a[i].fileUrl !== b[i].fileUrl) {
                        result = false;
                        break;
                    }
                }
            } else {
                result = false;
            }
            return result;
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

            self.$main.on('click', '.btn-close', $.proxy(self.removeFile, self));
        }
    };

    app.init();
});