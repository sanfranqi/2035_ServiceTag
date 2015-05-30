package com.cyou.fz2035.servicetag.config;

/**
 * User: littlehui
 * Date: 15-3-9
 * Time: 上午11:15
 */
public enum ServiceTagAuditEnum {
    INCHECK("待审核", "12"),
    RECHECK("未通过", "13"),
    CHECKED("通过", "11"),
    OTHERS("无", "99");

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

    private ServiceTagAuditEnum(String name, String code) {
        this.name = name;
        this.code = code;
    }

    public static ServiceTagAuditEnum valueOfCode(String code) {
        ServiceTagAuditEnum[] serviceTagAuditEnums = ServiceTagAuditEnum.values();
        for (ServiceTagAuditEnum serviceTagAuditEnum : serviceTagAuditEnums) {
            if (serviceTagAuditEnum.getCode().equals(code)) {
                return serviceTagAuditEnum;
            }
        }
        return OTHERS;
    }
}
