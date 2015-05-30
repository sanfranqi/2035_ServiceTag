package com.cyou.fz2035.servicetag.messagebox.bean;

import lombok.Data;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Column;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Id;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Table;

/**
 * @Description .
 * @author QiSF
 * @date 2014年11月27日
 */
@Data
@Table("T_MESSAGE_BOX")
public class MessageBox {
	@Id
	private Integer id;
	@Column("SERVICE_TAG_ID")
	private Integer serviceTagId;
	@Column("SERVICE_TYPE")
	private String serviceType;
	@Column("SEND_USER_ID")
	private Long sendUserId;
	@Column("CONTENT")
	private String content;
	@Column("RECEIVE_TIME")
	private Long receiveTime;
}
