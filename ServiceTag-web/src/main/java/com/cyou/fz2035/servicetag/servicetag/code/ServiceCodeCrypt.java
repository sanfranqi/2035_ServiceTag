package com.cyou.fz2035.servicetag.servicetag.code;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.StringUtil;
import com.cyou.fz2035.servicetag.utils.code.CAEncrypt;
import com.cyou.fz2035.servicetag.utils.code.IEncrypt;
import lombok.Synchronized;

import javax.crypto.NoSuchPaddingException;
import java.security.NoSuchAlgorithmException;

/**
 * User: littlehui
 * Date: 14-11-27
 * Time: 下午3:06
 */
public class ServiceCodeCrypt {

    private String numberFormate="00000000000";

    private String typeFormate="000";

    private String idFormate="0000000000";

    private String formatedCodes = "";

    IEncrypt encrypt;

    private String number;

    private String type;

    private String id;

    private String serviceCode;

    public ServiceCodeCrypt(IEncrypt encrypt) {
        this.encrypt = encrypt;
    }

    public String getNumber() {
        return codeDeformate(number);
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getId() {
        return codeDeformate(id);
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return codeDeformate(type);
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFormatedCodes() {
        return formatedCodes;
    }

    public void setServiceCode(String serviceCode) {
        this.serviceCode = serviceCode;
        try {
            this.codeDeCrypt(serviceCode);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private synchronized String getCodes() {
        formatedCodes = codeFormate(numberFormate, number) + codeFormate(typeFormate, type) + codeFormate(idFormate, id);
        return formatedCodes;
    }

    public String getServiceCode() {
        return encrypt.encrypt(getCodes());
    }


    private String codeFormate(String formate, String sourceString) {
        try {
            int formateInt = formate.length();
            int cutlenth = sourceString.length();
            int remainIndex = formateInt - cutlenth;
            String start = formate.substring(0, remainIndex);
            return start + sourceString;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    private String codeDeformate(String formatedCode) {
        byte[] bytes =formatedCode.getBytes();
        int i = 0;
        for (byte b : bytes) {
            if ('0' == b) {
                i ++;
            } else {
                break;
            }
        }
        return formatedCode.substring(i);
    }

    private ServiceCodeCrypt codeDeCrypt(String formatedCodes) throws Exception{
        String codes = this.encrypt.decrypt(formatedCodes);
        this.number = codes.substring(0, numberFormate.length());
        this.type = codes.substring(numberFormate.length(), typeFormate.length() + numberFormate.length());
        this.id = codes.substring(numberFormate.length() + typeFormate.length(), numberFormate.length() + typeFormate.length() + idFormate.length());
        return this;
    }

    public static void main(String args[]) throws NoSuchPaddingException, NoSuchAlgorithmException {
        ServiceCodeCrypt serviceCodeCrypt = new ServiceCodeCrypt(new CAEncrypt());
        serviceCodeCrypt.setId("1");
        serviceCodeCrypt.setNumber("15705959502");
        serviceCodeCrypt.setType("101");
        System.out.println(serviceCodeCrypt.getServiceCode());
        System.out.println(serviceCodeCrypt.getCodes());
        System.out.println(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
        ServiceCodeCrypt serviceCodeCrypt1 = new ServiceCodeCrypt(new CAEncrypt());
        try {
            serviceCodeCrypt1.codeDeCrypt("79465E446641070A05070403017943594463480203000707");
            System.out.print(serviceCodeCrypt1.getId() + " " + serviceCodeCrypt1.getNumber() +  " " + serviceCodeCrypt1.getType());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
