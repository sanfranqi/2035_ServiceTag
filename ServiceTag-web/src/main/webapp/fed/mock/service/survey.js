var common = require('./../common');
var store = common.store;
var getFile = common.getFile;
module.exports = {

    'get /admin/quest/queryQuestPageList.do': function (req, res) {
        var pageNo = +req.param('pageNo'),
            pageSize = +req.param('pageSize');

        res.send({
            "data": {
                "pageNo": pageNo,
                "pageSize": pageSize,
                "totalHit": 300,
                "listData": [
                    {
                        "id": 1,
                        "name": "问卷1",
                        "createDate": +new Date(),
                        "editDate": +new Date(),
                        "count": 123,
                        "serviceTagId": 1,
                        "statusName": "已发布"
                    },
                    {
                        "id": 2,
                        "name": "问卷2",
                        "createDate": +new Date(),
                        "editDate": +new Date(),
                        "count": 123,
                        "serviceTagId": 1,
                        "statusName": "已发布"
                    },
                    {
                        "id": 3,
                        "name": "问卷3",
                        "createDate": +new Date(),
                        "editDate": +new Date(),
                        "count": 0,
                        "serviceTagId": 1,
                        "statusName": "未发布"
                    }
                ]
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });

    },

    'get /admin/quest/getQuestClassList.do': function (req, res) {
        res.send({
            "data": [
                {
                    "classId": 1,
                    "name": "分类1"
                },
                {
                    "classId": 2,
                    "name": "分类2"
                },
                {
                    "classId": 3,
                    "name": "分类3"
                },
                {
                    "classId": 4,
                    "name": "分类4"
                }
            ],
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    'post /admin/quest/addQuest.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },

    'post /admin/quest/delQuest.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },

    'post /admin/quest/publishQuest.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    }
};