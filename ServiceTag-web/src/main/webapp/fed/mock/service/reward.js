var common = require('./../common');
var store = common.store;
var getFile = common.getFile;
module.exports = {

    'get /admin/service/queryRewardIdeas.do': function (req, res) {
        var pageNo = +req.param('pageNo'),
            pageSize = +req.param('pageSize'),
            status = req.param('status');

        res.send({
            "data": {
                "pageNo": pageNo,
                "pageSize": pageSize,
                "totalHit": 300,
                "listData": [
                    {
                        "id": "1675",
                        "content": "的观后感",
                        "user_cyuid": "18950444076",
                        "createtime": "1414742400",
                        "money": "0",
                        "review_status": status,
                        "review_user": "",
                        "reward_id": "225",
                        "review_time": "0",
                        "star": "3",
                        "userinfo": {
                            "userId": 18950444076,
                            "hardKey": "etnfxz",
                            "qq": "",
                            "userNick": "洪彬",
                            "fullName": "洪彬",
                            "sortCode": "hb",
                            "nameCode": "",
                            "userPwd": "1422ba63118b5b8e7812788a4cb4211c",
                            "codeState": "",
                            "pwdMail": "",
                            "gender": "",
                            "weiboSina": "",
                            "avatar": "",
                            "birthday": "",
                            "pwdLastSet": "",
                            "createDate": "2013-12-05 00:00:00",
                            "createDateStr": "",
                            "dataDate": "",
                            "dataDateStr": "",
                            "weiXin": "",
                            "comments": "",
                            "email": ""
                        },
                        "goodnum": "0",
                        "isgood": 0,
                        "fujian": [
                            {
                                name: '1412334.jpg',
                                path: 'http://ue1.17173cdn.com/a/2035/open/2014/img/1.jpg'
                            }
                        ],
                        "award_type": "1",
                        "is_hide": "0",
                        "award": "0"
                    }
                ]
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    'get /admin/service/queryAllIdeasAtEnd.do': function (req, res) {
        var pageNo = +req.param('pageNo'),
            pageSize = +req.param('pageSize'),
            status = req.param('status');

        res.send({
            "data": {
                "pageNo": pageNo,
                "pageSize": pageSize,
                "totalHit": 300,
                "listData": [
                    {
                        "id": "1675",
                        "content": "的观后感",
                        "user_cyuid": "18950444076",
                        "createtime": "1414742400",
                        "money": "0",
                        "review_status": status,
                        "review_user": "",
                        "reward_id": "225",
                        "review_time": "0",
                        "star": "3",
                        "userinfo": {
                            "userId": 18950444076,
                            "hardKey": "etnfxz",
                            "qq": "",
                            "userNick": "洪彬",
                            "fullName": "洪彬",
                            "sortCode": "hb",
                            "nameCode": "",
                            "userPwd": "1422ba63118b5b8e7812788a4cb4211c",
                            "codeState": "",
                            "pwdMail": "",
                            "gender": "",
                            "weiboSina": "",
                            "avatar": "",
                            "birthday": "",
                            "pwdLastSet": "",
                            "createDate": "2013-12-05 00:00:00",
                            "createDateStr": "",
                            "dataDate": "",
                            "dataDateStr": "",
                            "weiXin": "",
                            "comments": "",
                            "email": ""
                        },
                        "goodnum": "0",
                        "isgood": 0,
                        "fujian": [
                            {
                                name: '1412334.jpg',
                                path: 'http://ue1.17173cdn.com/a/2035/open/2014/img/1.jpg'
                            }
                        ],
                        "award_type": "1",
                        "is_hide": "0",
                        "award": "0"
                    }
                ]
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    'post /admin/service/uploadRewardFiles.do': function (req, res) {
        res.set('Content-Type', 'text/html');
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": {
                "fileName": "Lighthouse.jpg",
                "fileUrl": "/a/2035/open/2014/img/1.jpg"
            }
        });
    },

    'post /admin/service/saveServiceReward.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },

    'post /admin/service/publishServiceReward.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },

    'post /admin/service/republishServiceReward.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },

    'post /admin/service/setCreative.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },

    'post /admin/service/closeReward.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    }

};