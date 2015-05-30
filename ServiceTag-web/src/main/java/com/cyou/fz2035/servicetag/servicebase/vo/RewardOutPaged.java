package com.cyou.fz2035.servicetag.servicebase.vo;

import java.util.List;

/**
 * User: littlehui
 * Date: 15-1-19
 * Time: 下午2:34
 */
public class RewardOutPaged {
    private int page;
    private int total;
    private List<Object> rows;

    public List<Object> getRows() {
        return rows;
    }

    public void setRows(List<Object> rows) {
        this.rows = rows;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getPage() {

        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }
}
