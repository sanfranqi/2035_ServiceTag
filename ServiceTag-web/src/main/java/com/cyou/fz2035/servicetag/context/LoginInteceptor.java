package com.cyou.fz2035.servicetag.context;

import com.cyou.fz2035.matrix.api.model.Token;
import com.cyou.fz2035.servicetag.user.service.MatrixUserSoaService;
import com.cyou.fz2035.servicetag.user.service.impl.MatrixUserSoaServiceImpl;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import com.cyou.fz2035.servicetag.utils.data.ResponseFactory;
import com.cyou.fz2035.servicetag.utils.web.JsonUtil;
import com.cyou.fz2035.servicetag.utils.web.WebUtil;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * User: littlehui
 * Date: 14-12-29
 * Time: 下午2:40
 */
public class LoginInteceptor extends HandlerInterceptorAdapter {

    MatrixUserSoaService matrixUserSoaService = ApplicationContextUtil.getBean(MatrixUserSoaServiceImpl.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (handler instanceof HandlerMethod) {
            String url = request.getServletPath();
            if (!url.startsWith("/provider") && !url.startsWith("/admin/login")
                    && !url.startsWith("/index") && !url.startsWith("/nonlimit")) {
                boolean isLogin = false;
                Token token = WebContext.getLoginToken();
                if (token != null && token.getWebToken() != null) {
                    Token tokenEntity = matrixUserSoaService.authUser(token.getUser().getUserId(), token.getWebToken());
                    if (tokenEntity != null) {
                        WebContext.setLoginToken(tokenEntity);
                        isLogin = true;
                    } else {
                        isLogin = false;
                    }
                }
                if (!isLogin) {
                    if (WebUtil.isAjaxRequest(request)) {
                        JsonUtil.writeJson(response, ResponseFactory.getDefaultNeedLoginResponse());
                        return false;
                    } else {
                        response.sendRedirect("/");
                        return false;
                    }
                }
            }
        }
        return true;
    }
}