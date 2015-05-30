package com.cyou.fz2035.servicetag.utils.code;

import com.cyou.fz2035.servicetag.exception.DecryptException;

public class BasicEncrypt implements IEncrypt {

    public String encrypt(final String pwd) {
        if (pwd == null || pwd.trim() == null) {
            return "";
        }
        final int len = pwd.length();
        final char[] enPwd = new char[len * 2 + 1];
        String hexs;
        int tmpi;
        final int[] key = {0x0034, 0x0070, 0x0030, 0x004c, 0x0040, 0x0072,
                0x0031, 0x0024 };
        for (int i = 0, j = 0; i < len; i++, j++) {
            if (j == 8) {
                j = 0;
            }
            // 与密钥进行异或操作
            tmpi = (pwd.charAt(i) ^ key[j]);
            // 整型数转成16进制字符串
            hexs = Integer.toString(tmpi, 16);
            if (hexs.length() > 1) {
                enPwd[i * 2] = hexs.charAt(0);
                enPwd[i * 2 + 1] = hexs.charAt(1);
            } else {
                enPwd[i * 2] = '0';
                enPwd[i * 2 + 1] = hexs.charAt(0);
            }
        } // for (int i=0,j=0;i<len;i++,j++){
        return new String(enPwd).trim();
        
    }
    

    public String decrypt(final String enPwd) throws DecryptException {
        if (enPwd == null || enPwd.trim() == null) {
            return "";
        }
        final int len = enPwd.length();
        if (len % 2 != 0) {
            return "";
        }
        final char[] pwd = new char[len / 2];
        final char[] hexs = new char[2];
        int tmpi;
        final int[] key = {0x0034, 0x0070, 0x0030, 0x004c, 0x0040, 0x0072,
                0x0031, 0x0024 };
        for (int i = 0, j = 0; i < len / 2; i++, j++) {
            if (j == 8) {
                j = 0;
            }
            // 从16进制字符串合成
            hexs[0] = enPwd.charAt(i * 2);
            hexs[1] = enPwd.charAt(i * 2 + 1);
            // 16进制字符串转成整型数
            tmpi = Integer.parseInt(String.valueOf(hexs), 16);
            // 与密钥进行异或操作
            pwd[i] = (char) (tmpi ^ key[j]);
        }
        return new String(pwd).trim();
    }
}
