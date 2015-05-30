package com.cyou.fz2035.servicetag.quest.bean;

import lombok.Data;

/**
 * @Description .
 * @author QiSF
 * @date 2014年12月17日
 */
@Data
public class Head {
	private String result;
	private String cmdType;
	private String resultDesc;

	@Override
	public String toString() {
		return "HeadBean [result=" + result + ", cmdType=" + cmdType + ", resultDesc=" + resultDesc + "]";
	}

}
