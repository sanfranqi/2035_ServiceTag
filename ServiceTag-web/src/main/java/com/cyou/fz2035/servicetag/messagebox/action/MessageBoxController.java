package com.cyou.fz2035.servicetag.messagebox.action;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.messagebox.service.MessageBoxService;
import com.cyou.fz2035.servicetag.messagebox.vo.MessageBoxVo;

/**
 * @Description .
 * @author QiSF
 * @date 2014年11月28日
 */
@Controller
@RequestMapping("/admin/messageBox")
public class MessageBoxController {

	private static final Logger log = Logger.getLogger(MessageBoxController.class);

	@Autowired
	private MessageBoxService messageBoxService;

	/**
	 * 添加消息.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	@ResponseBody
	@RequestMapping(value = "/addMessage", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Boolean> addMessage(Integer serviceTagId, String serviceType, Long sendUserId, String content) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return Response.getFailedResponse("服务号ID不能为空!");
		// if (ObjectUtil.isEmpty(serviceType))
		// return Response.getFailedResponse("消息类型不能为空!");
		if (ObjectUtil.isEmpty(sendUserId))
			return Response.getFailedResponse("发送用户ID不能为空!");
		if (ObjectUtil.isEmpty(content))
			return Response.getFailedResponse("内容不能为空!");
		try {
			return Response.getSuccessResponse(messageBoxService.addMessage(serviceTagId, serviceType, sendUserId, content));
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 分页查询消息列表.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryMessageList", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Paged<MessageBoxVo>> queryMessageList(Integer serviceTagId, String serviceType, String content, Long startTime, Long endTime, Integer pageNo, Integer pageSize) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return Response.getFailedResponse("服务号ID不能为空!");
		if (ObjectUtil.isEmpty(pageNo))
			return Response.getFailedResponse("pageNo不能为空!");
		if (ObjectUtil.isEmpty(pageSize))
			return Response.getFailedResponse("pageSize不能为空!");
		try {
			return Response.getSuccessResponse(messageBoxService.queryMessageListFromMC(serviceTagId, startTime, endTime, pageNo, pageSize));
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 查询消息明细.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryMessageDetail", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<MessageBoxVo> queryMessageDetail(String messageId) {
		if (ObjectUtil.isEmpty(messageId))
			return Response.getFailedResponse("消息ID不能为空!");
		try {
			return Response.getSuccessResponse(messageBoxService.queryDetailMessageFromMC(messageId));
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}
}
