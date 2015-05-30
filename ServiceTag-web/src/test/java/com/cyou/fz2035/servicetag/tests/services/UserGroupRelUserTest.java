package com.cyou.fz2035.servicetag.tests.services;

import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * User: littlehui
 * Date: 14-12-16
 * Time: 下午5:35
 */
public class UserGroupRelUserTest extends BaseTestService {

    @Autowired
    private UserGroupRelUserService userGroupRelUserService;

    @Test
    public void queryWhiteListTest() {
        String userIds = userGroupRelUserService.queryWhiteList(5);
        System.out.print(userIds);
    }
}
