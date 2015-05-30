package com.cyou.fz2035.servicetag.soaservices.dto;

import java.io.Serializable;

/**
 * Description:
 * 
 * @author:ZhengChao
 * @email:zhengchao730@163.com
 */
public class DCalendarDTO implements Serializable {

	// by:QiSF 2015年1月12日
	private static final long serialVersionUID = 1L;
	public static final Integer RETURN = 1; // 重複日程
	public static final Integer DATE = 0; // 時間段日程
	public static final Integer NOW = 0;
	public static final Integer AFTER = 1;
	public static final Integer ALL = 2;

	private Long dcUuid;

	private Long dcId;

	private Integer dcType; // 日程类型 重复 -- 时间段

	/** -- D_NAME */
	private String dcName;

	/** -- RETURN_START_TIME */
	private Long returnStartTime;

	/** -- RETURN_END_TIME */
	private Long returnEndTime;

	/** -- RETURN_START_DATE */
	private Long returnStartDate;

	/** -- RETURN_END_DATE */
	private Long returnEndDate;

	/** -- RETURN_WEEK */
	private String returnWeek;

	/** -- RETURN_DAY */
	private String returnDay;

	/** -- D_DETAIL */
	private String dcDetail;

	/** -- D_CLASS */
	private String dcClass;

	/** -- START_DATE */
	private Long startDate;

	/** -- END_DATE */
	private Long endDate;

	/** -1 表示不提醒 1表示提醒 -- D_REMIND */
	private Long dcRemind;

	/** -- D_PRIVATE */
	private String dcPrivate;

	/** -- D_RANGE */
	private Integer dcRange;

	/** -- D_RANGE */
	private Integer meJoin;

	/** -- CREATE_USER */
	private String createUserName;

	/** -- CREATE_USER */
	private Long createUser;

	/** -- CREATE_DATE */
	private Long createDate;

	/** -- LAST_UPDATE_DATE */
	private Long lastUpdateDate;

	/** -- FILE_TIME */
	private Long fileTime;

	private boolean isTask = false;

	public boolean isTask() {
		return isTask;
	}

	public void setTask(boolean isTask) {
		this.isTask = isTask;
	}

	public Integer getMeJoin() {
		return meJoin;
	}

	public void setMeJoin(Integer meJoin) {
		this.meJoin = meJoin;
	}

	public Long getFileTime() {
		return fileTime;
	}

	public void setFileTime(Long fileTime) {
		this.fileTime = fileTime;
	}

	public String getCreateUserName() {
		return createUserName;
	}

	public void setCreateUserName(String createUserName) {
		this.createUserName = createUserName;
	}

	public Integer getDcType() {
		return dcType;
	}

	public void setDcType(Integer dcType) {
		this.dcType = dcType;
	}

	public String getDcName() {
		return dcName;
	}

	public void setDcName(String dcName) {
		this.dcName = dcName;
	}

	public Long getReturnStartTime() {
		return returnStartTime;
	}

	public void setReturnStartTime(Long returnStartTime) {
		this.returnStartTime = returnStartTime;
	}

	public Long getReturnEndTime() {
		return returnEndTime;
	}

	public void setReturnEndTime(Long returnEndTime) {
		this.returnEndTime = returnEndTime;
	}

	public Long getReturnStartDate() {
		return returnStartDate;
	}

	public void setReturnStartDate(Long returnStartDate) {
		this.returnStartDate = returnStartDate;
	}

	public Long getReturnEndDate() {
		return returnEndDate;
	}

	public void setReturnEndDate(Long returnEndDate) {
		this.returnEndDate = returnEndDate;
	}

	public String getReturnWeek() {
		return returnWeek;
	}

	public void setReturnWeek(String returnWeek) {
		this.returnWeek = returnWeek;
	}

	public String getReturnDay() {
		return returnDay;
	}

	public void setReturnDay(String returnDay) {
		this.returnDay = returnDay;
	}

	public String getDcDetail() {
		return dcDetail;
	}

	public void setDcDetail(String dcDetail) {
		this.dcDetail = dcDetail;
	}

	public String getDcClass() {
		return dcClass;
	}

	public void setDcClass(String dcClass) {
		this.dcClass = dcClass;
	}

	public Long getStartDate() {
		return startDate;
	}

	public void setStartDate(Long startDate) {
		this.startDate = startDate;
	}

	public Long getEndDate() {
		return endDate;
	}

	public void setEndDate(Long endDate) {
		this.endDate = endDate;
	}

	public Long getDcRemind() {
		return dcRemind;
	}

	public void setDcRemind(Long dcRemind) {
		this.dcRemind = dcRemind;
	}

	public String getDcPrivate() {
		return dcPrivate;
	}

	public void setDcPrivate(String dcPrivate) {
		this.dcPrivate = dcPrivate;
	}

	public Integer getDcRange() {
		return dcRange;
	}

	public void setDcRange(Integer dcRange) {
		this.dcRange = dcRange;
	}

	public Long getCreateUser() {
		return createUser;
	}

	public void setCreateUser(Long createUser) {
		this.createUser = createUser;
	}

	public Long getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Long createDate) {
		this.createDate = createDate;
	}

	public Long getLastUpdateDate() {
		return lastUpdateDate;
	}

	public void setLastUpdateDate(Long lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}

	public Long getDcUuid() {
		return dcUuid;
	}

	public void setDcUuid(Long dcUuid) {
		this.dcUuid = dcUuid;
	}

	public Long getDcId() {
		return dcId;
	}

	public void setDcId(Long dcId) {
		this.dcId = dcId;
	}
}
