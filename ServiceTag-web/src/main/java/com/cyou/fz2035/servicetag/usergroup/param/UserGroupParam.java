package com.cyou.fz2035.servicetag.usergroup.param;

import lombok.Data;

import com.cyou.fz.commons.mybatis.selecterplus.page.PageQueryParam;

/**
 * @Description .
 * @author QiSF
 * @date 2014年11月27日
 */
@Data
public class UserGroupParam extends PageQueryParam {

	private Integer serviceTagId;

}
