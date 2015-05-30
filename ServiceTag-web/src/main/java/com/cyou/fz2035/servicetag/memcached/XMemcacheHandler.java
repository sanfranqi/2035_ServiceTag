package com.cyou.fz2035.servicetag.memcached;

import net.rubyeye.xmemcached.MemcachedClient;
import net.rubyeye.xmemcached.exception.MemcachedException;

import java.util.concurrent.TimeoutException;

/**
 * UserInfo: wangj Date: 13-12-2 Time: 下午5:18
 */
public class XMemcacheHandler {
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
	private static Object LOCK = new Object();

	private MemcachedClient client;

	/**
	 * 用 “_” 连接每个key
	 *
	 * @param names
	 * @return
	 */
	public static String combineKeys(String... names) {
		StringBuilder sb = new StringBuilder();
		for (String name : names) {
			sb.append(name).append(DOT);
		}
		String key = sb.toString();
		return key.substring(0, key.length() - 1);
	}

	/**
	 * 计算缓存时间
	 */
	public static int getCacheHours(int hour) {
		return ONE_HOUR * hour;
	}

	public static int getCacheDays(int day) {
		return ONE_DAY * day;
	}

	public static int getCacheMinute(int minute) {
		return ONE_MINUTE * minute;
	}

	public void set(String key, int time, Object value) {
		try {
			getClient().set(key, time, value);
		} catch (TimeoutException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		} catch (MemcachedException e) {
			e.printStackTrace();
		}
	}

	public void set(String key, Object value) {
		this.set(key, 0, value);
	}

	public Object get(String key) {
		try {
			return getClient().get(key);
		} catch (TimeoutException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		} catch (MemcachedException e) {
			e.printStackTrace();
		}
		return null;
	}

	public Object get(String... keys) {
		try {
			return getClient().get(combineKeys(keys));
		} catch (TimeoutException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		} catch (MemcachedException e) {
			e.printStackTrace();
		}
		return null;
	}

	private MemcachedClient getClient() {
		return client;
	}

	/**
	 * 清除缓存中内容
	 *
	 * @param key
	 */
	public void delete(String key) {
		try {
			getClient().delete(key);
		} catch (TimeoutException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		} catch (MemcachedException e) {
			e.printStackTrace();
		}
	}


	public void setClient(MemcachedClient client) {
		this.client = client;
	}
}
