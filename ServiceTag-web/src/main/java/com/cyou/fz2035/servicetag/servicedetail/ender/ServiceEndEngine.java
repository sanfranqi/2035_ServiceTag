package com.cyou.fz2035.servicetag.servicedetail.ender;

import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.servicedetail.factory.ServiceEnderFactory;
import com.cyou.fz2035.servicetag.servicedetail.factory.ServicePublishFactory;
import com.cyou.fz2035.servicetag.servicedetail.publisher.Publisher;

import javax.servlet.http.HttpServletRequest;

/**
 * User: littlehui
 * Date: 14-12-17
 * Time: 下午4:28
 */
public class ServiceEndEngine {

    private Ender ender;

    private ServiceDetail serviceDetail;

    private ServiceEnderFactory serviceEnderFactory;

    public ServiceEndEngine(ServiceEnderFactory serviceEnderFactory, ServiceDetail serviceDetail) {
        this.serviceDetail = serviceDetail;
        this.serviceEnderFactory = serviceEnderFactory;
    }

    private void prepareServiceAndEnder(ServiceDetail serviceDetail) {
        this.serviceDetail = serviceDetail;
        ServiceTypeEnum serviceTypeEnum = ServiceTypeEnum.valueOfCode(serviceDetail.getServiceBaseVo().getServiceType());
        this.ender = serviceEnderFactory.createServiceEnder(serviceTypeEnum);
    }

    public ThirdResultVO sendToEndRemoteService(HttpServletRequest request) {
        prepareServiceAndEnder(serviceDetail);
        return ender.endService(serviceDetail, request);
    }
}
