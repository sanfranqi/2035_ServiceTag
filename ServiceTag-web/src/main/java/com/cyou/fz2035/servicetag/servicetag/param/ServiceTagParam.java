package com.cyou.fz2035.servicetag.servicetag.param;

import com.cyou.fz.commons.mybatis.selecterplus.page.PageQueryParam;
import lombok.Data;

/**
 * User: littlehui
 * Date: 14-11-26
 * Time: 下午4:57
 */
@Data
public class ServiceTagParam extends PageQueryParam {
    private Integer id;
    private String status;
    private Long updateStartTime = Long.MIN_VALUE + 1;
    private Long updateEndTime = Long.MAX_VALUE ;
    private Long createUser;
    private String serviceTagName;
    private String serviceTagCode;
}
