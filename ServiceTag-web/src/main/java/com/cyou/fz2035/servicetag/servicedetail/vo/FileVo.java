package com.cyou.fz2035.servicetag.servicedetail.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * User: littlehui
 * Date: 15-1-4
 * Time: 下午5:48
 */

public class FileVo implements Serializable {

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    private String fileName;
    private String fileUrl;
    public FileVo() {

    }
}
