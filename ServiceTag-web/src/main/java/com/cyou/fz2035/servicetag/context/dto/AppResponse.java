package com.cyou.fz2035.servicetag.context.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Description .
 * @author QiSF
 * @date 2014年12月26日
 */
public class AppResponse<T> implements Serializable {
	// 成功
	public static final String RESULT_SUCCESS = "success";
	// 未登录, 或者roleId获取失败, 典型的处理方式是显示完信息跳转到登录页
	public static final String RESULT_LOGIN = "login";
	// 业务规则失败或者业务异常(自己在自己的程序各层抛出的异常), 比如扣款时余额不足
	public static final String RESULT_FAILURE = "failure";
	// 表单格式验证失败, 表单业务规则验证失败, 典型的处理方式是显示完信息跳转回表单页
	public static final String RESULT_INPUT = "input";
	// 可以预见但是不能处理的异常, 如SQLException, IOException等等
	public static final String RESULT_ERROR = "error";

	public static final Boolean IS_OK_TRUE = true;

	public static final Boolean IS_OK_FALSE = false;

	/**
	 * 获取成功的返回
	 * 
	 * @return
	 */
	public static <M> AppResponse<M> getSuccessResponse() {
		AppResponse<M> response = new AppResponse<M>();
		response.setResult(RESULT_SUCCESS);
		response.setIs_ok(IS_OK_TRUE);
		return response;
	}

	public static <M> AppResponse<M> getSuccessResponse(M data) {
		AppResponse<M> response = new AppResponse<M>();
		response.setData(data);
		response.setResult(RESULT_SUCCESS);
		response.setIs_ok(IS_OK_TRUE);
		return response;
	}

	public static <M> AppResponse<M> getSuccessResponse(String message) {
		AppResponse<M> response = getSuccessResponse();
		response.setMessage(message);
		response.setError(message);
		return response;
	}

	public static <M> AppResponse<M> getInputFailedResponse() {
		AppResponse<M> response = new AppResponse<M>();
		response.setResult(RESULT_INPUT);
		response.setIs_ok(IS_OK_FALSE);
		return response;
	}

	public static <M> AppResponse<M> getInputFailedResponse(String message) {
		AppResponse<M> resp = AppResponse.getInputFailedResponse();
		resp.setMessage(message);
		resp.setError(message);
		return resp;
	}

	public static <M> AppResponse<M> getFailedResponse(M data) {
		AppResponse<M> response = new AppResponse<M>();
		response.setData(data);
		response.setResult(RESULT_FAILURE);
		response.setIs_ok(IS_OK_FALSE);
		return response;
	}

	public static <M> AppResponse<M> getFailedResponse(String msg) {
		AppResponse<M> resp = getFailedResponse();
		resp.setMessage(msg);
		resp.setError(msg);

		return resp;
	}

	public static <M> AppResponse<M> getFailedResponse() {
		AppResponse<M> response = new AppResponse<M>();
		response.setResult(RESULT_FAILURE);
		response.setIs_ok(IS_OK_FALSE);
		return response;
	}

	/**
		 * 
		 */
	private static final long serialVersionUID = -2049439550666128636L;

	// 标识变量
	private String result;
	// 数组, 存放业务失败提示
	private List<String> messages;
	// 对象, 存放字段格式错误信息
	private Map<String, String> fieldErrors;
	// 数组, 存放系统错误消息
	private List<String> errors;

	private Boolean is_ok;

	private String error;

	private T dto;

	/**
	 * APP端取登入错误码.
	 */
	private String error_code;

	public AppResponse() {
		messages = new ArrayList<String>(1);
		errors = new ArrayList<String>(1);
		fieldErrors = new HashMap<String, String>();
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public List<String> getMessages() {
		return messages;
	}

	/**
	 * 设置业务错误信息
	 * 
	 * @param message
	 */
	public void setMessage(String message) {
		this.messages.clear();
		this.messages.add(message);
	}

	public Map<String, String> getFieldErrors() {
		return fieldErrors;
	}

	/**
	 * 添加字段错误
	 * 
	 * @param key
	 * @param value
	 */
	public void addFieldErrors(String key, String value) {
		this.fieldErrors.put(key, value);
	}

	public List<String> getErrors() {
		return errors;
	}

	/**
	 * 设置系统错误信息
	 * 
	 * @param error
	 */
	public void setError(String error) {
		this.errors.clear();
		this.errors.add(error);
	}

	public T getData() {
		return dto;
	}

	public void setData(T data) {
		this.dto = data;
	}

	public Boolean getIs_ok() {
		return is_ok;
	}

	public void setIs_ok(Boolean is_ok) {
		this.is_ok = is_ok;
	}

	public T getDto() {
		return dto;
	}

	public void setDto(T dto) {
		this.dto = dto;
	}

	public String getError() {
		return error;
	}

	public String getError_code() {
		return error_code;
	}

	public void setError_code(String error_code) {
		this.error_code = error_code;
	}
}
