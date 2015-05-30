var common = require('./common');
var store = common.store;
var getFile = common.getFile;

module.exports = {

    'get /': function (req, res) {
        this.render.ftl(getFile('sso/login'), store);
    },

    'get /login.htm': function (req, res) {
        this.render.ftl(getFile('sso/login'), store);
    },

    'post /admin/login.do': function (req, res) {

        if (req.param('userName') === '1') {
            res.send({
                "result": "login",
                "messages": [
                    '用户不存在'
                ],
                "fieldErrors": {},
                "errors": [],
                "data": null
            });
        } else {
            res.send({
                "result": "success",
                "messages": [],
                "fieldErrors": {},
                "errors": [],
                "data": null
            });
        }
    },

    'get /admin/logout.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    }

};