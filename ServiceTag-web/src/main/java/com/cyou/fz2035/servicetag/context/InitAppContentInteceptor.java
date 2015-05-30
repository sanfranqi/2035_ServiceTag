package com.cyou.fz2035.servicetag.context;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cyou.fz2035.servicetag.user.service.MatrixUserService;
import com.cyou.fz2035.servicetag.utils.context.AppContext;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;

/**
 * User: littlehui Date: 14-10-28 Time: 下午4:19
 */
public class InitAppContentInteceptor implements Filter {

	MatrixUserService matrixUserService;

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		AppContext.setRequest(httpRequest);
		AppContext.setResponse((HttpServletResponse) response);
		AppContext.getResponse().setContentType("text/html;charset=UTF-8");
		String url = httpRequest.getServletPath();
		String userId = httpRequest.getParameter("_m");
		String token = httpRequest.getParameter("_t");
		String key = httpRequest.getParameter("key");
		if (userId == null || token == null || key == null) {
			response.setCharacterEncoding("UTF-8");
			response.getOutputStream().print("参数不对：token,key,m");
		}
		chain.doFilter(request, response);
		AppContext.remove();
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		matrixUserService = ApplicationContextUtil.getBean(MatrixUserService.class);
	}

	@Override
	public void destroy() {

	}
}
