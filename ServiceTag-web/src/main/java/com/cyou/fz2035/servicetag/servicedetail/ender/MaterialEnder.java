package com.cyou.fz2035.servicetag.servicedetail.ender;

import java.io.ByteArrayInputStream;

import javax.servlet.http.HttpServletRequest;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.filesystem.api.service.FileSystemService;
import com.cyou.fz2035.mc.api.service.MCDubboService;
import com.cyou.fz2035.services.calendar.api.service.ICalendarDubbo;
import com.cyou.fz2035.servicetag.config.ServiceBaseStatusEnum;
import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import com.cyou.fz2035.servicetag.servicebase.bean.ServiceBase;
import com.cyou.fz2035.servicetag.servicebase.service.ServiceBaseService;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.utils.bean.ServiceTagIdUtil;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.context.WebContext;

/**
 * 
 * @Description .
 * @author QiSF
 * @date 2014年12月26日
 */
public class MaterialEnder extends AbstractSoaServiceEnder {

	ICalendarDubbo calendarSoaService = ApplicationContextUtil.getBean("calendarSoaService");

	private ServiceBaseService serviceBaseService = ApplicationContextUtil.getBean(ServiceBaseService.class);

	private FileSystemService fileSystemService = ApplicationContextUtil.getBean(FileSystemService.class);

	private MCDubboService mcDubboService = ApplicationContextUtil.getBean(MCDubboService.class);

	@Override
	public ThirdResultVO endService(ServiceDetail serviceDetail, HttpServletRequest request) {
		ThirdResultVO thirdResultVO = new ThirdResultVO();
		try {
			ServiceBase serviceBase = ObjectUtil.convertObj(serviceDetail.getServiceBaseVo(), ServiceBase.class);
			serviceBase.setUpdateUser(WebContext.getLoginUserId());
			serviceBase.setUpdateTime(System.currentTimeMillis());
			serviceBase.setDeleteFlag(true);
			serviceBaseService.update(serviceBase);
			if (serviceBase.getStatus().equals(ServiceBaseStatusEnum.PUBLISHED.getCode())) {
				if (serviceBase.getServiceType().equals(ServiceTypeEnum.TELETEXT.getCode())) {
					String htmlName = (String) serviceDetail.getDetailsAddition().get("htmlName");
					String path = "/" + ServiceTagIdUtil.convertToOuterId(serviceBase.getServiceTagId()) + "/" + htmlName;
					fileSystemService.uploadFile(path, new ByteArrayInputStream("您访问的内容已被删除!".getBytes()));
				}
				mcDubboService.updateButtonStatus("已删除_SP__SP_0", null, null, "", String.valueOf(serviceBase.getBusinessId()), "", "");
				// if (!ObjectUtil.isEmpty(serviceDetail.getDetailsAddition()))
				// {
				// if
				// (!ObjectUtil.isEmpty(serviceDetail.getDetailsAddition().get("agendaDcId")))
				// {
				// long dcId = Long.parseLong((String)
				// serviceDetail.getDetailsAddition().get("agendaDcId"));
				// calendarSoaService.removeDCalendar(dcId, 2,
				// System.currentTimeMillis());
				// }
				// }
			}
		} catch (Exception e) {
			thirdResultVO.setSuccess(false);
			thirdResultVO.addMsg(e.getMessage());
			e.printStackTrace();
			return thirdResultVO;
		}
		thirdResultVO.setSuccess(true);
		return thirdResultVO;
	}
}
