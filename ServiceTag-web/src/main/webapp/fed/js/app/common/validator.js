define(function (require, exports, module) {
    'use strict';

    var Validator = require('validator');

    exports.relativeValidator = Validator.extend({
        attrs: {
            explainClass: 'help-block',
            itemClass: 'form-group',
            autoSubmit: false,
            stopOnError: true,
            autoFocus: false,
            itemErrorClass: 'has-error',
            inputClass: 'form-control',
            textareaClass: 'form-control',
            showMessage: function (message, element) {
                message = '<i class="ico ico-error"></i>' + message;

                this.getExplain(element).html(message);
                this.getItem(element).addClass('has-error');
            }
        }
    });

    exports.fixedValidator = Validator.extend({
        attrs: {
            explainClass: 'help-block',
            itemClass: 'form-group',
            autoSubmit: false,
            stopOnError: true,
            autoFocus: false,
            itemErrorClass: 'has-error',
            inputClass: 'form-control',
            textareaClass: 'form-control',
            showMessage: function (message, element) {
                message = '<i class="ico ico-error"></i>' + message;

                element = element.closest('form').find('.validatorError');
                element.html(message);
                element.addClass('has-error');
            },
            hideMessage: function (message, element) {
                element = element.closest('form').find('.validatorError');
                element.html('&nbsp;');
            }
        }
    });
});
