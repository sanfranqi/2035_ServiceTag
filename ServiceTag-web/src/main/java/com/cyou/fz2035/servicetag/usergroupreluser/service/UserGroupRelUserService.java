package com.cyou.fz2035.servicetag.usergroupreluser.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Query;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.service.BaseService;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.services.calendar.api.service.ICalendarDubbo;
import com.cyou.fz2035.servicetag.cached.UserCachedHandler;
import com.cyou.fz2035.servicetag.focustime.service.FocusTimeService;
import com.cyou.fz2035.servicetag.quest.service.QuestService;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.usergroup.bean.UserGroup;
import com.cyou.fz2035.servicetag.usergroup.service.UserGroupService;
import com.cyou.fz2035.servicetag.usergroupreluser.action.UserGroupRelUserController;
import com.cyou.fz2035.servicetag.usergroupreluser.bean.UserGroupRelUser;
import com.cyou.fz2035.servicetag.usergroupreluser.dao.UserGroupRelUserDAO;
import com.cyou.fz2035.servicetag.usergroupreluser.vo.UserGroupRelUserVo;
import com.cyou.fz2035.servicetag.utils.ListUtils;
import com.cyou.fz2035.servicetag.utils.UnCaughtException;
import com.cyou.fz2035.servicetag.utils.bean.ServiceTagIdUtil;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.task.rpc.api.ITaskService;

/**
 * @Description .
 * @author QiSF
 * @date 2014年11月27日
 */
@Service
public class UserGroupRelUserService extends BaseService<UserGroupRelUser> {

	private static final Logger log = Logger.getLogger(UserGroupRelUserController.class);

	@Autowired
	private UserGroupService userGroupService;
	@Autowired
	private UserGroupRelUserDAO userGroupRelUserDAO;
	@Autowired
	private FocusTimeService focusTimeService;
	@Autowired
	private QuestService questService;

	private ICalendarDubbo calendarSoaService = ApplicationContextUtil.getBean("calendarSoaService");

	private ITaskService taskService = ApplicationContextUtil.getBean("taskService");

	/**
	 * 根据分组ID统计关注用户数.
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	public int countUserByGroupId(Integer userGroupId) {
		Query query = Query.build(UserGroupRelUser.class);
		query.addEq("userGroupId", userGroupId);
		return this.count(query);
	}

	/**
	 * 删除分组后，将原组用户移至好友组
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	public boolean replaceGroupId(Integer userGroupId, Integer newGroupId) {
		return userGroupRelUserDAO.replaceGroupId(userGroupId, newGroupId);
	}

	/**
	 * 根据分组ID分页查询用户.
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	public Paged<UserGroupRelUserVo> queryUserList(Integer userGroupId, Integer pageNo, Integer pageSize) {
		Paged<UserGroupRelUserVo> paged = new Paged<UserGroupRelUserVo>(null, 0, pageNo, pageSize);
		Query query = Query.build(UserGroupRelUser.class);
		query.addEq("userGroupId", userGroupId);
		paged.setTotalHit(this.count(query));
		query.setPaged(pageNo, pageSize);
		List<UserGroupRelUser> userGroupRelUserList = this.findByQuery(query);
		List<UserGroupRelUserVo> userGroupRelUserVoList = ObjectUtil.convertList(userGroupRelUserList, UserGroupRelUserVo.class);
		for (UserGroupRelUserVo userGroupRelUserVo : userGroupRelUserVoList) {
			MatrixUserInfo matrixUserInfo = UserCachedHandler.getMatrixUserInfo(userGroupRelUserVo.getUserId());
			userGroupRelUserVo.setUserName(matrixUserInfo.getFullName());
			userGroupRelUserVo.setCellphone("*******" + userGroupRelUserVo.getUserId().toString().substring(7));
			// userGroupRelUserVo.setUserGroupName(userGroupService.get(userGroupId).getUserGroupName());
		}
		paged.setListData(userGroupRelUserVoList);
		return paged;
	}

	/**
	 * 根据分组ID、用户昵称分页查询用户.
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	public Paged<UserGroupRelUserVo> queryUserList(Integer userGroupId, String nickName, Integer pageNo, Integer pageSize) {
		if (ObjectUtil.isEmpty(nickName)) {
			return this.queryUserList(userGroupId, pageNo, pageSize);
		}
		Query query = Query.build(UserGroupRelUser.class);
		query.addEq("userGroupId", userGroupId);
		List<UserGroupRelUser> userGroupRelUserList = this.findByQuery(query);
		List<UserGroupRelUserVo> userGroupRelUserVoList = new ArrayList<UserGroupRelUserVo>();
		for (UserGroupRelUser userGroupRelUser : userGroupRelUserList) {
			MatrixUserInfo matrixUserInfo = UserCachedHandler.getMatrixUserInfo(userGroupRelUser.getUserId());
			String userName = matrixUserInfo.getFullName();
			if (!ObjectUtil.isEmpty(userName) && userName.contains(nickName)) {
				UserGroupRelUserVo userGroupRelUserVo = ObjectUtil.convertObj(userGroupRelUser, UserGroupRelUserVo.class);
				userGroupRelUserVo.setUserName(userName);
				userGroupRelUserVo.setCellphone("*******" + userGroupRelUserVo.getUserId().toString().substring(7));
				userGroupRelUserVoList.add(userGroupRelUserVo);
			}
		}
		Paged<UserGroupRelUserVo> paged = new Paged<UserGroupRelUserVo>(userGroupRelUserVoList, userGroupRelUserVoList.size(), pageNo, pageSize, true);
		return paged;
	}

	/**
	 * 移动用户到相应分组.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	public boolean transAddUserToGroup(Integer serviceTagId, Integer newGroupId, Long userIds[]) {
		for (Long userId : userIds) {
			UserGroup userGroup = userGroupService.findGroupByServiceTagIdAndUserId(serviceTagId, userId);
			if (ObjectUtil.isEmpty(userGroup)) {
				throw new UnCaughtException("该用户不在某一分组中");
			}
			int userGroupId = userGroup.getId();
			userGroupRelUserDAO.addUserToGroup(userGroupId, newGroupId, userId);
		}
		return true;
	}

	/**
	 * 用户关注.
	 * 
	 * @author QiSF
	 * @throws Exception
	 * @date 2014年11月28日
	 */
	public boolean transFocusServiceTag(Integer serviceTagId, Long userId) throws Exception {
		if (!this.validUserIsInGroup(serviceTagId, userId)) {
			int friendGroupId = userGroupService.findFriendGroupByServiceTagId(serviceTagId);
			long focusTime = System.currentTimeMillis();
			UserGroupRelUser userGroupRelUser = new UserGroupRelUser();
			userGroupRelUser.setUserId(userId);
			userGroupRelUser.setUserGroupId(friendGroupId);
			userGroupRelUser.setFocusTime(focusTime);
			this.insert(userGroupRelUser);
			focusTimeService.addFocusTime(serviceTagId, userId, focusTime);
			try {
				calendarSoaService.addSendee(ServiceTagIdUtil.convertToOuterId(serviceTagId), userId, focusTime);
			} catch (Exception e) {
				log.error("用户[" + userId + "]关注服务号[" + serviceTagId + "]，调用日程接口异常：" + e.getMessage());
			}
			try {
				questService.updateFocus(1, ServiceTagIdUtil.convertToOuterId(serviceTagId));
			} catch (Exception e) {
				log.error("用户[" + userId + "]关注服务号[" + serviceTagId + "]，调用问卷接口异常：" + e.getMessage());
			}
			try {
				taskService.reFollowServiceNo(ServiceTagIdUtil.convertToOuterId(serviceTagId), userId);
			} catch (Exception e) {
				log.error("用户[" + userId + "]关注服务号[" + serviceTagId + "]，调用任务接口异常：" + e.getMessage());
			}
		} else {
			throw new UnCaughtException("您已经关注过该服务号!");
		}
		return true;
	}

	/**
	 * 用户批量关注.
	 * 
	 * @author QiSF
	 * @date 2015年1月4日
	 */
	public boolean focusServiceTagList(String serviceTagIds, Long userId) {
		String[] serviceTagIdArr = serviceTagIds.split(",");
		for (String temp : serviceTagIdArr) {
			try {
				Long serviceTagId = Long.valueOf(temp);
				this.transFocusServiceTag(ServiceTagIdUtil.convertToInnerId(serviceTagId), userId);
			} catch (Exception e) {
				continue;
			}
		}
		return true;
	}

	/**
	 * 取消关注.
	 * 
	 * @author QiSF
	 * @throws Exception
	 * @date 2014年11月28日
	 */
	public boolean transCancelFocus(Integer serviceTagId, Long userId) throws Exception {
		List<UserGroup> userGroupList = userGroupService.queryGroupList(serviceTagId);
		boolean flag = false;
		for (UserGroup userGroup : userGroupList) {
			UserGroupRelUser temp = this.queryUserRel(userGroup.getId(), userId);
			if (!ObjectUtil.isEmpty(temp)) {
				this.delete(temp.getId());
				flag = true;
			}
		}
		if (flag) {
			focusTimeService.endFocusTime(serviceTagId, userId);
			try {
				calendarSoaService.deleteSendee(ServiceTagIdUtil.convertToOuterId(serviceTagId), userId, System.currentTimeMillis());
			} catch (Exception e) {
				log.error("用户[" + userId + "]取消关注服务号[" + serviceTagId + "]，调用日程接口异常：" + e.getMessage());
			}
			try {
				questService.updateFocus(2, ServiceTagIdUtil.convertToOuterId(serviceTagId));
			} catch (Exception e) {
				log.error("用户[" + userId + "]取消关注服务号[" + serviceTagId + "]，调用问卷接口异常：" + e.getMessage());
			}
			try {
				taskService.cancelFollowServiceNo(ServiceTagIdUtil.convertToOuterId(serviceTagId), userId);
			} catch (Exception e) {
				log.error("用户[" + userId + "]取消关注服务号[" + serviceTagId + "]，调用任务接口异常：" + e.getMessage());
			}
		}
		return true;
	}

	/**
	 * 根据分组ID获取所有用户.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	public List<UserGroupRelUser> queryUserByGroupId(Integer userGroupId) {
		Query query = Query.build(UserGroupRelUser.class);
		query.addEq("userGroupId", userGroupId);
		List<UserGroupRelUser> userGroupRelUserList = this.findByQuery(query);
		return userGroupRelUserList;
	}

	/**
	 * 根据分组ID获取所有用户ID列表.
	 * 
	 * @author QiSF
	 * @date 2015年3月5日
	 */
	public List<Long> queryUserIdListByGroupId(Integer userGroupId) {
		List<Long> userIdList = new ArrayList<Long>();
		List<UserGroupRelUser> userGroupRelUserList = this.queryUserByGroupId(userGroupId);
		if (userGroupRelUserList != null && userGroupRelUserList.size() != 0) {
			for (UserGroupRelUser userGroupRelUser : userGroupRelUserList) {
				userIdList.add(userGroupRelUser.getUserId());
			}
		}
		return userIdList;
	}

	/**
	 * 获取服务号里不在黑名单里所有用户ID.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	public List<Long> queryUserIdListNotInBlack(Integer serviceTagId) {
		List<Long> userIdList = new ArrayList<Long>();
		List<UserGroup> userGroupList = userGroupService.queryGroupListExceptBlack(serviceTagId);
		for (UserGroup userGroup : userGroupList) {
			List<UserGroupRelUser> userGroupRelUserList = this.queryUserByGroupId(userGroup.getId());
			if (userGroupRelUserList != null && userGroupRelUserList.size() != 0) {
				for (UserGroupRelUser userGroupRelUser : userGroupRelUserList) {
					userIdList.add(userGroupRelUser.getUserId());
				}
			}
		}
		return userIdList;
	}

	/**
	 * 获取服务号黑名单用户ID.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	public List<Long> queryBlackList(Integer serviceTagId) {
		List<Long> userIdList = new ArrayList<Long>();
		int userGroupId = userGroupService.findBlackGroupByServiceTagId(serviceTagId);
		List<UserGroupRelUser> userGroupRelUserList = this.queryUserByGroupId(userGroupId);
		if (userGroupRelUserList != null && userGroupRelUserList.size() != 0) {
			for (UserGroupRelUser userGroupRelUser : userGroupRelUserList) {
				userIdList.add(userGroupRelUser.getUserId());
			}
		}
		return userIdList;
	}

	public Long[] queryUserIdNotInBlack(Integer serviceTagId) {
		List<UserGroup> userGroupList = userGroupService.queryGroupListExceptBlack(serviceTagId);
		for (UserGroup userGroup : userGroupList) {
			List<UserGroupRelUser> userGroupRelUserList = this.queryUserByGroupId(userGroup.getId());
			if (userGroupRelUserList != null && userGroupRelUserList.size() != 0) {
				int i = 0;
				Long[] userIdList = new Long[userGroupRelUserList.size()];
				for (UserGroupRelUser userGroupRelUser : userGroupRelUserList) {
					userIdList[i] = userGroupRelUser.getUserId();
					i++;
				}
				return userIdList;
			}
		}
		return null;
	}

	/**
	 * 添加用户进黑名单.
	 * 
	 * @author QiSF
	 * @date 2014年12月9日
	 */
	public boolean moveToBlack(Integer serviceTagId, Long userId) {
		int blackGroupId = userGroupService.findBlackGroupByServiceTagId(serviceTagId);
		UserGroup userGroup = userGroupService.findGroupByServiceTagIdAndUserId(serviceTagId, userId);
		if (ObjectUtil.isEmpty(userGroup)) {
			throw new UnCaughtException("该用户不在某一分组中");
		}
		int userGroupId = userGroup.getId();
		userGroupRelUserDAO.addUserToGroup(userGroupId, blackGroupId, userId);
		return true;
	}

	/**
	 * 移除用户出黑名单.
	 * 
	 * @author QiSF
	 * @date 2014年12月9日
	 */
	public boolean moveOutBlack(Integer serviceTagId, Long userId) {
		int friendGroupId = userGroupService.findFriendGroupByServiceTagId(serviceTagId);
		UserGroup userGroup = userGroupService.findGroupByServiceTagIdAndUserId(serviceTagId, userId);
		if (ObjectUtil.isEmpty(userGroup)) {
			throw new UnCaughtException("该用户不在某一分组中");
		}
		int userGroupId = userGroup.getId();
		userGroupRelUserDAO.addUserToGroup(userGroupId, friendGroupId, userId);
		return true;
	}

	/**
	 * 验证用户是否关注过改服务号.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	public boolean validUserIsInGroup(Integer serviceTagId, Long userId) {
		List<UserGroup> userGroupList = userGroupService.queryGroupList(serviceTagId);
		for (UserGroup userGroup : userGroupList) {
			UserGroupRelUser temp = this.queryUserRel(userGroup.getId(), userId);
			if (!ObjectUtil.isEmpty(temp)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 根据组ID、用户ID查询数据.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	private UserGroupRelUser queryUserRel(Integer userGroupId, Long userId) {
		Query query = Query.build(UserGroupRelUser.class);
		query.addEq("userGroupId", userGroupId);
		query.addEq("userId", userId);
		List<UserGroupRelUser> userGroupRelUserList = this.findByQuery(query);
		if (userGroupRelUserList == null || userGroupRelUserList.size() == 0) {
			return null;
		}
		return userGroupRelUserList.get(0);
	}

	/**
	 * 拼装成String
	 * 
	 * @param serviceTagId
	 * @return
	 */
	public String queryWhiteList(Integer serviceTagId) {
		List<Long> userIds = this.queryUserIdListNotInBlack(serviceTagId);
		return ListUtils.list2String(userIds, ",");
	}

	/**
	 * 验证某个用户是否在某个服务号的黑名单里面.
	 * 
	 * @return
	 * @author QiSF
	 * @date 2014年12月19日
	 */
	public boolean validIsInblack(Integer serviceTagId, Long userId) {
		int blackGroupId = userGroupService.findBlackGroupByServiceTagId(serviceTagId);
		int num = userGroupRelUserDAO.validIsInblack(blackGroupId, userId);
		if (num != 0) {
			return true;
		}
		return false;
	}
}
