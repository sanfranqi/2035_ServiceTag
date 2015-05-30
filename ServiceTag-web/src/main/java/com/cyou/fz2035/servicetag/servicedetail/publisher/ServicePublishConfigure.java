package com.cyou.fz2035.servicetag.servicedetail.publisher;

import com.cyou.fz2035.servicetag.config.ServiceTagConstants;

import java.util.HashMap;
import java.util.Map;

/**
 * User: littlehui
 * Date: 14-12-2
 * Time: 下午4:22
 */
public class ServicePublishConfigure {

    public Map<String, Map<String, String>> paramParis = new HashMap<String, Map<String,String>>();

    public Map<String, Map<String, String>> endParamParis = new HashMap<String, Map<String, String>>();

    public Map<String, String> urlsMap = new HashMap<String, String>();

    public Map<String, String> getUrlsMap() {
        return urlsMap;
    }

    public String getPublishUrlByCode(String code) {
        return urlsMap.get(code + "_publish");
    }

    public String getRePublishUrlByCode(String code) {
        return urlsMap.get(code + "_republish");
    }

    public String getFileUploadUrilByCode(String code) {
        return urlsMap.get(code + "_upload");
    }

    public String getEndUrlByCode(String code) {
        return urlsMap.get(code + "_end");
    }

    public ServicePublishConfigure() {
        Map<String, String> taskParamParis = new HashMap<String, String>();
        taskParamParis.put("serviceName", "taskReceipt.title");
        taskParamParis.put("businessId", "taskReceipt.id");
        taskParamParis.put("serviceDescribe", "taskReceipt.detail");
        taskParamParis.put("startTime", "taskReceipt.start_time");
        taskParamParis.put("endTime", "taskReceipt.end_time");
        paramParis.put(ServiceTagConstants.SERVICE_BASE_TYPE_TASK, taskParamParis);
        Map<String, String> rewardParis = new HashMap<String, String>();
        rewardParis.put("serviceName", "subject");
        rewardParis.put("serviceTagCode", "group");
        rewardParis.put("serviceDescribe", "content");
        rewardParis.put("reviewer", "reviewers");
        /**
         * rewardType
         * 1:积分
         * 2:人民币
         */
        rewardParis.put("rewardType", "award_type");
        rewardParis.put("businessId", "id");
        /**
         * 0:公开
         * 2：不公开
         * 3：悬赏结束后公开
         */
        rewardParis.put("origSecrecy", "is_hide");
        /**
         * 悬赏数值
         */
        rewardParis.put("rewardCount", "award");
        //加上悬赏的完整url
        rewardParis.put("files", "file");
        paramParis.put(ServiceTagConstants.SERVICE_BASE_TYPE_REWARD, rewardParis);
        /***************************/
        /**
         * 结束服务的对应字段
         */
        /**************************/
        //任务结束
        Map<String, String> taskEndPairs = new HashMap<String, String>();
        taskEndPairs.put("businessId", "task_id");
        endParamParis.put(ServiceTagConstants.SERVICE_BASE_TYPE_TASK, taskEndPairs);
    }


    public Map<String, String> getServiceParamPairs(String serviceCode) {
        return paramParis.get(serviceCode);
    }

    public Map<String, String> getServiceEndParamParis(String serviceCode) {
        return endParamParis.get(serviceCode);
    }

    public void setUrlsMap(Map<String, String> urlsMap) {
        this.urlsMap = urlsMap;
    }

    public Map<String, Map<String, String>> getParamParis() {
        return paramParis;
    }

    public void setParamParis(Map<String, Map<String, String>> paramParis) {
        this.paramParis = paramParis;
    }
}
