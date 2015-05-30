package com.cyou.fz2035.servicetag.usergroupreluser.bean;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Id;
import lombok.Data;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Column;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Table;

/**
 * @Description .
 * @author QiSF
 * @date 2014年11月27日
 */
@Data
@Table("T_USER_GROUP_REL_USER")
public class UserGroupRelUser {
    @Id
    private Integer id;
	@Column("USER_GROUP_ID")
	private Integer userGroupId;
	@Column("USER_ID")
	private Long userId;
	@Column("FOCUS_TIME")
	private Long focusTime;
	@Column("REMARK")
	private String remark;
}
