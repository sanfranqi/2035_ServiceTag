package com.cyou.fz2035.servicetag.servicedetail.ender;

import com.cyou.fz2035.servicetag.servicebase.service.ServiceBaseService;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * User: littlehui
 * Date: 15-1-21
 * Time: 上午11:20
 */
public class RewardEnder extends AbstractHttpServiceEnder {

    ServiceBaseService serviceBaseService = ApplicationContextUtil.getBean(ServiceBaseService.class);

    protected void prepareEndService(String code, ServiceDetail serviceDetail) {
        this.setOperateRemoteService(false);
    }

        @Override
    public String doEndRemoteService() {
        return "";
    }

    @Override
    public ThirdResultVO afterDoEndRemoteService(ThirdResultVO thirdResultVO) {
        thirdResultVO.setSuccess(true);
        return thirdResultVO;
    }
}
