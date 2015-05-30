package com.cyou.fz2035.servicetag.servicetag.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * 
 * @Description .
 * @author QiSF
 * @date 2015年1月8日
 */
@Data
public class ServiceTagListOutVo implements Serializable {
	// by:QiSF 2015年1月5日
	private static final long serialVersionUID = 1L;
	private Long id;
	private String serviceTagName;
	private String serviceTagImg;
	private String remark;
	private String firstChar;
}
