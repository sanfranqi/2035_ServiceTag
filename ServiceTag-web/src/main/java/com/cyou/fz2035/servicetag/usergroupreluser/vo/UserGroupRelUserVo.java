package com.cyou.fz2035.servicetag.usergroupreluser.vo;

import lombok.Data;

/**
 * @Description .
 * @author QiSF
 * @date 2014年11月27日
 */
@Data
public class UserGroupRelUserVo {
	private Integer userGroupId;
	private Long userId;
	private Long focusTime;
	private String remark;
	private String userName;
	private String cellphone;
}
