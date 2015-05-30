define(function (require) {
    'use strict';

    var $ = require('$'),
        util = require('./util'),
        io = require('./io');

    $('#J_Logout').on('click', function () {
        io.get(util.getUrl('logout'), {}, function () {
            window.location.href = '/login.htm';
        });
    });
});
