define(function(require, exports, module) {
    'use strict';

    var $ = require('$');
    var Dialog = require('arale/dialog/1.3.0/dialog');
    var template = require('./confirmbox.handlebars');

    var ConfirmBox = Dialog.extend({
        attrs: {
            title: '提示',
            classPrefix: 'dialog',
            width: '400px',
            hasPadding: true,
            confirmTpl: '<a class="comm-btn" href="javascript:;">确定</a>',
            cancelTpl: '',
            align: {
                selfXY: ['50%', '-100px'],
                baseXY: ['50%', 0]
            },
            message: ''
        },
        setup: function() {
            ConfirmBox.superclass.setup.call(this);
            var model = {
                classPrefix: this.get('classPrefix'),
                message: this.get('message'),
                title: this.get('title'),
                confirmTpl: this.get('confirmTpl'),
                cancelTpl: this.get('cancelTpl'),
                hasPadding: this.get('hasPadding'),
                hasFoot: this.get('confirmTpl') || this.get('cancelTpl')
            };
            this.set('content', template(model));
        },
        events: {
            'click [data-role=confirm]': function(e) {
                e.preventDefault();
                this.trigger('confirm');
            },
            'click [data-role=cancel]': function(e) {
                e.preventDefault();
                this.trigger('cancel');
            }
        },
        _onChangeMessage: function(val) {
            this.$('[data-role=message]').html(val);
        },
        _onChangeTitle: function(val) {
            this.$('[data-role=title]').html(val);
        },
        _onChangeConfirmTpl: function(val) {
            this.$('[data-role=confirm]').html(val);
        },
        _onChangeCancelTpl: function(val) {
            this.$('[data-role=cancel]').html(val);
        }
    });

    ConfirmBox.alert = function(message, callback, options) {
        message = '<div style="padding:10px">' + message + '</div>';
        var defaults = {
            message: message,
            width: '400px',
            onConfirm: function() {
                typeof callback == 'function' && callback();
                this.hide();
            }
        };
        new ConfirmBox($.extend(null, defaults, options)).show().after('hide', function() {
            this.destroy();
        });
    };

    module.exports = ConfirmBox;
    module.exports.outerBoxClass = 'arale-dialog-1_2_5';

});
