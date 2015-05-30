package com.cyou.fz2035.servicetag.user.service.impl;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.matrix.api.model.Box;
import com.cyou.fz2035.matrix.api.model.Token;
import com.cyou.fz2035.matrix.api.model.User;
import com.cyou.fz2035.matrix.api.service.DubboService;
import com.cyou.fz2035.servicetag.user.service.MatrixUserSoaService;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import org.springframework.stereotype.Service;

/**
 * User: littlehui
 * Date: 14-12-9
 * Time: 下午2:29
 */
@Service("matrixUserSoaService")
public class MatrixUserSoaServiceImpl implements MatrixUserSoaService {

    DubboService dubboService = ApplicationContextUtil.getBean("dubboService");

    @Override
    public Token login(Long userId, String pwd, String key, int type) {
        Box<Token> box = dubboService.login(userId, pwd, key, type);
        return box.getDto();
    }

    @Override
    public MatrixUserInfo getUserByUserId(Long userId) {
        Box<User> box = dubboService.qId(userId);
        User user = box.getDto();
        MatrixUserInfo userInfo = ObjectUtil.convertObj(user, MatrixUserInfo.class);
        return userInfo;
    }

    @Override
    public Token authUser(Long userId, String token) {
        Box<Token> box = dubboService.auth(userId, token);
        Token tokenEntity = box.getDto();
        return tokenEntity;
    }

    @Override
    public Boolean register(Long userId, String name) {
        Box box = dubboService.reg(userId, "servicetagcantlogin", name, "");
        return box.isIs_ok();
    }

    @Override
    public Boolean update(Long userId, String name) {
        Box<String> box = dubboService.update(userId, name, "", "");
        return box.isIs_ok();
    }
}
