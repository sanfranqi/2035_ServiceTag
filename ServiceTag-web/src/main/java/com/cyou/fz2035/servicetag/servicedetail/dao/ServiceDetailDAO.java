package com.cyou.fz2035.servicetag.servicedetail.dao;

import com.cyou.fz2035.servicetag.servicebase.bean.ServiceBase;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;

/**
 * User: littlehui
 * Date: 14-11-28
 * Time: 下午3:15
 */
public interface ServiceDetailDAO {

    public void insertServiceDetail(ServiceDetail serviceDetail);

    public ServiceDetail getServiceDetail(ServiceBase serviceBase);

    public void updateServiceDetail(ServiceDetail serviceDetail);
}
