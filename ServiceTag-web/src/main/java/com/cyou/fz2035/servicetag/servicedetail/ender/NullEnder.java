package com.cyou.fz2035.servicetag.servicedetail.ender;

import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;

import javax.servlet.http.HttpServletRequest;

/**
 * User: littlehui
 * Date: 14-12-17
 * Time: 下午4:32
 */
public class NullEnder implements Ender {
    @Override
    public ThirdResultVO endService(ServiceDetail serviceDetail, HttpServletRequest request) {
        return new ThirdResultVO();
    }
}
