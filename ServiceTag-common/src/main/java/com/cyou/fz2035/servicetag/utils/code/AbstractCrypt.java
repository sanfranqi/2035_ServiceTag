package com.cyou.fz2035.servicetag.utils.code;

import com.cyou.fz2035.servicetag.exception.DecryptException;

/**
 * User: littlehui
 * Date: 14-11-27
 * Time: 下午3:27
 */
public class AbstractCrypt implements IEncrypt {

    @Override
    public String encrypt(String str) {
        return  CodeTranser.encode(str);
    }

    @Override
    public String decrypt(String enStr) throws DecryptException {
        return CodeTranser.decode(enStr);
    }
}
