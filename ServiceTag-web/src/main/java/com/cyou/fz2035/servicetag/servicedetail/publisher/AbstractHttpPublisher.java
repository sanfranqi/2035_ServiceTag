package com.cyou.fz2035.servicetag.servicedetail.publisher;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.servicetag.servicebase.bean.ServiceBase;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetailCover;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import org.apache.http.message.BasicNameValuePair;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * User: littlehui
 * Date: 14-12-5
 * Time: 下午4:48
 */
public abstract class AbstractHttpPublisher implements Publisher {

    public String PUBLISH_URL;

    public String REPUBLISH_URL;

    public List<BasicNameValuePair> baseBasicNameValuePair = new ArrayList<BasicNameValuePair>();

    private ServicePublishConfigure servicePublishConfigure = ApplicationContextUtil.getBean(ServicePublishConfigure.class);

    ServiceDetailCover serviceDetailCover = ApplicationContextUtil.getBean(ServiceDetailCover.class);

    public Map<String, Object> serviceMaps;

    public String publishResult;

    public ServiceBase serviceBase;

    public boolean isRepublisher;

    public boolean isRepublisher() {
        return isRepublisher;
    }

    public void setRepublisher(boolean isRepublisher) {
        this.isRepublisher = isRepublisher;
    }

    /**
     * 初始化http调用，处理url和参数。配置放在了ServicePublishConfigure里。
     * @param code
     * @param serviceDetail
     */
    protected void initPublisher(String code, ServiceDetail serviceDetail) {
        PUBLISH_URL = this.isRepublisher() ? servicePublishConfigure.getRePublishUrlByCode(code) : servicePublishConfigure.getPublishUrlByCode(code);
        serviceMaps = serviceDetailCover.coverToMap(serviceDetail);
        Map<String, Object> serviceMap = serviceDetailCover.coverToMap(serviceDetail);
        Map<String, String> rewardPairs = servicePublishConfigure.getServiceParamPairs(serviceDetail.getServiceBaseVo().getServiceType());
        Set<String> serviceMapKeys = serviceMap.keySet();
        for (String key : serviceMapKeys) {
            if (rewardPairs.get(key) != null && serviceMap.get(key) != null) {
                BasicNameValuePair basicNameValuePair = new BasicNameValuePair(rewardPairs.get(key), serviceMap.get(key).toString());
                baseBasicNameValuePair.add(basicNameValuePair);
            }
        }
        baseBasicNameValuePair.add(new BasicNameValuePair("_t", WebContext.getLoginTokenString()));
        baseBasicNameValuePair.add(new BasicNameValuePair("_m", WebContext.getLoginUserId().toString()));
        serviceBase = ObjectUtil.convertObj(serviceDetail.getServiceBaseVo(), ServiceBase.class);
    }

    protected abstract String sendToRemoteService();

    protected abstract ThirdResultVO afterSend(ServiceDetail serviceDetail);
}
