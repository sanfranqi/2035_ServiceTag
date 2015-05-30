package com.cyou.fz2035.servicetag.tests.services;

import com.alibaba.dubbo.common.json.JSONObject;
import com.cyou.fz2035.servicetag.config.ServiceBaseStatusEnum;
import com.cyou.fz2035.servicetag.config.SystemConfig;
import com.cyou.fz2035.servicetag.servicebase.service.ServiceBaseService;
import com.cyou.fz2035.servicetag.servicebase.vo.ServiceBaseVo;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ServiceRewardDetail;
import com.cyou.fz2035.servicetag.servicedetail.service.ServiceDetailService;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * User: littlehui
 * Date: 14-12-18
 * Time: 下午5:31
 */
public class ServiceDetailServiceTest extends BaseTestService {

    @Autowired
    ServiceDetailService serviceDetailService;

    @Autowired
    ServiceBaseService serviceBaseService;

    @Test
    public void serviceDetailAddTest() {
        ServiceDetail serviceDetail = new ServiceDetail();
        ServiceBaseVo serviceBaseVo = new ServiceBaseVo();
        serviceBaseVo.setPublishTime(1419958861000L);
        serviceBaseVo.setStatus("10");
        serviceBaseVo.setServiceDescribe("小辉的测试数据详细。。");
        serviceBaseVo.setServiceName("小辉的测试数据");
        serviceBaseVo.setServiceTagId(1);
        serviceBaseVo.setServiceType("100");
        Map<String, Object> detailsAddition = new HashMap<String, Object>();
        detailsAddition.put("startTime", System.currentTimeMillis());
        detailsAddition.put("endTime", System.currentTimeMillis());
        detailsAddition.put("attachFiles1", "/addition/test1.txt");
        serviceDetail.setServiceBaseVo(serviceBaseVo);
        serviceDetail.setDetailsAddition(detailsAddition);
        serviceDetailService.transInsertServiceDetail(serviceDetail);
    }


    @Test
    public void serviceDetailUpdateTest() {
        ServiceDetail serviceDetail = new ServiceDetail();
        ServiceBaseVo serviceBaseVo = new ServiceBaseVo();
        serviceBaseVo.setId(44);
        serviceBaseVo.setServiceTagId(1);
        serviceBaseVo.setServiceType("100");
        Map<String, Object> detailsAddition = new HashMap<String, Object>();
        detailsAddition.put("startTime", System.currentTimeMillis() + "");
        detailsAddition.put("endTime", "1419958861001");
        detailsAddition.put("attachFiles1", "/addition/test1.txt");
        serviceDetail.setServiceBaseVo(serviceBaseVo);
        serviceDetail.setDetailsAddition(detailsAddition);
        serviceDetailService.transUpdateServiceDetail(serviceDetail);
    }

    @Test
    public void postTest() throws IOException {
        JSONObject jsonObj = new JSONObject();
        HttpClientBuilder clientBuilder = HttpClientBuilder.create();
        CloseableHttpClient client = clientBuilder.build();
        ServiceDetail serviceDetail = serviceDetailService.getServiceDetail(224);
        jsonObj.put("detailsAddition", serviceDetail.getServiceBaseVo());
       // jsonObj.put("detailsAddition", serviceDetail.getDetailsAddition());
       // jsonObj.put("additionFiles", ((ServiceRewardDetail)serviceDetail).getAdditionFiles());
        //jsonObj.put("serviceRewardDetail", (ServiceRewardDetail)serviceDetail);
// Create the POST object and add the parameters
        HttpPost httpPost = new HttpPost("http://10.5.27.61:8084/nonlimit/serviceRewardDetail.do");
        StringEntity entity = new StringEntity(jsonObj.toString(), "utf-8");
        System.out.print(jsonObj.toString());
        entity.setContentType("application/json;charset=utf-8");
        httpPost.setEntity(entity);

        HttpResponse response = client.execute(httpPost);
        HttpEntity entity1 = response.getEntity();
        String content = EntityUtils.toString(entity1, "utf-8");

        System.out.print(content);
    }

    @Test
    public void testChangeStatus() {
        serviceBaseService.changeServiceBaseStatusByBusinessId(ServiceBaseStatusEnum.END.getCode(), 430L);
    }
}
