package com.cyou.fz2035.servicetag.servicebase.vo;

import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.utils.bean.Box;

/**
 * User: littlehui
 * Date: 15-1-19
 * Time: 下午2:17
 */
public class RewardResponse<T>extends Response<T> {
    public RewardResponse(Box box) {
        this.setResult(box.isIs_ok() ? "success" : "false");
        this.setMessage(box.getError());
        if (box.getDto() instanceof RewardOutPaged) {
            RewardPaged paged = new RewardPaged((RewardOutPaged)box.getDto());
            this.setData((T)paged);
        }
        this.setError(box.getError());
    }

    public static <T> RewardResponse<T> getResultResponseFromBox(Box box) {
        RewardResponse<T> rewardResponse = new RewardResponse(box);
        return rewardResponse;
    }

    public static <T> RewardResponse<T> getResultResponseFromBox(Box box, int pageSize) {
        RewardResponse<T> rewardResponse = new RewardResponse(box);
        RewardPaged paged = (RewardPaged)rewardResponse.getData();
        paged.setPageSize(pageSize);
        rewardResponse.setData((T)paged);
        return rewardResponse;
    }
}
