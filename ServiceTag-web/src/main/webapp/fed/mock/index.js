var common = require('./common');
var store = common.store;
var getFile = common.getFile;

module.exports = {

    'get /index.htm': function (req, res) {
        this.render.ftl(getFile('index/admin'), store);
    },

    'get /index/admin.htm': function (req, res) {
        this.render.ftl(getFile('index/admin'), store);
    },

    'get /index/user.htm': function (req, res) {
        this.render.ftl(getFile('index/user'), store);
    },

    'get /admin/serviceTag/query.do': function (req, res) {
        var pageNo = +req.param('pageNo'),
            pageSize = +req.param('pageSize'),
            id = +req.param('id');

        if (id) {
            // id存在是查询单条
            // 查询单条也是分页的结构
            res.send({
                "data": {
                    "pageNo": 0,
                    "pageSize": 0,
                    "totalHit": 0,
                    "listData": [
                        {
                            "id": 3,
                            "serviceTagName": "测试服务号3",
                            "serviceTagImg": "1.jpg",
                            "status": "12",
                            "serviceTagType": "104",
                            "serviceTagTypeName": "教育",
                            "userName": "测试测试测试测试",
                            "statusName": "未审批",
                            "remark": "备注3",
                            "secondCheckStatusName": "待审核",
                            "secondCheckStatus": "12",
                            "inAuthDetails": true,
                            "updateTime": +new Date() - 5000
                        }
                    ]
                },
                "result": "success",
                "messages": [],
                "fieldErrors": {},
                "errors": []
            });

        } else {
            // id不存在是查询列表

            res.send({
                "data": {
                    "pageNo": pageNo,
                    "pageSize": pageSize,
                    "totalHit": 300,
                    "listData": [
                        {
                            "id": 1,
                            "serviceTagName": "2&lt;345&gt;",
                            "serviceTagImg": "1.jpg",
                            "status": "10",
                            "serviceTagType": "100",
                            "serviceTagTypeName": "教育",
                            "userName": "张三",
                            "statusName": "启用",
                            "remark": "23\r\n3245\r\n&lt;script&gt;alert(1);&lt;/script&gt;",
                            "secondCheckStatusName": "通过",
                            "secondCheckStatus": "11",
                            "inAuthDetails": true,
                            "updateTime": +new Date()
                        },
                        {
                            "id": 2,
                            "serviceTagName": "测试服务号2",
                            "serviceTagImg": "1.jpg",
                            "status": "11",
                            "serviceTagType": "102",
                            "serviceTagTypeName": "企业",
                            "userName": "李四",
                            "statusName": "停用",
                            "remark": "备注2",
                            "secondCheckStatusName": "未通过",
                            "secondCheckStatus": "13",
                            "inAuthDetails": true,
                            "updateTime": +new Date() + 500000
                        },
                        {
                            "id": 3,
                            "serviceTagName": "测试服务号3",
                            "serviceTagImg": "1.jpg",
                            "status": "12",
                            "serviceTagType": "104",
                            "serviceTagTypeName": "教育",
                            "userName": "测试测试测试测试",
                            "statusName": "未审批",
                            "remark": "备注3",
                            "secondCheckStatusName": "待审核",
                            "secondCheckStatus": "12",
                            "inAuthDetails": true,
                            "updateTime": +new Date() - 5000
                        },
                        {
                            "id": 4,
                            "serviceTagName": "测试服务号4",
                            "serviceTagImg": "1.jpg",
                            "status": "13",
                            "serviceTagType": "101",
                            "serviceTagTypeName": "文化",
                            "userName": "测试",
                            "statusName": "未通过",
                            "remark": "备注4",
                            "inAuthDetails": false,
                            "updateTime": +new Date() - 1000
                        }
                    ]
                },
                "result": "success",
                "messages": [],
                "fieldErrors": {},
                "errors": []
            });
        }
    },

    'get /admin/serviceTag/queryAuditServiceTags.do': function (req, res) {
        var pageNo = +req.param('pageNo'),
            pageSize = +req.param('pageSize'),
            id = +req.param('id');

        res.send({
            "data": {
                "pageNo": pageNo,
                "pageSize": pageSize,
                "totalHit": 300,
                "listData": [
                    {
                        "id": 10,
                        "serviceTagId": 150,
                        "serviceTagName": "为二位的555",
                        "serviceTagImg": "1.jpg",
                        "serviceTagType": "104",
                        "serviceTagFacade": "",
                        "createTime": +new Date() + 500000,
                        "status": "12",
                        "createUser": 15705959502,
                        "createUserName": "陈小辉",
                        "remark": "说明的修改"
                    },
                    {
                        "id": 10,
                        "serviceTagId": 150,
                        "serviceTagName": "为二位的555",
                        "serviceTagImg": "1.jpg",
                        "serviceTagType": "104",
                        "serviceTagFacade": "",
                        "createTime": +new Date() + 500000,
                        "status": "12",
                        "createUser": 15705959502,
                        "createUserName": "陈小辉",
                        "remark": "说明的修改"
                    },
                    {
                        "id": 10,
                        "serviceTagId": 150,
                        "serviceTagName": "为二位的555",
                        "serviceTagImg": "1.jpg",
                        "serviceTagType": "104",
                        "serviceTagFacade": "",
                        "createTime": +new Date() + 500000,
                        "status": "12",
                        "createUser": 15705959502,
                        "createUserName": "陈小辉",
                        "remark": "说明的修改"
                    },
                    {
                        "id": 10,
                        "serviceTagId": 150,
                        "serviceTagName": "为二位的555",
                        "serviceTagImg": "1.jpg",
                        "serviceTagType": "104",
                        "serviceTagFacade": "",
                        "createTime": +new Date() + 500000,
                        "status": "12",
                        "createUser": 15705959502,
                        "createUserName": "陈小辉",
                        "remark": "说明的修改"
                    }
                ]
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    'get /admin/serviceTag/getAuditById.do': function (req, res) {
        res.send({
            "data": {
                "id": 10,
                "serviceTagId": 150,
                "serviceTagName": "为二位的555",
                "serviceTagImg": "1.jpg",
                "serviceTagType": "104",
                "serviceTagTypeName": "教育",
                "serviceTagFacade": "",
                "createTime": +new Date() + 500000,
                "status": "12",
                "createUser": 15705959502,
                "createUserName": "陈小辉",
                "remark": "说明的修改"
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    'get /admin/serviceTag/getAuditByServiceTagId.do': function (req, res) {
        res.send({
            "data": {
                "id": 10,
                "serviceTagId": 150,
                "serviceTagName": "为二位的555",
                "serviceTagImg": "1.jpg",
                "serviceTagType": "104",
                "serviceTagTypeName": "教育",
                "serviceTagFacade": "",
                "createTime": +new Date() + 500000,
                "status": "12",
                "createUser": 15705959502,
                "createUserName": "陈小辉",
                "remark": "说明的修改"
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    'post /admin/serviceTag/update.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },

    'post /admin/serviceTag/add.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },

    'post /admin/serviceTag/remove.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },

    'post /admin/serviceTag/uploadServiceTagImage.do': function (req, res) {
        res.set('Content-Type', 'text/html');
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": '2.jpg'
        });
    },

    'post /admin/serviceTag/checkAuditServiceTag.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },

    'post /admin/serviceTag/uncheckAuditServiceTag.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },

    'post /admin/serviceTag/updateAuditServiceTag.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },

    'get /admin/serviceTag/getAuditVoDetails.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": {
                id: 165,
                serviceTagId: 151,
                serviceTagName: "2423423",
                serviceTagImg: "1.jpg",
                serviceTagType: "104",
                serviceTagFacade: null,
                createTime: 1426737681898,
                status: "12",
                createUser: 15705959502,
                createUserName: "陈小辉",
                remark: "23423423423",
                serviceTagTypeName: null,
                oldServiceTagName: "再次修改修改哥啊",
                oldServiceTagImg: "2.jpg",
                oldServiceTagType: "104",
                oldServiceTagFacade: null,
                oldRemark: "阿哥阿哥啊"
            }
        });
    }
};