package com.cyou.fz2035.servicetag.servicetag.vo;

import com.cyou.fz2035.servicetag.config.ServiceTagAuditEnum;
import com.cyou.fz2035.servicetag.config.ServiceTagStatusEnum;

import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import lombok.Data;

/**
 * User: littlehui
 * Date: 14-11-27
 * Time: 下午5:54
 */
@Data
public class ServiceTagVo {
    private Integer id;
    private Integer serviceTagId;
    private String serviceTagType;
    private String serviceTagName;
    //头像
    private String serviceTagImg;
    //皮肤
    private String serviceTagFacade;
    private String status;
    private String serviceTagCode;
    private Long createUser;
    private Long updateTime;
    private String userName;
    private String statusName;
    private String remark;
    private String firstChar;
    private Boolean isFocus;
    private String serviceTagTypeName;
    private Long updateUser;
    private Boolean stopByAdmin;
    private String secondCheckStatusName;
    private String secondCheckStatus;
    private Boolean inAuthDetails;


    public void setServiceTagType(String serviceTagType) {
        this.serviceTagType = serviceTagType;
    }

    public void setStatus(String status) {
        this.status = status;
        this.statusName = ServiceTagStatusEnum.valueOfCode(status).getName();
    }

    public void setSecondCheckStatus(String secondCheckStatus) {
        this.secondCheckStatus = secondCheckStatus;
        this.secondCheckStatusName = ServiceTagAuditEnum.valueOfCode(secondCheckStatus).getName();
    }

    public void setId(Integer id) {
        this.serviceTagId = id;
        this.id = serviceTagId;
    }

    public void setServiceTagId(Integer serviceTagId) {
        this.serviceTagId = serviceTagId;
        this.id = serviceTagId;
    }
}
