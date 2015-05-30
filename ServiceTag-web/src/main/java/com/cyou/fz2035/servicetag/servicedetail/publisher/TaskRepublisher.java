package com.cyou.fz2035.servicetag.servicedetail.publisher;

import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import org.apache.http.message.BasicNameValuePair;

/**
 * Created by littlehui on 2014/12/20.
 */
public class TaskRepublisher extends TaskPublisher {

    private static String SEND_ROLE_SERVICETAG = "1";

    @Override
    protected void initPublisher(String code, ServiceDetail serviceDetail) {
        super.initPublisher(serviceDetail.getServiceBaseVo().getServiceType(), serviceDetail);
        finalBasicNameValuePairs.add(new BasicNameValuePair("taskReceipt.sender_role", SEND_ROLE_SERVICETAG));
    }

    public boolean isRepublisher() {
        return true;
    }
}
