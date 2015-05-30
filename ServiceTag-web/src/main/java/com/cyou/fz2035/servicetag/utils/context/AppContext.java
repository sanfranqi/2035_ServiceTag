package com.cyou.fz2035.servicetag.utils.context;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cyou.fz2035.matrix.api.model.Token;

/**
 * @Description .
 * @author QiSF
 * @date 2015年1月16日
 */
public class AppContext {
	private static Logger logger = LoggerFactory.getLogger(AppContext.class);
	private static ThreadLocal<HttpServletRequest> request = new ThreadLocal<HttpServletRequest>();
	private static ThreadLocal<HttpServletResponse> response = new ThreadLocal<HttpServletResponse>();

	/**
	 * 放入web请求
	 *
	 * @param r
	 * @author yangz
	 * @date 2012-10-8 下午04:22:36
	 */
	public static void setRequest(HttpServletRequest r) {
		request.set(r);
	}

	/**
	 * 获取当前request
	 *
	 * @return
	 * @author yangz
	 * @date 2012-10-18 上午10:50:32
	 */
	public static HttpServletRequest getRequest() {
		return request.get();
	}

	/**
	 * 得到当前线程response
	 *
	 * @return
	 * @author yangz
	 * @date 2012-10-13 下午06:00:37
	 */
	public static HttpServletResponse getResponse() {
		if (null == response.get()) {
			return null;
		}
		return response.get();
	}

	/**
	 * 放入当前线程response
	 *
	 * @param r
	 * @author yangz
	 * @date 2012-10-13 下午06:00:40
	 */
	public static void setResponse(HttpServletResponse r) {
		response.set(r);
	}

	/**
	 * 删除web请求
	 *
	 * @author yangz
	 * @date 2012-10-8 下午04:22:49
	 */
	public static void remove() {
		request.remove();
		response.remove();
	}

	/**
	 * 保存token.
	 * 
	 * @author QiSF
	 * @date 2015年1月16日
	 */
	public static Boolean setToken(Token token) {
		if (AppContext.getRequest() == null) {
			return false;
		}
		HttpSession session = AppContext.getRequest().getSession(true);
		session.setAttribute("token", token);
		return true;
	}

	/**
	 * 获取token.
	 * 
	 * @author QiSF
	 * @date 2015年1月16日
	 */
	public static Token getToken() {
		if (AppContext.getRequest() == null) {
			return null;
		}
		HttpSession session = AppContext.getRequest().getSession(true);
		if (session == null)
			return null;
		if (session.getAttribute("token") != null) {
			Token token = (Token) session.getAttribute("token");
			return token;
		}
		return null;
	}

	/**
	 * 获取当前用户ID.
	 * 
	 * @author QiSF
	 * @date 2015年1月16日
	 */
	public static Long getContextUserId() {
		if (getToken() == null)
			return null;
		return getToken().getUser().getUserId();
	}

	/**
	 * 获取当前用户token.
	 * 
	 * @author QiSF
	 * @date 2015年1月16日
	 */
	public static String getContextTokenString() {
		if (getToken() == null)
			return null;
		return getToken().getDeviceToken();
	}
}
