package com.cyou.fz2035.servicetag.servicetagaudit.param;

import com.cyou.fz.commons.mybatis.selecterplus.page.PageQueryParam;
import lombok.Data;

/**
 * User: littlehui
 * Date: 15-3-9
 * Time: 下午3:25
 */
@Data
public class ServiceTagAuditParam extends PageQueryParam {
    private Integer serviceTagId;
    private String serviceTagName;
    private String serviceTagImg;
    private String serviceTagFacade;
    private Long createTime;
    /**
     * 10 未审核
     * 11 审核通过
     * 12 审核不通过
     */
    private String status;
    private Long createUser;
    private String remark;
}
