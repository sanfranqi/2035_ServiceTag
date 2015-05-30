package com.cyou.fz2035.servicetag.springmvc.exception;

import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * User: littlehui
 * Date: 15-2-10
 * Time: 下午4:54
 */
public class DividSimpleMappingExceptionResolver extends SimpleMappingExceptionResolver {

    ObjectMapper mapper = new ObjectMapper();

    @Override
    protected ModelAndView doResolveException(HttpServletRequest request,
                                              HttpServletResponse response, Object handler, Exception ex) {
        // 全局对象映射（线程安全）

        // Expose ModelAndView for chosen error view.
        if (this.isAjaxRequest(request)) {
            try {
                this.writeJson(response, Response.getFailedResponse(ex.getMessage()));
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        } else {
            String viewName = determineViewName(ex, request);
            if (viewName != null) {
                if (viewName.equals("json")) {
                    try {
                        this.writeJson(response, Response.getFailedResponse(ex.getMessage()));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    return null;
                }
                // Apply HTTP status code for error views, if specified.
                // Only apply it if we're processing a top-level request.
                Integer statusCode = determineStatusCode(request, viewName);
                if (statusCode != null) {
                    applyStatusCodeIfPossible(request, response, statusCode);
                }
                return getModelAndView(viewName, ex, request);
            } else {
                try {
                    this.writeJson(response, Response.getFailedResponse(ex.getMessage()));
                } catch (IOException e) {
                    e.printStackTrace();
                }
                return null;
            }
        }
    }

    private boolean isAjaxRequest(HttpServletRequest request) {
        return !StringUtils.isEmpty(request.getHeader("X-Requested-With"));
    }

    private void writeJson(HttpServletResponse response, Object result) throws IOException {
        PrintWriter writer = response.getWriter();
        String json = toJson(result);
        writer.println(json);
        writer.flush();
    }

    private String toJson(Object obj) {
        try {
            return mapper.writeValueAsString(obj);
        } catch (Exception ex) {
            logger.error("toJson error：" + obj.getClass().getName(), ex);
            return "{}";
        }
    }
}
