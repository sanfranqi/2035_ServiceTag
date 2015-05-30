package com.cyou.fz2035.servicetag.usergroupreluser.dao;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.dao.BaseDAO;
import com.cyou.fz2035.servicetag.usergroupreluser.bean.UserGroupRelUser;

/**
 * @Description .
 * @author QiSF
 * @date 2014年11月27日
 */
@Repository
public interface UserGroupRelUserDAO extends BaseDAO<UserGroupRelUser> {

	/**
	 * 删除分组后，将原组用户移至好友组
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	public boolean replaceGroupId(@Param("userGroupId") Integer userGroupId, @Param("newGroupId") Integer newGroupId);

	/**
	 * 移动用户到相应分组
	 * 
	 * @author QiSF
	 * @date 2014年11月27日
	 */
	public boolean addUserToGroup(@Param("userGroupId") Integer userGroupId, @Param("newGroupId") Integer newGroupId, @Param("userId") Long userId);

	/**
	 * 验证某个用户是否在某个服务号的黑名单里面.
	 * 
	 * @return
	 * @author QiSF
	 * @date 2014年12月19日
	 */
	public int validIsInblack(@Param("blackGroupId") Integer blackGroupId, @Param("userId") Long userId);
}
