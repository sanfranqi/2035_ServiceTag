package com.cyou.fz2035.servicetag.tests.services;


import com.cyou.fz2035.matrix.api.model.User;
import com.cyou.fz2035.servicetag.user.service.MatrixUserService;
import com.cyou.fz2035.servicetag.user.service.MatrixUserSoaService;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.utils.bean.Token;
import com.cyou.fz2035.servicetag.utils.http.HttpClientUtil;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * User: littlehui
 * Date: 14-11-4
 * Time: 下午2:40
 */
public class MatrixUserServiceTests extends BaseTestService {

    @Autowired
    MatrixUserService matrixUserService;

    @Autowired
    MatrixUserSoaService matrixUserSoaService;
    @Test
    public void testLogin() throws Exception {

        String _t = "w13599088095cd775350";
//			 new BaseUserService().queryMuserByPhone("13599088095", _t, "13599088095");
//			 new BaseUserService().queryGroupAll("13599088095", _t);
//			 new BaseUserService().queryMuserListByQ("13599088095", _t, "85");
        //new BaseUserService().queryGroupListByUser("13599088095", _t);

        //Token token = matrixUserService.login("13599088095", "123456","10.5.117.141", "2");
        //com.cyou.fz2035.matrix.api.model.Token token = matrixUserSoaService.login(15280191991L, "123456", "10.5.27.61", 2);
        com.cyou.fz2035.matrix.api.model.Token token = matrixUserSoaService.login(15705959502L, "123456", "10.5.27.61", 2);

        System.out.println(token.getUser().getUserId());
        assert token != null;
    }

    @Test
    public void queryMuserAuthTest() {
/*        String _t = "w13599088095cd775350";
        String _m="13599088095";
        String key="10.5.117.141";*/
        String _t = "d10.5.27.61c38caa";
        String _m="15705959502";
        String key="10.5.27.61";
        try {
            MatrixUserInfo matrixUserInfo = matrixUserService.queryMuserAuth(_m, _t, key);
            assert matrixUserInfo.getUserId() != null;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testQueryByUserId() {
        try {
            MatrixUserInfo matrixUserInfo = matrixUserSoaService.getUserByUserId(15705959502L);//matrixUserService.getUserInfoByUserId(13599088095L, _t, 13599088095L);
            assert matrixUserInfo.getUserId() != null;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
