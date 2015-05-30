package com.cyou.fz2035.servicetag.messagebox.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.collections.iterators.ArrayListIterator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Query;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.service.BaseService;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.mc.api.model.FullMsg;
import com.cyou.fz2035.mc.api.service.MCDubboService;
import com.cyou.fz2035.servicetag.cached.UserCachedHandler;
import com.cyou.fz2035.servicetag.messagebox.bean.MessageBox;
import com.cyou.fz2035.servicetag.messagebox.vo.MessageBoxVo;
import com.cyou.fz2035.servicetag.replymessage.service.ReplyMessageService;
import com.cyou.fz2035.servicetag.replymessage.vo.ReplyMessageVo;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.utils.ListUtils;
import com.cyou.fz2035.servicetag.utils.UnCaughtException;
import com.cyou.fz2035.servicetag.utils.bean.ServiceTagIdUtil;
import com.cyou.fz2035.servicetag.utils.data.DateUtil;

/**
 * @Description .
 * @author QiSF
 * @date 2014年11月28日
 */
@Service
public class MessageBoxService extends BaseService<MessageBox> {

	@Autowired
	private UserGroupRelUserService userGroupRelUserService;
	@Autowired
	private MCDubboService mcDubboService;
	@Autowired
	private ReplyMessageService replyMessageService;

	/**
	 * 添加消息.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	public Boolean addMessage(Integer serviceTagId, String serviceType, Long sendUserId, String content) {
		if (userGroupRelUserService.validIsInblack(serviceTagId, sendUserId)) {
			return true;
		}
		MessageBox messageBox = new MessageBox();
		messageBox.setServiceTagId(serviceTagId);
		// messageBox.setServiceType(serviceType);
		messageBox.setSendUserId(sendUserId);
		messageBox.setContent(content);
		messageBox.setReceiveTime(System.currentTimeMillis());
		this.insert(messageBox);
		return true;
	}

	/**
	 * 分页查询消息列表.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	public Paged<MessageBoxVo> queryMessageList(Integer serviceTagId, String serviceType, String content, Long startTime, Long endTime, Integer pageNo, Integer pageSize) {
		Paged<MessageBoxVo> paged = new Paged<MessageBoxVo>(null, 0, pageNo, pageSize);
		Query query = Query.build(MessageBox.class);
		query.addEq("serviceTagId", serviceTagId);
		// query.addEq("serviceType", serviceType);
		// query.addLike("content", content);
		query.addBetween("receiveTime", startTime, endTime);
		paged.setTotalHit(this.count(query));
		query.setPaged(pageNo, pageSize);
		List<MessageBox> messageBoxList = this.findByQuery(query);
		List<MessageBoxVo> messageBoxVoList = new ArrayList<MessageBoxVo>();
		for (MessageBox messageBox : messageBoxList) {
			MatrixUserInfo matrixUserInfo = UserCachedHandler.getMatrixUserInfo(messageBox.getSendUserId());
			MessageBoxVo messageBoxVo = new MessageBoxVo();
			messageBoxVo.setId(String.valueOf(messageBox.getId()));
			messageBoxVo.setServiceTagId(messageBox.getServiceTagId());
			// messageBoxVo.setServiceTypeName(ServiceTypeEnum.valueTextOfCode(messageBox.getServiceType()));
			messageBoxVo.setSendUserId(messageBox.getSendUserId());
			messageBoxVo.setReceiveTime(String.valueOf(messageBox.getReceiveTime()));
			messageBoxVo.setContent(messageBox.getContent());
			messageBoxVo.setUserName(matrixUserInfo.getFullName());
			messageBoxVo.setCellphone("*******" + messageBox.getSendUserId().toString().substring(7));
			messageBoxVoList.add(messageBoxVo);
		}
		paged.setListData(messageBoxVoList);
		return paged;
	}

	/**
	 * 查询消息明细.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	public MessageBoxVo queryMessageDetail(Integer messageId) {
		MessageBox messageBox = this.get(messageId);
		if (ObjectUtil.isEmpty(messageBox)) {
			throw new UnCaughtException("消息不存在!");
		}
		MessageBoxVo messageBoxVo = ObjectUtil.convertObj(messageBox, MessageBoxVo.class);
		MatrixUserInfo matrixUserInfo = UserCachedHandler.getMatrixUserInfo(messageBoxVo.getSendUserId());
		messageBoxVo.setUserName(matrixUserInfo.getFullName());
		messageBoxVo.setIsInBlack(userGroupRelUserService.validIsInblack(messageBoxVo.getServiceTagId(), messageBoxVo.getSendUserId()));
		return messageBoxVo;
	}

	/**
	 * 从消息中心获取消息列表.
	 * 
	 * @author QiSF
	 * @date 2015年1月15日
	 */
	public Paged<MessageBoxVo> queryMessageListFromMC(Integer serviceTagId, Long startTime, Long endTime, Integer pageNo, Integer pageSize) {
		Paged<MessageBoxVo> paged = new Paged<MessageBoxVo>(null, 0, pageNo, pageSize);
		List<FullMsg> fullMsgList = mcDubboService.queryFullMsgsByTypeAndTime(ServiceTagIdUtil.convertToOuterId(serviceTagId) + "", startTime, endTime, pageNo, pageSize,
				ListUtils.list2String(userGroupRelUserService.queryBlackList(serviceTagId), ","));

		List<ReplyMessageVo> replyMessageList = new ArrayList<ReplyMessageVo>();
		if (!ObjectUtil.isEmpty(fullMsgList)) {
			long startTimeMsg = DateUtil.getDate(fullMsgList.get(0).getTime(), DateUtil.ISO_DATE_TIME_FORMAT);
			long endTimeMsg = DateUtil.getDate(fullMsgList.get(fullMsgList.size() - 1).getTime(), DateUtil.ISO_DATE_TIME_FORMAT);
			replyMessageList = replyMessageService.queryReplyMessageListByTime(serviceTagId, startTimeMsg, endTimeMsg);
		}

		List<MessageBoxVo> messageBoxVoList = new ArrayList<MessageBoxVo>();
		for (FullMsg fullMsg : fullMsgList) {
			Iterator<ReplyMessageVo> iterator = new ArrayListIterator(replyMessageList.toArray());
			MessageBoxVo messageBoxVo = new MessageBoxVo();
			messageBoxVo.setId(fullMsg.getId());
			messageBoxVo.setServiceTagId(serviceTagId);
			messageBoxVo.setSendUserId(Long.parseLong(fullMsg.getPhone()));
			messageBoxVo.setReceiveTime(fullMsg.getTime());
			messageBoxVo.setContent(fullMsg.getContent());
			messageBoxVo.setUserName(fullMsg.getUserName());
			messageBoxVo.setCellphone("*******" + fullMsg.getPhone().toString().substring(7));
			messageBoxVo.setIsInBlack(userGroupRelUserService.validIsInblack(messageBoxVo.getServiceTagId(), messageBoxVo.getSendUserId()));

			List<ReplyMessageVo> list = new ArrayList<ReplyMessageVo>();
			while (iterator.hasNext()) {
				ReplyMessageVo replyMessageVo = iterator.next();
				if (replyMessageVo.getMessageId().equals(fullMsg.getId())) {
					list.add(replyMessageVo);
					replyMessageList.remove(replyMessageVo);
				}
			}

			messageBoxVo.setReplyMessageList(list);
			messageBoxVoList.add(messageBoxVo);
		}
		paged.setListData(messageBoxVoList);
		return paged;
	}

	/**
	 * 从消息中心获取消息明细.
	 * 
	 * @author QiSF
	 * @date 2015年1月15日
	 */
	public MessageBoxVo queryDetailMessageFromMC(String messageId) {
		List<FullMsg> fullMsgList = mcDubboService.queryDetail(messageId.substring(0, 11), messageId.substring(11, messageId.length() - 19), messageId, 1);
		if (ObjectUtil.isEmpty(fullMsgList)) {
			throw new UnCaughtException("消息不存在!");
		}
		MessageBoxVo messageBoxVo = new MessageBoxVo();
		FullMsg fullMsg = fullMsgList.get(0);
		messageBoxVo.setId(fullMsg.getId());
		messageBoxVo.setServiceTagId(ServiceTagIdUtil.convertToInnerId(Long.parseLong(fullMsg.getSystem())));
		// messageBoxVo.setServiceTypeName(ServiceTypeEnum.valueTextOfCode(messageBox.getServiceType()));
		messageBoxVo.setSendUserId(Long.parseLong(fullMsg.getPhone()));
		messageBoxVo.setReceiveTime(fullMsg.getTime());
		messageBoxVo.setContent(fullMsg.getContent());
		messageBoxVo.setUserName(fullMsg.getUserName());
		messageBoxVo.setCellphone("*******" + fullMsg.getPhone().toString().substring(7));
		messageBoxVo.setIsInBlack(userGroupRelUserService.validIsInblack(messageBoxVo.getServiceTagId(), messageBoxVo.getSendUserId()));
		return messageBoxVo;
	}
}
