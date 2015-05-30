define(function (require, exports, module) {
    'use strict';

    require('jqPaginator');

    module.exports = function (config) {
        var $obj = config.obj,
            totalCounts = config.totalHit,
            currentPage = config.pageNo,
            pageSize = config.pageSize,
            callback = config.callback;

        if (totalCounts <= pageSize) {
            $obj.data('jqPaginator') && $obj.jqPaginator('destroy');
            return;
        }

        $obj.jqPaginator({
            totalCounts: totalCounts,
            pageSize: pageSize,
            visiblePages: 7,
            currentPage: currentPage,
            disableClass: 'disable',

            first: '<li><a href="javascript:;" title="首页"><i class="ico ico-arrow1"></i></a></li>',
            prev: '<li><a href="javascript:;" title="上一页"><i class="ico ico-arrow2"></i></a></li>',
            next: '<li><a href="javascript:;" title="下一页"><i class="ico ico-arrow3"></i></a></li>',
            last: '<li><a href="javascript:;" title="尾页"><i class="ico ico-arrow4"></i></a></li>',
            page: '<li><a href="javascript:;">{{page}}</a></li>',
            onPageChange: callback
        });
    };
});
