package com.cyou.fz2035.servicetag.servicedetail.ender;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.servicetag.config.ServiceBaseStatusEnum;
import com.cyou.fz2035.servicetag.servicebase.bean.ServiceBase;
import com.cyou.fz2035.servicetag.servicebase.service.ServiceBaseService;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetailCover;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.servicedetail.publisher.ServicePublishConfigure;
import com.cyou.fz2035.servicetag.servicedetail.service.ServiceDetailService;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import org.apache.http.message.BasicNameValuePair;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * User: littlehui
 * Date: 14-12-17
 * Time: 下午3:54
 */
public abstract class AbstractHttpServiceEnder implements Ender {

    private ServiceBaseService serviceBaseService = ApplicationContextUtil.getBean(ServiceBaseService.class);

    /**
     * 数据库操作的钩子
     */
    private boolean isOperateDataSource = true;
    /**
     * 结束外系统服务的钩子
     */
    private boolean isOperateRemoteService = true;

    public String END_URL;

    public List<BasicNameValuePair> baseBasicNameValuePair = new ArrayList<BasicNameValuePair>();

    private ServicePublishConfigure servicePublishConfigure = ApplicationContextUtil.getBean(ServicePublishConfigure.class);

    ServiceDetailCover serviceDetailCover = ApplicationContextUtil.getBean(ServiceDetailCover.class);

    public Map<String, Object> serviceMaps;

    public String endResult;

    public ServiceBase serviceBase;


    public void setOperateRemoteService(boolean isOperateRemoteService) {
        this.isOperateRemoteService = isOperateRemoteService;
    }

    public boolean isOperateDataSource() {
        return isOperateDataSource;
    }

    public void setOperateDataSource(boolean isOperateDataSource) {
        this.isOperateDataSource = isOperateDataSource;
    }


    @Override
    public ThirdResultVO endService(ServiceDetail serviceDetail, HttpServletRequest request) {
        //初始化参url和参数等
        prepareEndService(serviceDetail.getServiceBaseVo().getServiceType(), serviceDetail);
        //如果对数据库有修改就修改数据库。
        ThirdResultVO thirdResultVO = new ThirdResultVO();
        if (this.isOperateDataSource()) {
            thirdResultVO = endServiceLocal(serviceDetail);
        }
        if (isOperateRemoteService) {
            doEndRemoteService();
            thirdResultVO = afterDoEndRemoteService(thirdResultVO);
            if (!thirdResultVO.isSuccess()) {
                //不成功要做处理
                thirdResultVO = this.reEndService(thirdResultVO, serviceDetail);
            }
        }
        return thirdResultVO;
    }

    protected void prepareEndService(String code, ServiceDetail serviceDetail) {
        END_URL = servicePublishConfigure.getEndUrlByCode(code);
        serviceMaps = serviceDetailCover.coverToMap(serviceDetail);
        Map<String, Object> serviceMap = serviceDetailCover.coverToMap(serviceDetail);
        Map<String, String> rewardPairs = servicePublishConfigure.getServiceEndParamParis(serviceDetail.getServiceBaseVo().getServiceType());
        Set<String> serviceMapKeys = serviceMap.keySet();
        for (String key : serviceMapKeys) {
            if (rewardPairs.get(key) != null) {
                BasicNameValuePair basicNameValuePair = new BasicNameValuePair(rewardPairs.get(key), serviceMap.get(key).toString());
                baseBasicNameValuePair.add(basicNameValuePair);
            }
        }
        baseBasicNameValuePair.add(new BasicNameValuePair("_t", WebContext.getLoginTokenString()));
        baseBasicNameValuePair.add(new BasicNameValuePair("_m", WebContext.getLoginUserId().toString()));
        serviceBase = ObjectUtil.convertObj(serviceDetail.getServiceBaseVo(), ServiceBase.class);
        //状态是未发布，和虽然是未发布但是businessId是不大于0的也是不进行操作的。
        isOperateRemoteService = ServiceBaseStatusEnum.valueOfCode(serviceBase.getStatus()) == ServiceBaseStatusEnum.PUBLISHED;
        if (isOperateRemoteService) {
            isOperateRemoteService = serviceBase.getBusinessId() != null && serviceBase.getBusinessId() > 0;
        }
    }

    public abstract  String doEndRemoteService();

    public abstract  ThirdResultVO afterDoEndRemoteService(ThirdResultVO thirdResultVO);

    public ThirdResultVO endServiceLocal(ServiceDetail serviceDetail) {
        ThirdResultVO thirdResultVO = new ThirdResultVO();
        serviceBaseService.delete(serviceDetail.getServiceBaseVo().getId());
        thirdResultVO.setSuccess(true);
        thirdResultVO.addMsg("本地操作成功。");
        return thirdResultVO;
    }

    /**
     * 不成功的话还原回去
     * @param serviceDetail
     * @return
     */
    public ThirdResultVO reEndService(ThirdResultVO thirdResultVO, ServiceDetail serviceDetail) {
        Integer serviceBaseId = serviceDetail.getServiceBaseVo().getId();
        thirdResultVO.setSuccess(false);
        if (!isOperateDataSource) {
            thirdResultVO.addMsg("不用对数据库进行恢复。");
            return thirdResultVO;
        }
        serviceBaseService.reDelete(serviceBaseId);
        ServiceBase serviceBase = serviceBaseService.get(serviceBaseId);
        if (!serviceBase.getDeleteFlag()) {
            thirdResultVO.addErrorCode(ThirdResultVO.ERROR_CODE_REEND);
            thirdResultVO.addMsg("恢复数据成功服务ID" + serviceBaseId);
        } else {
            thirdResultVO.addErrorCode(ThirdResultVO.ERROR_CODE_NOREEND);
            thirdResultVO.addMsg("恢复数据不成功ID" + serviceBaseId);
        }
        return thirdResultVO;
    }
}
