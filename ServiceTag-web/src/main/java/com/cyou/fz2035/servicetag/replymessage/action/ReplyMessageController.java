package com.cyou.fz2035.servicetag.replymessage.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.replymessage.service.ReplyMessageService;

/**
 * 
 * @Description .
 * @author QiSF
 * @date 2015年3月6日
 */
@Controller
@RequestMapping("/admin/replyMessage")
public class ReplyMessageController {

	@Autowired
	private ReplyMessageService replyMessageService;

	/**
	 * 回复用户消息.
	 * 
	 * @author QiSF
	 * @date 2015年3月6日
	 */
	@ResponseBody
	@RequestMapping(value = "/replyMessage", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Boolean> replyMessage(Integer serviceTagId, String content, String messageId, String userSendTime, Long receiveUserId) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return Response.getFailedResponse("服务号ID不能为空!");
		if (ObjectUtil.isEmpty(content))
			return Response.getFailedResponse("回复内容不能为空!");
		if (ObjectUtil.isEmpty(messageId))
			return Response.getFailedResponse("消息ID不能为空!");
		if (ObjectUtil.isEmpty(userSendTime))
			return Response.getFailedResponse("消息时间不能为空!");
		try {
			return Response.getSuccessResponse(replyMessageService.replyMessage(serviceTagId, content, messageId, userSendTime, receiveUserId));
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

}
