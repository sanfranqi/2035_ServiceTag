package com.cyou.fz2035.servicetag.utils.bean;


import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;

public class Token implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4648513543632562397L;

	private String deviceToken;

	private String webToken;

	public String getDeviceToken() {
		return deviceToken;
	}

	public void setDeviceToken(String deviceToken) {
		this.deviceToken = deviceToken;
	}

	public String getWebToken() {
		return webToken;
	}

	public void setWebToken(String webToken) {
		this.webToken = webToken;
	}

	private MatrixUserInfo user;

	public MatrixUserInfo getUser() {
		return user;
	}

	public void setUser(MatrixUserInfo user) {
		this.user = user;
	}

}
