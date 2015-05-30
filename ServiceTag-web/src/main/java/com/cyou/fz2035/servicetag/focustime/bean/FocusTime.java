package com.cyou.fz2035.servicetag.focustime.bean;

import lombok.Data;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Column;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Id;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Table;

/**
 * @Description .
 * @author QiSF
 * @date 2015年1月7日
 */
@Data
@Table("T_FOCUS_TIME")
public class FocusTime {
	@Id
	private Integer id;
	@Column("SERVICE_TAG_ID")
	private Integer serviceTagId;
	@Column("USER_ID")
	private Long userId;
	@Column("START_TIME")
	private Long startTime;
	@Column("END_TIME")
	private Long endTime;
	@Column("END_FLAG")
	private Boolean endFlag;
}
