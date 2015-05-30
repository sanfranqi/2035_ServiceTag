package com.cyou.fz2035.servicetag.groupmessage.bean;

import lombok.Data;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Column;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Id;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Table;

/**
 * 
 * @Description .
 * @author QiSF
 * @date 2015年3月5日
 */
@Data
@Table("T_GROUP_MESSAGE")
public class GroupMessage {
	@Id
	private Integer id;
	@Column("PURPOSE")
	private String purpose;
	@Column("CONTENT")
	private String content;
	@Column("SEND_TIME")
	private Long sendTime;
	@Column("SERVICE_TAG_ID")
	private Integer serviceTagId;
	@Column("USER_ID")
	private Long userId;
	@Column("GROUP_ID")
	private Integer groupId;
	@Column("SEND_FLAG")
	private Boolean sendFlag;
}
