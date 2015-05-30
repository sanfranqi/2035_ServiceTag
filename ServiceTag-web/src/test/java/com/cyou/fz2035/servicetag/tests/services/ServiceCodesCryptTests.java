package com.cyou.fz2035.servicetag.tests.services;

import com.cyou.fz2035.servicetag.config.SystemConfig;
import com.cyou.fz2035.servicetag.servicetag.code.ServiceCodeCrypt;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import org.apache.commons.collections.bag.SynchronizedSortedBag;
import org.junit.Test;

/**
 * User: littlehui
 * Date: 14-11-27
 * Time: 下午5:08
 */

public class ServiceCodesCryptTests extends BaseTestService{
    @Test
    public void testEncodeDecode() {
        ServiceCodeCrypt codeCrypt = ApplicationContextUtil.getBean(ServiceCodeCrypt.class);
        codeCrypt.setId("1");
        codeCrypt.setType("101");
        codeCrypt.setNumber("15705959502");
        System.out.println(codeCrypt.getServiceCode());
        codeCrypt.setId("1");
        codeCrypt.setType("101");
        codeCrypt.setNumber("15705959501");
        codeCrypt.setServiceCode("79465E446641070A05070403017943594463480203000707");
        System.out.println(codeCrypt.getNumber() + "  " + codeCrypt.getId());
    }
}
