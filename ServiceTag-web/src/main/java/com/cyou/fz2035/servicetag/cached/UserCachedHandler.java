package com.cyou.fz2035.servicetag.cached;

import com.cyou.fz2035.servicetag.memcached.XMemcacheHandler;
import com.cyou.fz2035.servicetag.user.service.MatrixUserService;
import com.cyou.fz2035.servicetag.user.service.MatrixUserSoaService;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.utils.UnCaughtException;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;

public class UserCachedHandler {

	private static final String KEY_PRE_USER = "SERVICETAG_MATRIUSER_";

	private static MatrixUserService matrixUserService = ApplicationContextUtil.getBean(MatrixUserService.class);

	private static MatrixUserSoaService matrixUserSoaService = ApplicationContextUtil.getBean("matrixUserSoaService");

	/**
	 * 生成KEY.
	 * 
	 * @author QiSF
	 * @date 2014年12月1日
	 */
	private static String generateKey(String preKey, String sufKey) {
		return preKey + sufKey;
	}

	/**
	 * 获取用户缓存.
	 *
	 * @param userId
	 *            当前登入人ID
	 * @param token
	 *            当前登入人token
	 * @param queryUserId
	 *            被查询人ID
	 * @author QiSF
	 * @date 2014年10月30日
	 */
	public static synchronized MatrixUserInfo getMatrixUserInfo(Long userId, String token, Long queryUserId) {
		String cacheKey = generateKey(KEY_PRE_USER, String.valueOf(queryUserId));
		MatrixUserInfo matrixUserInfo = (MatrixUserInfo) getXMemcacheHandler().get(cacheKey);
		if (matrixUserInfo == null) {
			matrixUserInfo = setCachedMatrixUserInfo(queryUserId);
		}
		return matrixUserInfo;
	}

	/**
	 * 获取用户缓存.
	 *
	 * @param queryUserId
	 *            被查询人ID
	 * @author QiSF
	 * @date 2014年11月3日
	 */
	public static synchronized MatrixUserInfo getMatrixUserInfo(Long queryUserId) {
		String cacheKey = generateKey(KEY_PRE_USER, String.valueOf(queryUserId));
		MatrixUserInfo matrixUserInfo = (MatrixUserInfo) getXMemcacheHandler().get(cacheKey);
		if (matrixUserInfo == null) {
			matrixUserInfo = setCachedMatrixUserInfo(queryUserId);
		}
		return matrixUserInfo;
	}

	/**
	 * 设置用户缓存.
	 *
	 * @param queryUserId
	 *            被查询人ID
	 * @author QiSF
	 * @date 2014年10月30日
	 */
	public static MatrixUserInfo setCachedMatrixUserInfo(Long queryUserId) {
		String cacheKey = generateKey(KEY_PRE_USER, String.valueOf(queryUserId));
		MatrixUserInfo matrixUserInfo = matrixUserSoaService.getUserByUserId(queryUserId);
		// matrixUserService.getUserInfoByUserId(userId, token, queryUserId);
		if (matrixUserInfo == null) {
			throw new UnCaughtException("不存在ID为：" + queryUserId + "的用户!");
		}
		setCacheDefault(cacheKey, matrixUserInfo);
		return matrixUserInfo;
	}

	/**
	 * 置缓存，默认时间30.
	 * 
	 * @author QiSF
	 * @date 2014年12月1日
	 */
	public static void setCacheDefault(String key, Object value) {
		getXMemcacheHandler().set(key, getXMemcacheHandler().getCacheMinute(30), value);
	}

	public static XMemcacheHandler getXMemcacheHandler() {
		XMemcacheHandler memcacheHandler = ApplicationContextUtil.getBean(XMemcacheHandler.class);
		if (memcacheHandler != null) {
			return memcacheHandler;
		}
		throw new RuntimeException("no config ");
	}

}
