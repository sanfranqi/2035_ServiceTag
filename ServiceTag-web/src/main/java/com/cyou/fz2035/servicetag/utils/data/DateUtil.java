package com.cyou.fz2035.servicetag.utils.data;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.GregorianCalendar;

import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.commons.lang.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * 类说明: 日期工具类.
 * 
 * 类用途：提供日期操作的各种方法
 * 
 * <pre>
 * 修改日期      修改人    修改原因
 * 2013-04-13    qingwu   新建
 * </pre>
 */
public class DateUtil {

	private final static Logger logger = LoggerFactory.getLogger(DateUtil.class);

	/**
	 * 默认的日期格式,yyyy-MM-dd.
	 */
	public static final String ISO_DATE_FORMAT = "yyyy-MM-dd";

	/**
	 * 数字格式的日期格式,yyyyMMdd.
	 */
	public static final String NUMBER_DATE_FORMAT = "yyyyMMdd";

	/**
	 * 数字格式的时间字符串,HHmmss.
	 */
	public static final String NUMBER_TIME_FORMAT = "HHmmss";

	/**
	 * 数字格式的日期时间字符串, yyyyMMddHHmmss.
	 */
	public static final String NUMBER_DATE_TIME_FORMAT = "yyyyMMddHHmmss";

	/**
	 * 默认的日期时间格式,yyyy-MM-dd' 'HH:mm:ss.
	 */
	public static final String ISO_DATE_TIME_FORMAT = "yyyy-MM-dd' 'HH:mm:ss";

	/**
	 * 
	 * 转换日期格式.
	 * 
	 * @param date
	 *            字符型的日期
	 * @param oldFormat
	 *            原始的日期格式
	 * @param newFormat
	 *            新的日期格式
	 * @return 新的日期字符串
	 * 
	 *         <pre>
	 * 修改日期        修改人    修改原因
	 * 2010-12-20        新建
	 * </pre>
	 */
	public static String transformDateFormat(String date, String oldFormat, String newFormat) {
		if (date == null) {
			return null;
		}
		Date tempDate = parseDate(date, oldFormat);
		return formatDate(tempDate, newFormat);
	}

	/**
	 * 
	 * 解析日期,以默认日期格式yyyy-MM-dd进行解析.<br>
	 * 相关方法:{@link #parseDate(String, String)}
	 * 
	 * @param stringDate
	 *            日期字符串
	 * @return 日期对象
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-11-15        新建
	 * 2010-12-07        修改注释和注释格式
	 * </pre>
	 * 
	 */
	public static Date parseDate(String stringDate) {
		return parseDate(stringDate, ISO_DATE_FORMAT);
	}

	/**
	 * 
	 * 解析日期,根据指定的格式进行解析.<br>
	 * 如果解析错误,则返回null
	 * 
	 * @param stringDate
	 *            日期字符串
	 * @param format
	 *            日期格式
	 * @return 日期类型
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-11-15        整理
	 * 2010-12-07        修改注释和注释格式
	 * </pre>
	 * 
	 */
	public static Date parseDate(String stringDate, String format) {
		if (stringDate == null) {
			return null;
		}

		try {
			return DateUtils.parseDate(stringDate, new String[] { format });
		} catch (ParseException e) {
			logger.error("解析日期异常[" + stringDate + ":" + format + "]", e);
		}

		return null;
	}

	/**
	 * 
	 * 解析日期,以所指定的日期格式集合进行解析.<br>
	 * <p>
	 * <li>如果满足其中一个日期格式,解析并且返回<br>
	 * <li>如果没解析成功或者解析错误,则返回null
	 * </p>
	 * 
	 * @param stringDate
	 *            日期字符串
	 * @param formates
	 *            日期格式的集合
	 * @return 日期类型
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-11-15        整理
	 * </pre>
	 * 
	 */
	public static Date parseDate(String stringDate, Collection<String> formates) {
		if (formates == null || formates.size() == 0) {
			throw new IllegalStateException("Date format not set.");
		}

		try {
			return DateUtils.parseDate(stringDate, formates.toArray(new String[formates.size()]));
		} catch (Exception e) {
			logger.error("日期解析错误", e);
		}

		return null;
	}

	/**
	 * 
	 * 以默认的格式"yyyy-MM-dd"格式化日期.
	 * 
	 * @param srcDate
	 *            源日期
	 * @return 格式化后的日期字符串
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-11-15        整理
	 * </pre>
	 * 
	 */
	public static String formatDate(Date srcDate) {
		return formatDate(srcDate, ISO_DATE_FORMAT);
	}

	/**
	 * 以指定的格式格式化日期.
	 * 
	 * @param srcDate
	 *            源日期
	 * @param pattern
	 *            格式
	 * @return 格式化的日期字符串
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-11-15        新建
	 * </pre>
	 * 
	 */
	public static String formatDate(Date srcDate, String pattern) {
		if (srcDate == null) {
			return null;
		}
		return DateFormatUtils.format(srcDate, pattern);
	}

	/**
	 * 格式化time获得指定格式的字符串.
	 * 
	 * @param time
	 *            时间
	 * @param pattern
	 *            格式
	 * @return 格式化后的字符串
	 * @author zhufu
	 * @version 2013年10月18日 上午9:40:01
	 */
	private static String formatDate(long time, String pattern) {
		return DateFormatUtils.format(time, pattern);
	}

	/**
	 * 格式化date获得yyyyMMddHHmmss格式的字符串.
	 * 
	 * @param date
	 *            时间
	 * @return 格式化后的字符串
	 * @author zhufu
	 * @version 2013年10月18日 上午9:41:42
	 */
	public static String formatDateyyyyMMddHHmmss(Date date) {
		return formatDate(date, NUMBER_DATE_TIME_FORMAT);
	}

	/**
	 * 格式化time获得yyyyMMddHHmmss格式的字符串.
	 * 
	 * @param time
	 *            时间
	 * @return 格式化后的字符串
	 * @author zhufu
	 * @version 2013年10月18日 上午9:42:25
	 */
	public static String formatDateyyyyMMddHHmmss(long time) {
		return formatDate(time, NUMBER_DATE_TIME_FORMAT);
	}

	/**
	 * 为指定日期添加N天.
	 * 
	 * @param date
	 *            指定日期
	 * @param amount
	 *            增加天数
	 * @return 计算后的日期
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-11-15        新建
	 * </pre>
	 */
	public static Date addDays(Date date, int amount) {
		return DateUtils.addDays(date, amount);
	}

	/**
	 * 为指定日期添加N月.
	 * 
	 * @param date
	 *            指定日期
	 * @param amount
	 *            增加月数
	 * @return 计算后的日期
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-11-15        新建
	 * </pre>
	 */
	public static Date addMonths(Date date, int amount) {
		return DateUtils.addMonths(date, amount);
	}

	/**
	 * 为指定日期添加N周.
	 * 
	 * @param date
	 *            指定日期
	 * @param amount
	 *            增加周数
	 * @return 计算后的日期
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-11-15        新建
	 * </pre>
	 */
	public static Date addWeeks(Date date, int amount) {
		return DateUtils.addWeeks(date, amount);
	}

	/**
	 * 为指定日期添加N年.
	 * 
	 * @param date
	 *            指定日期
	 * @param amount
	 *            增加年数
	 * @return 计算后的日期
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-11-15        新建
	 * </pre>
	 */
	public static Date addYears(Date date, int amount) {
		return DateUtils.addYears(date, amount);
	}

	/**
	 * 为指定日期添加N小时.
	 * 
	 * @param date
	 *            指定日期
	 * @param amount
	 *            增加小时数
	 * @return 计算后的日期
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-11-15                  整理
	 * </pre>
	 */
	public static Date addHours(Date date, int amount) {
		return DateUtils.addHours(date, amount);
	}

	/**
	 * 为指定日期添加N分钟.
	 * 
	 * @param date
	 *            指定日期
	 * @param amount
	 *            增加分钟数
	 * @return 计算后的日期
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-11-15        整理
	 * </pre>
	 */
	public static Date addMinutes(Date date, int amount) {
		return DateUtils.addMinutes(date, amount);
	}

	/**
	 * 为指定日期添加N秒.
	 * 
	 * @param date
	 *            指定日期
	 * @param amount
	 *            增加秒数
	 * @return 计算后的日期
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-11-15        新建
	 * </pre>
	 */
	public static Date addSeconds(Date date, int amount) {
		return DateUtils.addSeconds(date, amount);
	}

	/**
	 * 为指定日期添加N毫秒.
	 * 
	 * @param date
	 *            指定日期
	 * @param amount
	 *            增加毫秒数
	 * @return 计算后的日期
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-11-15        新建
	 * </pre>
	 */
	public static Date addMilliseconds(Date date, int amount) {
		return DateUtils.addMilliseconds(date, amount);
	}

	/**
	 * 获取格式为“yyyyMMdd”的日期.
	 * 
	 * @return 日期字符串
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-04-13        整理
	 * </pre>
	 */
	public static String getDate() {
		return getDate(new Date());
	}

	/**
	 * 获取格式为“yyyyMMdd”的日期.
	 * 
	 * @param date
	 * @return
	 * 
	 *         <pre>
	 * 修改日期        修改人    修改原因
	 * 2012-1-10    陈建榕    新建
	 * </pre>
	 */
	public final static String getDate(Date date) {
		return formatDate(date, NUMBER_DATE_FORMAT);
	}

	/**
	 * 获取格式为“yyyyMMdd”的日期.
	 * 
	 * @param date
	 * @return 日期字符串
	 * 
	 *         <pre>
	 * 修改日期        修改人    修改原因
	 * 2011-12-14    陈建榕    新建
	 * </pre>
	 */
	public static String getDateStr(Date date) {
		return formatDate(date, NUMBER_DATE_FORMAT);
	}

	/**
	 * 获取格式为"yyyyMMdd"的数值型日期.
	 * 
	 * @return
	 * 
	 *         <pre>
	 * 修改日期        修改人    修改原因
	 * 2011-12-14    陈建榕    新建
	 * </pre>
	 */
	public static final Integer getNumDate() {
		return Integer.valueOf(getDate());
	}

	/**
	 * 获取格式为"yyyyMMdd"的数值型日期.
	 * 
	 * @param date
	 * @return
	 * 
	 *         <pre>
	 * 修改日期        修改人    修改原因
	 * 2011-12-14    陈建榕    新建
	 * </pre>
	 */
	public static final Integer getNumDate(Date date) {
		return Integer.valueOf(getDate(date));
	}

	/**
	 * 获取格式“HHmmss”的时间.
	 * 
	 * @return 时间字符串
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-04-13        整理
	 * </pre>
	 */
	public static String getTime() {
		return formatDate(new Date(), NUMBER_TIME_FORMAT);
	}

	/**
	 * 获取格式为“yyyy-MM-dd HH:mm:ss”的日期和时间.
	 * 
	 * @return 时间日期字符串
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-04-13        整理
	 * </pre>
	 */
	public static String getDateTime() {
		return formatDate(new Date(), ISO_DATE_TIME_FORMAT);
	}

	/**
	 * 获取格式为“yyyy-MM-dd HH:mm:ss”的日期和时间.
	 * 
	 * @return 时间日期字符串
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-04-13        整理
	 * </pre>
	 */
	public static String getDateTime(Date date) {
		return formatDate(date, ISO_DATE_TIME_FORMAT);
	}

	/**
	 * 获取格式为“yyyy-MM-dd HH:mm:ss”的日期和时间.
	 * 
	 * @return 时间日期字符串
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2010-04-13        整理
	 * </pre>
	 */
	public static String getDateTime(long time) {
		return formatDate(new Date(time), ISO_DATE_TIME_FORMAT);
	}

	/**
	 * 获取清理了时分秒的日期,只保留年月日的信息.
	 * 
	 * @param date
	 * @return
	 * 
	 *         <pre>
	 * 修改日期        修改人    修改原因
	 * 2011-12-13    陈建榕    新建
	 * </pre>
	 */
	public final static Date getClearDate(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.clear(Calendar.HOUR_OF_DAY);
		calendar.clear(Calendar.AM_PM);
		calendar.clear(Calendar.HOUR);
		calendar.clear(Calendar.MINUTE);
		calendar.clear(Calendar.SECOND);
		calendar.clear(Calendar.MILLISECOND);
		return calendar.getTime();
	}

	/**
	 * 获取清理了时分秒的日期,只保留年月的信息，日为1号.
	 * 
	 * @param date
	 * @return
	 * 
	 *         <pre>
	 * 修改日期        修改人    修改原因
	 * 2011-12-13    陈建榕    新建
	 * </pre>
	 */
	public final static Date getClearMonth(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DAY_OF_MONTH, 1);
		calendar.clear(Calendar.HOUR_OF_DAY);
		calendar.clear(Calendar.AM_PM);
		calendar.clear(Calendar.HOUR);
		calendar.clear(Calendar.MINUTE);
		calendar.clear(Calendar.SECOND);
		calendar.clear(Calendar.MILLISECOND);
		return calendar.getTime();
	}

	/**
	 * 以指定的格式格式化日期.
	 * 
	 * @param srcDate
	 *            源日期
	 * @param pattern
	 *            格式
	 * @return 格式化的日期字符串
	 * 
	 *         <pre>
	 * 修改日期         修改人    修改原因
	 * 2013-07-09  qingwu    新建
	 * </pre>
	 * 
	 */
	public static String formatDate(Timestamp srcDate, String pattern) {
		if (srcDate == null) {
			return null;
		}
		DateFormat sdf = new SimpleDateFormat(pattern);
		return sdf.format(srcDate);
	}

	/**
	 * calcLastWeek(new GregorianCalendar()); 获取上周六
	 * 
	 * @param calendar
	 */
	public static long calcLastWeek() {
		GregorianCalendar calendar = new GregorianCalendar();
		int minus = calendar.get(GregorianCalendar.DAY_OF_WEEK);
		calendar.add(GregorianCalendar.DATE, -minus);
		return calendar.getTime().getTime();
	}

	/**
	 * calcLastWeek(new GregorianCalendar()); 获取上上周六
	 * 
	 * @param calendar
	 */
	public static long calcLastLastWeek() {
		GregorianCalendar calendar = new GregorianCalendar();
		int minus = calendar.get(GregorianCalendar.DAY_OF_WEEK);
		calendar.add(GregorianCalendar.DATE, -minus);
		calendar.add(GregorianCalendar.DATE, -4);
		return calendar.getTime().getTime();
	}

	public static Timestamp dateToTimestamp(Date date, String formater) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(formater);
		String dateStr = simpleDateFormat.format(date);
		try {
			return new Timestamp(simpleDateFormat.parse(dateStr).getTime());
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static Timestamp timemillsToTimestamp(Long timemills, String formater) {
		return dateToTimestamp(new Date(timemills), formater);
	}

	/**
	 * 获取本周开始
	 * 
	 * @param calendar
	 */
	public static Timestamp nowWeekStart() {
		Calendar c = Calendar.getInstance();
		int weekday = c.get(7) - 1;
		c.add(5, -weekday);
		return new Timestamp(c.getTime().getTime());
	}

	/**
	 * 获取本周结束
	 * 
	 * @param calendar
	 */
	public static Timestamp nowWeekEnd() {
		Calendar c = Calendar.getInstance();
		int weekday = c.get(7) - 1;
		c.add(5, -weekday);
		c.add(5, 6);
		return new Timestamp(c.getTime().getTime());
	}

	/**
	 * 获取某个时间的第二天的0点
	 * 
	 * @param time
	 *            时间戳
	 * @return
	 * @author QiSF
	 * @date 2014年12月24日
	 */
	public static long getNextDay(long time) {
		Calendar c = Calendar.getInstance();
		c.setTimeInMillis(time);
		c.set(Calendar.HOUR_OF_DAY, 24);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);
		c.set(Calendar.MILLISECOND, 0);
		return c.getTimeInMillis();
	}

	/**
	 * 将字符串时间转成时间戳
	 * 
	 * @param timeStr
	 *            时间字符串
	 * @param pattern
	 *            时间字符串格式
	 * @return
	 * @author QiSF
	 * @date 2015年3月6日
	 */
	public static long getDate(String timeStr, String pattern) {
		if (timeStr == null) {
			return 0;
		}
		SimpleDateFormat df = new SimpleDateFormat(pattern);
		try {
			Date date = df.parse(timeStr);
			return date.getTime();
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return 0;
	}
}
