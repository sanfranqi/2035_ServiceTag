package com.cyou.fz2035.servicetag.servicetag.vo;

import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.utils.data.ResponseFactory;

/**
 * User: littlehui
 * Date: 15-1-12
 * Time: 上午11:22
 */
public class ValidatorResultVo<T> {
    private Boolean result;
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getResult() {
        return result;
    }

    public void setResult(Boolean result) {
        this.result = result;
    }

    private  ValidatorResultVo(boolean result, String message) {
        this.message = message;
        this.result = result;
    }

    public static ValidatorResultVo DefaultValidationFailureVo() {
        ValidatorResultVo validatorResultVo = new ValidatorResultVo(false, "验证失败。");
        return validatorResultVo;
    }

    public static ValidatorResultVo DefaultValidationSuccessVo() {
        ValidatorResultVo validatorResultVo = new ValidatorResultVo(true, "验证成功。");
        return validatorResultVo;
    }

    public static ValidatorResultVo DefaultValidationFailureVo(String message) {
        ValidatorResultVo validatorResultVo = new ValidatorResultVo(false, message);
        return validatorResultVo;
    }

    public static ValidatorResultVo DefaultValidationSuccessVo(String message) {
        ValidatorResultVo validatorResultVo = new ValidatorResultVo(true, message);
        return validatorResultVo;
    }


    public Response<T> toResponse() {
        if (result) {
            return ResponseFactory.getDefaultSuccessResponse(message);
        } else {
            return ResponseFactory.getDefaultFailureResponse(message);
        }
    }
}
