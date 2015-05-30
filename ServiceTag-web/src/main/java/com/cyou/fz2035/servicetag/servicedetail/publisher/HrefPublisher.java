package com.cyou.fz2035.servicetag.servicedetail.publisher;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.mc.api.model.FullMsg;
import com.cyou.fz2035.mc.api.model.SortMsg;
import com.cyou.fz2035.mc.api.service.MCDubboService;
import com.cyou.fz2035.services.calendar.api.service.ICalendarDubbo;
import com.cyou.fz2035.servicetag.cached.UserCachedHandler;
import com.cyou.fz2035.servicetag.config.ServiceBaseStatusEnum;
import com.cyou.fz2035.servicetag.serviceattrvalue.dao.ServiceAttrValueDAO;
import com.cyou.fz2035.servicetag.servicebase.vo.ServiceBaseVo;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.servicedetail.service.ServiceDetailService;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.utils.bean.ServiceTagIdUtil;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;

/**
 * @author QiSF
 * @date 2014年12月16日
 */
public class HrefPublisher extends AbstractHttpPublisher {

	private MCDubboService mcDubboService = ApplicationContextUtil.getBean(MCDubboService.class);

	private ServiceTagService serviceTagService = ApplicationContextUtil.getBean(ServiceTagService.class);

	private UserGroupRelUserService userGroupRelUserService = ApplicationContextUtil.getBean(UserGroupRelUserService.class);

	private ICalendarDubbo calendarSoaService = ApplicationContextUtil.getBean("calendarSoaService");

	private ServiceAttrValueDAO serviceAttrValueDAO = ApplicationContextUtil.getBean(ServiceAttrValueDAO.class);

	private ServiceDetailService serviceDetailService = ApplicationContextUtil.getBean(ServiceDetailService.class);

	@Override
	public ThirdResultVO publishService(ServiceDetail serviceDetail, HttpServletRequest request) {
		ThirdResultVO thirdResultVO = new ThirdResultVO();
		ServiceBaseVo serviceBaseVo = serviceDetail.getServiceBaseVo();
		Map<String, Object> detailsAddition = serviceDetail.getDetailsAddition();
		// 发消息中心
		String bussId = String.valueOf(serviceDetail.getServiceBaseVo().getBusinessId());
		if (ObjectUtil.isEmpty(bussId) || "0".equals(bussId)) {// 业务ID为空时才发消息，否则不发新消息
			bussId = String.valueOf(serviceBaseVo.getServiceTagId()) + String.valueOf(System.currentTimeMillis());

			FullMsg fullMsg = new FullMsg();
			fullMsg.setBussId(bussId);
			fullMsg.setType(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceBaseVo.getServiceTagId())));
			fullMsg.setTitle(serviceBaseVo.getServiceName());
			fullMsg.setSystem(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceBaseVo.getServiceTagId())));
			fullMsg.setSystemName(serviceTagService.get(serviceBaseVo.getServiceTagId()).getServiceTagName());
			fullMsg.setViewUrl("查看详情_SP_" + serviceBaseVo.getServiceDescribe() + "_SP_3");
			fullMsg.setImg(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceBaseVo.getServiceTagId())));
			SortMsg sortMsg = new SortMsg();
			sortMsg.setType(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceBaseVo.getServiceTagId())));
			sortMsg.setTitle(serviceBaseVo.getServiceName());
			sortMsg.setSystem(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceBaseVo.getServiceTagId())));
			sortMsg.setSystemName(serviceTagService.get(serviceBaseVo.getServiceTagId()).getServiceTagName());
			sortMsg.setImg(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceBaseVo.getServiceTagId())));
			List<Long> userIdList = userGroupRelUserService.queryUserIdListNotInBlack(serviceBaseVo.getServiceTagId());
			if (userIdList == null || userIdList.size() == 0) {
				thirdResultVO.setSuccess(false);
				thirdResultVO.addMsg("服务号关注的用户数为0,发布失败!");
				return thirdResultVO;
			}
			String[] userIdArr = new String[userIdList.size()];
			for (int i = 0; i < userIdArr.length; i++) {
				userIdArr[i] = String.valueOf(userIdList.get(i));
			}
			List<String> userNameList = new ArrayList<String>();
			for (Long userId : userIdList) {
				MatrixUserInfo matrixUserInfo = UserCachedHandler.getMatrixUserInfo(userId);
				userNameList.add(matrixUserInfo.getFullName());
			}
			String[] userNameArr = new String[userNameList.size()];
			for (int i = 0; i < userNameArr.length; i++) {
				userNameArr[i] = String.valueOf(userNameList.get(i));
			}
			try {
				mcDubboService.sysInArr(userIdArr, userNameArr, sortMsg, fullMsg);
			} catch (Exception e) {
				thirdResultVO.setSuccess(false);
				thirdResultVO.addMsg("消息中心异常：" + e.getMessage());
				return thirdResultVO;
			}
		} else {// 业务ID不为空时更新消息的消息体，标题不变
			mcDubboService.updateButtonStatus("查看详情_SP_" + serviceBaseVo.getServiceDescribe() + "_SP_3", null, null, "", bussId, "", "");
		}

		// 发送日程
		// long businessId = serviceBaseVo.getBusinessId();
		// if (!ObjectUtil.isEmpty(businessId) && businessId != 0) {
		// try {
		// calendarSoaService.removeDCalendar(serviceBaseVo.getBusinessId(),
		// DCalendar.DATE, System.currentTimeMillis());
		// } catch (Exception e) {
		// thirdResultVO.setSuccess(false);
		// thirdResultVO.addMsg(e.getMessage());
		// thirdResultVO.addErrorCode(e.getCause().toString());
		// e.printStackTrace();
		// return thirdResultVO;
		// }
		// }
		// String isAgenda = (String) detailsAddition.get("isAgenda");
		// DCalendar dCalendarReturn = null;
		// if (ServiceTagConstants.SEND_AGENDA.equals(isAgenda)) {
		// long time =
		// Long.parseLong(detailsAddition.get("agendaTime").toString());
		// if (ObjectUtil.isEmpty(time)) {
		// time = System.currentTimeMillis();
		// serviceAttrValueDAO.upateAttrValues(serviceBaseVo.getId(),
		// "agendaTime", String.valueOf(time));
		// }
		// DCalendar dCalendar = new DCalendar();
		// dCalendar.setDcDetail(serviceBaseVo.getServiceDescribe());
		// dCalendar.setStartDate(time);
		// dCalendar.setEndDate(DateUtil.getNextDay(time));
		// dCalendar.setCreateUser(serviceBaseVo.getServiceTagId() +
		// ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID);
		// dCalendar.setDcType(DCalendar.DATE);
		// dCalendar.setDcRemind(-1l);
		// dCalendar.setDcName(serviceBaseVo.getServiceName());
		// dCalendar.setDcPrivate("1");
		// Long[] userArr = (Long[]) userIdList.toArray();
		// try {
		// dCalendarReturn = calendarSoaService.saveOrUpdateDCalendar(dCalendar,
		// userArr, 2, System.currentTimeMillis());
		// serviceDetail.getDetailsAddition().put("agendaDcId",
		// dCalendarReturn.getDcId());
		// } catch (Exception e) {
		// e.printStackTrace();
		// thirdResultVO.setSuccess(false);
		// return thirdResultVO;
		// }
		// }
		serviceDetail.getServiceBaseVo().setBusinessId(Long.parseLong(bussId));
		serviceDetail.getServiceBaseVo().setStatus(ServiceBaseStatusEnum.PUBLISHED.getCode());
		serviceDetail.getServiceBaseVo().setPublishTime(System.currentTimeMillis());
		serviceDetailService.transUpdateServiceDetail(serviceDetail);
		thirdResultVO.setData(serviceDetail);
		thirdResultVO.setSuccess(true);
		return thirdResultVO;
	}

	@Override
	public String sendToRemoteService() {
		return "";
	}

	@Override
	public ThirdResultVO afterSend(ServiceDetail serviceDetail) {
		return null;
	}
}
