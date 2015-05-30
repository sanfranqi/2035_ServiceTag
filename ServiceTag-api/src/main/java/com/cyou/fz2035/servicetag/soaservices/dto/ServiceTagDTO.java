package com.cyou.fz2035.servicetag.soaservices.dto;

import java.io.Serializable;

public class ServiceTagDTO implements Serializable {
	// by:QiSF 2015年1月5日
	private static final long serialVersionUID = 1L;
	private Long id;
	private String serviceTagName;
	private String serviceTagImg;
	private String remark;
	private String firstChar;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getServiceTagName() {
		return serviceTagName;
	}

	public void setServiceTagName(String serviceTagName) {
		this.serviceTagName = serviceTagName;
	}

	public String getServiceTagImg() {
		return serviceTagImg;
	}

	public void setServiceTagImg(String serviceTagImg) {
		this.serviceTagImg = serviceTagImg;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getFirstChar() {
		return firstChar;
	}

	public void setFirstChar(String firstChar) {
		this.firstChar = firstChar;
	}

}
