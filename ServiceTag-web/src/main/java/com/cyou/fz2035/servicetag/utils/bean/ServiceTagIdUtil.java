package com.cyou.fz2035.servicetag.utils.bean;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.utils.UnCaughtException;

/**
 * @Description 服务号ID转换.
 * @author QiSF
 * @date 2015年1月8日
 */
public class ServiceTagIdUtil {

	/**
	 * 将外部系统服务号ID转换成内部ID
	 * 
	 * @author QiSF
	 * @date 2015年1月8日
	 */
	public static int convertToInnerId(long serviceTagId) {
		if (ObjectUtil.isEmpty(serviceTagId)) {
			throw new UnCaughtException("服务号ID不能为空!");
		}
		if (serviceTagId <= ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID) {
			throw new UnCaughtException("服务号ID不正确!" + serviceTagId);
		}
		int id = (int) (serviceTagId - ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID);
		return id;
	}

	/**
	 * 将内部系统服务号ID转换成外部ID
	 * 
	 * @author QiSF
	 * @date 2015年1月8日
	 */
	public static long convertToOuterId(int serviceTagId) {
		if (ObjectUtil.isEmpty(serviceTagId)) {
			throw new UnCaughtException("服务号ID不能为空!");
		}
		if (serviceTagId >= ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID) {
			throw new UnCaughtException("服务号ID不正确!" + serviceTagId);
		}
		long id = serviceTagId + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID;
		return id;
	}

}
