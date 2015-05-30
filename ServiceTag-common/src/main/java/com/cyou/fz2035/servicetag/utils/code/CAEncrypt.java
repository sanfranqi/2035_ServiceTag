package com.cyou.fz2035.servicetag.utils.code;


import com.cyou.fz2035.servicetag.exception.DecryptException;
import com.cyou.fz2035.servicetag.utils.StrUtil;

public class CAEncrypt implements IEncrypt {
    /**
     * ENC_KEY String.
     */
    public static final String ENC_KEY = "HsitSx2307621"; // 默认的加密公钥串
                                                          

    public String encrypt(final String pwd) {
        String lpReturnValue = "";
        final String enckey = CAEncrypt.ENC_KEY;
        if (pwd != null && !pwd.equals("")) {
            final byte[] lpPasswordBytes = pwd.getBytes();
            
            final int len1 = lpPasswordBytes.length / enckey.length();
            String longKey = "";
            for (int i = 0; i <= len1; i++) {
                longKey += enckey;
            }
            final byte[] lpLongKeyBytes = longKey.getBytes();
            for (int i = 0; i < pwd.getBytes().length; i++) {
                final byte b1 = lpPasswordBytes[i];
                final byte b2 = lpLongKeyBytes[i];
                String lpResultStr = Integer.toHexString((b1 ^ b2) & 0xFF)
                    .toUpperCase();
                if (lpResultStr.length() < 2) {
                    lpResultStr = "0" + lpResultStr;
                }
                lpReturnValue += lpResultStr;
            }
        }
        return lpReturnValue;
    }

    public String decrypt(final String enPwd) throws DecryptException {
        String lpReturnValue = "";
        final String enckey = CAEncrypt.ENC_KEY;
        if (enPwd != null && !enPwd.equals("")) {
            final int len1 = enPwd.length() / enckey.length();
            String longKey = "";
            for (int i = 0; i <= len1; i++) {
                longKey += enckey;
            }
            final byte[] lpLongKeyBytes = longKey.getBytes();
            final byte[] lpPasswordBytes = new byte[enPwd.length() / 2];
            for (int i = 0; i < lpPasswordBytes.length; i++) {
                final String lpResultStr = enPwd.substring(i * 2, i * 2 + 2);
                lpPasswordBytes[i] = (byte) this.HexToInt(lpResultStr);
            }
            final byte[] lpResultBytes = new byte[lpPasswordBytes.length];
            for (int i = 0; i < lpPasswordBytes.length; i++) {
                final byte b1 = lpPasswordBytes[i];
                final byte b2 = lpLongKeyBytes[i];
                lpResultBytes[i] = (byte) (b1 ^ b2);
            }
            try {
                lpReturnValue = StrUtil.GBToUnicode(new String(lpResultBytes,
                        "ISO8859_1"));
            } catch (final Exception ex) {
            }
        }
        return lpReturnValue;
        
    }
    

    public int HexToInt(final String lpHexStr) {
        int lpReturnValue = 0;
        int lpResult, hiw, low;
        if (lpHexStr != null && !lpHexStr.equals("")) {
            final int[] lpIntArr = new int[lpHexStr.length()];
            for (int i = 0; i < lpHexStr.length(); i++) {
                final String str1 = lpHexStr.substring(i, i + 1).toLowerCase();
                if (str1.equals("a")) {
                    lpResult = 10;
                } else if (str1.equals("b")) {
                    lpResult = 11;
                } else if (str1.equals("c")) {
                    lpResult = 12;
                } else if (str1.equals("d")) {
                    lpResult = 13;
                } else if (str1.equals("e")) {
                    lpResult = 14;
                } else if (str1.equals("f")) {
                    lpResult = 15;
                } else {
                    lpResult = Integer.parseInt(str1);
                }
                lpIntArr[i] = lpResult;
            }
            hiw = lpIntArr[0];
            low = lpIntArr[1];
            lpReturnValue = hiw * 16 + low;
        }
        return lpReturnValue;
    }
    

    public static void main(final String[] args) {
        try {
            final CAEncrypt test = new CAEncrypt();
            System.out.print(test.encrypt("123456"));
            System.out.print(test.decrypt("79415A40664E"));
        } catch (final Exception e) {
        }
    }
    
}
