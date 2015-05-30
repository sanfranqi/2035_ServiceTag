package com.cyou.fz2035.servicetag.quest.bean;

import java.util.List;

import lombok.Data;

/**
 * @Description .
 * @author QiSF
 * @date 2014年12月17日
 */
@Data
public class Response<T> {
	private List<T> body;
	private Head head;
}
