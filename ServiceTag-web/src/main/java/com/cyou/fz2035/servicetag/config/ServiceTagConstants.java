package com.cyou.fz2035.servicetag.config;

import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;

public class ServiceTagConstants {

	/**
	 * 用户组类型：好友组
	 */
	public static String GROUP_TYPE_FRIEND = "10";
	/**
	 * 用户组类型：黑名单
	 */
	public static String GROUP_TYPE_BLACKLIST = "11";
	/**
	 * 用户组类型：自定义
	 */
	public static String GROUP_TYPE_CUSTOM = "12";

	public static String DOMAIN_URL = ApplicationContextUtil.getBean(SystemConfig.class).getDomainUrl();

	public static String ADMINUSERIDS = ApplicationContextUtil.getBean(SystemConfig.class).getAdmins();

	public static String MATRIXURL = ApplicationContextUtil.getBean(SystemConfig.class).getMartixUrl();

	public static String REWARD_URL = ApplicationContextUtil.getBean(SystemConfig.class).getRewardUrl();

	public static String QUEST_URL = ApplicationContextUtil.getBean(SystemConfig.class).getQuestUrl();

	public static String QUEST_PAGE_URL = ApplicationContextUtil.getBean(SystemConfig.class).getQuestPageUrl();

	public static String FILE_IMAGEPATH = ApplicationContextUtil.getBean(SystemConfig.class).getFileImagePath();

	public static String FILE_SYSTEMPATH = ApplicationContextUtil.getBean(SystemConfig.class).getFileSystemUrl();

	public static Integer SERVICETAG_IMAGE_SIZE = ApplicationContextUtil.getBean(SystemConfig.class).getFileSize();

	public static String REWARD_DOMAIN_URL = ApplicationContextUtil.getBean(SystemConfig.class).getRewardDomainUrl();

	public static String USER_IMAGE_PATH = ApplicationContextUtil.getBean(SystemConfig.class).getUserImagePath();

	// 没用了
	public static String FILE_PATH = "D:/Program Files (x86)/resin-4.0.28-jeecg/webapps/filePath/";

	public final static int DEFAULT_LOGIN_TYPE = 2;

	public final static int LOGIN_TYPE_APP = 1;

	public final static String GROUP_FRIEND_NAME = "好友分组";

	public final static String GROUP_BLACK_NAME = "黑名单";

	// 服务号头像类型
	public static String AVATAR_LARGE = "big.jpg";// 大头像
	public static String AVATAR_MEDIUM = "middle.jpg";// 中等头像
	public static String AVATAR_SMALL = "small.jpg";// 小头像
	public static String AVATAR_MIN = "min.jpg";// 小头像
	public static Integer AVATAR_LARGE_SIZE = 200;// 大头像
	public static Integer AVATAR_MEDIUM_SIZE = 128;// 中等头像
	public static Integer AVATAR_SMALL_SIZE = 50;// 小头像
	public static Integer AVATAR_MINI_SIZE = 30;// 迷你头像
	// 状态 10：启用 11：停用 12:未启用(未审批)
	public static String SERVICETAG_STATUS_NEW = "12";
	public static String SERVICETAG_STATUS_USE = "10";
	public static String SERVICETAG_STATUS_STOP = "11";
	// 100：任务管理
	// 101：日程管理
	// 102：悬赏招募
	// 103：问卷平台
	// 999：其他
	public static String SERVICE_BASE_TYPE_AGENDA = ServiceTypeEnum.AGENDA.getCode();
	public static String SERVICE_BASE_TYPE_TASK = ServiceTypeEnum.TASK.getCode();
	public static String SERVICE_BASE_TYPE_REWARD = ServiceTypeEnum.REWARD.getCode();
	public static String SERVICE_BASE_TYPE_OTHERS = ServiceTypeEnum.OTHERS.getCode();

	// 10未发布
	// 11已发布
	public static String SERVICE_BASE_STATUS_PUBLISHED = "11";
	public static String SERVICE_BASE_STATUS_UNPUBLISH = "10";

	public static String SSO_LOGIN_URL = "sso/login";
	public static String ADMIN_MAIN_URL = "index";
	public static String ADMIN_MAIN_USER_URL = "index/user";
	public static String ADMIN_MAIN_ADMIN_URL = "index/admin";

	public static String ZIMG_UPDATE_URL = ApplicationContextUtil.getBean(SystemConfig.class).getZimgUrl() + "/upload";// http://10.5.27.61:4869/upload";

	public static String ZIMG_URL = ApplicationContextUtil.getBean(SystemConfig.class).getZimgUrl();

	/**
	 * 是否发布到日程：发布
	 */
	public static String SEND_AGENDA = "0";
	/**
	 * 是否发布到日程：不发布
	 */
	public static String NO_SEND_AGENDA = "1";

	public static Long SERVICETAG_MATRIX_BASE_ID = 20000000000L;

	public static String LOGIN_TOKEN_REMEMBER = "ServiceTagTokenRemember";

	public static String LOGIN_ISREMEMBER = "remember";

	public static String ISLOGIN = "isFirstLogin";

}
