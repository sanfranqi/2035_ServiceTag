package com.cyou.fz2035.servicetag.usergroup.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Query;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.service.BaseService;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.usergroup.bean.UserGroup;
import com.cyou.fz2035.servicetag.usergroup.dao.UserGroupDAO;
import com.cyou.fz2035.servicetag.usergroup.vo.UserGroupVo;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.utils.UnCaughtException;

/**
 * @Description .
 * @author QiSF
 * @date 2014年11月27日
 */
@Service
public class UserGroupService extends BaseService<UserGroup> {

	@Autowired
	private UserGroupRelUserService userGroupRelUserService;

	@Autowired
	private UserGroupDAO userGroupDAO;

	/**
	 * 根据服务号ID查询分组列表.
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	public List<UserGroup> queryGroupList(Integer serviceTagId) {
		Query query = Query.build(UserGroup.class);
		query.addEq("serviceTagId", serviceTagId);
		query.addOrder("id", Query.DBOrder.ASC);
		List<UserGroup> userGroupList = this.findByQuery(query);
		return userGroupList;
	}

	/**
	 * 根据服务号ID查询分组列表Vo.
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	public List<UserGroupVo> queryGroupVoList(Integer serviceTagId) {
		List<UserGroup> userGroupList = this.queryGroupList(serviceTagId);
		List<UserGroupVo> userGroupVoList = ObjectUtil.convertList(userGroupList, UserGroupVo.class);
		for (UserGroupVo userGroupVo : userGroupVoList) {
			userGroupVo.setUserNum(userGroupRelUserService.countUserByGroupId(userGroupVo.getId()));
		}
		return userGroupVoList;
	}

	/**
	 * 根据服务号ID查询服务号的分组列表(除黑名单组).
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	public List<UserGroup> queryGroupListExceptBlack(Integer serviceTagId) {
		Query query = Query.build(UserGroup.class);
		query.addEq("serviceTagId", serviceTagId);
		query.addIn("userGroupType", Arrays.asList(ServiceTagConstants.GROUP_TYPE_FRIEND, ServiceTagConstants.GROUP_TYPE_CUSTOM));
		List<UserGroup> userGroupList = this.findByQuery(query);
		return userGroupList;
	}

	/**
	 * 添加分组.
	 * 
	 * @param userGroupName
	 *            用户组类型名称(ServiceTagConstants.GROUP_TYPE)
	 * @param userGroupType
	 *            用户组类型(ServiceTagConstants.GROUP_TYPE)
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	public boolean addGroup(Integer serviceTagId, String userGroupName, String userGroupType) {
		UserGroup userGroup = new UserGroup();
		userGroup.setServiceTagId(serviceTagId);
		userGroup.setUserGroupName(userGroupName);
		userGroup.setUserGroupType(userGroupType);
		if (!this.validGroupName(serviceTagId, userGroupName, 0)) {
			throw new UnCaughtException("组名重复了!");
		}
		this.insert(userGroup);
		return true;
	}

	/**
	 * 修改分组.
	 * 
	 * @param userGroupType
	 *            用户组类型(ServiceTagConstants.GROUP_TYPE)
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	public boolean editGroup(Integer userGroupId, String userGroupName) {
		UserGroup userGroup = this.get(userGroupId);
		if (this.validGroup(userGroup)) {
			userGroup.setUserGroupName(userGroupName);
			if (!this.validGroupName(userGroup.getServiceTagId(), userGroupName, userGroupId)) {
				throw new UnCaughtException("组名重复了!");
			}
			this.update(userGroup);
		}
		return true;
	}

	/**
	 * 删除分组.
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	public boolean transDelGroup(Integer userGroupId) {
		UserGroup userGroup = this.get(userGroupId);
		if (this.validGroup(userGroup)) {
			int friendGroupId = this.findFriendGroupByServiceTagId(userGroup.getServiceTagId());
			userGroupRelUserService.replaceGroupId(userGroupId, friendGroupId);
			this.delete(userGroup.getId());
		}
		return true;
	}

	/**
	 * 验证分组能否修改、删除
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	private boolean validGroup(UserGroup userGroup) {
		if (userGroup == null) {
			throw new UnCaughtException("分组不存在!");
		}
		if (ServiceTagConstants.GROUP_TYPE_FRIEND.equals(userGroup.getUserGroupType()) || ServiceTagConstants.GROUP_TYPE_BLACKLIST.equals(userGroup.getUserGroupType())) {
			throw new UnCaughtException("默认分组不允许操作!");
		}
		return true;
	}

	/**
	 * 根据服务号ID查询服务号的好友组ID
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	public int findFriendGroupByServiceTagId(Integer serviceTagId) {
		Query query = Query.build(UserGroup.class);
		query.addEq("serviceTagId", serviceTagId);
		query.addEq("userGroupType", ServiceTagConstants.GROUP_TYPE_FRIEND);
		List<UserGroup> userGroupList = this.findByQuery(query);
		if (userGroupList == null || userGroupList.size() == 0) {
			throw new UnCaughtException("服务号[" + serviceTagId + "]没有好友组.");
		}
		return userGroupList.get(0).getId();
	}

	/**
	 * 根据服务号ID查询服务号的黑名单组ID
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	public int findBlackGroupByServiceTagId(Integer serviceTagId) {
		Query query = Query.build(UserGroup.class);
		query.addEq("serviceTagId", serviceTagId);
		query.addEq("userGroupType", ServiceTagConstants.GROUP_TYPE_BLACKLIST);
		List<UserGroup> userGroupList = this.findByQuery(query);
		if (userGroupList == null || userGroupList.size() == 0) {
			throw new UnCaughtException("服务号[" + serviceTagId + "]没有黑名单组.");
		}
		return userGroupList.get(0).getId();
	}

	/**
	 * 根据服务号ID、用户ID查询用户所在组
	 * 
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	public UserGroup findGroupByServiceTagIdAndUserId(Integer serviceTagId, Long userId) {
		UserGroup userGroup = userGroupDAO.findGroupByServiceTagIdAndUserId(serviceTagId, userId);
		return userGroup;
	}

	/**
	 * 验证组名是否重复.
	 * 
	 * @author QiSF
	 * @date 2014年12月31日
	 */
	public boolean validGroupName(Integer serviceTagId, String groupName, Integer groupId) {
		List<UserGroup> list = this.queryGroupList(serviceTagId);
		for (UserGroup userGroup : list) {
			if (userGroup.getUserGroupName().equals(groupName)) {
				if (!userGroup.getId().equals(groupId)) {
					return false;
				}
			}
		}
		return true;
	}

}
