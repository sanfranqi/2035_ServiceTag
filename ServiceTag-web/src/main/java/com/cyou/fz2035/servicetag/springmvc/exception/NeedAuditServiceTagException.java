package com.cyou.fz2035.servicetag.springmvc.exception;

/**
 * User: littlehui
 * Date: 15-3-12
 * Time: 下午6:18
 */
public class NeedAuditServiceTagException extends BusinessException {

    public NeedAuditServiceTagException() {
        super("需要审核修改。");
    }
}
