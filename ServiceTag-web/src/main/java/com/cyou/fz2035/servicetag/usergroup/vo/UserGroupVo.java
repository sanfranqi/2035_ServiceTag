package com.cyou.fz2035.servicetag.usergroup.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * @Description .
 * @author QiSF
 * @date 2014年11月27日
 */
@Data
public class UserGroupVo implements Serializable {
	private static final long serialVersionUID = 1L;
	private Integer id;
	private String userGroupName;
	private Integer userNum;// 关注用户数
	private String userGroupType;
}
