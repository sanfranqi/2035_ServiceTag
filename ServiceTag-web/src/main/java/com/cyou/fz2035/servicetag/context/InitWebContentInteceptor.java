package com.cyou.fz2035.servicetag.context;


import com.cyou.fz2035.matrix.api.model.Token;
import com.cyou.fz2035.servicetag.user.service.MatrixUserSoaService;
import com.cyou.fz2035.servicetag.user.service.impl.MatrixUserSoaServiceImpl;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import com.cyou.fz2035.servicetag.utils.data.ResponseFactory;
import com.cyou.fz2035.servicetag.utils.web.JsonUtil;
import com.cyou.fz2035.servicetag.utils.web.WebUtil;
import org.apache.http.client.RedirectStrategy;
import org.apache.http.impl.client.DefaultRedirectStrategy;
import org.springframework.web.bind.ServletRequestUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * User: littlehui
 * Date: 14-10-28
 * Time: 下午4:20
 */
public class InitWebContentInteceptor implements Filter {

    MatrixUserSoaService matrixUserSoaService;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        matrixUserSoaService = ApplicationContextUtil.getBean(MatrixUserSoaServiceImpl.class);
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        WebContext.setRequest(httpRequest);
        WebContext.setResponse((HttpServletResponse) response);
        WebContext.getResponse().setContentType("text/html;charset=UTF-8");
        String url = httpRequest.getServletPath();
        Long userId = ServletRequestUtils.getLongParameter(request, "_m");
        String tokenStr = ServletRequestUtils.getStringParameter(request, "_t");
        try {
            chain.doFilter(request, response);
        } catch (RuntimeException e) {
            e.printStackTrace();
        } finally {
            WebContext.remove();
        }
    }


    @Override
    public void destroy() {
    }
}
