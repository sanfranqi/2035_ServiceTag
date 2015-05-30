package com.cyou.fz2035.servicetag.context.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * @Description .
 * @author QiSF
 * @date 2014年12月26日
 */
/**
 * @Description .
 * @author QiSF
 * @date 2014年12月26日
 */
public class AppPaged<T> implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -3563058571948937207L;

	/*
	 * 总的查询命中数量
	 */
	private int total;

	/*
	 * 当前页码
	 */
	private int pageNo;

	/*
	 * 页面大小
	 */
	private int pageSize = 1;

	/*
	 * 分页数据
	 */
	private List<T> listData = new ArrayList<T>();

	public AppPaged() {

	}

	public AppPaged(List<T> listData, int totalHit, int pageNo, int pageSize) {
		this.listData = listData;
		this.total = totalHit;
		this.pageNo = pageNo;
		this.pageSize = pageSize;
	}

	public AppPaged(List<T> listData, int totalHit, int pageNo, int pageSize, boolean needPaged) {
		int start = (pageNo - 1) * pageSize;
		if (start < 0)
			start = 0;
		int end = pageNo * pageSize;
		if (listData != null && end > listData.size())
			end = listData.size();
		this.listData = listData.subList(start, end);
		this.total = totalHit;
		this.pageNo = pageNo;
		this.pageSize = pageSize;
	}

	public int getTotalHit() {
		return total;
	}

	public void setTotalHit(int totalHit) {
		this.total = totalHit;
	}

	public int getPageNo() {
		return pageNo;
	}

	public void setPageNo(int pageNo) {
		this.pageNo = pageNo;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public List<T> getListData() {
		return listData;
	}

	public void setListData(List<T> listData) {
		this.listData = listData;
	}

	/**
	 * 根据pageSize和totalHit计算总页数
	 * 
	 * @return
	 */
	public int totalPage() {
		int totalPage = this.total / this.pageSize;
		if (this.total % this.pageSize != 0) {
			totalPage = totalPage + 1;
		}
		return totalPage;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

}
