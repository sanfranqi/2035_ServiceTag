package com.cyou.fz2035.servicetag.utils.bean;

public class Box<T> {

	private Integer error_code ; // -1 \ 1 \ 0 \  
	
	private Boolean is_ok ; 
	
	private String error ; // 信息
	
	private T dto ; // 数据


	public Integer getError_code() {
		return error_code;
	}

	public void setError_Code(Integer error_code) {
		this.error_code = error_code;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	public Box(){
		
	}
	
	public Box(int code ,String msg , Object data , boolean is_ok){
		this.error_code = code;
		this.error = msg;
		this.dto = (T)data;
		this.is_ok = is_ok;
	}
	
	public Boolean isIs_ok() {
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

	public Box error(String msg){
		return new Box(10001,msg,null,false);
	}
	
	public Box paramError(String msg){
		return new Box(10101,msg,null,false);
	}
	
	public Box noLogin(String msg){
		return new Box(20001,msg,null,false);
	}
	
	public Box noAuthed(String msg , Object data){
		return new Box(20101,msg,data,false);
	}

	public Box success(String msg , Object data){
		return new Box(00000,msg,data,true);
	}
	
	public Box success(String msg){
		return new Box(00000,msg,null,true);
	}

	
}
