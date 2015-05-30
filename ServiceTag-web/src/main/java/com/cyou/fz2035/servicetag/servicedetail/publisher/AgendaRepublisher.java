package com.cyou.fz2035.servicetag.servicedetail.publisher;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.StringUtil;
import com.cyou.fz2035.services.calendar.api.model.DCalendar;
import com.cyou.fz2035.servicetag.config.ServiceBaseStatusEnum;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.servicebase.vo.ServiceBaseVo;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import sun.print.resources.serviceui_de;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * User: littlehui
 * Date: 14-12-23
 * Time: 下午9:28
 */
public class AgendaRepublisher extends AgendaPublisher {
    @Override
    public ThirdResultVO publishService(ServiceDetail serviceDetail, HttpServletRequest request)  {
        DCalendar dCalendar = new DCalendar();
        Map detailsAddition = serviceDetail.getDetailsAddition();
        ServiceBaseVo serviceBaseVo = serviceDetail.getServiceBaseVo();
        if (serviceBaseVo.getBusinessId() != null && serviceBaseVo.getBusinessId() > 0) {
            dCalendar.setDcId(serviceBaseVo.getBusinessId().longValue());
            dCalendar.setDcUuid(Long.parseLong(detailsAddition.get("uuId").toString()));
        }
        dCalendar.setLastUpdateDate(System.currentTimeMillis());
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
            dCalendar.setCreateUser(WebContext.getLoginUserId());
            dCalendar.setDcType(dCalendar.DATE);
        }
        dCalendar.setDcRemind(Long.parseLong(detailsAddition.get("remind").toString()));
        dCalendar.setDcName(serviceBaseVo.getServiceName());
        dCalendar.setDcPrivate("1");
        dCalendar.setCreateDate(System.currentTimeMillis());
        dCalendar.setCreateUser(serviceBaseVo.getServiceTagId() + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID);
        Long[] userIds = userGroupRelUserService.queryUserIdNotInBlack(serviceBaseVo.getServiceTagId());
        DCalendar dCalendarReturn = null;
        ThirdResultVO thirdResultVO = new ThirdResultVO();
        try {
/*            if (userIds == null || userIds.length < 1) {
                thirdResultVO.setSuccess(false);
                thirdResultVO.addMsg("关注用户不能为空。");
                return thirdResultVO;
            }*/
            dCalendarReturn = calendarSoaService.editDCalendar(dCalendar, new Long[]{}, 2, System.currentTimeMillis(), dCalendar.getCreateUser() + "", dCalendar.getCreateUser() + "", false);
        } catch (Exception e) {
            e.printStackTrace();
            thirdResultVO.setSuccess(false);
            return thirdResultVO;
        }
        serviceDetail.getServiceBaseVo().setBusinessId(dCalendarReturn.getDcId());
        serviceDetail.getServiceBaseVo().setStatus(ServiceBaseStatusEnum.PUBLISHED.getCode());
        serviceDetail.getDetailsAddition().put("uuId", dCalendarReturn.getDcUuid());
        thirdResultVO.setData(serviceDetail);
        thirdResultVO.setSuccess(true);
        afterPublish(serviceDetail);
        return thirdResultVO;
    }
}

