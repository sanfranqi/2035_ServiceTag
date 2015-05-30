package com.cyou.fz2035.servicetag.usergroupreluser.action;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.usergroupreluser.vo.UserGroupRelUserVo;
import com.cyou.fz2035.servicetag.utils.context.WebContext;

/**
 * @Description .
 * @author QiSF
 * @date 2014年11月27日
 */
@Controller
@RequestMapping("/admin/userGroupRelUser")
public class UserGroupRelUserController {

	private static final Logger log = Logger.getLogger(UserGroupRelUserController.class);

	@Autowired
	private UserGroupRelUserService userGroupRelUserService;

	/**
	 * 根据分组ID查询用户.
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryUserList", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Paged<UserGroupRelUserVo>> queryUserList(Integer userGroupId, String nickName, Integer pageNo, Integer pageSize) {
		if (ObjectUtil.isEmpty(userGroupId))
			return Response.getFailedResponse("分组ID不能为空!");
		if (ObjectUtil.isEmpty(pageNo))
			return Response.getFailedResponse("pageNo不能为空!");
		if (ObjectUtil.isEmpty(pageSize))
			return Response.getFailedResponse("pageSize不能为空!");
		try {
			Paged<UserGroupRelUserVo> paged = userGroupRelUserService.queryUserList(userGroupId, nickName, pageNo, pageSize);
			return Response.getSuccessResponse(paged);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 移动用户到相应分组.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	@ResponseBody
	@RequestMapping(value = "/addUserToGroup", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Boolean> addUserToGroup(Integer serviceTagId, Integer newGroupId, Long userIds[]) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return Response.getFailedResponse("服务号ID不能为空!");
		if (ObjectUtil.isEmpty(newGroupId))
			return Response.getFailedResponse("新分组ID不能为空!");
		if (ObjectUtil.isEmpty(userIds))
			return Response.getFailedResponse("用户ID不能为空!");
		try {
			boolean flag = userGroupRelUserService.transAddUserToGroup(serviceTagId, newGroupId, userIds);
			log.info("用户[：" + WebContext.getLoginUserId() + "]移动用户[" + userIds.toString() + "]到分组[" + newGroupId + "]");
			return Response.getSuccessResponse(flag);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 添加用户进黑名单.
	 * 
	 * @author QiSF
	 * @date 2014年12月9日
	 */
	@ResponseBody
	@RequestMapping(value = "/moveToBlack", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Boolean> moveToBlack(Integer serviceTagId, Long userId) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return Response.getFailedResponse("服务号ID不能为空!");
		if (ObjectUtil.isEmpty(userId))
			return Response.getFailedResponse("用户ID不能为空!");
		try {
			boolean flag = userGroupRelUserService.moveToBlack(serviceTagId, userId);
			log.info("用户[：" + WebContext.getLoginUserId() + "]移动用户[" + userId + "]进黑名单!");
			return Response.getSuccessResponse(flag);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 移除用户出黑名单.
	 * 
	 * @author QiSF
	 * @date 2014年12月9日
	 */
	@ResponseBody
	@RequestMapping(value = "/moveOutBlack", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Boolean> moveOutBlack(Integer serviceTagId, Long userId) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return Response.getFailedResponse("服务号ID不能为空!");
		if (ObjectUtil.isEmpty(userId))
			return Response.getFailedResponse("用户ID不能为空!");
		try {
			boolean flag = userGroupRelUserService.moveOutBlack(serviceTagId, userId);
			log.info("用户[：" + WebContext.getLoginUserId() + "]移动用户[" + userId + "]出黑名单!");
			return Response.getSuccessResponse(flag);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}
}
