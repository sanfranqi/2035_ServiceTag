package com.cyou.fz2035.servicetag.config;

import java.util.Map;

public class SystemConfig {
	private String martixUrl;

	private String admins;

	private String domainUrl;

	private String fileImagePath;

	private String rewardUrl;

	private String questUrl;

	private String questPageUrl;

	private String zimgUrl;

	private String rewardDomainUrl;

	private String userImagePath;

	public String getUserImagePath() {
		return userImagePath;
	}

	public void setUserImagePath(String userImagePath) {
		this.userImagePath = userImagePath;
	}

	public String getRewardDomainUrl() {
		return rewardDomainUrl;
	}

	public void setRewardDomainUrl(String rewardDomainUrl) {
		this.rewardDomainUrl = rewardDomainUrl;
	}

	public String getZimgUrl() {
		return zimgUrl;
	}

	public void setZimgUrl(String zimgUrl) {
		this.zimgUrl = zimgUrl;
	}

	private Map<String, String> addItionMap;

	private String fileSystemUrl;

	public String getTempPath() {
		return addItionMap.get("tempPath");
	}

	public Integer getFileSize() {
		return Integer.parseInt(addItionMap.get("fileSize"));
	}

	public Map<String, String> getAddItionMap() {
		return addItionMap;
	}

	public void setAddItionMap(Map<String, String> addItionMap) {
		this.addItionMap = addItionMap;
	}

	public String getRewardUrl() {
		return rewardUrl;
	}

	public void setRewardUrl(String rewardUrl) {
		this.rewardUrl = rewardUrl;
	}

	public String getFileImagePath() {
		return fileImagePath;
	}

	public void setFileImagePath(String fileImagePath) {
		this.fileImagePath = fileImagePath;
	}

	public String getDomainUrl() {
		return domainUrl;
	}

	public void setDomainUrl(String domainUrl) {
		this.domainUrl = domainUrl;
	}

	public String getAdmins() {
		return admins;
	}

	public void setAdmins(String admins) {
		this.admins = admins;
	}

	public String getMartixUrl() {
		return martixUrl;
	}

	public void setMartixUrl(String martixUrl) {
		this.martixUrl = martixUrl;
	}

	public String getMatrixUrl() {
		return martixUrl;
	}

	public String getQuestUrl() {
		return questUrl;
	}

	public void setQuestUrl(String questUrl) {
		this.questUrl = questUrl;
	}

	public String getQuestPageUrl() {
		return questPageUrl;
	}

	public void setQuestPageUrl(String questPageUrl) {
		this.questPageUrl = questPageUrl;
	}

	public String getFileSystemUrl() {
		return fileSystemUrl;
	}

	public void setFileSystemUrl(String fileSystemUrl) {
		this.fileSystemUrl = fileSystemUrl;
	}
}
