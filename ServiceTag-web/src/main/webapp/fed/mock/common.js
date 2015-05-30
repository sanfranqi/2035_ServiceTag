module.exports = {
    getFile: function (s) {
        return 'WEB-INF/template/ftl/' + s + '/index';
    },
    store: {
        ctx: 'http://localhost:7000',
        imageURL: 'http://localhost:7000/img',
        userImagePath: 'http://s1.17173.jzmom.com/om_att/avatars/',
        rewardDomainUrl: 'http://ue1.17173cdn.com',

        userInfo: {
            id: 15059456663,
            userName: '123',
            token: 'w16810664860272194',
            admin: true
        },

        questURL: 'http://222.77.181.18:8092/wenjuan',

        simpleServiceTagVo: {
            id: 1234,
            serviceTagName: '养生体系',
            serviceTagImg: '1.jpg'
        }
    }
};