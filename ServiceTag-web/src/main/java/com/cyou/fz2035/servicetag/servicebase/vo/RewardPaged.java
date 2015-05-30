package com.cyou.fz2035.servicetag.servicebase.vo;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;

/**
 * User: littlehui
 * Date: 15-1-19
 * Time: 下午2:32
 */
public class RewardPaged extends Paged<Object> {
    public  RewardPaged(RewardOutPaged paged) {
        this.setPageNo(paged.getPage());
        this.setTotalHit(paged.getTotal());
        this.setListData(paged.getRows());
    }
}
