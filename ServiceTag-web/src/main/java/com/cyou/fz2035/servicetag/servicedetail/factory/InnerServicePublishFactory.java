package com.cyou.fz2035.servicetag.servicedetail.factory;

import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import com.cyou.fz2035.servicetag.servicedetail.publisher.*;

/**
 * Created by littlehui on 2014/12/20.
 */
public class InnerServicePublishFactory implements ServicePublishFactory {

    private static InnerServicePublishFactory innerServicePublishFactory = new InnerServicePublishFactory();

    public static InnerServicePublishFactory instance() {
        return innerServicePublishFactory;
    }

    @Override
    public Publisher createPublisher(ServiceTypeEnum serviceTypeEnum) {
        switch (serviceTypeEnum) {
            case TASK:
                return new TaskPublisher();
            case AGENDA:
                return new AgendaPublisher();
            case REWARD:
                return new RewardPublisher();
            case HREF:
                return new HrefPublisher();
            case TELETEXT:
                return new TeletextPublisher();
            default:
                return new NullPublisher();
        }
    }
}
