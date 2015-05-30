package com.cyou.fz2035.servicetag.context;

import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import com.cyou.fz2035.servicetag.utils.web.JsonUtil;
import com.cyou.fz2035.servicetag.utils.web.WebUtil;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * User: littlehui
 * Date: 15-2-4
 * Time: 上午10:46
 */
public class ServiceTagInterceptor implements HandlerInterceptor {

    ServiceTagService serviceTagService = ApplicationContextUtil.getBean(ServiceTagService.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!WebUtil.isAjaxRequest(request)) {
            return true;
        }
        String requestUrl = request.getRequestURL().toString();
        //更新服务号的话
        if (!requestUrl.contains("/admin/serviceTag/update")) {
            return true;
        }
        Integer serviceTagId = request.getParameter("serviceTagId") != null ? Integer.valueOf(request.getParameter("serviceTagId")) : 0;
        String status = request.getParameter("status") != null ? request.getParameter("status") : "";
        ServiceTag serviceTag = serviceTagService.get(serviceTagId);
        if (serviceTag == null) {
            return true;
        }
        if (ServiceTagConstants.SERVICETAG_STATUS_STOP.equals(status)) {
            if (WebContext.isLoginAdminModel()) {
                serviceTag.setStopByAdmin(true);
                serviceTagService.update(serviceTag);
                return true;
            } else {
                serviceTag.setStopByAdmin(false);
                serviceTagService.update(serviceTag);
                return true;
            }
        } else if (ServiceTagConstants.SERVICETAG_STATUS_USE.equals(status)) {
            if (serviceTag.getStopByAdmin()) {
                //如果是管理员停用的
                if (WebContext.isLoginAdminModel()) {
                    return true;
                } else {
                    JsonUtil.writeJson(response, Response.getFailedResponse("超管模式下停用的服务号，不允许在普通模式下启用。"));
                    return false;
                }
            }
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }
}
