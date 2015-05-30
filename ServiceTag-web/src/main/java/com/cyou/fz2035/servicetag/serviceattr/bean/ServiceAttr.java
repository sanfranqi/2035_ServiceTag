package com.cyou.fz2035.servicetag.serviceattr.bean;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Column;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Id;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Table;
import lombok.Data;

/**
 * User: littlehui
 * Date: 15-1-4
 * Time: 下午7:02
 */
@Data
@Table("T_SERVICE_ATTR")
public class ServiceAttr {
    @Id
    private Integer id;
    @Column("SERVICE_ATTR_NAME")
    private String serviceAttrName;
    @Column("SERVICE_ATTR_CODE")
    private String serviceAttrCode;
    @Column("SERVICE_TYPE")
    private String serviceType;
    @Column("SERVICE_ATTR_TYPE")
    private String serviceAttrType;
}
