package com.cyou.fz2035.servicetag.serviceattr.service;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.service.BaseService;
import com.cyou.fz2035.servicetag.serviceattr.dao.ServiceAttrDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * User: littlehui
 * Date: 14-11-30
 * Time: 上午10:54
 */
@Service
public class ServiceAttrService {

    @Autowired
    ServiceAttrDAO serviceAttrDAO;

    public List<String> getAttrsByServiceType(String serviceType) {
        return serviceAttrDAO.findAttrByServiceType(serviceType);
    }
}
