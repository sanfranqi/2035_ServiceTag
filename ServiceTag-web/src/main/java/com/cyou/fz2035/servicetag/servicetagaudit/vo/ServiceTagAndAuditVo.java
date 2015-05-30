package com.cyou.fz2035.servicetag.servicetagaudit.vo;

import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import lombok.Data;

/**
 * User: littlehui
 * Date: 15-3-20
 * Time: 下午4:04
 */
@Data
public class ServiceTagAndAuditVo {
    private Integer id;
    private Integer serviceTagId;
    private String serviceTagName;
    private String serviceTagImg;
    private String serviceTagType;
    private String serviceTagFacade;
    private Long createTime;
    /**
     * 11 通过
     * 13 未通过
     * 12 待审核
     */
    private String status;
    private Long createUser;
    private String createUserName;
    private String remark;
    private String serviceTagTypeName;

    /**
     * 未审核前的服务号信息
     */
    private String oldServiceTagName;
    private String oldServiceTagImg;
    private String oldServiceTagType;
    private String oldServiceTagFacade;
    private String oldServiceTagTypeName;
    private String oldRemark;
}
