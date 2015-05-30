var common = require('./../common');
var store = common.store;
var getFile = common.getFile;
module.exports = {

    'get /admin/service/query.do': function (req, res) {
        var pageNo = +req.param('pageNo'),
            pageSize = +req.param('pageSize'),
            serviceType = req.param('serviceType'),
            name = '';

        switch (serviceType) {
            case '100':
                name = '任务管理';
                break;
            case '101':
                name = '日程管理';
                break;
            case '102':
                name = '悬赏管理';
                break;
            case '103':
                name = '问卷管理';
                break;
            default :
                name = '素材管理';
                break;
        }

        res.send({
            "data": {
                "pageNo": pageNo,
                "pageSize": pageSize,
                "totalHit": 300,
                "listData": [
                    {
                        "id": 1,
//                        "serviceType": serviceType,
                        "serviceType": "104",
                        "serviceTypeName": '素材管理',
                        "serviceName": name + "1",
                        "serviceDescribe": "24314",
                        "status": "10",
                        "statusName": "未发布",
                        "updateTime": +new Date() + 10001,
                        "businessId": "1"
                    },
                    {
                        "id": 2,
//                        "serviceType": serviceType,
                        "serviceType": "105",
                        "serviceTypeName": '素材管理',
                        "serviceName": name + "2",
                        "serviceDescribe": "24314",
                        "status": "11",
                        "statusName": "已发布",
                        "updateTime": +new Date() + 50000,
                        "businessId": "1"
                    },
                    {
                        "id": 2,
//                        "serviceType": serviceType,
                        "serviceType": "105",
                        "serviceTypeName": '素材管理',
                        "serviceName": name + "3",
                        "serviceDescribe": "24314",
                        "status": "10",
                        "statusName": "未发布",
                        "updateTime": +new Date() + 100,
                        "businessId": "1"
                    }
                ]
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });

    },

    'post /admin/service/endService.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },

    'get /admin/service/getServiceDetail.do': function (req, res) {

        var serviceBaseId = req.param('serviceBaseId');

        // 获取任务
        if (serviceBaseId === '1') {
            res.send({
                "result": "success",
                "messages": [],
                "fieldErrors": {},
                "errors": [],
                "data": {
                    "serviceBaseVo": {
                        "id": 1,
                        "seriveType": '100',
                        "serviceTagId": 1234,
                        "serviceName": "雕刻时光咖啡",
                        "serviceDescribe": "刻时光咖啡馆sculpting in tim",
                        "statusName": "状态1",
                        "status": "11",
                        "publishTime": +new Date(),
                        "businessId": 1
                    },
                    "detailsAddition": {
                        "startTime": 1221290100000,
                        "endTime": 1321290120000,
                        "attachFiles1": "http://ue1.17173cdn.com/a/2035/open/2014/img/1.jpg",
                        "attachFiles2": "",
                        "attachFiles3": "http://baidu.com/123123.exe"
                    }
                }
            });
        }

        // 获取日程
        if (serviceBaseId === '2') {
            res.send({
                "result": "success",
                "messages": [],
                "fieldErrors": {},
                "errors": [],
                "data": {
                    "serviceBaseVo": {
                        "id": 1,
                        "seriveType": '100',
                        "serviceTagId": 1234,
                        "serviceName": "雕刻时光咖啡",
                        "serviceDescribe": "刻时光咖啡馆sculpting in tim",
                        "statusName": "状态1",
                        "status": "10",
                        "publishTime": +new Date(),
                        "businessId": 1
                    },
                    "detailsAddition": {
                        "startTime": 1420540320000,
                        "endTime": 1421490780000,
                        "repeatEndTime": +new Date(),
                        "repeatStartTime": +new Date() + 10000000,
                        "isRepeat": "0",
                        "isAllDay": "0",
                        "remind": (10 * 60).toString(),
                        "isSecrecy": "1"
                    }
                }
            });
        }

        // 获取图文
        if (serviceBaseId === '3') {
            res.send({
                "result": "success",
                "messages": [],
                "fieldErrors": {},
                "errors": [],
                "data": {
                    "serviceBaseVo": {
                        "id": 1,
                        "seriveType": '100',
                        "serviceTagId": 1234,
                        "serviceName": "雕刻时光咖啡",
                        "serviceDescribe": '2345<span style="background-color:#E56600;">23</span>45',
                        "status": "10",
                        "businessId": 1
                    },
                    "detailsAddition": {
                        "author": '作者'
                    }
                }
            });
        }

        // 获取悬赏
        if (serviceBaseId === '4') {
            res.send({
                "result": "success",
                "messages": [],
                "fieldErrors": {},
                "errors": [],
                "data": {
                    "serviceBaseVo": {
                        "id": 1,
                        "serviceTagId": 1,
                        "serviceBaseId": 1234,
                        "seriveType": '102',
                        "serviceName": "雕刻时光咖啡",
                        "serviceDescribe": '7897&nbsp;89798<br/>98797',
                        "status": "10",
                        "businessId": 1
                    },
                    "detailsAddition": {
                        "origSecrecy": "0",
                        "reviewer": "20000000001",
                        "rewardType": "2",
                        "rewardCount": "2"
                    },
                    "additionFiles": [
                        {
                            "fileName": "Jellyfish.jpg",
                            "fileUrl": "/a/2035/open/2014/img/bg2.jpg"
                        }
                    ]
                }
            });
        }
    },

    'post /admin/service/saveServiceDetail.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": {
                "serviceBaseVo": {
                    "id": 58,
                    "serviceType": "100",
                    "serviceTagId": 5,
                    "serviceName": "灏忚緣鐨勬祴璇曟暟鎹畑",
                    "serviceAttachFiles": null,
                    "serviceDescribe": "xiaohuitest",
                    "status": "11",
                    "publishTime": 1419353851525,
                    "businessId": 1549,
                    "statusName": "已发布"
                },
                "detailsAddition": {
                    "attachFiles1": "http://s-150637.abc188.com/statics/om_att/2014/12/c3ce3eb6f7524b2597a5287889f7afaa.txt",
                    "endTime": "1427569323731",
                    "startTime": "1417069323731"
                }
            }
        });
    },

    'post /admin/service/publishService.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": {
                "serviceBaseVo": {
                    "id": 58,
                    "serviceType": "100",
                    "serviceTagId": 5,
                    "serviceName": "灏忚緣鐨勬祴璇曟暟鎹畑",
                    "serviceAttachFiles": null,
                    "serviceDescribe": "xiaohuitest",
                    "status": "11",
                    "publishTime": 1419353851525,
                    "businessId": 1549,
                    "statusName": "已发布"
                },
                "detailsAddition": {
                    "attachFiles1": "http://s-150637.abc188.com/statics/om_att/2014/12/c3ce3eb6f7524b2597a5287889f7afaa.txt",
                    "endTime": "1427569323731",
                    "startTime": "1417069323731"
                }
            }
        });
    },

    'post /admin/service/republishService.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": {
                "serviceBaseVo": {
                    "id": 58,
                    "serviceType": "100",
                    "serviceTagId": 5,
                    "serviceName": "灏忚緣鐨勬祴璇曟暟鎹畑",
                    "serviceAttachFiles": null,
                    "serviceDescribe": "xiaohuitest",
                    "status": "11",
                    "publishTime": 1419353851525,
                    "businessId": 1549,
                    "statusName": "已发布"
                },
                "detailsAddition": {
                    "attachFiles1": "http://s-150637.abc188.com/statics/om_att/2014/12/c3ce3eb6f7524b2597a5287889f7afaa.txt",
                    "endTime": "1427569323731",
                    "startTime": "1417069323731"
                }
            }
        });
    },

//    // KindEditor
//    'post /admin/service/uploadTeletextImage.do': function (req, res) {
//        res.send({
//            "error": 0,
//            "url": "http://ue1.17173cdn.com/a/2035/open/2014/img/5.jpg"
//        });
//    }


    // UEditor
    'get /admin/service/uploadTeletextImage.do': function (req, res) {
        res.send({
            "imageActionName": "uploadimage",
            "imageFieldName": "upfile",
            "imageMaxSize": 10485760,
            "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
            "imageCompressEnable": false,
            "imageInsertAlign": "none",
            "imageUrlPrefix": "http://ue1.17173cdn.com/a/2035/open/2014/img/"
        });
    },

    'post /admin/service/uploadTeletextImage.do': function (req, res) {
        res.send({
            "state": "SUCCESS",
            "url": "5.jpg",
            "title": "demo.jpg",
            "original": "demo.jpg"
        });
    },

    'post /admin/service/uploadAddtionFiles.do': function (req, res) {
        res.set('Content-Type', 'text/html');
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": Math.random() > 0.5 ?
                'http://ue1.17173cdn.com/a/2035/open/2014/img/1.jpg' :
                'http://ue1.17173cdn.com/a/2035/open/2014/img/2.jpg'
        });
    }

};