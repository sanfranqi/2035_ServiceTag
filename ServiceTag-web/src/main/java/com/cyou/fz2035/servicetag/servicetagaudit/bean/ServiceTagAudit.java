package com.cyou.fz2035.servicetag.servicetagaudit.bean;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Id;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Table;
import lombok.Data;

/**
 * User: littlehui
 * Date: 15-3-9
 * Time: 上午10:52
 */
@Data
@Table("T_SERVICE_TAG_AUDIT")
public class ServiceTagAudit {
    @Id
    private Integer id;
    private String serviceTagName;
    private String serviceTagImg;
    private String serviceTagType;
    private String serviceTagFacade;
    private Long createTime;
    private Integer serviceTagId;
    /**
     * 11 通过
     * 13 未通过
     * 12 待审核
     */
    private String status;
    private Long createUser;
    private String remark;
    private Boolean deleteFlag;
}
