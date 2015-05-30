package com.cyou.fz2035.servicetag.servicedetail.publisher;

import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.servicedetail.factory.ServicePublishFactory;

import javax.servlet.http.HttpServletRequest;

/**
 * User: littlehui
 * Date: 14-12-2
 * Time: 下午3:06
 */
public class ServicePublishEngine {

    private Publisher publisher;

    private ServiceDetail serviceDetail;

    private ServicePublishFactory servicePublishFactory;

    public ServicePublishEngine(ServicePublishFactory servicePublishFactory, ServiceDetail serviceDetail) {
        this.serviceDetail = serviceDetail;
        this.servicePublishFactory = servicePublishFactory;
    }

    private void prepareServiceAndPublisher(ServiceDetail serviceDetail) {
        this.serviceDetail = serviceDetail;
        ServiceTypeEnum serviceTypeEnum = ServiceTypeEnum.valueOfCode(serviceDetail.getServiceBaseVo().getServiceType());
        this.publisher = servicePublishFactory.createPublisher(serviceTypeEnum);
    }

    public ThirdResultVO sendToRemoteService(HttpServletRequest request) {
        prepareServiceAndPublisher(serviceDetail);
        ThirdResultVO resultVO = publisher.publishService(serviceDetail, request);
        return resultVO;
    }

    public static void main(String args[]) {
        ServiceTypeEnum serviceTypeEnum = ServiceTypeEnum.valueOfCode("100");
        System.out.print(serviceTypeEnum.getName());
    }
}
