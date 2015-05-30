package com.cyou.fz2035.servicetag.servicebase.bean;

import lombok.Data;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Id;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Table;

/**
 * User: littlehui Date: 14-11-26 Time: 下午4:47
 */
@Data
@Table("T_SERVICE_BASE")
public class ServiceBase {
	@Id
	private Integer id;
	private Integer serviceTagId;
	private String serviceName;
	private String serviceType;
	private String serviceAttachFiles;
	private String serviceDescribe;
	private String status;
	private Long createUser;
	private Long updateUser;
	private Long publishTime;
	private Boolean deleteFlag;
	private Long updateTime;
	private Long businessId;
}
