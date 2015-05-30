package com.cyou.fz2035.servicetag.replymessage.bean;

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
@Table("T_REPLY_MESSAGE")
public class ReplyMessage {
	@Id
	private Integer id;
	@Column("SERVICE_TAG_ID")
	private Integer serviceTagId;
	@Column("USER_SEND_TIME")
	private Long userSendTime;
	@Column("MESSAGE_ID")
	private String messageId;
	@Column("REPLY_CONTENT")
	private String replyContent;
	@Column("REPLY_TIME")
	private Long replyTime;
	@Column("RECEIVE_USER_ID")
	private Long receiveUserId;
	@Column("USER_ID")
	private Long userId;
	@Column("SEND_FLAG")
	private Boolean sendFlag;
}
