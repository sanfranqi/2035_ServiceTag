package com.cyou.fz2035.servicetag.config;

/**
 * User: littlehui
 * Date: 14-12-23
 * Time: 下午3:47
 */
public enum ServiceBaseStatusEnum {
    UNPUBLISHED("未发布", "10"),
    PUBLISHED("已发布", "11"),
    END("结束", "12"),
    OTHERS("其它", "99");
    private String name;
    private String code;

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

    private ServiceBaseStatusEnum(String name, String code) {
        this.name = name;
        this.code = code;
    }

    public static ServiceBaseStatusEnum valueOfCode(String code) {
        ServiceBaseStatusEnum[] serviceBaseStatusEnums = ServiceBaseStatusEnum.values();
        for (ServiceBaseStatusEnum serviceBaseStatusEnum : serviceBaseStatusEnums) {
            if (serviceBaseStatusEnum.getCode().equals(code)) {
                return serviceBaseStatusEnum;
            }
        }
        return OTHERS;
    }
}
