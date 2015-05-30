var common = require('./../common');
var store = common.store;

module.exports = {

    "get /admin/messageBox/queryMessageList.do": function (req, res) {
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
                        "content": '消息内容的详情描述，不限字',
                        "serviceTagId": 1234,
                        "sendUserId": 15059456663,
                        "receiveTime":  "2015-01-20 14:54:42",
                        "userName": "张三1",
                        "cellphone": '*******8970',
                        "isInBlack": false,
                        "replyMessageList": [ ]
                    },
                    {
                        "id": 2,
                        "content": '消息内容的详情描述，不限字消息内容的详情描述，不限字消息内容的详情描述，不限字消息内容的详情描述，不限字消息内容的详情描述，不限字',
                        "serviceTagId": 1234,
                        "sendUserId": 15059456663,
                        "receiveTime":  "2015-01-20 14:54:42",
                        "userName": "张三1",
                        "cellphone": '*******8970',
                        "isInBlack": false,
                        "replyMessageList": [
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "息内容的详情描息内容的详情描息内容的详情描",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "息内容的详情描息内容的详情描息内容的详情描",
                                "replyTime": +new Date()
                            }
                        ]
                    },
                    {
                        "id": 3,
                        "content": '消息内容的详情描述，不限字消息内容的详情描述，不限字消息内容的详情描述，不限字消息内容的详情描述，不限字消息内容的详情描述，不限字消息内容的详情描述，不限字',
                        "serviceTagId": 1234,
                        "sendUserId": 15059456663,
                        "receiveTime":  "2015-01-20 14:54:42",
                        "userName": "张三1",
                        "cellphone": '*******8970',
                        "isInBlack": false,
                        "replyMessageList": [
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "息内容的详情描息内容的详情描息内容的详情描息内容的详情描",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            }
                        ]
                    },
                    {
                        "id": 4,
                        "content": '消息内容的详情描述，不限字',
                        "serviceTagId": 1234,
                        "sendUserId": 15059456663,
                        "receiveTime":  "2015-01-20 14:54:42",
                        "userName": "张三1",
                        "cellphone": '*******8970',
                        "isInBlack": false,
                        "replyMessageList": [
                            {
                                "replyContent": "息内容的详情描",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "息内容的详情描息内容的详情描息内容的详情描",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "息内容的详情描息内容的详情描息内容的详情描",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            }
                        ]
                    },
                    {
                        "id": 5,
                        "content": '消息内容的详情描述，不限字消息内容的详情描述，不限字消息内容的详情描述，不限字',
                        "serviceTagId": 1234,
                        "sendUserId": 15059456663,
                        "receiveTime":  "2015-01-20 14:54:42",
                        "userName": "张三1",
                        "cellphone": '*******8970',
                        "isInBlack": false,
                        "replyMessageList": [
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "息内容的详情描息内容的详情描息内容的详情描",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "息内容的详情描息内容的详情描息内容的详情描",
                                "replyTime": +new Date()
                            }
                        ]
                    },
                    {
                        "id": 6,
                        "content": '消息内容的详情描述，不限字息内容的详情描述，不限字息内容的详情描述，不限字',
                        "serviceTagId": 1234,
                        "sendUserId": 15059456663,
                        "receiveTime":  "2015-01-20 14:54:42",
                        "userName": "张三1",
                        "cellphone": '*******8970',
                        "isInBlack": false,
                        "replyMessageList": [
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "息内容的详情描息内容的详情描息内容的详情描息内容的详情描",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            }
                        ]
                    },
                    {
                        "id": 7,
                        "content": '消息内容的详情描述，不限字息内容的详情描述，不限字息内容的详情描述，不限字',
                        "serviceTagId": 1234,
                        "sendUserId": 15059456663,
                        "receiveTime":  "2015-01-20 14:54:42",
                        "userName": "张三1",
                        "cellphone": '*******8970',
                        "isInBlack": false,
                        "replyMessageList": [
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "息内容的详情描息内容的详情描息内容的详情描息内容的详情描",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            }
                        ]
                    },
                    {
                        "id": 8,
                        "content": '消息内容的详情描述，不限字息内容的详情描述，不限字息内容的详情描述，不限字',
                        "serviceTagId": 1234,
                        "sendUserId": 15059456663,
                        "receiveTime":  "2015-01-20 14:54:42",
                        "userName": "张三1",
                        "cellphone": '*******8970',
                        "isInBlack": false,
                        "replyMessageList": [
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "息内容的详情描息内容的详情描息内容的详情描息内容的详情描",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            }
                        ]
                    },
                    {
                        "id": 9,
                        "content": '消息内容的详情描述，不限字息内容的详情描述，不限字息内容的详情描述，不限字',
                        "serviceTagId": 1234,
                        "sendUserId": 15059456663,
                        "receiveTime":  "2015-01-20 14:54:42",
                        "userName": "张三1",
                        "cellphone": '*******8970',
                        "isInBlack": false,
                        "replyMessageList": [
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "息内容的详情描息内容的详情描息内容的详情描息内容的详情描",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            }
                        ]
                    },
                    {
                        "id": 10,
                        "content": '消息内容的详情描述，不限字息内容的详情描述，不限字息内容的详情描述，不限字',
                        "serviceTagId": 1234,
                        "sendUserId": 15059456663,
                        "receiveTime":  "2015-01-20 14:54:42",
                        "userName": "张三1",
                        "cellphone": '*******8970',
                        "isInBlack": false,
                        "replyMessageList": [
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "息内容的详情描息内容的详情描息内容的详情描息内容的详情描",
                                "replyTime": +new Date()
                            },
                            {
                                "replyContent": "1212",
                                "replyTime": +new Date()
                            }
                        ]
                    }
                ]
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    "post /admin/replyMessage/replyMessage.do": function (req, res) {
        res.send({
            "data": null,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    "get /admin/messageBox/queryMessageDetail.do": function (req, res) {
        res.send({
            "data": {
                "id": 1,
                "serviceTagId": 1234,
                "serviceType": "100",
                "sendUserId": 15059456663,
                "serviceTypeName": '日程管理',
                "isInBlack": Math.random() > 0.5,
                "content": '消息内容的详情描述，不限字数。消息内容的详情描述，不限字数。消息内容的详情描述，不限字数。消息内容的详情描述，不限字数。消息内容的详情描述，不限字数。息内容的详情描述，不限字数。消息内容的详情描述，不限字数',
                "receiveTime": +new Date(),
                "userName": "张三1"
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    "get /admin/groupMessage/queryGroupMessageList.do": function (req, res) {
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
                        "content": '消息内容的详情描述，不限字',
                        "sendTime": "2015-01-20 14:54:42",
                        "purpose": "张三1"
                    },
                    {
                        "id": 2,
                        "content": '消息内容的详情描述，不限字',
                        "sendTime": "2015-01-20 14:54:42",
                        "purpose": "张三1"
                    },
                    {
                        "id": 3,
                        "content": '消息内容的详情描述，不限字',
                        "sendTime": "2015-01-20 14:54:42",
                        "purpose": "张三1"
                    },
                    {
                        "id": 4,
                        "content": '消息内容的详情描述，不限字',
                        "sendTime": "2015-01-20 14:54:42",
                        "purpose": "张三1"
                    }
                ]
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    "get /admin/groupMessage/getMessageDetail.do": function (req, res) {
        res.send({
            "data": {
                "id": 1,
                "purpose": "XXX分组",
                "content": '消息内容的详情描述，不限字数。消息内容的详情描述，不限字数。消息内容的详情描述，不限字数。消息内容的详情描述，不限字数。消息内容的详情描述，不限字数。息内容的详情描述，不限字数。消息内容的详情描述，不限字数',
                "sendTime": "2015-01-01 14:55"
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    "post /admin/groupMessage/sendGroupMessage.do": function (req, res) {
        res.send({
            "data": null,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    "get /admin/userGroup/queryGroupListExceptBlack.do": function (req, res) {
        res.send({
            "data": [
                {
                    "id": 1,
                    "userGroupName": "好友组",
                    "userNum": 100,
                    "userGroupType": "10"
                },
                {
                    "id": 2,
                    "userGroupName": "黑名单",
                    "userNum": 5,
                    "userGroupType": "11"
                },
                {
                    "id": 100,
                    "userGroupName": "自定义组1",
                    "userNum": 1,
                    "userGroupType": "12"
                },
                {
                    "id": 101,
                    "userGroupName": "自定义组2",
                    "userNum": 2,
                    "userGroupType": "12"
                },
                {
                    "id": 102,
                    "userGroupName": "自定义组3",
                    "userNum": 3,
                    "userGroupType": "12"
                }
            ],
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    }
};