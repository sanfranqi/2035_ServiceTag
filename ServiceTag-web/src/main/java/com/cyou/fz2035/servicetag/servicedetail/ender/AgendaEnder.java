package com.cyou.fz2035.servicetag.servicedetail.ender;

import javax.servlet.http.HttpServletRequest;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.services.calendar.api.service.ICalendarDubbo;
import com.cyou.fz2035.servicetag.config.ServiceBaseStatusEnum;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.servicebase.bean.ServiceBase;
import com.cyou.fz2035.servicetag.servicebase.service.ServiceBaseService;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.servicedetail.service.ServiceDetailService;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.context.WebContext;

/**
 * User: littlehui Date: 14-12-24 Time: 上午10:32
 */
public class AgendaEnder extends AbstractSoaServiceEnder {

	ICalendarDubbo calendarSoaService = ApplicationContextUtil.getBean("calendarSoaService");

	UserGroupRelUserService userGroupRelUserService = ApplicationContextUtil.getBean("userGroupRelUserService");

	ServiceDetailService serviceDetailService = ApplicationContextUtil.getBean("serviceDetailService");

	private ServiceBaseService serviceBaseService = ApplicationContextUtil.getBean(ServiceBaseService.class);

	@Override
	public ThirdResultVO endService(ServiceDetail serviceDetail, HttpServletRequest request) {
		ThirdResultVO thirdResultVO = new ThirdResultVO();
		try {
			ServiceBase serviceBase = ObjectUtil.convertObj(serviceDetail.getServiceBaseVo(), ServiceBase.class);
			serviceBase.setUpdateUser(WebContext.getLoginUserId());
			serviceBase.setUpdateTime(System.currentTimeMillis());
			serviceBase.setDeleteFlag(true);
            if (serviceBase.getStatus().equals(ServiceBaseStatusEnum.PUBLISHED.getCode())) {
                calendarSoaService.removeDCalendar(serviceDetail.getServiceBaseVo().getBusinessId(), 2, System.currentTimeMillis()
                        , null
                        , serviceBase.getServiceTagId() + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID + ""
                        , serviceBase.getServiceTagId() + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID + "", false);
            }
            serviceBaseService.update(serviceBase);
		} catch (Exception e) {
			thirdResultVO.setSuccess(false);
			thirdResultVO.addMsg(e.getMessage());
			thirdResultVO.addErrorCode(e.getCause().toString());
			e.printStackTrace();
			return thirdResultVO;
		}
		thirdResultVO.setSuccess(true);
		return thirdResultVO;
	}
}
