package com.cyou.fz2035.servicetag.login.action;

import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.matrix.api.model.Token;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.config.SystemConfig;
import com.cyou.fz2035.servicetag.user.service.MatrixUserSoaService;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import com.cyou.fz2035.servicetag.utils.web.IPUtil;
import com.cyou.fz2035.servicetag.utils.web.WebUtil;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * User: littlehui
 * Date: 14-11-25
 * Time: 上午11:39
 */
@Controller
public class LoginController {

    @Autowired
    private SystemConfig systemConfig;

    @Autowired
    @Qualifier("matrixUserSoaService")
    private MatrixUserSoaService matrixUserSoaService;


    @ResponseBody
    @RequestMapping(value = "/")
    public ModelAndView init(HttpServletRequest request, HttpServletResponse httpResponse) {
        ModelAndView modelAndView = new ModelAndView();
        String viewName = "";
        if (WebContext.getLoginUserId() != null && WebContext.getLoginTokenString() != null) {
            Token token = matrixUserSoaService.authUser(WebContext.getLoginUserId(), WebContext.getLoginToken().getWebToken());
            if (token.getUser() != null) {// 未登录情况下到登陆页
                viewName = ServiceTagConstants.SSO_LOGIN_URL;
            } else {
                viewName = ServiceTagConstants.ADMIN_MAIN_URL;
            }
        } else {
            viewName = ServiceTagConstants.SSO_LOGIN_URL;
        }
        modelAndView.setViewName(viewName);
        return modelAndView;
    }

    @ResponseBody
    @RequestMapping(value = "index.htm")
    public ModelAndView serviceTagIndex(HttpServletRequest request, HttpServletResponse httpResponse) {
        ModelAndView modelAndView = new ModelAndView();
        String viewName = "";
        if (WebContext.getLoginUserId() != null && WebContext.getLoginTokenString() != null) {
            Token token = null;
            try {
                token = matrixUserSoaService.authUser(WebContext.getLoginUserId(), WebContext.getLoginToken().getWebToken());
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (token == null || token.getUser() == null) {// 未登录情况下到登陆页
                viewName = ServiceTagConstants.SSO_LOGIN_URL;
                WebContext.getRequest().getSession().invalidate();
                WebContext.remove();
            } else {
                if (WebContext.isLoginUserAdmin()) {
                    viewName = ServiceTagConstants.ADMIN_MAIN_ADMIN_URL;
                } else {
                    viewName = ServiceTagConstants.ADMIN_MAIN_USER_URL;
                }
            }
        } else {
            viewName = ServiceTagConstants.SSO_LOGIN_URL;
        }
        WebContext.setLoginModel("user");
        modelAndView.setViewName(viewName);
        return modelAndView;
    }


    @ResponseBody
    @RequestMapping(value = "admin/logout.do")
    public Response<String> logout(HttpServletRequest request, HttpServletResponse httpResponse) {
        request.getSession().invalidate();
        return Response.getSuccessResponse("登出成功。");
    }


    @ResponseBody
    @RequestMapping(value = "admin/login.do", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<String> loginCtrl(HttpServletRequest request, HttpServletResponse httpResponse) throws IOException {
        String userName = request.getParameter("userName");
        String passWord = request.getParameter("passWord");
        String remember = request.getParameter("remember");
        Response response = Response.getSuccessResponse();
        Token token = null;
        if (userName != null) {
            if (WebContext.getLoginToken() != null) {
                String tokenStr = WebContext.getLoginToken().getWebToken();
                long userId = Long.parseLong(userName);
                token = matrixUserSoaService.authUser(userId, tokenStr);
            }
        }

        if (token != null) {
            WebContext.setResponse(httpResponse);
            WebContext.setRequest(request);
            WebContext.setLoginToken(token);
            response.setData(token.getWebToken());
            response.setMessage(null);
            return response;
        }
        if (StringUtils.isBlank(userName) || StringUtils.isBlank(passWord)) {
            response.setMessage("用户名或者密码不能为空");
            return response;
        }
        String allowUser = systemConfig.getAdmins();
        if (StringUtils.isBlank(allowUser)) {
            response.setResult(Response.RESULT_LOGIN);
            response.setMessage("用户名或者密码错误");
            return response;
        }
        try {
            long userId = Long.parseLong(userName);
            token = matrixUserSoaService.login(userId, passWord, IPUtil.ip2long(WebUtil.getRemoteIP(request)) + "", ServiceTagConstants.DEFAULT_LOGIN_TYPE);
        } catch (Exception e) {
            e.printStackTrace();
            response.setMessage("登陆系统错误。");
            response.setResult(Response.RESULT_LOGIN);
            response.setError(e.getMessage());
            return response;
        }
        if (token == null) {
            response.setResult(Response.RESULT_LOGIN);
            response.setMessage("用户名或者密码错误");
        } else {
            response.setResult(Response.RESULT_SUCCESS);
            WebContext.setRequest(request);
            WebContext.setResponse(httpResponse);
            WebContext.setLoginToken(token);
            if ("true".equals(remember)) {
                Cookie cookie = new Cookie(ServiceTagConstants.LOGIN_TOKEN_REMEMBER, remember);
                WebContext.getResponse().addCookie(cookie);
                WebContext.getRequest().getSession().setAttribute(ServiceTagConstants.LOGIN_ISREMEMBER, true);
            } else {
                Cookie cookie = new Cookie(ServiceTagConstants.LOGIN_TOKEN_REMEMBER, remember);
                WebContext.getResponse().addCookie(cookie);
                WebContext.getRequest().getSession().setAttribute(ServiceTagConstants.LOGIN_ISREMEMBER, false);
            }
            WebContext.getRequest().getSession().setAttribute(ServiceTagConstants.ISLOGIN, "true");
            response.setData(token.getWebToken());
            if (remember != null && Boolean.valueOf(remember)) {
            }
            response.setMessage(null);
        }
        return response;
    }

    public void setCoodies(HttpServletRequest request, HttpServletResponse response) {

    }
}
