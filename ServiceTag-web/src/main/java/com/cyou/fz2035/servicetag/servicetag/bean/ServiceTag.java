package com.cyou.fz2035.servicetag.servicetag.bean;

import lombok.Data;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Id;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Table;

/**
 * User: littlehui Date: 14-11-26 Time: 下午4:31
 */
@Data
@Table("T_SERVICE_TAG")
public class ServiceTag {
	@Id
	private Integer id;
	private String serviceTagType;
	private String serviceTagName;
	private String serviceTagImg;
	private String serviceTagFacade;
	private Long createTime;
	private String status;
	private String serviceTagCode;
	private Long createUser;
	private Long updateTime;
	private Long updateUser;
	private Boolean deleteFlag;
	private String remark;
	private String firstChar;
    private Boolean stopByAdmin;
    private String secondCheckStatus;
    private Boolean inAuthDetails;
}
