package com.cyou.fz2035.servicetag.groupmessage.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Query;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.service.BaseService;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.mc.api.model.FullMsg;
import com.cyou.fz2035.mc.api.model.SortMsg;
import com.cyou.fz2035.mc.api.service.MCDubboService;
import com.cyou.fz2035.servicetag.cached.UserCachedHandler;
import com.cyou.fz2035.servicetag.groupmessage.bean.GroupMessage;
import com.cyou.fz2035.servicetag.groupmessage.vo.GroupMessageVo;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.usergroup.bean.UserGroup;
import com.cyou.fz2035.servicetag.usergroup.service.UserGroupService;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.utils.UnCaughtException;
import com.cyou.fz2035.servicetag.utils.bean.ServiceTagIdUtil;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.context.WebContext;

/**
 * 
 * @Description .
 * @author QiSF
 * @date 2015年3月5日
 */
@Service
public class GroupMessageService extends BaseService<GroupMessage> {

	@Autowired
	private UserGroupRelUserService userGroupRelUserService;
	@Autowired
	private UserGroupService userGroupService;
	@Autowired
	private ServiceTagService serviceTagService;

	private MCDubboService mcDubboService = ApplicationContextUtil.getBean(MCDubboService.class);

	/**
	 * 根据服务号ID分页查询群发消息.
	 * 
	 * @author QiSF
	 * @date 2015年3月5日
	 */
	public Paged<GroupMessageVo> queryGroupMessageList(Integer serviceTagId, String content, Integer pageNo, Integer pageSize) {
		Query query = Query.build(GroupMessage.class);
		query.addEq("serviceTagId", serviceTagId);
		query.addLike("content", content);
		query.addEq("sendFlag", Boolean.TRUE);
		int count = this.count(query);
		query.setPaged(pageNo, pageSize);
		List<GroupMessage> groupMessageList = this.findByQuery(query);
		List<GroupMessageVo> groupMessageVoList = new ArrayList<GroupMessageVo>();
		groupMessageVoList = ObjectUtil.convertList(groupMessageList, GroupMessageVo.class);
		Paged<GroupMessageVo> paged = new Paged<GroupMessageVo>(groupMessageVoList, count, pageNo, pageSize, true);
		return paged;
	}

	/**
	 * 根据服务号ID群发消息.
	 * 
	 * @author QiSF
	 * @date 2015年3月5日
	 */
	public boolean sendGroupMessage(Integer serviceTagId, String content, Integer userGroupId) {
		List<Long> userIdList = null;
		String purpose = "";
		if (userGroupId == 0) {
			userIdList = userGroupRelUserService.queryUserIdListNotInBlack(serviceTagId);
			purpose = "全部用户";
		} else {
			userIdList = userGroupRelUserService.queryUserIdListByGroupId(userGroupId);
			UserGroup userGroup = userGroupService.get(userGroupId);
			if (ObjectUtil.isEmpty(userGroup)) {
				throw new UnCaughtException("分组[" + userGroupId + "]不存在!");
			}
			purpose = userGroup.getUserGroupName();
		}
		if (ObjectUtil.isEmpty(userIdList)) {
			if (userGroupId == 0) {
				throw new UnCaughtException("服务号关注的用户数为0，不能群发消息!");
			} else {
				throw new UnCaughtException("分组[" + purpose + "]的用户数为0，不能群发消息!");
			}

		}

		ServiceTag serviceTag = serviceTagService.get(serviceTagId);
		if (ObjectUtil.isEmpty(serviceTag)) {
			throw new UnCaughtException("服务号[" + serviceTagId + "]不存在!");
		}

		long sendTime = System.currentTimeMillis();
		GroupMessage groupMessage = new GroupMessage();
		groupMessage.setPurpose(purpose);
		groupMessage.setContent(content);
		groupMessage.setSendTime(sendTime);
		groupMessage.setServiceTagId(serviceTagId);
		groupMessage.setUserId(WebContext.getLoginUserId());
		groupMessage.setGroupId(userGroupId);
		groupMessage = this.insert(groupMessage);

		FullMsg fullMsg = new FullMsg();
		fullMsg.setBussId("GroupMessage|" + serviceTagId + "|" + groupMessage.getId());
		fullMsg.setType(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		fullMsg.setTitle("");
		fullMsg.setSystem(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		fullMsg.setSystemName(serviceTag.getServiceTagName());
		fullMsg.setViewUrl("");
		fullMsg.setImg(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		fullMsg.setContent(content);
		SortMsg sortMsg = new SortMsg();
		sortMsg.setType(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		sortMsg.setTitle("");
		sortMsg.setSystem(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		sortMsg.setSystemName(serviceTag.getServiceTagName());
		sortMsg.setImg(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		// sortMsg.setSortContent(content);

		String[] userIdArr = new String[userIdList.size()];
		for (int i = 0; i < userIdArr.length; i++) {
			userIdArr[i] = String.valueOf(userIdList.get(i));
		}
		List<String> userNameList = new ArrayList<String>();
		for (Long userId : userIdList) {
			MatrixUserInfo matrixUserInfo = UserCachedHandler.getMatrixUserInfo(userId);
			userNameList.add(matrixUserInfo.getFullName());
		}
		String[] userNameArr = new String[userNameList.size()];
		for (int i = 0; i < userNameArr.length; i++) {
			userNameArr[i] = String.valueOf(userNameList.get(i));
		}
		try {
			mcDubboService.sysInArr(userIdArr, userNameArr, sortMsg, fullMsg);
		} catch (Exception e) {
			groupMessage.setSendFlag(false);
			this.update(groupMessage);

			e.printStackTrace();
			throw new UnCaughtException("消息中心异常!");
		}
		return true;
	}

	/**
	 * 根据消息ID查询消息明细.
	 * 
	 * @author QiSF
	 * @date 2015年3月5日
	 */
	public GroupMessageVo getMessageDetail(Integer messageId) {
		GroupMessageVo messageVo = new GroupMessageVo();
		GroupMessage groupMessage = this.get(messageId);
		if (!ObjectUtil.isEmpty(groupMessage)) {
			messageVo = (GroupMessageVo) ObjectUtil.copyPorperties(groupMessage, messageVo);
		}
		return messageVo;
	}

	/**
	 * 消息重发.
	 * 
	 * @author QiSF
	 * @date 2015年3月6日
	 */
	public boolean sendMessageAgain(Integer messageId) {
		GroupMessage groupMessage = this.get(messageId);
		if (ObjectUtil.isEmpty(groupMessage)) {
			throw new UnCaughtException("消息[" + messageId + "]不存在!");
		}
		int userGroupId = groupMessage.getGroupId();
		int serviceTagId = groupMessage.getServiceTagId();
		String content = groupMessage.getContent();
		List<Long> userIdList = null;
		if (userGroupId == 0) {
			userIdList = userGroupRelUserService.queryUserIdListNotInBlack(serviceTagId);
		} else {
			userIdList = userGroupRelUserService.queryUserIdListByGroupId(userGroupId);
			UserGroup userGroup = userGroupService.get(userGroupId);
			if (ObjectUtil.isEmpty(userGroup)) {
				throw new UnCaughtException("分组[" + userGroupId + "]不存在!");
			}
		}
		if (ObjectUtil.isEmpty(userIdList)) {
			throw new UnCaughtException("服务号关注的用户数为0，不能群发消息!");
		}

		ServiceTag serviceTag = serviceTagService.get(serviceTagId);
		if (ObjectUtil.isEmpty(serviceTag)) {
			throw new UnCaughtException("服务号[" + serviceTagId + "]不存在!");
		}

		FullMsg fullMsg = new FullMsg();
		fullMsg.setBussId("GroupMessage|" + serviceTagId + "|" + groupMessage.getId());
		fullMsg.setType(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		fullMsg.setTitle("");
		fullMsg.setSystem(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		fullMsg.setSystemName(serviceTag.getServiceTagName());
		fullMsg.setViewUrl("");
		fullMsg.setImg(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		fullMsg.setContent(content);
		SortMsg sortMsg = new SortMsg();
		sortMsg.setType(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		sortMsg.setTitle("");
		sortMsg.setSystem(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		sortMsg.setSystemName(serviceTag.getServiceTagName());
		sortMsg.setImg(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)));
		// sortMsg.setSortContent(content);

		String[] userIdArr = new String[userIdList.size()];
		for (int i = 0; i < userIdArr.length; i++) {
			userIdArr[i] = String.valueOf(userIdList.get(i));
		}
		List<String> userNameList = new ArrayList<String>();
		for (Long userId : userIdList) {
			MatrixUserInfo matrixUserInfo = UserCachedHandler.getMatrixUserInfo(userId);
			userNameList.add(matrixUserInfo.getFullName());
		}
		String[] userNameArr = new String[userNameList.size()];
		for (int i = 0; i < userNameArr.length; i++) {
			userNameArr[i] = String.valueOf(userNameList.get(i));
		}
		try {
			mcDubboService.sysInArr(userIdArr, userNameArr, sortMsg, fullMsg);

			groupMessage.setSendFlag(true);
			this.update(groupMessage);
		} catch (Exception e) {
			e.printStackTrace();
			throw new UnCaughtException("消息中心异常!");
		}
		return true;
	}
}
