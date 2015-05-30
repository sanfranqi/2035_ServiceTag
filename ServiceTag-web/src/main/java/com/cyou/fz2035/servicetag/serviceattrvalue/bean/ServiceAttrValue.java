package com.cyou.fz2035.servicetag.serviceattrvalue.bean;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Id;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.annotation.Table;
import lombok.Data;

/**
 * User: littlehui
 * Date: 14-11-28
 * Time: 下午3:37
 */
@Data
@Table("T_SERVICE_ATTR_VALUE")
public class ServiceAttrValue {
    @Id
    private Integer id;
    private String serviceAttrValue;
    private Integer serviceBaseId;
    private String serviceAttrCode;
}
