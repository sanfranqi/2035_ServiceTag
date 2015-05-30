package com.cyou.fz2035.servicetag.servicetag.vo;

import lombok.Data;

import com.cyou.fz2035.servicetag.config.ServiceTagStatusEnum;

/**
 * @Description .
 * @author QiSF
 * @date 2015年1月8日
 */
@Data
public class ServiceTagOutVo {
	private Long id;
	private Integer serviceTagId;
	private String serviceTagType;
	private String serviceTagName;
	// 头像
	private String serviceTagImg;
	// 皮肤
	private String serviceTagFacade;
	private String status;
	private String serviceTagCode;
	private Long createUser;
	private Long updateTime;
	private String userName;
	private String statusName;
	private String remark;
	private String firstChar;
	private Boolean isFocus;
	private String serviceTagTypeName;

	public void setServiceTagType(String serviceTagType) {
		this.serviceTagType = serviceTagType;
	}

	public void setStatus(String status) {
		this.status = status;
		this.statusName = ServiceTagStatusEnum.valueOfCode(status).getName();
	}
}
