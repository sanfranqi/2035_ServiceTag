package com.cyou.fz2035.servicetag.config;

/**
 * User: littlehui
 * Date: 15-1-4
 * Time: 下午7:07
 */
public enum ServiceAttrTypeEnum {
     INTEGER("Integer",Integer.class),
    STRING("String", String.class),
    LONG("Long", Long.class),
    DEFAULT("String", String.class);
    private String code;
    private Class<?> type;
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Class<?> getType() {
        return type;
    }

    public void setType(Class<?> type) {
        this.type = type;
    }

    private ServiceAttrTypeEnum(String code, Class<?> aclass) {
        this.code = code;
        this.type = aclass;
    }

    public static ServiceAttrTypeEnum valueOfCode(String code) {
        ServiceAttrTypeEnum[] ServiceAttrTypeEnums = ServiceAttrTypeEnum.values();
        for (ServiceAttrTypeEnum serviceAttrTypeEnum : ServiceAttrTypeEnums) {
            if (serviceAttrTypeEnum.getCode().equals(code)) {
                return serviceAttrTypeEnum;
            }
        }
        return DEFAULT;
    }
}
