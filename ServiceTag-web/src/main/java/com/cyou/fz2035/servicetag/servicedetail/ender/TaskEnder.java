package com.cyou.fz2035.servicetag.servicedetail.ender;

import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.utils.bean.Box;
import com.cyou.fz2035.servicetag.utils.http.HttpClientUtil;
import com.cyou.fz2035.servicetag.utils.web.JsonUtil;
import org.apache.http.message.BasicNameValuePair;

/**
 * User: littlehui
 * Date: 14-12-17
 * Time: 下午4:14
 */
public class TaskEnder extends AbstractHttpServiceEnder {

    private static final String TASK_END_TAG = "_serviceid";

    @Override
    protected void prepareEndService(String code, ServiceDetail serviceDetail) {
        super.prepareEndService(code, serviceDetail);
        baseBasicNameValuePair.add(new BasicNameValuePair(TASK_END_TAG, serviceBase.getServiceTagId() + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID + ""));
    }
    @Override
    public String doEndRemoteService() {
        endResult = HttpClientUtil.post(END_URL, baseBasicNameValuePair);
        return endResult;
    }

    @Override
    public ThirdResultVO afterDoEndRemoteService(ThirdResultVO thirdResultVO) {
        //通过endResult拼装thirdResultVO.
        Box box = JsonUtil.toObject(endResult, Box.class);
        thirdResultVO.setSuccess(box.isIs_ok());
        if (!box.isIs_ok()) {
            thirdResultVO.addErrorCode(box.getError_code() + "");
            thirdResultVO.addMsg(box.getError());
        } else {
            thirdResultVO.setData("删除任务成功。");
        }
        return thirdResultVO;
    }

}
