package com.cyou.fz2035.servicetag.springmvc.exception;

/**
 * User: littlehui
 * Date: 15-2-10
 * Time: 下午4:51
 */
public class BusinessException extends Exception {

    private static final long serialVersionUID = 1L;

    public BusinessException() {
        // TODO Auto-generated constructor stub
    }

    public BusinessException(String message) {
        super(message);
        // TODO Auto-generated constructor stub
    }

    public BusinessException(Throwable cause) {
        super(cause);
        // TODO Auto-generated constructor stub
    }

    public BusinessException(String message, Throwable cause) {
        super(message, cause);
        // TODO Auto-generated constructor stub
    }

    public BusinessException(String message, String cause) {
        super(message, new Throwable(cause));
        // TODO Auto-generated constructor stub
    }
}
