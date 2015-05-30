package com.cyou.fz2035.servicetag.servicetag.action;

import com.cyou.fz2035.servicetag.cached.UserCachedHandler;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.servicetag.vo.SimpleServiceTagVo;
import com.cyou.fz2035.servicetag.user.bean.UserInfo;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 处理视图渲染
 * User: littlehui
 * Date: 14-12-17
 * Time: 上午10:39
 */
@Controller
public class ServiceTagCommonAdminController {

    @Autowired
    private ServiceTagService serviceTagService;

    @ResponseBody
    @RequestMapping(value = "/{serviceTagId:\\d+}/**/*.htm", produces = MediaType.APPLICATION_JSON_VALUE)
    public ModelAndView resloverHtm(HttpServletRequest request, HttpServletResponse response, @PathVariable Integer serviceTagId, Model model) throws IOException {
        String url = request.getServletPath();
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName(getViewName(url, ".htm", serviceTagId.toString().length() + 2));
        ServiceTag serviceTag = serviceTagService.get(serviceTagId);
        SimpleServiceTagVo simpleServiceTagVo = new SimpleServiceTagVo();
        if (serviceTag != null) {
            simpleServiceTagVo.setId(serviceTagId);
            simpleServiceTagVo.setServiceTagImg(serviceTag.getServiceTagImg());
            simpleServiceTagVo.setServiceTagName(serviceTag.getServiceTagName());
        }
        if (WebContext.getLoginUserId() != null) {
            if (!serviceTagService.isAuthUserServiceTag(serviceTagId, WebContext.getLoginUserId())) {
                modelAndView.setViewName("redirect:/index.htm");
                return modelAndView;
            }
            MatrixUserInfo matrixUserInfo = UserCachedHandler.getMatrixUserInfo(WebContext.getLoginUserId());
            UserInfo userInfo = new UserInfo();
            userInfo.setId(matrixUserInfo.getUserId());
            userInfo.setUserName(matrixUserInfo.getFullName());
            if (userInfo != null) {
                model.addAttribute("userInfo", userInfo);
                request.setAttribute("userInfo", userInfo);
            }
        }
        if (simpleServiceTagVo != null) {
            request.getSession().setAttribute("simpleServiceTagVo", simpleServiceTagVo);
        }
        return modelAndView;
    }

    @ResponseBody
    @RequestMapping(value = "/index/admin.htm", produces = MediaType.APPLICATION_JSON_VALUE)
    public ModelAndView userIndex(HttpServletRequest request, HttpServletResponse response) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/index/admin");
        if (WebContext.isLoginUserAdmin()) {
            WebContext.setLoginModel("admin");
        }
        return modelAndView;
    }


    @ResponseBody
    @RequestMapping(value = "/index/user.htm", produces = MediaType.APPLICATION_JSON_VALUE)
    public ModelAndView adminIndex(HttpServletRequest request, HttpServletResponse response) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/index/user");
        if (WebContext.isLoginUserAdmin()) {
            WebContext.setLoginModel("user");
        }
        return modelAndView;
    }

    public String getViewName(String requestURI, String suffix, int startLength) {
        String viewName = requestURI;
        viewName = viewName.substring(startLength, viewName.length() - suffix.length());
        return "service/" + viewName;
    }
}
