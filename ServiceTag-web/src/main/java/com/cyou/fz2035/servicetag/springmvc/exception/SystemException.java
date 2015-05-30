package com.cyou.fz2035.servicetag.springmvc.exception;

/**
 * User: littlehui
 * Date: 15-2-10
 * Time: 下午4:51
 */
public class SystemException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public SystemException() {
        // TODO Auto-generated constructor stub
    }

    /**
     * @param message
     */
    public SystemException(String message) {
        super(message);
        // TODO Auto-generated constructor stub
    }

    /**
     * @param cause
     */
    public SystemException(Throwable cause) {
        super(cause);
        // TODO Auto-generated constructor stub
    }

    /**
     * @param message
     * @param cause
     */
    public SystemException(String message, Throwable cause) {
        super(message, cause);
        // TODO Auto-generated constructor stub
    }
}
