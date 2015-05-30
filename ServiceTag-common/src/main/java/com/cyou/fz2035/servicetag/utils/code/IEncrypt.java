package com.cyou.fz2035.servicetag.utils.code;


import com.cyou.fz2035.servicetag.exception.DecryptException;

public interface IEncrypt {
    

    String encrypt(String str);
    

    String decrypt(String enStr) throws DecryptException;
}
