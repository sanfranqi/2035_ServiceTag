var common = require('./../common');
var store = common.store;

module.exports = {

    "get /admin/userGroup/queryGroupList.do": function (req, res) {
        var serviceTagId = req.param('serviceTagId');
        if (!serviceTagId) {
            res.send({
                "data": "",
                "result": "failure",
                "messages": ["serviceTagId不存在"],
                "fieldErrors": {},
                "errors": []
            });
        } else {
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
    },

    "get /admin/userGroupRelUser/queryUserList.do": function (req, res) {
        var userGroupId = +req.param('userGroupId'),
            nickName = req.param('nickName'),
            pageNo = +req.param('pageNo'),
            pageSize = +req.param('pageSize');

        res.send({
            "data": {
                "pageNo": pageNo,
                "pageSize": pageSize,
                "totalHit": 300,
                "listData": [
                    {
                        "userGroupId": userGroupId,
                        "userId": 15055555555,
                        "focusTime": +new Date(),
                        "userName": "张三1-(" + userGroupId + " " + pageNo + ")",
                        "cellphone": "*******8888"
                    },
                    {
                        "userGroupId": userGroupId,
                        "userId": 18888888888,
                        "focusTime": +new Date(),
                        "userName": "张三2-(" + userGroupId + " " + pageNo + ")",
                        "cellphone": "*******8888"
                    },
                    {
                        "userGroupId": userGroupId,
                        "userId": 13635286548,
                        "focusTime": +new Date(),
                        "userName": "张三3-(" + userGroupId + " " + pageNo + ")",
                        "cellphone": "*******8888"
                    }
                ]
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    "post /admin/userGroup/addGroup.do": function (req, res) {
        res.send({
            "data": null,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    "post /admin/userGroup/editGroup.do": function (req, res) {
        res.send({
            "data": null,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    "post /admin/userGroup/delGroup.do": function (req, res) {
        res.send({
            "data": null,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    "post /admin/userGroupRelUser/moveToBlack.do": function (req, res) {
        res.send({
            "data": null,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    "post /admin/userGroupRelUser/addUserToGroup.do": function (req, res) {
        res.send({
            "data": null,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    }

};