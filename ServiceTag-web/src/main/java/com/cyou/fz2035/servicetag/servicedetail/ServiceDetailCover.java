package com.cyou.fz2035.servicetag.servicedetail;

import com.cyou.fz2035.servicetag.servicebase.bean.ServiceBase;

import java.util.Map;

/**
 * User: littlehui
 * Date: 14-11-28
 * Time: 下午3:07
 */
public interface ServiceDetailCover {

    /**
     * 转换成serviceDetail格式
     * @param detailMap
     * @return
     */
    public ServiceDetail coverToServiceDetail(Map<String, Object> detailMap);

    /**
     * 转成ServiceBase多余的key删掉
     * @param detailMap
     * @return
     */
    public ServiceBase coverToServiceBase(Map<String, Object> detailMap);

    /**
     * serviceDetail转成一整个map
     * @param serviceDetail
     * @return
     */
    public Map<String, Object> coverToMap(ServiceDetail serviceDetail);
}
