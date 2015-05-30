package com.cyou.fz2035.servicetag.context;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.ServletRequestUtils;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.StringUtil;
import com.cyou.fz2035.matrix.api.model.Token;
import com.cyou.fz2035.servicetag.context.dto.AppResponse;
import com.cyou.fz2035.servicetag.user.service.MatrixUserSoaService;
import com.cyou.fz2035.servicetag.user.service.impl.MatrixUserSoaServiceImpl;
import com.cyou.fz2035.servicetag.utils.context.AppContext;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.web.JsonUtil;

/**
 * User: littlehui Date: 14-12-4 Time: 上午10:51
 */
public class InitProviderContentInteceptor implements Filter {

	MatrixUserSoaService matrixUserSoaService;

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		matrixUserSoaService = ApplicationContextUtil.getBean(MatrixUserSoaServiceImpl.class);
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		req.setCharacterEncoding("UTF-8");
		res.setCharacterEncoding("UTF-8");
		res.setContentType("text/html;charset=UTF-8");
		AppContext.setRequest(req);
		AppContext.setResponse(res);
		Long userId = ServletRequestUtils.getLongParameter(request, "_m");
		String tokenStr = ServletRequestUtils.getStringParameter(request, "_t");
		boolean isAuth = false;
		Token token = null;
		if (userId == null || StringUtil.isEmpty(tokenStr)) {
			JsonUtil.writeJson(res, AppResponse.getFailedResponse("登陆信息验证失败。"));
		} else {
			try {
				token = matrixUserSoaService.authUser(userId, tokenStr);
				if (token != null && token.getUser() != null) {
					isAuth = true;
				} else {
					PrintWriter writer = response.getWriter();
					AppResponse<String> appResponse = AppResponse.getFailedResponse("请重新登陆!");
					appResponse.setError_code("20001");
					writer.write(JsonUtil.toJson(appResponse));
					writer.flush();
					writer.close();
				}
			} catch (Exception ex) {
				ex.printStackTrace();
				JsonUtil.writeJson(res, AppResponse.getFailedResponse("登陆信息验证失败。"));
			}
		}
		if (isAuth) {
			AppContext.setToken(token);
			chain.doFilter(request, response);
		}
	}

	@Override
	public void destroy() {
		AppContext.remove();
	}
}
