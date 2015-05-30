package com.cyou.fz2035.servicetag.user.bean;

import lombok.Data;

/**
 * User: littlehui
 * Date: 14-12-17
 * Time: 上午10:48
 */
public class UserInfo {
    private long id;
    private String userName;
    private boolean admin;
    private String token;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
