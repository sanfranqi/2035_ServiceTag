define("app/common/sidebar-debug", [ "$-debug" ], function(require) {
    "use strict";
    var $ = require("$-debug");
    $(".nav-item:first,.nav-item:last").children("a").on("click", function() {
        $(this).parent().toggleClass("show");
    });
});
