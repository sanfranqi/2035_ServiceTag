package com.cyou.fz2035.servicetag.servicetag.vo;

import lombok.Data;

/**
 * User: littlehui Date: 14-11-27 Time: 下午5:54
 */
@Data
public class ServiceTagListVo {
	private Integer id;
	private String serviceTagName;
	private String serviceTagImg;
	private String remark;
	private String firstChar;
    private String serviceTagCode;

    public int hashCode() {
        return serviceTagCode.hashCode();
    }

    public boolean equals(Object obj) {
        if (obj instanceof ServiceTagListVo) {
            return this.hashCode() == ((ServiceTagListVo)obj).hashCode();
        }
        return false;
    }
}
