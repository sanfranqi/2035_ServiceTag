package com.cyou.fz2035.servicetag.utils.web;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;

/**
 * <p>
 * Title: JSON工具类
 * </p>
 * <p>
 * Description: 提供Json格式字符串与对象之间的相互转化
 * </p>
 * 
 * @author 林通
 */
public final class JsonUtil {

	private static Logger logger = LoggerFactory.getLogger(JsonUtil.class);
	// 全局对象映射（线程安全）
	private static ObjectMapper mapper = new ObjectMapper();

	// 不可创建本类实例
	private JsonUtil() {
	}

	static {
		mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
		mapper.getDeserializationConfig().set(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
	}

	/**
	 * response 输出Json格式字符串
	 * 
	 * @param response
	 * @param result
	 * @throws java.io.IOException
	 */
	public static void writeJson(HttpServletResponse response, Object result) throws IOException {
		PrintWriter writer = response.getWriter();
		String json = toJson(result);
		writer.println(json);
	}

	/**
	 * 将对象转化为Json格式字符串
	 * 
	 * @param obj
	 * @return
	 */
	public static String toJson(Object obj) {
		try {
			return mapper.writeValueAsString(obj);
		} catch (Exception ex) {
			logger.error("toJson error：" + obj.getClass().getName(), ex);
			return "{}";
		}
	}

	/**
	 * 将Json格式字符串转化为对象
	 * 
	 * @param <T>
	 * @param json
	 * @param type
	 * @return
	 */
	public static <T> T toObject(String json, Class<T> type) {
		try {
			return mapper.readValue(json, type);
		} catch (Exception ex) {
			logger.error("To " + type.getName() + "> error: " + json, ex);
			return null;
		}
	}

	/**
	 * 将Json格式字符串转化为泛型对象
	 * 
	 * @param <T>
	 * @param json
	 * @param type
	 * @return
	 */
	public static <T> T toObject(String json, TypeReference<T> type) {
		try {
            if("".equals(json)||json==null)
                return null;
			return (T)mapper.readValue(json, type);
		} catch (Exception ex) {
			logger.error("To " + type.getType() + "> error: " + json, ex);
			return null;
		}
	}

}
