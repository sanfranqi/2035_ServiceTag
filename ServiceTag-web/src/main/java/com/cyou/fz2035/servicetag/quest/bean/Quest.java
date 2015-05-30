package com.cyou.fz2035.servicetag.quest.bean;

import lombok.Data;

/**
 * @Description .
 * @author QiSF
 * @date 2014年12月17日
 */
@Data
public class Quest {
	private int id;// 问卷id
	private String userName;// 发布人姓名
	private String createrId;// 发布人ID
	private String user_server_id;// 服务号ID
	private String url;// 发布人头像
	private String name;// 标题
	private String note;// 描述
	private String create_date;// 创建时间
	private String edit_date;// 编辑时间
	private String end_date;// 结束时间
	private String release_date;// 发布时间
	private int status;// 发布状态（0未发布1已发布2停止收集）
	private int answerStatus;// 默认值0 0—未答 1—已答
	private int count;// 收到答卷数
	private int page;// 总页数
	private int size;// 总条数
}
