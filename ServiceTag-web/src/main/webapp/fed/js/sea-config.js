;(function () {

    var METHODS = ["warn", "log", "error", "table"];
    if (!window.console) {
        window.console = {};
        for (var i = 0, method, l = METHODS.length; i < l; i++) {
            method = METHODS[i];
            console[method] = function () {
            };
        }
    }

    var ROOT = root;
    var DEBUG = env === 'development';
    var BASE = DEBUG ? (ctx + '/sea-modules/') : ROOT;

    var RULES = [
        [ROOT + 'jquery/jquery/1.10.1/jquery.js', ROOT + 'jquery/1.10.1/jquery.js'],
        ['/sea-modules/jquery/jquery/1.10.1/jquery.js', '/js/jquery/1.10.1/jquery.js'],
        ['.js', '.js?v=' + version]
    ];

    var MODULE = {
        '$': 'jquery/jquery/1.10.1/jquery',
        '$-debug': 'jquery/jquery/1.10.1/jquery-debug',
        'calendar.css': 'arale/calendar/1.0.0/calendar.css',
        'calendar': 'arale/calendar/1.0.0/calendar',
        'validator': 'arale/validator/0.9.7/validator',
        'upload': 'arale/upload/1.1.1/upload',
        'cookie': 'arale/cookie/1.0.2/cookie',
        'dialog': 'arale/dialog/1.3.0/dialog',
        'carousel': 'arale/switchable/1.0.2/carousel',
        'handlebars': 'gallery/handlebars/1.0.2/handlebars',
        'runtime': 'gallery/handlebars/1.0.2/runtime',
        'jqPaginator': 'keenwon/jqPaginator/1.1.0/jqPaginator',
        'waterfall': 'keenwon/waterfall/0.1.72/waterfall',
        'datetimepicker': 'keenwon/datetimepicker/2.4.1/datetimepicker',
        'select2': 'keenwon/select2/3.5.2/select2',
        'moment': 'gallery/moment/2.8.1/moment'
    };

    seajs.config({
        base: BASE,
        debug: DEBUG,
        map: RULES,
        alias: MODULE
    });
})();