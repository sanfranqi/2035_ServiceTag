package com.cyou.fz2035.servicetag.tests.services;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.cyou.fz2035.servicetag.focustime.service.FocusTimeService;

public class FocusTimeTest extends BaseTestService {

	@Autowired
	FocusTimeService focusTimeService;

	@Test
	public void isInFocusTime() {
		System.out.println(focusTimeService.validDC(134, 13720839557l, 1420128000000l, 1420128000000l));
	}
}
