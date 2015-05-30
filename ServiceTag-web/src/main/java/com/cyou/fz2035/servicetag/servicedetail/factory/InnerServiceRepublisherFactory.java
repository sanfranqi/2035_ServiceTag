package com.cyou.fz2035.servicetag.servicedetail.factory;

import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import com.cyou.fz2035.servicetag.servicedetail.publisher.*;

/**
 * Created by littlehui on 2014/12/20.
 */
public class InnerServiceRepublisherFactory implements ServicePublishFactory {

    private static InnerServiceRepublisherFactory innerServiceRepublisherFactory = new InnerServiceRepublisherFactory();

    public static InnerServiceRepublisherFactory instance() {
        return innerServiceRepublisherFactory;
    }

    @Override
    public Publisher createPublisher(ServiceTypeEnum serviceTypeEnum) {
        switch (serviceTypeEnum) {
            case TASK:
                return new TaskRepublisher();
            case AGENDA:
                return new AgendaRepublisher();
            case REWARD:
                return new RewardRePublisher();
            case HREF:
                return new HrefPublisher();
            case TELETEXT:
                return new TeletextPublisher();
            default:
                return new NullPublisher();
        }
    }
}
