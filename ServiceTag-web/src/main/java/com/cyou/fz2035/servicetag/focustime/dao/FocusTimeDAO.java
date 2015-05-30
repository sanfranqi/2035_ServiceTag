package com.cyou.fz2035.servicetag.focustime.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.dao.BaseDAO;
import com.cyou.fz2035.servicetag.focustime.bean.FocusTime;

/**
 * 
 * @Description .
 * @author QiSF
 * @date 2015年1月7日
 */
@Repository
public interface FocusTimeDAO extends BaseDAO<FocusTime> {

	/**
	 * 取消关注时间.
	 * 
	 * @author QiSF
	 * @date 2015年1月7日
	 */
	public void endFocusTime(@Param("serviceTagId") int serviceTagId, @Param("userId") long userId, @Param("endTime") long endTime);

	/**
	 * 在某个时间点用户是否有关注服务号.
	 * 
	 * @author QiSF
	 * @date 2015年1月12日
	 */
	public List<FocusTime> validDC(@Param("serviceTagId") int serviceTagId, @Param("userId") long userId, @Param("startTime") long startTime, @Param("endTime") long endTime);

}
