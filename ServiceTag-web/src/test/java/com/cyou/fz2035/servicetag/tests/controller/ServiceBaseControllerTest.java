package com.cyou.fz2035.servicetag.tests.controller;

import com.alibaba.dubbo.common.json.JSONObject;
import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ServiceRewardDetail;
import com.cyou.fz2035.servicetag.servicedetail.service.ServiceDetailService;
import com.cyou.fz2035.servicetag.utils.http.HttpClientUtil;
import com.cyou.fz2035.servicetag.utils.web.JsonUtil;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

/**
 * User: littlehui
 * Date: 14-12-15
 * Time: 下午4:23
 */
public class ServiceBaseControllerTest extends BaseControllerTest {

    Logger logger = Logger.getLogger(ServiceBaseControllerTest.class);

    ServiceDetailService serviceDetailService = new ServiceDetailService();

    @Test
    public void insertTest() {
        List<BasicNameValuePair> basicNameValuePairList = new ArrayList<BasicNameValuePair>();
        basicNameValuePairList.add(new BasicNameValuePair("_t", "w213070643346544a57"));
        basicNameValuePairList.add(new BasicNameValuePair("_m", "15705959502"));
        basicNameValuePairList.add(new BasicNameValuePair("serviceBaseVo.serviceType", "100"));
        basicNameValuePairList.add(new BasicNameValuePair("serviceBaseVo.serviceTagId", "1"));
        basicNameValuePairList.add(new BasicNameValuePair("serviceBaseVo.serviceName", "sgdsgdgs"));
        basicNameValuePairList.add(new BasicNameValuePair("serviceBaseVo.serviceDescribe", "sdsdgsdgsgsgs"));
        basicNameValuePairList.add(new BasicNameValuePair("serviceBaseVo.status", "12"));
        basicNameValuePairList.add(new BasicNameValuePair("serviceBaseVo.publishTime", "1417069323731"));
        basicNameValuePairList.add(new BasicNameValuePair("detailsAddition.endTime", "1417069323731"));
        basicNameValuePairList.add(new BasicNameValuePair("detailsAddition.startTime", "1417069323731"));
        String returns = HttpClientUtil.post("http://localhost:8084/admin/service/saveServiceDetail.do", basicNameValuePairList);
        Response r = JsonUtil.toObject(returns, Response.class);
        logger.info(r.toString());
    }

    @Test
    public void queryTest() {
        List<BasicNameValuePair> basicNameValuePairList = new ArrayList<BasicNameValuePair>();
        basicNameValuePairList.add(new BasicNameValuePair("serviceBaseId", "1"));
        basicNameValuePairList.add(new BasicNameValuePair("_t", "w213070643346544a57"));
        basicNameValuePairList.add(new BasicNameValuePair("_m", "15705959502"));
        String returns = HttpClientUtil.get("http://localhost:8084/admin/service/getServiceDetail.do", basicNameValuePairList);
        Response r = JsonUtil.toObject(returns, Response.class);
        logger.info(r.toString());
    }

}
