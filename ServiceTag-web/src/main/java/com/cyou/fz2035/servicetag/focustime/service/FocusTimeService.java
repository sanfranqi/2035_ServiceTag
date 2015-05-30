package com.cyou.fz2035.servicetag.focustime.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.service.BaseService;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.servicetag.focustime.bean.FocusTime;
import com.cyou.fz2035.servicetag.focustime.dao.FocusTimeDAO;
import com.cyou.fz2035.servicetag.utils.UnCaughtException;

/**
 * 
 * @Description .
 * @author QiSF
 * @date 2015年1月7日
 */
@Service
public class FocusTimeService extends BaseService<FocusTime> {

	@Autowired
	private FocusTimeDAO focusTimeDAO;

	/**
	 * 添加关注时间.
	 * 
	 * @author QiSF
	 * @throws ParseException
	 * @date 2015年1月7日
	 */
	public boolean addFocusTime(int serviceTagId, long userId, long startTime) {
		try {
			FocusTime focusTime = new FocusTime();
			focusTime.setServiceTagId(serviceTagId);
			focusTime.setUserId(userId);
			focusTime.setStartTime(startTime);
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
			Date date = sdf.parse("20991231");
			focusTime.setEndTime(date.getTime());
			focusTime.setEndFlag(false);
			this.insert(focusTime);
		} catch (Exception e) {
			throw new UnCaughtException(e.getMessage());
		}
		return true;
	}

	/**
	 * 取消关注时间.
	 * 
	 * @author QiSF
	 * @date 2015年1月7日
	 */
	public boolean endFocusTime(int serviceTagId, long userId) {
		long endTime = System.currentTimeMillis();
		focusTimeDAO.endFocusTime(serviceTagId, userId, endTime);
		return true;
	}

	/**
	 * 在某个时间点用户是否有关注服务号.
	 * 
	 * @author QiSF
	 * @date 2015年1月7日
	 */
	public boolean validDC(int serviceTagId, long userId, long startTime, long endTime) {
		List<FocusTime> list = focusTimeDAO.validDC(serviceTagId, userId, startTime, endTime);
		if (ObjectUtil.isEmpty(list)) {
			return false;
		}
		return true;
	}
}
