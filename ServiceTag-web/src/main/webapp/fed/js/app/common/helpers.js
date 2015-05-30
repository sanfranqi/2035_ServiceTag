define(function (require) {
    var moment = require('moment');

    return {

        fDate: function (val) {
            var ret = '';
            if (val) {
                ret = moment(val).format('YYYY-MM-DD HH:mm');
            }
            return ret;
        },

        fShortDate: function (val) {
            var ret = '';
            if (val) {
                ret = moment(val).format('YYYY-MM-DD');
            }
            return ret;
        },

        // 解析只有小时的“时间戳”
        fTime: function (val) {
            var ret = '',
                timestamp = +val;

            if (timestamp || timestamp === 0) {
                // 946656000000 = '2000-01-01 00:00:00'
                ret = moment(timestamp + 946656000000).format('HH:mm');
            }
            return ret;
        },

        judge: function (a, b, options) {
            if (a === b) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },

        contrast: function (a, b, options) {
            if (a > b) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },

        getImage: function (val) {
            return imageURL + '/' + val;
        },

        getAvatars: function (userId) {
            return userImagePath + '/m_' + userId + '/head_pic/small.jpg';
        },

        now: function () {
            return moment().format('HH:mm');
        },

        getFileIcon: function (fileName) {
            var o = fileName.split('.'),
                fileType = o[o.length - 1].toString().toLowerCase(),
                baseUrl = 'http://ue1.17173cdn.com/a/2035/open/2014/img/',
                imgName;

            switch (fileType) {
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'bmp':
                    imgName = fileName;
                    break;
                case 'doc':
                    imgName = baseUrl + 'f1.jpg';
                    break;
                case 'txt':
                    imgName = baseUrl + 'f2.jpg';
                    break;
                case 'xls':
                    imgName = baseUrl + 'f3.jpg';
                    break;
                case 'pdf':
                    imgName = baseUrl + 'f4.jpg';
                    break;
                case 'ppt':
                    imgName = baseUrl + 'f5.jpg';
                    break;
                case 'rar':
                    imgName = baseUrl + 'f6.jpg';
                    break;
                case 'zip':
                    imgName = baseUrl + 'f7.jpg';
                    break;
                case 'mp3':
                    imgName = baseUrl + 'f8.jpg';
                    break;
                default :
                    imgName = baseUrl + 'f9.jpg';
                    break;
            }

            return imgName;
        }

    };
});