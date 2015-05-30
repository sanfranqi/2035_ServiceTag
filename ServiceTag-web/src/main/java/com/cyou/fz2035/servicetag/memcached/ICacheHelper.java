package com.cyou.fz2035.servicetag.memcached;

/**
 * icache 部分工具类
 * @author wangj
 *	@date 2013-6-8
 */
public class ICacheHelper {
	

	/**
	 * 一分钟的毫秒数
	 */
	private final static int ONE_MINUTE = 60 * 1000;
	/**
	 * 一天的毫秒数
	 */
	private final static int ONE_HOUR = ONE_MINUTE * 1000;
	
	/**
	 * 一天的毫秒数
	 */
	private final static int ONE_DAY = ONE_HOUR * 24;
	
	
	private final static String DOT = ".";
	

	
	/**
	 * 用 “_” 连接每个key
	 * @param names
	 * @return
	 */
	public static String combineKeys(String... names) {
		StringBuilder sb = new StringBuilder();
		for (String name : names) {
			sb.append(name).append(DOT);
		}
		String key = sb.toString();
		return key.substring(0,key.length() - 1);
	}
	
	/**
	 * 计算缓存时间
	 */
	public static int getCacheHours(int hour){
		return ONE_HOUR * hour;
	}
	
	public static int getCacheDays(int day){
		return ONE_DAY * day;
	}
	
	public static int getCacheMinute(int minute) {
		return ONE_MINUTE * minute;
	}
}
