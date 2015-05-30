package com.cyou.fz2035.servicetag.servicebase.param;

import java.util.List;

import lombok.Data;

import com.cyou.fz.commons.mybatis.selecterplus.page.PageQueryParam;

/**
 * User: littlehui Date: 14-11-28 Time: 上午11:03
 */
@Data
public class ServiceBaseParam extends PageQueryParam {
	private Integer serviceTagId;
	private String serviceType[];
	private String status;
	private Long updateTimeStart = Long.MIN_VALUE + 1;
	private Long updateTimeEnd = Long.MAX_VALUE;
	private Long userId;
	private Long businessId;
	private String serviceName;
}
