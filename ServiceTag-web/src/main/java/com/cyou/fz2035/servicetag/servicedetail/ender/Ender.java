package com.cyou.fz2035.servicetag.servicedetail.ender;

import com.cyou.fz2035.servicetag.files.ResultVO;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;

import javax.servlet.http.HttpServletRequest;

/**
 * User: littlehui
 * Date: 14-12-17
 * Time: 下午3:49
 */
public interface Ender {
    /**
     *
     * @param serviceDetail
     * @param request
     * @return
     */
    public ThirdResultVO endService(ServiceDetail serviceDetail, HttpServletRequest request);
}
