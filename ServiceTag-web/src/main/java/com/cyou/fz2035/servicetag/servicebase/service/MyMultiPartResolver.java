package com.cyou.fz2035.servicetag.servicebase.service;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;

/**
 * User: littlehui
 * Date: 14-12-16
 * Time: 下午4:17
 */
public class MyMultiPartResolver extends CommonsMultipartResolver {

    /**
     * url包含图片的文件不做文件处理
     */
    private final static String NOTUSERESOLVER = "Image";


    public boolean isMultipart(HttpServletRequest request) {
/*        String url = request.getRequestURI();

        Boolean result = request != null && ServletFileUpload.isMultipartContent(request);
        if (result) {
            if (url.contains(NOTUSERESOLVER)) {
                result = false;
            }
        }
        return result;*/
        return super.isMultipart(request);
    }
}
