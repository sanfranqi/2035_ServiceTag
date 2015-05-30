package com.cyou.fz2035.servicetag.springmvc;

import com.cyou.fz2035.matrix.api.model.Token;
import com.cyou.fz2035.servicetag.cached.UserCachedHandler;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.servicetag.vo.SimpleServiceTagVo;
import com.cyou.fz2035.servicetag.user.bean.UserInfo;
import com.cyou.fz2035.servicetag.user.service.MatrixUserSoaService;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import org.apache.http.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * spring mvc 默认地址匹配.
 *
 * @author qingwu
 * @date 2013-6-1 下午4:35:02
 */
@Controller
public class WildcardMVCController {

    @Autowired
    @Qualifier("matrixUserSoaService")
    MatrixUserSoaService matrixUserSoaService;


    /**
     * 默认匹配字符串开始的地址
     * @param request
     * @param textualPart
     * @return
     */
	@RequestMapping("/{textualPart:[a-z-]+}/**/*.html")
	public ModelAndView htmlMapping(HttpServletRequest request, @PathVariable String textualPart) {
		String url = request.getServletPath();
		ModelAndView view = new ModelAndView();
		view.setViewName(getViewName(url, ".html"));
		return view;
	}

    @RequestMapping("/*.htm")
    public ModelAndView indHtmMapping(HttpServletRequest request) {
        String url = request.getServletPath();
        ModelAndView view = new ModelAndView();
        view.setViewName(getViewName(url, ".htm"));
        return view;
    }

    /**
     * 默认匹配字符串开始的地址
     * @param request
     * @param textualPart
     * @return
     */
    @RequestMapping("/{textualPart:[a-z-]+}/**/*.htm")
    public ModelAndView htmMapping(HttpServletRequest request, @PathVariable String textualPart) {
        String url = request.getServletPath();
        ModelAndView view = new ModelAndView();
        view.setViewName(getViewName(url, ".htm"));
        return view;
    }

    /**
     * 登陆映射
     * @param request
     * @return
     */
    @RequestMapping("login.html")
    public ModelAndView login(HttpServletRequest request, HttpServletResponse response) {
        String url = request.getServletPath();
        ModelAndView view = new ModelAndView();
        if (WebContext.getLoginUserId() != null) {
            try {
                response.sendRedirect("index.html");
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            view.setViewName(ServiceTagConstants.SSO_LOGIN_URL);
        }
        return view;
    }

    /**
     * 登陆映射
     * @param request
     * @return
     */
    @RequestMapping("login.htm")
    public ModelAndView loginHtm(HttpServletRequest request, HttpServletResponse response) {
        String url = request.getServletPath();
        ModelAndView view = new ModelAndView();
        if (WebContext.getLoginUserId() != null) {
            try {
                 response.sendRedirect("index.htm");
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            view.setViewName(ServiceTagConstants.SSO_LOGIN_URL);
        }
        view.setViewName(ServiceTagConstants.SSO_LOGIN_URL);
        return view;
    }

    /**
     * 登陆view名称解析
     * @param requestURI
     * @param suffix
     * @return
     */
	public String getViewName(String requestURI, String suffix) {
		String viewName = requestURI;
		if (viewName.equals("/")) {// 直接访问项目路径
            Token token = matrixUserSoaService.authUser(WebContext.getLoginUserId(), WebContext.getLoginToken().getWebToken());
			if (token.getUser() != null) {// 未登录情况下到登陆页
				viewName = ServiceTagConstants.SSO_LOGIN_URL + suffix;
			} else {
                viewName = ServiceTagConstants.ADMIN_MAIN_URL + suffix;
            }
		}
		viewName = viewName.substring(0, viewName.length() - suffix.length());
		return viewName;
	}
}
