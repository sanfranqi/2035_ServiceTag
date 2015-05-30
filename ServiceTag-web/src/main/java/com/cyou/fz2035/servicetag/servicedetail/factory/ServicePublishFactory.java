package com.cyou.fz2035.servicetag.servicedetail.factory;

import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import com.cyou.fz2035.servicetag.servicedetail.publisher.Publisher;

/**
 * User: littlehui
 * Date: 14-12-2
 * Time: 上午10:44
 */
public interface ServicePublishFactory {

    public Publisher createPublisher(ServiceTypeEnum serviceTypeEnum);

}
