package com.cyou.fz2035.servicetag.servicedetail.factory;

import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import com.cyou.fz2035.servicetag.servicedetail.ender.Ender;

/**
 * User: littlehui
 * Date: 14-12-17
 * Time: 下午4:29
 */
public interface ServiceEnderFactory {

    public Ender createServiceEnder(ServiceTypeEnum serviceTypeEnum);
}
