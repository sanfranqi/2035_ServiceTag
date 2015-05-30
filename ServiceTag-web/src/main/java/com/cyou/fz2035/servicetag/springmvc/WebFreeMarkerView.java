package com.cyou.fz2035.servicetag.springmvc;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.view.freemarker.FreeMarkerView;

import com.cyou.fz2035.servicetag.cached.UserCachedHandler;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.servicetag.vo.SimpleServiceTagVo;
import com.cyou.fz2035.servicetag.user.bean.UserInfo;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.utils.context.WebContext;

public class WebFreeMarkerView extends FreeMarkerView {

	@Override
	protected void exposeHelpers(Map<String, Object> model, HttpServletRequest request) throws Exception {
		model.put("ctx", ServiceTagConstants.DOMAIN_URL);
		model.put("imageURL", ServiceTagConstants.ZIMG_URL);
		model.put("questURL", ServiceTagConstants.QUEST_PAGE_URL);
		model.put("userImagePath", ServiceTagConstants.USER_IMAGE_PATH);
		model.put("rewardDomainUrl", ServiceTagConstants.REWARD_DOMAIN_URL);
		if (WebContext.getLoginUserId() != null) {
			MatrixUserInfo matrixUserInfo = UserCachedHandler.getMatrixUserInfo(WebContext.getLoginUserId());
			UserInfo userInfo = new UserInfo();
			userInfo.setId(matrixUserInfo.getUserId());
			userInfo.setUserName(matrixUserInfo.getFullName());
			userInfo.setAdmin(WebContext.isLoginUserAdmin());
			if (userInfo != null) {
				model.put("userInfo", userInfo);
			}
			userInfo.setToken(WebContext.getLoginTokenString());
		}
		SimpleServiceTagVo simpleServiceTagVo = (SimpleServiceTagVo) request.getSession().getAttribute("simpleServiceTagVo");
		if (simpleServiceTagVo != null) {
			model.put("simpleServiceTagVo", simpleServiceTagVo);
		}
	}
}
