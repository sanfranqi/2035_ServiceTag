package com.cyou.fz2035.servicetag.tests.services;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz2035.servicetag.messagebox.service.MessageBoxService;
import com.cyou.fz2035.servicetag.messagebox.vo.MessageBoxVo;

/**
 * @Description .
 * @author QiSF
 * @date 2014年12月25日
 */
public class MessageboxServiceTest extends BaseTestService {

	@Autowired
	private MessageBoxService messageBoxService;

	@Test
	public void addMessage() {
		Integer serviceTagId = 44;
		Long sendUserId = 13720839557l;
		String content = "testtest";
		messageBoxService.addMessage(serviceTagId, null, sendUserId, content);
	}

	@Test
	public void queryMessageList() {
		Integer serviceTagId = 11;
		Long startTime = 1419502384496l;
		Long endTime = 1419502530953l;
		Integer pageNo = 1;
		Integer pageSize = 100;
		Paged<MessageBoxVo> page = messageBoxService.queryMessageList(serviceTagId, null, null, startTime, endTime, pageNo, pageSize);
		List<MessageBoxVo> list = page.getListData();
		for (MessageBoxVo messageBoxVo : list) {
			System.out.println(messageBoxVo);
		}
	}

	@Test
	public void queryMessageDetail() {
		Integer messageId = 2;
		MessageBoxVo message = messageBoxService.queryMessageDetail(messageId);
		System.out.println(message);
	}
}
