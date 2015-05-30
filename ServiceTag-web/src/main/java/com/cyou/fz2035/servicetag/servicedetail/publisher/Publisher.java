package com.cyou.fz2035.servicetag.servicedetail.publisher;

import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;

import javax.servlet.http.HttpServletRequest;

/**
 * User: littlehui
 * Date: 14-12-2
 * Time: 上午10:45
 */
public interface Publisher {

    public ThirdResultVO publishService(ServiceDetail serviceDetail, HttpServletRequest request);

}
