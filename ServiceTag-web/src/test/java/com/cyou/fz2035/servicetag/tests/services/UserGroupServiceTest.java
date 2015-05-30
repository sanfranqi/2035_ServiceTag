package com.cyou.fz2035.servicetag.tests.services;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagListVo;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagVo;
import com.cyou.fz2035.servicetag.usergroup.bean.UserGroup;
import com.cyou.fz2035.servicetag.usergroup.service.UserGroupService;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.usergroupreluser.vo.UserGroupRelUserVo;

/**
 * 
 * @Description .
 * @author QiSF
 * @date 2014年12月25日
 */
public class UserGroupServiceTest extends BaseTestService {

	@Autowired
	private UserGroupService userGroupService;

	@Autowired
	private UserGroupRelUserService userGroupRelUserService;

	@Autowired
	private ServiceTagService serviceTagService;

	@Test
	public void queryGroupList() {
		List<UserGroup> userGroupList = userGroupService.queryGroupList(11);
		for (UserGroup userGroup : userGroupList) {
			System.out.println(userGroup);
		}
	}

	@Test
	public void addGroup() {
		String userGroupName = "测试组";
		int serviceTagId = 11;
		userGroupService.addGroup(serviceTagId, userGroupName, ServiceTagConstants.GROUP_TYPE_CUSTOM);
		List<UserGroup> userGroupList = userGroupService.queryGroupList(11);
		for (UserGroup userGroup : userGroupList) {
			System.out.println(userGroup);
		}
	}

	@Test
	public void editGroup() {
		String userGroupName = "测试组修改";
		int userGroupId = 37;
		userGroupService.editGroup(userGroupId, userGroupName);
		List<UserGroup> userGroupList = userGroupService.queryGroupList(5);
		for (UserGroup userGroup : userGroupList) {
			System.out.println(userGroup);
		}
	}

	@Test
	public void queryUserList() {
		Integer userGroupId = 3;
		String nikeName = null;
		Integer pageNo = 1;
		Integer pageSize = 100;
		Paged<UserGroupRelUserVo> paged = userGroupRelUserService.queryUserList(userGroupId, nikeName, pageNo, pageSize);
		List<UserGroupRelUserVo> list = paged.getListData();
		for (UserGroupRelUserVo userGroupRelUserVo : list) {
			System.out.println(userGroupRelUserVo);
		}
	}

	@Test
	public void delGroup() {
		int userGroupId = 46;
		userGroupService.transDelGroup(userGroupId);
		List<UserGroup> userGroupList = userGroupService.queryGroupList(11);
		for (UserGroup userGroup : userGroupList) {
			System.out.println(userGroup);
		}
	}

	@Test
	public void focusServiceTag() {
		Integer serviceTagId = 46;
		Long mobile = 15280053496l;
		// userGroupRelUserService.transFocusServiceTag(serviceTagId, mobile);
		serviceTagId = 47;
		// userGroupRelUserService.transFocusServiceTag(serviceTagId, mobile);
	}

	@Test
	public void cancelFocus() {
		Integer serviceTagId = 11;
		Long mobile = 13912345678l;
		// userGroupRelUserService.transCancelFocus(serviceTagId, mobile);
	}

	@Test
	public void queryWhiteList() {
		Integer serviceTagId = 11;
		List<Long> list = userGroupRelUserService.queryUserIdListNotInBlack(serviceTagId);
		for (Long long1 : list) {
			System.out.println(long1);
		}
	}

	@Test
	public void queryFocusServiceTag() {
		Long mobile = 13912345678l;
		Integer pageNo = 1;
		Integer pageSize = 100;
		Paged<ServiceTagListVo> paged = serviceTagService.queryFocusServiceTag(mobile, pageNo, pageSize);
		List<ServiceTagListVo> list = paged.getListData();
		for (ServiceTagListVo temp : list) {
			System.out.println(temp);
		}
	}

	@Test
	public void getServiceTagById() {
		int serviceTagId = 11;
		ServiceTagVo vo = serviceTagService.getServiceTagById(serviceTagId, 13812345678l);
		System.out.println(vo);
	}

	@Test
	public void addUserToGroup() {
		Integer serviceTagId = 11;
		Integer newGroupId = 46;
		Long userIds[] = { 13912345678l };
		userGroupRelUserService.transAddUserToGroup(serviceTagId, newGroupId, userIds);
	}

	@Test
	public void moveOutBlack() {
		Integer serviceTagId = 11;
		Long userId = 13912345678l;
		userGroupRelUserService.moveOutBlack(serviceTagId, userId);
	}

	@Test
	public void moveToBlack() {
		Integer serviceTagId = 11;
		Long userId = 13912345678l;
		userGroupRelUserService.moveToBlack(serviceTagId, userId);
	}

	@Test
	public void queryAllFocusServiceTag() {
		Long userId = 15280053496l;
		List<ServiceTagListVo> list = serviceTagService.queryAllFocusServiceTag(userId);
		for (ServiceTagListVo serviceTagListVo : list) {
			System.out.println(serviceTagListVo);
		}
	}

	@Test
	public void queryAllServiceTagList() {
		List<ServiceTagListVo> list = serviceTagService.queryAllServiceTagList();
		for (ServiceTagListVo serviceTagListVo : list) {
			System.out.println(serviceTagListVo);
		}
	}

	@Test
	public void queryLastServiceTag() {
		List<ServiceTagListVo> list = serviceTagService.queryLastServiceTag();
		for (ServiceTagListVo serviceTagListVo : list) {
			System.out.println(serviceTagListVo);
		}
	}

	@Test
	public void focusServiceTagList() {
		Long userId = 15280053496l;
		String serviceTagIdArr = "120,115,73,58,56,54";
		userGroupRelUserService.focusServiceTagList(serviceTagIdArr, userId);
	}
}
