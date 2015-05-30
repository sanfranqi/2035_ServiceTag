package com.cyou.fz2035.servicetag.user.vo;

import java.io.Serializable;

/**
 * User: littlehui Date: 14-10-28 Time: 下午4:52
 */
public class MatrixUserInfo implements Serializable {

	/** 用户编号 -- USER_ID */
	private Long userId;

	/** 手机硬件码 -- HARD_KEY */
	private String hardKey;

	/** 邮箱 -- E_MAIL */
	private String eMail;

	/** 腾讯QQ -- QQ */
	private String qq;

	/** 昵称账号 -- USER_NICK */
	private String userNick;

	/** 姓名 -- FULL_NAME */
	private String fullName;

	private String sortCode;

	public String getSortCode() {
		return sortCode;
	}

	public void setSortCode(String sortCode) {
		this.sortCode = sortCode;
	}

	/** 姓名全拼 -- NAME_CODE */
	private String nameCode;

	/** 用户密码 -- USER_PWD */
	private String userPwd;
	/** 账号状态 -- CODE_STATE */
	private String codeState;

	/** 密保邮箱 -- PWD_MAIL */
	private String pwdMail;

	/** 性别 -- GENDER */
	private String gender;

	/** 新浪微博 -- WEIBO_SINA */
	private String weiboSina;

	/** 头像 -- AVATAR */
	private String avatar;

	/** 生日 -- BIRTHDAY */
	private java.sql.Timestamp birthday;

	/** 上次密码修改时间 -- PWD_LAST_SET */
	private java.sql.Timestamp pwdLastSet;

	/** 用户创建时间 -- CREATE_DATE */
	private java.sql.Timestamp createDate;
	/** 用户创建时间(字符串类型) */
	private String createDateStr;

	/** 信息最后更新时间 -- DATA_DATE */
	private java.sql.Timestamp dataDate;
	/** 信息最后更新时间(字符串类型) */
	private String dataDateStr;

	public String getCreateDateStr() {
		return createDateStr;
	}

	public void setCreateDateStr(String createDateStr) {
		this.createDateStr = createDateStr;
	}

	public String getDataDateStr() {
		return dataDateStr;
	}

	public void setDataDateStr(String dataDateStr) {
		this.dataDateStr = dataDateStr;
	}

	/** 备注信息 -- COMMENTS */
	private String comments;

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getHardKey() {
		return hardKey;
	}

	public void setHardKey(String hardKey) {
		this.hardKey = hardKey;
	}

	public String getEMail() {
		return eMail;
	}

	public void setEMail(String eMail) {
		this.eMail = eMail;
	}

	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public String getUserNick() {
		return userNick;
	}

	public void setUserNick(String userNick) {
		this.userNick = userNick;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getNameCode() {
		return nameCode;
	}

	public void setNameCode(String nameCode) {
		this.nameCode = nameCode;
	}

	public String getUserPwd() {
		return userPwd;
	}

	public void setUserPwd(String userPwd) {
		this.userPwd = userPwd;
	}

	public String getCodeState() {
		return codeState;
	}

	public void setCodeState(String codeState) {
		this.codeState = codeState;
	}

	public String getPwdMail() {
		return pwdMail;
	}

	public void setPwdMail(String pwdMail) {
		this.pwdMail = pwdMail;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getWeiboSina() {
		return weiboSina;
	}

	public void setWeiboSina(String weiboSina) {
		this.weiboSina = weiboSina;
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	public java.sql.Timestamp getBirthday() {
		return birthday;
	}

	public void setBirthday(java.sql.Timestamp birthday) {
		this.birthday = birthday;
	}

	public java.sql.Timestamp getPwdLastSet() {
		return pwdLastSet;
	}

	public void setPwdLastSet(java.sql.Timestamp pwdLastSet) {
		this.pwdLastSet = pwdLastSet;
	}

	public java.sql.Timestamp getCreateDate() {
		return createDate;
	}

	public void setCreateDate(java.sql.Timestamp createDate) {
		this.createDate = createDate;
	}

	public java.sql.Timestamp getDataDate() {
		return dataDate;
	}

	public void setDataDate(java.sql.Timestamp dataDate) {
		this.dataDate = dataDate;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

}
