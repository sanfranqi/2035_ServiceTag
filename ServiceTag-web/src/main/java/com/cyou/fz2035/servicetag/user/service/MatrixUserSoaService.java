package com.cyou.fz2035.servicetag.user.service;

import com.cyou.fz2035.matrix.api.model.Token;
import com.cyou.fz2035.matrix.api.model.User;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;

/**
 * User: littlehui
 * Date: 14-12-9
 * Time: 下午2:25
 */
public interface MatrixUserSoaService {

    public Token login(Long userId, String pwd, String key, int type);

    public MatrixUserInfo getUserByUserId(Long userId);

    public Token authUser(Long userId, String token);

    public Boolean register(Long userId, String name);

    public Boolean update(Long userId, String name);
}
