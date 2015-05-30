define(function (require) {
    var $ = require('$'),
        Uploader = require('upload'),
        util = require('../../common/util'),
        io = require('../../common/io'),
        helpers = require('../../common/helpers'),
        ConfirmBox = require('../../common/dialog/confirmbox'),
        paginator = require('../../common/paginator'),
        Validator = require('../../common/validator').fixedValidator,

        listTemplate = require('./list.handlebars'),
        dialogTemplate = require('./dialog.handlebars');

    require('../../common/logout');
    require('handlebars');

    Validator.addRule('firstWord', function(options) {
        var $el = $(options.element),
            val = $el.val();

        return /^[a-zA-Z0-9\u4e00-\u9fa5].*$/g.test(val);
    }, '{{display}}格式错误');

    var app = {

        model: {
            status: 'null',
            serviceTagName: '',
            pageNo: 1,
            pageSize: 10,
            isAdminModel: false
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

            io.get(util.getUrl('queryServiceTag'), self.model, function () {
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

        add: function () {
            var self = this;

            var cb = new ConfirmBox({
                title: '申请服务号',
                width: 600,
                message: dialogTemplate({}, {helpers: helpers}),
                onConfirm: function () {
                    // 防止连续点击
                    if (self._isAddClick) {
                        return;
                    }
                    self._isAddClick = true;
                    self.userGroupValidator.execute(function (hasError) {
                        if (hasError) {
                            self._isAddClick = false;
                            return;
                        }
                        var url = util.getUrl('addServiceTag'),
                            data = util.packForm('#J_Dialog_Form');

                        data.serviceTagType = $('.comm-btn3-checked').data('typeid').toString();

                        io.post(url, data, function () {
                            self.proof();
                            cb.hide();
                            self._isAddClick = false;
                        });
                    });
                }
            }).after('show', function () {
                self.initDialogValidator();
                self.initUploader();
                $('.type-box').off().on('click', 'a', function () {
                    $(this).siblings('a').removeClass('comm-btn3-checked');
                    $(this).addClass('comm-btn3-checked');
                });
            }).after('hide',function(){
                self.dialogValidator && self.dialogValidator.destroy();
                self.destroyUploader();
                cb.destroy();
            }).show();
        },

        edit: function (e) {
            var self = this,
                $li = $(e.currentTarget).closest('li'),
                id = $li.data('id'),
                inAuthDetails = $li.data('inauthdetails');

            if (inAuthDetails) {
                io.get(util.getUrl('getAuditByServiceTagId'), {serviceTagId: id}, function () {
                    var obj = this.data;

                    obj.inAuthDetails = inAuthDetails;
                    var cb = new ConfirmBox({
                        title: '编辑服务号',
                        width: 600,
                        message: dialogTemplate(obj, {helpers: helpers}),
                        onConfirm: function () {
                            self.userGroupValidator.execute(function (hasError) {
                                if (hasError) {
                                    return;
                                }

                                var url = util.getUrl('updateAuditServiceTag'),
                                    data = util.packForm('#J_Dialog_Form');

                                data.serviceTagType = $('.comm-btn3-checked').data('typeid').toString();

                                io.post(url, data, function () {
                                    self.proof();
                                    cb.hide();
                                });
                            });
                        }
                    }).after('show', function () {
                        self.initDialogValidator();
                        self.initUploader();
                        $('.type-box').off().on('click', 'a', function () {
                            $(this).siblings('a').removeClass('comm-btn3-checked');
                            $(this).addClass('comm-btn3-checked');
                        });
                    }).after('hide',function(){
                        self.dialogValidator && self.dialogValidator.destroy();
                        self.destroyUploader();
                        cb.destroy();
                    }).show();
                });
            } else {
                io.get(util.getUrl('queryServiceTag'), {id: id}, function () {
                    var obj = this.data.listData[0];

                    obj.inAuthDetails = inAuthDetails;
                    var cb = new ConfirmBox({
                        title: '编辑服务号',
                        width: 600,
                        message: dialogTemplate(obj, {helpers: helpers}),
                        onConfirm: function () {
                            self.userGroupValidator.execute(function (hasError) {
                                if (hasError) {
                                    return;
                                }

                                var url = util.getUrl('uodateServiceTag'),
                                    data = util.packForm('#J_Dialog_Form');

                                data.serviceTagType = $('.comm-btn3-checked').data('typeid').toString();

                                io.post(url, data, function () {
                                    self.proof();
                                    cb.hide();
                                });
                            });
                        }
                    }).after('show', function () {
                        self.initDialogValidator();
                        self.initUploader();
                        $('.type-box').off().on('click', 'a', function () {
                            $(this).siblings('a').removeClass('comm-btn3-checked');
                            $(this).addClass('comm-btn3-checked');
                        });
                    }).after('hide',function(){
                        self.dialogValidator && self.dialogValidator.destroy();
                        self.destroyUploader();
                        cb.destroy();
                    }).show();
                });
            }
        },

        initDialogValidator: function () {
            this.userGroupValidator = new Validator({
                element: '#J_Dialog_Form'
            }).addItem({
                element: '[name=serviceTagName]',
                display: '服务号名称',
                rule: 'firstWord maxlength{max:10}',
                required: true
            }).addItem({
                element: '[name=serviceTagImg]',
                display: '服务号头像',
                required: true,
                errormessage: '请上传服务号头像'
            }).addItem({
                element: '[name=remark]',
                display: '说明',
                rule: 'maxlength{max:300}'
            });
        },

        initUploader: function () {
            var self = this;
            var uploader = self.uploader = new Uploader({
                trigger: '#J_Uploader',
                name: 'file',
                action: util.getUrl('uoloadServiceTagImage'),
                accept: 'image/jpeg,image/gif,image/bmp,image/png'
            });
            uploader.change(function(val) {
                var name = val[0].name,
                    index = name.lastIndexOf('.') + 1,
                    len = name.length,
                    suffix = name.slice(index - len).toLowerCase(),
                    msg = '<i class="ico ico-error"></i>格式必须是jpg,png,gif或bmp';

                if (suffix !== 'jpg' && suffix !== 'jpeg' && suffix !== 'png' && suffix !== 'gif' && suffix !== 'bmp') {
                    $('.validatorError').html(msg);
                } else {
                    util.showLoading();
                    uploader.submit();
                }
            });
            uploader.success(function (response) {
                //bug: IE9会下载json数据，所以接口响应类型改为text/html 手动解析json
                response = $.parseJSON(response);
                io.processor(response, {
                    success: function () {
                        var result = this.data;

                        $('img[data-size="big"]').attr('src', imageURL + '/' + result + '?w=200&h=200&q=75');
                        $('img[data-size="middle"]').attr('src', imageURL + '/' + result + '?w=96&h=96&q=75');
                        $('img[data-size="min"]').attr('src', imageURL + '/' + result + '?w=50&h=50&q=75');
                        $('[name="serviceTagImg"]').val(result);

                        self.userGroupValidator.execute();
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

        destroyUploader: function () {
            $('body').children('form[target]').remove();
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

            self.$add.on('click', $.proxy(self.add, self));
            self.$list.on('click', '[data-role=edit]', $.proxy(self.edit, self));
            self.$list.on('click', '[data-role=start]', $.proxy(self.start, self));
            self.$list.on('click', '[data-role=stop]', $.proxy(self.stop, self));
            self.$list.on('click', '[data-role=del]', $.proxy(self.del, self));
        }

    };

    app.init();
});
