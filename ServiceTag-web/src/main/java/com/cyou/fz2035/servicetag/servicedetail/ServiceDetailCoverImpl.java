package com.cyou.fz2035.servicetag.servicedetail;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.servicetag.servicebase.bean.ServiceBase;
import com.cyou.fz2035.servicetag.servicebase.vo.ServiceBaseVo;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

/**
 * User: littlehui
 * Date: 14-11-28
 * Time: 下午5:23
 */
public class ServiceDetailCoverImpl implements ServiceDetailCover {

    @Override
    public ServiceDetail coverToServiceDetail(Map<String, Object> detailMap) {
        ServiceBaseVo serviceBaseVo = ObjectUtil.toBean(ServiceBaseVo.class, detailMap);
        ServiceDetail serviceDetail = new ServiceDetail();
        serviceDetail.setServiceBaseVo(serviceBaseVo);
        Field[] fields = ServiceBaseVo.class.getDeclaredFields();
        for (Field field : fields) {
            if (detailMap.containsKey(field.getName())) {
                detailMap.remove(field.getName());
            }
        }
        serviceDetail.setDetailsAddition(detailMap);
        return serviceDetail;
    }

    @Override
    public ServiceBase coverToServiceBase(Map<String, Object> detailMap) {
        ServiceBase serviceBase = ObjectUtil.toBean(ServiceBase.class, detailMap);
        return serviceBase;
    }

    @Override
    public Map<String, Object> coverToMap(ServiceDetail serviceDetail) {
        Map<String, Object> retMap = new HashMap<String, Object>();
        ServiceBaseVo serviceBaseVo = serviceDetail.getServiceBaseVo();
        retMap.putAll(ObjectUtil.toMap(serviceBaseVo));
        retMap.putAll(serviceDetail.getDetailsAddition());
        return retMap;
    }
}
