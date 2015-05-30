package com.cyou.fz2035.servicetag.servicebase.vo;

import lombok.Data;

/**
 * @author QiSF
 * @date 2014年12月24日
 */
@Data
public class TeletextResponse {

	private String url;
	private Integer error;
	private String message;

	private String imageActionName;
	private String imageFieldName;
	private Integer imageMaxSize;
	private String[] imageAllowFiles;
	private Boolean imageCompressEnable;
	private String imageInsertAlign;
	private String imageUrlPrefix;

	private String state;
	private String title;
	private String original;
}
