var common = require('./common');
var store = common.store;
var getFile = common.getFile;

module.exports = {

    'get /exception/404.htm': function(req, res) {
        this.render.ftl(getFile('exception/404'), store);
    },

    'get /exception/error.htm': function(req, res) {
        this.render.ftl(getFile('exception/error'), store);
    }

};