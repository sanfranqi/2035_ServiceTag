package com.cyou.fz2035.servicetag.servicetag.service;

import com.cyou.fz2035.servicetag.user.service.MatrixUserService;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import com.cyou.fz2035.servicetag.utils.web.WebUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * User: littlehui
 * Date: 14-12-1
 * Time: 下午3:19
 */
@Service
public class WebUserService {

    @Autowired
    MatrixUserService matrixUserService;

    public MatrixUserInfo getUserInfoByUserId(Long userId) {
        MatrixUserInfo matrixUserInfo = matrixUserService.getUserInfoByUserId(WebContext.getLoginUserId(), WebContext.getLoginToken().getWebToken(), userId);
        return matrixUserInfo;
    }
}
