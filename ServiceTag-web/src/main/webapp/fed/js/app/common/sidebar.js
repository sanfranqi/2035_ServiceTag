define(function (require) {
    'use strict';

    var $ = require('$');

    $('.nav-item:first,.nav-item:last').children('a').on('click', function () {
        $(this).parent().toggleClass('show');
    });
});
