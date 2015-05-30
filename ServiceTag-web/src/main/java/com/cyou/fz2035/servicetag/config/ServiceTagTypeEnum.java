package com.cyou.fz2035.servicetag.config;

/**
 * User: littlehui
 * Date: 14-12-29
 * Time: 上午10:26
 */
public enum ServiceTagTypeEnum {
    EDUCATION("教育", "100"),
    NEW("互联网", "101"),
    COMPANY("企业", "102"),
    CULTURE("健康", "103"),
    HEALTH("文化", "104"),
    OTHERS("其它", "999");
    private String name;
    private String code;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    private ServiceTagTypeEnum(String name, String code) {
        this.name = name;
        this.code = code;
    }

    public static ServiceTagTypeEnum valueOfCode(String code) {
        ServiceTagTypeEnum[] serviceTagTypeStatusEnums = ServiceTagTypeEnum.values();
        for (ServiceTagTypeEnum serviceTagTypeStatusEnum : serviceTagTypeStatusEnums) {
            if (serviceTagTypeStatusEnum.getCode().equals(code)) {
                return serviceTagTypeStatusEnum;
            }
        }
        return OTHERS;
    }
}
