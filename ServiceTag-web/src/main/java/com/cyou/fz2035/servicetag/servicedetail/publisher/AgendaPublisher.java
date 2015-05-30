package com.cyou.fz2035.servicetag.servicedetail.publisher;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.StringUtil;
import com.cyou.fz2035.services.calendar.api.model.DCalendar;
import com.cyou.fz2035.services.calendar.api.service.ICalendarDubbo;
import com.cyou.fz2035.servicetag.config.ServiceBaseStatusEnum;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.servicebase.vo.ServiceBaseVo;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.servicedetail.service.ServiceDetailService;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.utils.ListUtils;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import org.apache.commons.lang.StringEscapeUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * User: littlehui
 * Date: 14-12-2
 * Time: 上午10:47
 */
public class AgendaPublisher implements Publisher {

    ICalendarDubbo calendarSoaService = ApplicationContextUtil.getBean("calendarSoaService");

    UserGroupRelUserService userGroupRelUserService = ApplicationContextUtil.getBean("userGroupRelUserService");

    ServiceDetailService serviceDetailService = ApplicationContextUtil.getBean("serviceDetailService");

    @Override
    public ThirdResultVO publishService(ServiceDetail serviceDetail, HttpServletRequest request) {
        DCalendar dCalendar = new DCalendar();
        Map detailsAddition = serviceDetail.getDetailsAddition();
        ServiceBaseVo serviceBaseVo = serviceDetail.getServiceBaseVo();
        dCalendar.setDcDetail(serviceBaseVo.getServiceDescribe());
        if (detailsAddition.get("isRepeat") != null && detailsAddition.get("isRepeat").equals("1")) {
            //重复周期
            dCalendar.setReturnStartDate(Long.parseLong(detailsAddition.get("repeatStartTime").toString()));
            if (StringUtil.isEmpty(detailsAddition.get("repeatEndTime").toString())) {
                dCalendar.setReturnEndDate(-1L);
            } else {
                dCalendar.setReturnEndDate(Long.parseLong(detailsAddition.get("repeatEndTime").toString()));
            }
            dCalendar.setReturnStartTime(Long.parseLong(detailsAddition.get("startTime").toString()));
            dCalendar.setReturnEndTime(Long.parseLong(detailsAddition.get("endTime").toString()));
            dCalendar.setReturnWeek("1,2,3,4,5,6,7");
            dCalendar.setDcType(dCalendar.RETURN);
        } else {
            //普通日程
            dCalendar.setStartDate(Long.parseLong(detailsAddition.get("startTime").toString()));
            dCalendar.setEndDate(Long.parseLong(detailsAddition.get("endTime").toString()));
            dCalendar.setDcType(dCalendar.DATE);
        }
        dCalendar.setDcRemind(Long.parseLong(detailsAddition.get("remind").toString()));
        dCalendar.setDcName(serviceBaseVo.getServiceName());
        dCalendar.setDcPrivate("1");
        dCalendar.setCreateUser(serviceBaseVo.getServiceTagId() + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID);
        dCalendar.setCreateDate(System.currentTimeMillis());
        dCalendar.setLastUpdateDate(System.currentTimeMillis());
        Long[] userIds = userGroupRelUserService.queryUserIdNotInBlack(serviceBaseVo.getServiceTagId());
        DCalendar dCalendarReturn = null;
        ThirdResultVO thirdResultVO = new ThirdResultVO();
        try {
            if (userIds == null || userIds.length < 1) {
                thirdResultVO.setSuccess(false);
                thirdResultVO.addMsg("关注用户不能为空。");
                return thirdResultVO;
            }
            dCalendar.setDcUuid(System.currentTimeMillis());
            dCalendar.setDcId(dCalendar.getDcUuid());
            dCalendarReturn = calendarSoaService.sendDCalendar(dCalendar, userIds, dCalendar.getCreateUser() + "", dCalendar.getCreateUser() + "", true, true);
        } catch (Exception e) {
            e.printStackTrace();
            thirdResultVO.setSuccess(false);
            return thirdResultVO;
        }
        serviceDetail.getServiceBaseVo().setPublishTime(System.currentTimeMillis());
        serviceDetail.getServiceBaseVo().setBusinessId(dCalendarReturn.getDcId());
        serviceDetail.getDetailsAddition().put("uuId", dCalendarReturn.getDcUuid());
        serviceDetail.getServiceBaseVo().setStatus(ServiceBaseStatusEnum.PUBLISHED.getCode());
        serviceDetail.getServiceBaseVo().setUpdateTime(System.currentTimeMillis());
        afterPublish(serviceDetail);
        thirdResultVO.setData(serviceDetail);
        thirdResultVO.setSuccess(true);
        return thirdResultVO;
    }

    public void afterPublish(ServiceDetail serviceDetail) {
        if (serviceDetail.getServiceBaseVo().getId() != null) {
            serviceDetailService.transUpdateServiceDetail(serviceDetail);
        } else {
            serviceDetailService.transInsertServiceDetail(serviceDetail);
        }
    }
}
