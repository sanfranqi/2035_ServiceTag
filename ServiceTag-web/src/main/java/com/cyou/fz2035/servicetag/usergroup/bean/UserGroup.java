package com.cyou.fz2035.servicetag.usergroup.bean;

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
@Table("T_USER_GROUP")
public class UserGroup {
	@Id
	private Integer id;
	@Column("USER_GROUP_NAME")
	private String userGroupName;
	@Column("USER_GROUP_TYPE")
	private String userGroupType;
	@Column("SERVICE_TAG_ID")
	private Integer serviceTagId;
}
