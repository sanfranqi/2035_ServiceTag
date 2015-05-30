package com.cyou.fz2035.servicetag.messagebox.vo;

import java.util.List;

import lombok.Data;

import com.cyou.fz2035.servicetag.replymessage.vo.ReplyMessageVo;

/**
 * @Description .
 * @author QiSF
 * @date 2014年11月27日
 */
@Data
public class MessageBoxVo {
	private String id;
	private Integer serviceTagId;
	private Long sendUserId;
	private String receiveTime;
	private String userName;
	private String cellphone;
	private String content;
	private Boolean isInBlack;
	private List<ReplyMessageVo> replyMessageList;
}
