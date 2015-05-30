define(function (require) {
    'use strict';

    var $ = require('$'),
        util = require('../../../../common/util'),
        io = require('../../../../common/io'),
        helpers = require('../../../../common/helpers'),
        ConfirmBox = require('../../../../common/dialog/confirmbox'),
        paginator = require('../../../../common/paginator'),
        Validator = require('../../../../common/validator').fixedValidator,

        mainTemplate = require('./main.handlebars'),
        previewTemplate = require('./preview.handlebars');

    require('../../../../common/logout');
    require('handlebars');
    require('../../../../common/sidebar');

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
            'serviceBaseVo.serviceType': '104',
            'serviceBaseVo.serviceName': '',
            'serviceBaseVo.serviceDescribe': '',
            'author': ''
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
            window.editor && window.editor.destroy();
            self.$main.html(mainHtml);

            previewHtml = previewTemplate(result, {helpers: helpers});
            $('#J_Preview').html(previewHtml);

            self.initEditor();
            self.previewStart();
            self.initValidator();
        },

        initEditor: function () {
            window.editor = UE.getEditor('container', {
                serverUrl: util.getUrl('uploadTeletextImage'),
                initialFrameWidth: 320,
                initialFrameHeight: 200,

                //UEditor未解决bug
                enableAutoSave: false,
                saveInterval: 2592000000,

                wordCount: false,
                imagePopup: false,
                imageScaleEnabled: false,
                elementPathEnabled: false,
                autoHeightEnabled: false,
                toolbars: [
                    ['justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', 'insertorderedlist', 'insertunorderedlist',
                        'removeformat', 'simpleupload', 'link', 'unlink', '|', 'fullscreen'],
                    ['forecolor', 'backcolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight'],
                    ['paragraph', 'fontfamily', 'fontsize' ]
                ],
                //坑 https://github.com/fex-team/ueditor/issues/470
                onready: function () {
                    this.on('showmessage', function (type, m) {
                        if (m['content'] === '本地保存成功') {
                            return true;
                        }
                    });
                }
            });
        },

        initValidator: function () {
            this.validator = new Validator({
                element: '#J_Form'
            }).addItem({
                element: '[name="serviceBaseVo.serviceName"]',
                display: '标题',
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
                $preview = $('#J_Preview');

            data['serviceBaseVo.serviceDescribe'] = editor.getContent();

            // 新旧数据对比
            self.oldModel = $.extend({}, self.model);
            self.model = $.extend({}, data);
            if (self.model['serviceBaseVo.serviceName'] === self.oldModel['serviceBaseVo.serviceName'] &&
                self.model['serviceBaseVo.serviceDescribe'] === self.oldModel['serviceBaseVo.serviceDescribe'] &&
                self.model['author'] === self.oldModel['author']) {
                return;
            }

            if (!data['author]'] && !data['serviceBaseVo.serviceName'] && !$.trim(data['serviceBaseVo.serviceDescribe'])) {
                $preview.html(previewTemplate(null, {helpers: helpers}));
                return;
            }

            $preview.html(previewTemplate({
                serviceBaseVo: {
                    id: data['serviceBaseVo.id'] || '',
                    serviceName: data['serviceBaseVo.serviceName'],
                    serviceDescribe: data['serviceBaseVo.serviceDescribe']
                },
                detailsAddition: {
                    author: data['author']
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

                if (!$.trim(editor.getContent())) {
                    $('.validatorError').text('正文不能为空');
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
                self.model['serviceBaseVo.serviceDescribe'] = editor.getContent();
                self.model['detailsAddition["author"]'] =self.model['author'];
                self.model['serviceBaseVo.serviceTagId'] = serviceTagId;

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
        }
    };

    app.init();
});