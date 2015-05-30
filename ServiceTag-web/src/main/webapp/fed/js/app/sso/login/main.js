define(function (require) {
    'use strict';

    var $ = require('$'),
        Cookie = require('cookie'),
        util = require('../../common/util'),
        io = require('../../common/io'),
        ConfirmBox = require('../../common/dialog/confirmbox');

    var app = {
        init: function () {
            var self = this;

            self.cacheElements();
            self.setUsername();
            self.bindEvents();
        },

        cacheElements: function () {
            var self = this;

            self.$form = $('#J_Form');
            self.$userTip = $('#J_UserTip');
        },

        setUsername: function () {
            Cookie.get('username', function (value) {
                if (value) {
                    $('[name="userName"]').val(value);
                }
            });
        },

        login: function () {
            var self = this,
                data = util.packForm(self.$form);

            data.remember = $('.check-box', self.$form).hasClass('checked');

            if (!data.userName || !data.passWord) {
                self.showUserTip('请输入用户名和密码');
                return false;
            }

            if (data.remember) {
                Cookie.set('username', data.userName, {
                    expires: 365
                });
            } else {
                Cookie.remove('username');
            }

            io.post(util.getUrl('login'), data, function () {
                var msg = this.messages[0];

                if (msg) {
                    self.showUserTip(msg);
                } else {
                    window.location.href = ctx + '/index.htm';
                }
            });
        },

        showUserTip: function (msg) {
            var self = this;
            self.$userTip.text(msg);
        },

        bindEvents: function () {
            var self = this;

            self.$form.on('submit', function () {
                self.login();
                return false;
            });

            self.$form.on('keyup', function (e) {
                var currKey = e.keyCode || e.which || e.charCode;
                if (currKey === 13) {
                    self.login();
                }
                return false;
            });

            self.$form.on('click', '[data-role="login"]', function () {
                self.login();
                return false;
            });

            self.$form.on('click', '.form-check', function () {
                $(this).find('.check-box').toggleClass('checked');
            });

            self.$form.on('click', '[data-role="forget"]', function () {
                ConfirmBox.alert('请返回“智管理”手机端软件的登录页进行修改！');
            });
        }
    };

    app.init();
});