package com.cyou.fz2035.servicetag.servicedetail.publisher;

import com.cyou.fz2035.servicetag.config.ServiceBaseStatusEnum;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import com.cyou.fz2035.servicetag.servicebase.service.ServiceBaseService;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.servicedetail.service.ServiceDetailClassifyService;
import com.cyou.fz2035.servicetag.servicedetail.service.ServiceDetailService;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.utils.bean.Box;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.http.HttpClientUtil;
import com.cyou.fz2035.servicetag.utils.web.JsonUtil;
import org.apache.http.message.BasicNameValuePair;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * User: littlehui Date: 14-12-2 Time: 上午10:48
 */
public class RewardPublisher extends AbstractHttpPublisher {

    List<BasicNameValuePair> finalBasicNamePairs = new ArrayList<BasicNameValuePair>();

    ServiceBaseService serviceBaseService = ApplicationContextUtil.getBean(ServiceBaseService.class);

    ServiceTagService serviceTagService = ApplicationContextUtil.getBean(ServiceTagService.class);

    private ServiceDetailService serviceDetailService = ApplicationContextUtil.getBean(ServiceDetailService.class);

    ServiceDetailClassifyService serviceDetailClassifyService = ApplicationContextUtil.getBean(ServiceDetailClassifyService.class);

    @Override
    public ThirdResultVO publishService(ServiceDetail serviceDetail, HttpServletRequest request) {
        serviceDetail = serviceDetailClassifyService.reproduceServiceDetailForReward(serviceDetail, ServiceTypeEnum.REWARD.getCode());
        this.initPublisher(serviceDetail.getServiceBaseVo().getServiceType(), serviceDetail);
        finalBasicNamePairs.addAll(baseBasicNameValuePair);
        ServiceTag serviceTag = serviceTagService.get(serviceBase.getServiceTagId());
        ThirdResultVO isSuccess = new ThirdResultVO();
        if (serviceTag == null) {
            isSuccess.setSuccess(false);
            isSuccess.addMsg("seviceTag 为空");
            return isSuccess;
        }
        finalBasicNamePairs.add(new BasicNameValuePair("group", serviceTag.getServiceTagCode()));
        finalBasicNamePairs.add(new BasicNameValuePair("user_cyuid", serviceTag.getId() + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID + ""));
        finalBasicNamePairs.add(new BasicNameValuePair("reviewers", serviceTag.getId() + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID + ""));
        finalBasicNamePairs.add(new BasicNameValuePair("serviceid", serviceTag.getId() + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID + ""));
        serviceDetail.getDetailsAddition().put("reviewer", serviceTag.getId() + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID + "");
        publishResult = sendToRemoteService();
        isSuccess = afterSend(serviceDetail);
        return isSuccess;
    }

    @Override
    protected String sendToRemoteService() {
        String result = HttpClientUtil.post(PUBLISH_URL, finalBasicNamePairs);
        return result;
    }

    @Override
    protected ThirdResultVO afterSend(ServiceDetail serviceDetail) {
        Box resultBox = JsonUtil.toObject(publishResult, Box.class);
        ThirdResultVO thirdResultVO = new ThirdResultVO();
        if (resultBox.isIs_ok()) {
            long businessId = Long.parseLong(resultBox.getDto().toString());
            serviceDetail.getServiceBaseVo().setBusinessId(businessId);
            serviceDetail.getServiceBaseVo().setStatus(ServiceBaseStatusEnum.PUBLISHED.getCode());
            serviceDetail.getServiceBaseVo().setPublishTime(System.currentTimeMillis());
            serviceDetailService.transUpdateServiceDetail(serviceDetail);
            thirdResultVO.setSuccess(true);
            return thirdResultVO;
        } else {
            thirdResultVO.setSuccess(false);
            thirdResultVO.addMsg(resultBox.getError());
        }
        return thirdResultVO;
    }
}
