package com.cyou.fz2035.servicetag.replymessage.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Query;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.service.BaseService;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.mc.api.model.FullMsg;
import com.cyou.fz2035.mc.api.service.MCDubboService;
import com.cyou.fz2035.servicetag.cached.UserCachedHandler;
import com.cyou.fz2035.servicetag.replymessage.bean.ReplyMessage;
import com.cyou.fz2035.servicetag.replymessage.vo.ReplyMessageVo;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.usergroup.service.UserGroupService;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.utils.UnCaughtException;
import com.cyou.fz2035.servicetag.utils.bean.ServiceTagIdUtil;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import com.cyou.fz2035.servicetag.utils.data.DateUtil;

/**
 * 
 * @Description .
 * @author QiSF
 * @date 2015年3月6日
 */
@Service
public class ReplyMessageService extends BaseService<ReplyMessage> {

	@Autowired
	private UserGroupRelUserService userGroupRelUserService;
	@Autowired
	private UserGroupService userGroupService;
	@Autowired
	private ServiceTagService serviceTagService;

	private MCDubboService mcDubboService = ApplicationContextUtil.getBean(MCDubboService.class);

	/**
	 * 回复用户消息.
	 * 
	 * @author QiSF
	 * @date 2015年3月6日
	 */
	public boolean replyMessage(Integer serviceTagId, String content, String messageId, String userSendTime, Long receiveUserId) {

		if (!userGroupRelUserService.validUserIsInGroup(serviceTagId, receiveUserId)) {
			throw new UnCaughtException("用户已经不再关注服务号!");
		}

		long replyTime = System.currentTimeMillis();
		ReplyMessage replyMessage = new ReplyMessage();
		replyMessage.setServiceTagId(serviceTagId);
		replyMessage.setUserSendTime(DateUtil.getDate(userSendTime, DateUtil.ISO_DATE_TIME_FORMAT));
		replyMessage.setMessageId(messageId);
		replyMessage.setReplyContent(content);
		replyMessage.setReplyTime(replyTime);
		replyMessage.setUserId(WebContext.getLoginUserId());
		replyMessage.setReceiveUserId(receiveUserId);
		replyMessage = this.insert(replyMessage);

		ServiceTag serviceTag = serviceTagService.get(serviceTagId);
		if (ObjectUtil.isEmpty(serviceTag)) {
			throw new UnCaughtException("服务号[" + serviceTagId + "]不存在!");
		}

		MatrixUserInfo matrixUserInfo = UserCachedHandler.getMatrixUserInfo(receiveUserId);

		FullMsg fullMsg = new FullMsg();
		fullMsg.setBussId("ReplyMessage|" + serviceTagId + "|" + replyMessage.getId());
		fullMsg.setType(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		fullMsg.setTitle("");
		fullMsg.setSystem(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		fullMsg.setSystemName(serviceTag.getServiceTagName());
		fullMsg.setViewUrl("");
		fullMsg.setImg(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		fullMsg.setContent(content);
		fullMsg.setPhone(receiveUserId + "");
		fullMsg.setUserName(matrixUserInfo.getFullName());

		try {
			mcDubboService.sysIn(fullMsg);
		} catch (Exception e) {
			replyMessage.setSendFlag(Boolean.FALSE);
			this.update(replyMessage);

			e.printStackTrace();
			throw new UnCaughtException("消息中心异常!");
		}
		return true;
	}

	/**
	 * 根据时间段查询回复的消息列表
	 * 
	 * @author QiSF
	 * @date 2015年3月6日
	 */
	public List<ReplyMessageVo> queryReplyMessageListByTime(Integer serviceTagId, Long startTime, Long endTime) {
		Query query = Query.build(ReplyMessage.class);
		query.addEq("serviceTagId", serviceTagId);
		query.addEq("sendFlag", Boolean.TRUE);
		query.addBetween("userSendTime", startTime, endTime);
		query.addOrder("replyTime", Query.DBOrder.ASC);
		List<ReplyMessage> replyMessages = this.findByQuery(query);
		List<ReplyMessageVo> replyMessageList = new ArrayList<ReplyMessageVo>();
		replyMessageList = ObjectUtil.convertList(replyMessages, ReplyMessageVo.class);
		return replyMessageList;
	}

}
