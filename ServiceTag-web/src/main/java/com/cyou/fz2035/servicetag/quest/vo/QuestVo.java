package com.cyou.fz2035.servicetag.quest.vo;

import lombok.Data;

/**
 * @Description .
 * @author QiSF
 * @date 2014年12月17日
 */
@Data
public class QuestVo {
	private int id;// 问卷id
	private String name;// 标题
	private String createDate;// 创建时间
	private String editDate;// 编辑时间
	private int count;// 收到答卷数
	private String serviceTagId;// 服务号ID
	private String statusName;// 发布状态（0未发布1已发布2停止收集）
}
