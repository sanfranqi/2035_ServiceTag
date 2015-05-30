package com.cyou.fz2035.servicetag.servicetag.vo;

import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import lombok.Data;

/**
 * User: littlehui
 * Date: 14-12-4
 * Time: 下午6:20
 */
@Data
public class ServiceTagImageVo {
    /**
     *
     */
    private static final long serialVersionUID = 45033305168312657L;

    private static final String SIZE_BIG = "BIG";
    private static final String SIZE_SMALL = "SMALL";
    private static final String SIZE_MIDDLE = "MIDDLE";
    /**
     * BIG
     * MIDDLE
     * MIN
     */
    private String sizeCode;
    private String url;
    private Integer width;
    private Integer height;

    public static ServiceTagImageVo createSmallServiceTagImage(String imgCode) {
        ServiceTagImageVo small = new ServiceTagImageVo();
        small.setHeight(ServiceTagConstants.AVATAR_SMALL_SIZE);
        small.setWidth(ServiceTagConstants.AVATAR_SMALL_SIZE);
        small.setSizeCode(ServiceTagImageVo.SIZE_SMALL);
        small.setUrl(imgCode + "/" + ServiceTagConstants.AVATAR_SMALL);
        return small;
    }

    public static ServiceTagImageVo createMiddleServiceTagImage(String imgCode) {
        ServiceTagImageVo middleSize = new ServiceTagImageVo();
        middleSize.setHeight(ServiceTagConstants.AVATAR_MEDIUM_SIZE);
        middleSize.setWidth(ServiceTagConstants.AVATAR_MEDIUM_SIZE);
        middleSize.setSizeCode(ServiceTagImageVo.SIZE_MIDDLE);
        middleSize.setUrl("images/" +imgCode+"/" + ServiceTagConstants.AVATAR_MEDIUM);
        return middleSize;
    }

    public static ServiceTagImageVo createLargeServiceTagImage(String imgCode) {
        ServiceTagImageVo large = new ServiceTagImageVo();
        large.setHeight(ServiceTagConstants.AVATAR_LARGE_SIZE);
        large.setWidth(ServiceTagConstants.AVATAR_LARGE_SIZE);
        large.setSizeCode(ServiceTagImageVo.SIZE_BIG);
        large.setUrl("images/" + imgCode + "/" + ServiceTagConstants.AVATAR_LARGE);
        return large;
    }
}
