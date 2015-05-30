var common = require('./common');
var store = common.store;
var getFile = common.getFile;
module.exports = {

    'get /:serviceId/user.htm': function(req, res) {
        this.render.ftl(getFile('service/user'), store);
    },

    'get /:serviceId/message/index.htm': function(req, res) {
        this.render.ftl(getFile('service/message/index'), store);
    },

    'get /:serviceId/message/group.htm': function(req, res) {
        this.render.ftl(getFile('service/message/group'), store);
    },

    'get /:serviceId/custom/article/list.htm': function(req, res) {
        this.render.ftl(getFile('service/custom/article/list'), store);
    },

    'get /:serviceId/custom/article/single.htm': function(req, res) {
        this.render.ftl(getFile('service/custom/article/single'), store);
    },

    'get /:serviceId/custom/reward/list.htm': function(req, res) {
        this.render.ftl(getFile('service/custom/reward/list'), store);
    },

    'get /:serviceId/custom/reward/single.htm': function(req, res) {
        this.render.ftl(getFile('service/custom/reward/single'), store);
    },

    'get /:serviceId/custom/reward/review.htm': function(req, res) {
        this.render.ftl(getFile('service/custom/reward/review'), store);
    },

    'get /:serviceId/custom/reward/finish.htm': function(req, res) {
        this.render.ftl(getFile('service/custom/reward/finish'), store);
    },

    'get /:serviceId/custom/survey/list.htm': function(req, res) {
        this.render.ftl(getFile('service/custom/survey/list'), store);
    },

    'get /:serviceId/custom/task/list.htm': function(req, res) {
        this.render.ftl(getFile('service/custom/task/list'), store);
    },

    'get /:serviceId/custom/task/single.htm': function(req, res) {
        this.render.ftl(getFile('service/custom/task/single'), store);
    },

    'get /:serviceId/custom/time/list.htm': function(req, res) {
        this.render.ftl(getFile('service/custom/time/list'), store);
    },

    'get /:serviceId/custom/time/single.htm': function(req, res) {
        this.render.ftl(getFile('service/custom/time/single'), store);
    }

};