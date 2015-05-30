package com.cyou.fz2035.servicetag.servicedetail.publisher;

import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;

import javax.servlet.http.HttpServletRequest;

/**
 * User: littlehui
 * Date: 14-12-2
 * Time: 下午3:04
 */
public class QuestPublisher implements Publisher {

    @Override
    public ThirdResultVO publishService(ServiceDetail serviceDetail, HttpServletRequest request) {
        return new ThirdResultVO();
    }
}
