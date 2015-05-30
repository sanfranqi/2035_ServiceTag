package com.cyou.fz2035.servicetag.servicebase.vo;

import com.cyou.fz2035.servicetag.config.ServiceBaseStatusEnum;
import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import lombok.Data;

/**
 * User: littlehui Date: 14-11-26 Time: 下午5:51
 */
@Data
public class ServiceBaseVo {
	private Integer id;
    private Integer serviceBaseId;
	private String serviceType;
	private Integer serviceTagId;
	private String serviceName;
	private String serviceAttachFiles;
	private String serviceDescribe;
	private String status;
	private Long publishTime;
	private Long businessId;
	private String statusName;
	private String serviceTypeName;
	private Long updateTime;

    public void setStatus(String status) {
        this.status = status;
        this.statusName = ServiceBaseStatusEnum.valueOfCode(status).getName();
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
        this.serviceTypeName = ServiceTypeEnum.valueOfCode(serviceType).getName();
    }

    public void setServiceBaseId(Integer serviceBaseId) {
        this.serviceBaseId = serviceBaseId;
        this.id = serviceBaseId;
    }

    public void setId(Integer id) {
        this.id = id;
        this.serviceBaseId = id;
    }
}
