package com.cyou.fz2035.servicetag.utils.context;


import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.StringUtil;
import com.cyou.fz2035.matrix.api.model.Token;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.memcached.XMemcacheHandler;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.user.service.MatrixUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

/**
 * User: littlehui Date: 14-10-30 Time: 下午3:42
 */
public class WebContext {
	private static Logger logger = LoggerFactory.getLogger(WebContext.class);
	private static ThreadLocal<HttpServletRequest> request = new ThreadLocal<HttpServletRequest>();
	private static ThreadLocal<HttpServletResponse> response = new ThreadLocal<HttpServletResponse>();
	/**
	 * 注入使用的容器
	 */
    private static Map<String, Object> cacheKey = new HashMap<String, Object>();


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

	public static Token getLoginToken() {
		if (WebContext.getRequest() == null) {
            return null;
        }
		//HttpSession session = (HttpSession) cacheKey.get(WebContext.getRequest().getSession().getId());
        HttpSession session = WebContext.getRequest().getSession(true);
		if (session == null)
			return null;
        if (session.getAttribute("token") != null) {
            //TODO littlehui  验证登陆记录的方式20141229
/*            if (Boolean.FALSE.equals(session.getAttribute(ServiceTagConstants.LOGIN_ISREMEMBER))) {
                //session记录是否保存账号
                //如果没保存，需要判断cookie是否有保存
                if (isTokenCookiesReadyIn()) {
                    //证明已经有登陆痕迹的
                    Token token = (Token) session.getAttribute("token");
                    return token;
                } else {
                    if ("true".equals(session.getAttribute(ServiceTagConstants.ISLOGIN))) {
                        Token token = (Token) session.getAttribute("token");
                        session.setAttribute(ServiceTagConstants.ISLOGIN, false);
                        return token;
                    }
                }
            }*/
            Token token = (Token) session.getAttribute("token");
            return token;
        }
        return null;
	}

    private static boolean isTokenCookiesReadyIn() {
        if (request == null) {
            return false;
        } else {
            Cookie[] cookies = WebContext.getRequest().getCookies();
            if (cookies != null && cookies.length > 0) {
                for (Cookie cookie : cookies) {
                    if (cookie.getName().equals(ServiceTagConstants.LOGIN_TOKEN_REMEMBER)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public static boolean isRemember() {
        if (WebContext.getRequest() == null) {
            return false;
        }
        HttpSession session = WebContext.getRequest().getSession(true);
        if (session == null)
            return false;
        if (session.getAttribute("remember") != null) {
            Boolean aBoolean = (Boolean) session.getAttribute("remember");
            return aBoolean;
        }
        return false;
    }

	public static Long getLoginUserId() {
        if(getLoginToken()==null) return null;
		return getLoginToken().getUser().getUserId();
	}

	public static String getLoginTokenString() {
        if(getLoginToken()==null) return null;
		return getLoginToken().getWebToken();
	}


	public static Boolean setLoginToken(Token token) {
		if (WebContext.getRequest() == null) {
			return false;
		}
		HttpSession session = WebContext.getRequest().getSession(true);
        WebContext.getRequest().getCookies();
		session.setAttribute("token", token);
		return true;
	}

    public static boolean isLoginUserAdmin() {
        String userId = getLoginUserId().toString();
        if (StringUtil.isEmpty(userId)) {
            return false;
        }
        return ServiceTagConstants.ADMINUSERIDS.contains(userId);
    }

    public static boolean isLoginAdminModel() {
        String loginModel = (String)getCache(WebContext.getLoginUserId() + "_loginModel");
        if ("admin".equals(loginModel)) {
            return true;
        } else {
            return false;
        }
    }

    public static void setLoginModel(String loginModel) {
        setCache(WebContext.getLoginUserId() + "_loginModel", loginModel);
    }

    public static boolean isUserAdmin(String userId) {
        return ServiceTagConstants.ADMINUSERIDS.contains(userId);
    }


    public static void setCache(String key, Object value) {
        getXMemcacheHandler().set(key, getXMemcacheHandler().getCacheMinute(30), value);
    }

    public static Object getCache(String key) {
        return getXMemcacheHandler().get(key);
    }

    public static XMemcacheHandler getXMemcacheHandler() {
        XMemcacheHandler memcacheHandler = ApplicationContextUtil.getBean(XMemcacheHandler.class);
        if (memcacheHandler != null) {
            return memcacheHandler;
        }
        throw new RuntimeException("no config ");
    }

}
