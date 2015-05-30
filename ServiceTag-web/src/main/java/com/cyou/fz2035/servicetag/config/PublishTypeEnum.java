package com.cyou.fz2035.servicetag.config;

/**
 * @Description 发布状态.
 * @author QiSF
 * @date 2014年12月19日
 */
public enum PublishTypeEnum {

	// 发布状态 0未发布1已发布2停止收集
	NO_PUBLISH("未发布", 0), PUBLISHED("已发布", 1), STOP_COLLECT("停止收集", 2);

	private String name;
	private int code;

	private PublishTypeEnum(String name, int code) {
		this.name = name;
		this.code = code;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public static String valueOfCode(int code) {
		PublishTypeEnum[] publishTypes = PublishTypeEnum.values();
		for (PublishTypeEnum publishTypeEnum : publishTypes) {
			if (publishTypeEnum.getCode() == code) {
				return publishTypeEnum.getName();
			}
		}
		return "状态出错";
	}
}
