package com.cyou.fz2035.servicetag.servicedetail;

import com.cyou.fz2035.servicetag.servicebase.vo.ServiceBaseVo;
import lombok.Data;

import java.util.Map;

/**
 * User: littlehui
 * Date: 14-11-28
 * Time: 下午2:28
 */
@Data
public class ServiceDetail {
    private ServiceBaseVo serviceBaseVo;
    private Map<String, Object> detailsAddition;
}
