package com.cyou.fz2035.servicetag.servicedetail;

import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.utils.ListUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * User: littlehui
 * Date: 14-12-17
 * Time: 下午3:51
 */
public class ThirdResultVO {

    /**
     * 失败，成功回滚
     */
    public static final String ERROR_CODE_REEND= "20000";

    /**
     * 失败并且未能回滚
     */
    public static final String ERROR_CODE_NOREEND = "20001";

    /**
     *
     */
    private static final long serialVersionUID = 5818701239255621332L;

    /**
     * 是否成功.
     */
    private boolean isSuccess = true;

    /**
     * 提示信息.
     */
    private List<String> msg = new ArrayList<String>();

    /**
     * 错误代码.
     */
    private List<String> errorCode = new ArrayList<String>();

    private Object data;

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public static String getErrorCodeNoreend() {
        return ERROR_CODE_NOREEND;
    }

    public static String getErrorCodeReend() {
        return ERROR_CODE_REEND;
    }

    public ThirdResultVO() {

    }

    /**
     * @return the isSuccess
     */
    public boolean isSuccess() {
        return isSuccess;
    }

    /**
     * @param isSuccess the isSuccess to set
     */
    public void setSuccess(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }

    /**
     * @return the msg
     */
    public List<String> getMsg() {
        return msg;
    }

    /**
     * @param msg the msg to set
     */
    public void setMsg(List<String> msg) {
        this.msg = msg;
    }

    /**
     * @return the errorCode
     */
    public List<String> getErrorCode() {
        return errorCode;
    }

    /**
     * @param errorCode the errorCode to set
     */
    public void setErrorCode(List<String> errorCode) {
        this.errorCode = errorCode;
    }

    /**
     * 获得提示信息的字符串.
     *
     * @return
     * @author qingwu
     * @date 2014-1-20 上午11:19:55
     */
    public String getStringMsg() {
        String str = "";
        for (String temp : this.msg) {
            str += temp + "\n";
        }
        return str;
    }

    /**
     *
     * @return
     */
    public String getStringMsg2() {
        String str = "";
        for (int i = 0; i < this.msg.size(); i++) {
            if (i != 0) {
                str += ",";
            }
            str += this.msg.get(i);
        }
        return str;
    }

    /**
     * 添加提示信息.
     */
    public ThirdResultVO addMsg(String s) {
        this.msg.add(s);
        return this;
    }

    /**
     * 添加错误代码.
     */
    public ThirdResultVO addErrorCode(String e) {
        this.errorCode.add(e);
        return this;
    }

    /**
     * 获得错误代码，多个用逗号','相隔.
     *
     * @return
     * @author qingwu
     * @date 2014-2-8 下午3:23:03
     */
    public String getErrorCodeStr() {
        String s = "";
        for (String _s : this.errorCode) {
            if (!s.equals("")) {
                s += ",";
            }
            s += _s;
        }
        return s;
    }

    /**
     * 转response.
     *
     * @param r
     * @author qingwu
     * @date 2014-1-27 下午4:26:53
     */
    public <T> void toResponse(Response<T> r) {
        if (this.isSuccess == true) {
            r.setResult(Response.RESULT_SUCCESS);
            for (String s : this.msg) {
                r.getMessages().add(s);
            }
        } else {
            r.setResult(Response.RESULT_FAILURE);
            for (String s : this.msg) {
                r.getMessages().add(s);
            }
        }
    }

    public <T> Response<T> toResponse() {
        Response response;
        if (this.isSuccess == true) {
            response = Response.getSuccessResponse();
            for (String s : this.msg) {
                response.getMessages().add(s);
            }
            response.setData(this.getData());
            for (String s : this.msg) {
                response.getMessages().add(s);
            }
            response.setData(this.getData());
        } else {
            response = Response.getFailedResponse();
            for (String s : this.msg) {
                response.getMessages().add(s);
            }
            if (this.getErrorCodeStr() != null) {
                response.setError(this.getErrorCodeStr());
            }
        }
        return response;
    }
}
