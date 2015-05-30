package com.cyou.fz2035.servicetag.usergroup.action;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.usergroup.bean.UserGroup;
import com.cyou.fz2035.servicetag.usergroup.service.UserGroupService;
import com.cyou.fz2035.servicetag.usergroup.vo.UserGroupVo;
import com.cyou.fz2035.servicetag.utils.context.WebContext;

/**
 * @Description .
 * @author QiSF
 * @date 2014年11月27日
 */
@Controller
@RequestMapping("/admin/userGroup")
public class UserGroupController {

	private static final Logger log = Logger.getLogger(UserGroupController.class);

	@Autowired
	private UserGroupService userGroupService;

	/**
	 * 根据服务号ID查询分组列表.
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryGroupList", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<List<UserGroupVo>> queryGroupList(Integer serviceTagId) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return Response.getFailedResponse("服务号ID不能为空!");
		try {
			List<UserGroupVo> list = userGroupService.queryGroupVoList(serviceTagId);
			return Response.getSuccessResponse(list);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 添加分组.
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	@ResponseBody
	@RequestMapping(value = "/addGroup", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Boolean> addGroup(Integer serviceTagId, String userGroupName) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return Response.getFailedResponse("服务号ID不能为空!");
		if (ObjectUtil.isEmpty(userGroupName))
			return Response.getFailedResponse("分组名不能为空!");
		try {
			boolean flag = userGroupService.addGroup(serviceTagId, userGroupName, ServiceTagConstants.GROUP_TYPE_CUSTOM);
			log.info("用户[：" + WebContext.getLoginUserId() + "]添加用户分组[" + userGroupName + "]");
			return Response.getSuccessResponse(flag);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 修改分组.
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	@ResponseBody
	@RequestMapping(value = "/editGroup", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Boolean> editGroup(Integer userGroupId, String userGroupName) {
		if (ObjectUtil.isEmpty(userGroupId))
			return Response.getFailedResponse("分组ID不能为空!");
		if (ObjectUtil.isEmpty(userGroupName))
			return Response.getFailedResponse("分组名不能为空!");
		try {
			boolean flag = userGroupService.editGroup(userGroupId, userGroupName);
			log.info("用户[：" + WebContext.getLoginUserId() + "]修改用户分组[" + userGroupId + "]");
			return Response.getSuccessResponse(flag);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 删除分组.
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	@ResponseBody
	@RequestMapping(value = "/delGroup", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Boolean> delGroup(Integer userGroupId) {
		if (ObjectUtil.isEmpty(userGroupId))
			return Response.getFailedResponse("分组ID不能为空!");
		try {
			boolean flag = userGroupService.transDelGroup(userGroupId);
			log.info("用户[：" + WebContext.getLoginUserId() + "]删除用户分组[" + userGroupId + "]");
			return Response.getSuccessResponse(flag);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 根据服务号ID查询分组列表.(除了黑名单组)
	 * 
	 * @return
	 * @author QiSF
	 * @date 2015年3月5日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryGroupListExceptBlack", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<List<UserGroupVo>> queryGroupListExceptBlack(Integer serviceTagId) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return Response.getFailedResponse("服务号ID不能为空!");
		try {
			List<UserGroup> userGroupList = userGroupService.queryGroupListExceptBlack(serviceTagId);
			List<UserGroupVo> list = ObjectUtil.convertList(userGroupList, UserGroupVo.class);
			return Response.getSuccessResponse(list);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}
}
