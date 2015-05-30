package com.cyou.fz2035.servicetag.servicedetail.factory;

import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import com.cyou.fz2035.servicetag.servicedetail.ender.*;

/**
 * User: littlehui
 * Date: 14-12-17
 * Time: 下午4:30
 */
public class InnerServiceEnderFactory implements ServiceEnderFactory {

    private static InnerServiceEnderFactory innerServiceEnderFactory = new InnerServiceEnderFactory();

    public static InnerServiceEnderFactory instance() {
        return innerServiceEnderFactory;
    }

    @Override
    public Ender createServiceEnder(ServiceTypeEnum serviceTypeEnum) {
        switch (serviceTypeEnum) {
            case TASK:
                return new TaskEnder();
            case AGENDA:
                return new AgendaEnder();
            case TELETEXT:
            	return new MaterialEnder();
            case HREF:
            	return new MaterialEnder();
            case REWARD:
                return new RewardEnder();
            default:
                return new NullEnder();
        }
    }
}
