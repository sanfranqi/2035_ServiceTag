package com.cyou.fz2035.servicetag.groupmessage.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.groupmessage.service.GroupMessageService;
import com.cyou.fz2035.servicetag.groupmessage.vo.GroupMessageVo;

/**
 * 
 * @Description .
 * @author QiSF
 * @date 2015年3月5日
 */
@Controller
@RequestMapping("/admin/groupMessage")
public class GroupMessageController {

	@Autowired
	private GroupMessageService groupMessageService;

	/**
	 * 根据服务号ID分页查询群发消息.
	 * 
	 * @author QiSF
	 * @date 2015年3月5日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryGroupMessageList", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Paged<GroupMessageVo>> queryGroupMessageList(Integer serviceTagId, String content, Integer pageNo, Integer pageSize) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return Response.getFailedResponse("服务号ID不能为空!");
		if (ObjectUtil.isEmpty(pageNo))
			return Response.getFailedResponse("pageNo不能为空!");
		if (ObjectUtil.isEmpty(pageSize))
			return Response.getFailedResponse("pageSize不能为空!");
		try {
			Paged<GroupMessageVo> paged = groupMessageService.queryGroupMessageList(serviceTagId, content, pageNo, pageSize);
			return Response.getSuccessResponse(paged);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 根据服务号ID群发消息.
	 * 
	 * @author QiSF
	 * @date 2015年3月5日
	 */
	@ResponseBody
	@RequestMapping(value = "/sendGroupMessage", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Boolean> sendGroupMessage(Integer serviceTagId, String content, Integer userGroupId) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return Response.getFailedResponse("服务号ID不能为空!");
		if (ObjectUtil.isEmpty(content))
			return Response.getFailedResponse("消息内容不能为空!");
		if (ObjectUtil.isEmpty(userGroupId))
			return Response.getFailedResponse("用户分组不能为空!");
		try {
			return Response.getSuccessResponse(groupMessageService.sendGroupMessage(serviceTagId, content, userGroupId));
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 根据消息ID查询消息明细.
	 * 
	 * @author QiSF
	 * @date 2015年3月5日
	 */
	@ResponseBody
	@RequestMapping(value = "/getMessageDetail", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<GroupMessageVo> getMessageDetail(Integer messageId) {
		if (ObjectUtil.isEmpty(messageId))
			return Response.getFailedResponse("消息ID不能为空!");
		try {
			return Response.getSuccessResponse(groupMessageService.getMessageDetail(messageId));
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 消息重发.
	 * 
	 * @author QiSF
	 * @date 2015年3月6日
	 */
	@ResponseBody
	@RequestMapping(value = "/sendMessageAgain", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Boolean> sendMessageAgain(Integer messageId) {
		if (ObjectUtil.isEmpty(messageId))
			return Response.getFailedResponse("消息ID不能为空!");
		try {
			return Response.getSuccessResponse(groupMessageService.sendMessageAgain(messageId));
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

}
