package com.cyou.fz2035.servicetag.soaservices.model;

import java.io.Serializable;

/**
 * 项目名:cmsSOA
 * 描述：查询分页对象
 *        </br>pageNo：分页页码,从1开始 默认1
 *        </br>pageSize：分页大小，默认10
 * 包:com.cyou.fz.services.cms.model
 * 作者: cnJason
 * 日期: 13-10-18
 * 时间: 下午4:15
 */
public class PageParam implements Serializable{
    /**
	 * 
	 */
	private static final long serialVersionUID = -8033431721826556379L;
	/**
     * pageNo：分页页码
     */
    private int pageNo=1;
    /**
     *  pageSize：分页大小
     */
    private int pageSize=10;
    /**
     * 是否分页，true 是 false：否。 默认true
     */
    private boolean isPage =true;
    /**
     * get pageNo：分页页码
     * @return pageNo：分页页码
     */
    public int getPageNo() {
        return pageNo;
    }

    /**
     * set pageNo：分页页码
     * @param pageNo pageNo：分页页码
     */
    public void setPageNo(int pageNo) {
        this.pageNo = pageNo;
    }

    /**
     * get pageSize：分页大小
     * @return pageSize：分页大小
     */
    public int getPageSize() {
        return pageSize;
    }

    /**
     * set pageSize：分页大小
     * @param pageSize pageSize：分页大小
     */
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    /**
     * @param pageNo ：分页页码,从1开始 默认1
     * @param pageSize 分页大小，默认10
     */
    public PageParam(int pageNo, int pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
    }

    public boolean isPage() {
        return isPage;
    }

    public void setPage(boolean page) {
        isPage = page;
    }

    public PageParam(){}
}
