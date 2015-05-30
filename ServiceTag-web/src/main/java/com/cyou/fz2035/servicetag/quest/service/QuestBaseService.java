package com.cyou.fz2035.servicetag.quest.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.type.TypeReference;

import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.quest.bean.Head;
import com.cyou.fz2035.servicetag.quest.bean.Quest;
import com.cyou.fz2035.servicetag.quest.bean.QuestClass;
import com.cyou.fz2035.servicetag.quest.bean.Response;
import com.cyou.fz2035.servicetag.utils.UnCaughtException;
import com.cyou.fz2035.servicetag.utils.context.AppContext;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import com.cyou.fz2035.servicetag.utils.http.HttpClientReq;
import com.cyou.fz2035.servicetag.utils.web.JsonUtil;

/**
 * @Description .
 * @author QiSF
 * @date 2014年12月17日
 */
public class QuestBaseService {

	private final static String URL = ServiceTagConstants.QUEST_URL;

	private final static String TERMINAL_TYPE = "3";// 问卷系统服务号标识

	private final static String CMD_TYPE_FLLB = "03";// 分类列表
	private final static String CMD_TYPE_WJTJ = "10";// 问卷添加
	private final static String CMD_TYPE_WJSC = "12";// 问卷删除
	private final static String CMD_TYPE_WJFB = "17";// 问卷发布
	private final static String CMD_TYPE_WJLB = "32";// 问卷列表
	private final static String CMD_TYPE_GZGX = "34";// 关注更新
	private final static String CMD_TYPE_GZFWH = "35";// 服务号名称更新
	private final static String CMD_TYPE_GZFQT = "36";// 服务号启用停用

	/**
	 * 获取问卷分类列表.
	 * 
	 * @return
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	public static List<QuestClass> getQuestClassList() {
		Map<String, String> headMap = getHeadMap(CMD_TYPE_FLLB);
		Map<String, Object> bodyMap = new HashMap<String, Object>();
		String responseJson = getResponseJson(headMap, bodyMap);
		Response<QuestClass> responseBean = JsonUtil.toObject(responseJson, new TypeReference<Response<QuestClass>>() {
		});
		Head head = responseBean.getHead();
		if (!head.getResult().equals("0")) {
			throw new UnCaughtException(head.getResultDesc());
		}
		List<QuestClass> questClassList = responseBean.getBody();
		return questClassList;
	}

	/**
	 * 问卷添加.
	 * 
	 * @return
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	public static boolean addQuest(String title, String classId, String serviceTagId, String serviceTagName) {
		Map<String, String> headMap = getHeadMap(CMD_TYPE_WJTJ);
		Map<String, Object> bodyMap = new HashMap<String, Object>();
		List<Map<String, Object>> questionList = new ArrayList<Map<String, Object>>();
		bodyMap.put("id", "");
		bodyMap.put("type", 1);// 1---问卷添加 2---问卷更新 3---编辑发布
		bodyMap.put("title", title);
		bodyMap.put("note", "");
		bodyMap.put("class_id", classId);
		bodyMap.put("user_class_ids", "-1");
		bodyMap.put("collect_number", 0);
		bodyMap.put("collect_day", "");
		bodyMap.put("creater", serviceTagName);
		bodyMap.put("create_date", new Date().getTime());
		bodyMap.put("edit_date", new Date().getTime());
		bodyMap.put("status", 0);
		bodyMap.put("tag", "");
		bodyMap.put("error_tag", "");
		bodyMap.put("release", 0);
		bodyMap.put("questions", questionList);
		bodyMap.put("user_server_id", serviceTagId);
		String responseJson = getResponseJson(headMap, bodyMap);
		Response<String> responseBean = JsonUtil.toObject(responseJson, new TypeReference<Response<String>>() {
		});
		Head head = responseBean.getHead();
		if (!head.getResult().equals("0")) {
			throw new UnCaughtException(head.getResultDesc());
		}
		return true;
	}

	/**
	 * 问卷删除.
	 * 
	 * @return
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	public static boolean delQuest(int id, String serviceTagId) {
		Map<String, String> headMap = getHeadMap(CMD_TYPE_WJSC);
		Map<String, Object> bodyMap = new HashMap<String, Object>();
		bodyMap.put("id", id);
		bodyMap.put("user_server_id", serviceTagId);
		bodyMap.put("opt", 0);
		String responseJson = getResponseJson(headMap, bodyMap);
		Response<String> responseBean = JsonUtil.toObject(responseJson, new TypeReference<Response<String>>() {
		});
		Head head = responseBean.getHead();
		if (!head.getResult().equals("0")) {
			throw new UnCaughtException(head.getResultDesc());
		}
		return true;
	}

	/**
	 * 问卷发布.
	 * 
	 * @return
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	public static boolean publishQuest(int id, String userIds, String userNames) {
		Map<String, String> headMap = getHeadMap(CMD_TYPE_WJFB);
		Map<String, Object> bodyMap = new HashMap<String, Object>();
		bodyMap.put("id", id);
		bodyMap.put("user_class_ids", userIds);
		bodyMap.put("user_names", userNames);
		String responseJson = getResponseJson(headMap, bodyMap);
		Response<String> responseBean = JsonUtil.toObject(responseJson, new TypeReference<Response<String>>() {
		});
		Head head = responseBean.getHead();
		if (!head.getResult().equals("0")) {
			throw new UnCaughtException(head.getResultDesc());
		}
		return true;
	}

	/**
	 * 查询问卷列表.
	 * 
	 * @return
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	public static List<Quest> queryQuestPageList(String serviceTagId, String title, int status, int page, int count) {
		Map<String, String> headMap = getHeadMap(CMD_TYPE_WJLB);
		Map<String, Object> bodyMap = new HashMap<String, Object>();
		bodyMap.put("user_server_id", serviceTagId);
		bodyMap.put("title", title);
		bodyMap.put("status", status);
		bodyMap.put("page", page);
		bodyMap.put("count", count);
		String responseJson = getResponseJson(headMap, bodyMap);
		Response<Quest> responseBean = JsonUtil.toObject(responseJson, new TypeReference<Response<Quest>>() {
		});
		Head head = responseBean.getHead();
		if (!head.getResult().equals("0")) {
			throw new UnCaughtException(head.getResultDesc());
		}
		List<Quest> questList = responseBean.getBody();
		return questList;
	}

	/**
	 * 更新问卷关注对象.
	 * 
	 * @return
	 * @author QiSF
	 * @date 2015年1月16日
	 */
	public static boolean updateFocus(int type, String serviceTagId) {
		Map<String, String> headMap = getAppHeadMap(CMD_TYPE_GZGX);
		Map<String, Object> bodyMap = new HashMap<String, Object>();
		bodyMap.put("type", type);
		bodyMap.put("user_server_id", serviceTagId);
		String responseJson = getResponseJson(headMap, bodyMap);
		Response<String> responseBean = JsonUtil.toObject(responseJson, new TypeReference<Response<String>>() {
		});
		Head head = responseBean.getHead();
		if (!head.getResult().equals("0")) {
			throw new UnCaughtException(head.getResultDesc());
		}
		return true;
	}

	/**
	 * 更新服务号名称.
	 * 
	 * @return
	 * @author QiSF
	 * @date 2015年1月16日
	 */
	public static boolean updateServiceTagName(String serviceTagId, String serviceTagName) {
		Map<String, String> headMap = getHeadMap(CMD_TYPE_GZFWH);
		Map<String, Object> bodyMap = new HashMap<String, Object>();
		bodyMap.put("user_server_id", serviceTagId);
		bodyMap.put("server_name", serviceTagName);
		String responseJson = getResponseJson(headMap, bodyMap);
		Response<String> responseBean = JsonUtil.toObject(responseJson, new TypeReference<Response<String>>() {
		});
		Head head = responseBean.getHead();
		if (!head.getResult().equals("0")) {
			throw new UnCaughtException(head.getResultDesc());
		}
		return true;
	}

	/**
	 * 更新服务号状态通知.
	 * 
	 * @author QiSF
	 * @date 2015年1月29日
	 */
	public static boolean updateServiceTagStatus(String serviceTagId, int type) {
		Map<String, String> headMap = getHeadMap(CMD_TYPE_GZFQT);
		Map<String, Object> bodyMap = new HashMap<String, Object>();
		bodyMap.put("type", type);
		bodyMap.put("user_server_id", serviceTagId);
		String responseJson = getResponseJson(headMap, bodyMap);
		Response<String> responseBean = JsonUtil.toObject(responseJson, new TypeReference<Response<String>>() {
		});
		Head head = responseBean.getHead();
		if (!head.getResult().equals("0")) {
			throw new UnCaughtException(head.getResultDesc());
		}
		return true;
	}

	/**
	 * 获取响应返回的json.
	 * 
	 * @param headMap
	 * @param bodyMap
	 * @return
	 * @author QiSF
	 * @return
	 * @date 2014年12月17日
	 */
	private static String getResponseJson(Map<String, String> headMap, Map<String, Object> bodyMap) {
		String reqData = getQuestJsonString(headMap, bodyMap);
		HttpClientReq httpClientReq = HttpClientReq.build(URL);
		httpClientReq.addParam("reqData", reqData);
		return httpClientReq.post();
	}

	/**
	 * 获取请求head的map.
	 * 
	 * @param cmdType
	 * @return
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	private static Map<String, String> getHeadMap(String cmdType) {
		String userId = WebContext.getLoginUserId().toString();
		String token = WebContext.getLoginTokenString();
		Map<String, String> headMap = new HashMap<String, String>();
		headMap.put("userid", userId);
		headMap.put("token", token);
		headMap.put("terminalType", TERMINAL_TYPE);
		headMap.put("cmdType", cmdType);
		return headMap;
	}

	/**
	 * 获取请求App head的map.
	 * 
	 * @param cmdType
	 * @return
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	private static Map<String, String> getAppHeadMap(String cmdType) {
		String userId = AppContext.getContextUserId().toString();
		String token = AppContext.getContextTokenString();
		Map<String, String> headMap = new HashMap<String, String>();
		headMap.put("userid", userId);
		headMap.put("token", token);
		headMap.put("terminalType", TERMINAL_TYPE);
		headMap.put("cmdType", cmdType);
		return headMap;
	}

	/**
	 * 拼接请求head和body的map返回json.
	 * 
	 * @param headMap
	 * @param bodyMap
	 * @return
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	private static String getQuestJsonString(Map<String, String> headMap, Map<String, Object> bodyMap) {
		Map<String, Object> jsonMap = new HashMap<String, Object>();
		jsonMap.put("head", headMap);
		jsonMap.put("body", Arrays.asList(bodyMap));
		return JsonUtil.toJson(jsonMap);
	}
}
