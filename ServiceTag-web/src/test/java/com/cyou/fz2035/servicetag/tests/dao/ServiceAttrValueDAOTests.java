package com.cyou.fz2035.servicetag.tests.dao;

import com.cyou.fz2035.servicetag.serviceattrvalue.bean.ServiceAttrValue;
import com.cyou.fz2035.servicetag.serviceattrvalue.dao.ServiceAttrValueDAO;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * User: littlehui
 * Date: 14-11-28
 * Time: 下午4:24
 */
public class ServiceAttrValueDAOTests extends BaseDAOTest {

    @Autowired
    ServiceAttrValueDAO serviceAttrValueDAO;

    @Test
    public void findMapTest() {
        List<String> codes = new ArrayList<String>();
        codes.add("reviewer");
        codes.add("origSecrecy");
        Map<String, Object> map = serviceAttrValueDAO.findAttrValuesMapByServiceBase(1, codes);
        System.out.println(map.get("reviewer"));
    }

    @Test
    public void insertValuesTest() {
        List<ServiceAttrValue> serviceAttrValues = new ArrayList<ServiceAttrValue>();
        ServiceAttrValue serviceAttrValue1 = new ServiceAttrValue();
        serviceAttrValue1.setServiceAttrCode("reviewer");
        serviceAttrValue1.setServiceAttrValue("xiaohuidere");
        serviceAttrValue1.setServiceBaseId(1);
        ServiceAttrValue serviceAttrValue2 = new ServiceAttrValue();
        serviceAttrValue2.setServiceAttrCode("origSecrecy");
        serviceAttrValue2.setServiceAttrValue("xiaohuidere2");
        serviceAttrValue2.setServiceBaseId(1);
        serviceAttrValues.add(serviceAttrValue1);
        serviceAttrValues.add(serviceAttrValue2);
        serviceAttrValueDAO.insertAttrValues(1, serviceAttrValues);
    }

    @Test
    public void deleteAttrValuesByServiceBaseTest() {
        serviceAttrValueDAO.deleteAttrValuesByServiceBase(1);
    }
}
