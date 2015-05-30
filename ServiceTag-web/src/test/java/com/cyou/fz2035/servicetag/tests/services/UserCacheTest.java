package com.cyou.fz2035.servicetag.tests.services;

import org.junit.Test;

import com.cyou.fz2035.servicetag.cached.UserCachedHandler;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;

/**
 * @Description .
 * @author QiSF
 * @date 2014年12月22日
 */

public class UserCacheTest extends BaseTestService {

	@Test
	public void testGetUser() {

		MatrixUserInfo user = UserCachedHandler.getMatrixUserInfo(15280191991l);
		System.out.println(user.toString());
	}
}
