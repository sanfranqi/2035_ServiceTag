package com.cyou.fz2035.servicetag.servicedetail;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.servicetag.serviceattr.service.ServiceAttrService;
import com.cyou.fz2035.servicetag.serviceattrvalue.bean.ServiceAttrValue;
import com.cyou.fz2035.servicetag.utils.ListUtils;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

/**
 * User: littlehui
 * Date: 14-11-28
 * Time: 下午5:31
 */
public class ServiceAttrValueCover implements BeanCover<ServiceAttrValue> {

    private static final String SERVICE_BASE_ID = "serviceBaseId";

    @Autowired
    ServiceAttrService serviceAttrService;

    @Override
    public List<ServiceAttrValue> coverToBeanList(Map<String, Object> additionMap) {
        List<ServiceAttrValue> serviceAttrValues = new ArrayList<ServiceAttrValue>();
        if (!ObjectUtil.isEmpty(additionMap)){
        	  Set<String> keySet = additionMap.keySet();
              keySet.remove(SERVICE_BASE_ID);
              List<String> attrs = new ArrayList<String>(keySet);
              serviceAttrValues = coverToBeanList(additionMap, attrs);
		}
        return serviceAttrValues;
    }

    @Override
    public Map<String, Object> coverTomap(List<ServiceAttrValue> attrValues) {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        for (ServiceAttrValue serviceAttrValue : attrValues) {
            resultMap.put(serviceAttrValue.getServiceAttrCode(), serviceAttrValue.getServiceAttrValue());
        }
        resultMap.put(SERVICE_BASE_ID, attrValues.get(0).getServiceBaseId());
        return resultMap;
    }

    @Override
    public List<ServiceAttrValue> coverToBeanList(Map<String, Object> additionMap, List<String> attrs){
        List<ServiceAttrValue> serviceAttrValues = new ArrayList<ServiceAttrValue>();
        Integer serviceBaseId = (Integer) additionMap.get(SERVICE_BASE_ID);
        if (ListUtils.isNotEmpty(attrs)) {
            for (String atrr : attrs) {
                if (additionMap.get(atrr) != null) {
                    ServiceAttrValue serviceAttrValue = new ServiceAttrValue();
                    serviceAttrValue.setServiceBaseId(serviceBaseId);
                    serviceAttrValue.setServiceAttrCode(atrr);
                    serviceAttrValue.setServiceAttrValue(additionMap.get(atrr).toString());
                    serviceAttrValues.add(serviceAttrValue);
                }
            }
        }
        return serviceAttrValues;
    }
}
