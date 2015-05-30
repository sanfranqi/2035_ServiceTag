package com.cyou.fz2035.servicetag.tests.services;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;

/**
 * User: littlehui Date: 14-11-27 Time: 上午10:57
 */
public class ServiceTagServiceTests extends BaseTestService {

	@Autowired
	ServiceTagService serviceTagService;

	@Test
	public void insert() {
		ServiceTag serviceTag = new ServiceTag();
		/*
		 * serviceTag.setCreateTime(System.currentTimeMillis());
		 * serviceTag.setCreateUser(15705959502L);
		 * serviceTag.setServiceTagName("小辉test");
		 * serviceTag.setServiceTagCode("生成规则");
		 * serviceTag.setServiceTagFacade("/etsts.gif");
		 * serviceTag.setServiceTagImg("/服务号头像.jpg");
		 * serviceTag.setStatus("10"); serviceTag.setServiceTagName("'test");
		 * serviceTag.setServiceTagType("100");
		 */
		serviceTag.setUpdateTime(System.currentTimeMillis());
		serviceTag.setUpdateUser(15705959502L);
		serviceTag.setCreateUser(15705959502L);
		serviceTag.setCreateTime(System.currentTimeMillis());
		serviceTag.setStatus(ServiceTagConstants.SERVICETAG_STATUS_NEW);
		serviceTag.setServiceTagName("test");
		serviceTag.setServiceTagType("100");
		serviceTag.setServiceTagImg("/服务号头像.jpg");
		serviceTagService.insert(serviceTag);
		System.out.print(serviceTag.getId());
	}

	@Test
	public void testIsEnable() {
		System.out.println("===========" + serviceTagService.isEnable(138));
	}
}
