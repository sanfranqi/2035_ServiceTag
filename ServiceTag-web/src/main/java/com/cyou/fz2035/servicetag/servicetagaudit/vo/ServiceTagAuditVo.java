package com.cyou.fz2035.servicetag.servicetagaudit.vo;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Id;
import lombok.Data;

/**
 * User: littlehui
 * Date: 15-3-9
 * Time: 上午10:54
 */
@Data
public class ServiceTagAuditVo {
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
}
