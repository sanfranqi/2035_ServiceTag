package com.cyou.fz2035.servicetag.utils.bean;


/**
 * Description:
 * @author:ZhengChao
 * @email:zhengchao730@163.com
 */
public class Group implements java.io.Serializable {
	
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 7935172436391713206L;

	/** 用户组号 -- UUID */
	private Integer uuid;
	
	/** 组昵称 -- GROUP_NAME */
	private String groupName;
	
	private Integer pUuid;

    public Integer getpUuid() {
        return pUuid;
    }

    public void setpUuid(Integer pUuid) {
        this.pUuid = pUuid;
    }

    /** 创建人 -- USER_ID */
	private Integer userId;
	
	/** 组索引 -- GROUP_INDEX */
	private String groupIndex;
	
	/** 组公告 -- GROUP_MSG */
	private String groupMsg;

    public Integer getUuid() {
        return uuid;
    }

    public void setUuid(Integer uuid) {
        this.uuid = uuid;
    }

    public String getGroupName(){
	  return groupName;
	} 
	public void setGroupName(String groupName){
	  this.groupName = groupName;
	}

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getGroupIndex(){
	  return groupIndex;
	} 
	public void setGroupIndex(String groupIndex){
	  this.groupIndex = groupIndex;
	}
	public String getGroupMsg(){
	  return groupMsg;
	} 
	public void setGroupMsg(String groupMsg){
	  this.groupMsg = groupMsg;
	}

}
