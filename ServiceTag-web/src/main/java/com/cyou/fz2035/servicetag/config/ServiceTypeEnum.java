package com.cyou.fz2035.servicetag.config;

import javax.xml.ws.Service;

/**
 * User: littlehui
 * Date: 14-12-2
 * Time: 上午11:10
 */
public enum ServiceTypeEnum {

    AGENDA("日程管理", "101"),
    REWARD("悬赏招募", "102"),
    TASK("任务管理", "100"),
    QUEST("问卷平台", "103"),
    TELETEXT("图文", "104"),
    HREF("超链接", "105"),
    OTHERS("其他", "999"),
    UNKNOWN("未知", "000");


    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    private String name;
    private String code;

    private ServiceTypeEnum(String name, String code) {
        this.name = name;
        this.code = code;
    }

    public static ServiceTypeEnum valueOfCode(String code) {
        ServiceTypeEnum[] serviceTypes = ServiceTypeEnum.values();
        for (ServiceTypeEnum serviceTypeEnum : serviceTypes) {
            if (serviceTypeEnum.getCode().equals(code)) {
                return serviceTypeEnum;
            }
        }
        return OTHERS;
    }
    
    public static String valueTextOfCode(String code) {
        ServiceTypeEnum[] serviceTypes = ServiceTypeEnum.values();
        for (ServiceTypeEnum serviceTypeEnum : serviceTypes) {
            if (serviceTypeEnum.getCode().equals(code)) {
                return serviceTypeEnum.getName();
            }
        }
        return "未知";
    }
}
