package com.cyou.fz2035.servicetag.usergroup.dao;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.dao.BaseDAO;
import com.cyou.fz2035.servicetag.usergroup.bean.UserGroup;

/**
 * @Description .
 * @author QiSF
 * @date 2014年11月27日
 */
@Repository
public interface UserGroupDAO extends BaseDAO<UserGroup> {

	/**
	 * 根据服务号ID、用户ID查询用户所在组
	 * 
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	public UserGroup findGroupByServiceTagIdAndUserId(@Param("serviceTagId") Integer serviceTagId, @Param("userId") Long userId);

}
