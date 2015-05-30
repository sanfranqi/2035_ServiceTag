package com.cyou.fz2035.servicetag.serviceattr.dao;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.dao.BaseDAO;
import com.cyou.fz2035.servicetag.serviceattr.bean.ServiceAttr;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * User: littlehui
 * Date: 14-11-28
 * Time: 下午3:28
 */
@Repository
public interface ServiceAttrDAO extends BaseDAO<ServiceAttr> {

    public List<ServiceAttr> findAttrsByServiceType(String serviceType);

    public List<String> findAttrByServiceType(String serviceType);
}
