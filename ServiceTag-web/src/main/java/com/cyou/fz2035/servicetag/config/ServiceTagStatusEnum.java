package com.cyou.fz2035.servicetag.config;

/**
 * User: littlehui
 * Date: 14-12-23
 * Time: 上午11:31
 */
public enum ServiceTagStatusEnum {
    INUSE("启用", "10"),
    STOPUSE("停用", "11"),
    UNCHECK("未审核", "12"),
    RECHECK("未通过", "13"),
    OTHERS("其它", "99");
    private String name;
    private String code;

     private ServiceTagStatusEnum(String name, String code) {
        this.name = name;
        this.code = code;
    }
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

    public static ServiceTagStatusEnum valueOfCode(String code) {
        ServiceTagStatusEnum[] serviceTagStatusEnums = ServiceTagStatusEnum.values();
        for (ServiceTagStatusEnum serviceTagStatusEnum : serviceTagStatusEnums) {
            if (serviceTagStatusEnum.getCode().equals(code)) {
                return serviceTagStatusEnum;
            }
        }
        return OTHERS;
    }
}