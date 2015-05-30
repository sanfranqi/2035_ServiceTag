package com.cyou.fz2035.servicetag.servicedetail.service;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.StringUtil;
import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import com.cyou.fz2035.servicetag.servicebase.vo.ServiceBaseVo;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ServiceRewardDetail;
import com.cyou.fz2035.servicetag.servicedetail.vo.FileVo;
import com.cyou.fz2035.servicetag.utils.ListUtils;
import org.apache.poi.util.ArrayUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 此类处理服务详情在页面展示与数据保存间的某些字段处理
 * User: littlehui
 * Date: 15-1-4
 * Time: 下午3:19
 */
@Service
public class ServiceDetailClassifyService {

    private static final String REWARD_FILES_LIST = "addtionFiles";
    private static final String REWARD_FILES = "files";

    /**
     * get的时候处理
     * @param serviceDetail
     * @param serviceType
     * @return
     */
    public ServiceDetail produceServiceDetailForReward(ServiceDetail serviceDetail, String serviceType) {
        ServiceRewardDetail serviceRewardDetail = new ServiceRewardDetail();
        if (ServiceTypeEnum.valueOfCode(serviceType) == ServiceTypeEnum.REWARD) {
            Map<String, Object> detailsAddition = serviceDetail.getDetailsAddition();
            List<FileVo> fileVos = new ArrayList<FileVo>();
            if (detailsAddition != null && detailsAddition.get(REWARD_FILES) != null) {
                String filesString = (String)detailsAddition.get(REWARD_FILES);
                String[] files = filesString.split(",");
                if (files.length > 0) {
                    for (String fileInfo : files) {
                        String[] fileVoStr = fileInfo.split("@");
                        FileVo fileVo = new FileVo();
                        if (fileVoStr.length > 1) {
                            fileVo.setFileUrl(fileVoStr[0]);
                            fileVo.setFileName(fileVoStr[1]);
                            fileVos.add(fileVo);
                        }
                    }
                }
            }
            serviceRewardDetail.setDetailsAddition(detailsAddition);
            FileVo[] fileVosArray = new FileVo[fileVos.size()];
            serviceRewardDetail.setAdditionFiles(fileVos.toArray(fileVosArray));
            serviceRewardDetail.setServiceBaseVo(serviceDetail.getServiceBaseVo());
            detailsAddition.remove(REWARD_FILES);
            serviceDetail.setDetailsAddition(detailsAddition);
            return serviceRewardDetail;
        }
        return serviceDetail;
    }

    public ServiceDetail produceServiceDetailForTask(ServiceDetail serviceDetail, String serviceType) {
        return serviceDetail;
    }

    public ServiceDetail produceServiceDetailForAgenda(ServiceDetail serviceDetail, String serviceType) {
        if (ServiceTypeEnum.valueOfCode(serviceType) == ServiceTypeEnum.AGENDA) {
            Map<String, Object> detailsAddition = serviceDetail.getDetailsAddition();
            
        }
        return serviceDetail;
    }

    public ServiceDetail produceServiceDetailForTeleText(ServiceDetail serviceDetail, String serviceType) {
        if (serviceType != null && serviceType.equals(ServiceTypeEnum.TELETEXT.getCode())) {// 素材管理特殊处理
            if (serviceDetail.getServiceBaseVo() != null) {
                serviceDetail.getServiceBaseVo().setServiceDescribe(HtmlUtils.htmlUnescape(serviceDetail.getServiceBaseVo().getServiceDescribe()));
            }
        }
        return serviceDetail;
    }

    public ServiceDetail produceServiceDetailForInsertTeleText(ServiceDetail serviceDetail, String serviceType) {
//        serviceDetail = this.produceServiceDetailForTeleText(serviceDetail, serviceType);
        if (serviceType != null && serviceType.equals(ServiceTypeEnum.TELETEXT.getCode())) {// 素材管理特殊处理
            if (serviceDetail.getServiceBaseVo() != null) {
                ServiceBaseVo serviceBaseVo = serviceDetail.getServiceBaseVo();
                serviceBaseVo.setServiceDescribe(HtmlUtils.htmlEscape(serviceBaseVo.getServiceDescribe()));
                String htmlName = System.currentTimeMillis() + ".html";
                serviceDetail.getDetailsAddition().put("htmlName", htmlName);
                serviceDetail.setServiceBaseVo(serviceBaseVo);
            }
        }
        return serviceDetail;
    }


    /**
     * set数据库的时候转换
     * @param serviceDetail
     * @param serviceType
     * @return
     */
    public ServiceDetail reproduceServiceDetailForReward(ServiceDetail serviceDetail, String serviceType) {
        StringBuffer filesAppends = new StringBuffer("");
        if (ServiceTypeEnum.valueOfCode(serviceType) == ServiceTypeEnum.REWARD
                && serviceDetail instanceof ServiceRewardDetail) {
            ServiceRewardDetail serviceRewardDetail = (ServiceRewardDetail)serviceDetail;
            Map<String, Object> detailsAddition = serviceDetail.getDetailsAddition();
            if (serviceRewardDetail.getAdditionFiles() != null && serviceRewardDetail.getAdditionFiles().length > 0) {
                FileVo[] fileVos = serviceRewardDetail.getAdditionFiles();
                int i = 0;
                for (FileVo fileVo : fileVos) {
                    if (i > 0) {
                        filesAppends.append(",");
                    }
                    //PS这里保存的是http:// 开头的
                    filesAppends.append(fileVo.getFileUrl() + "@" + fileVo.getFileName());
                    i ++;
                }
            }
            detailsAddition.put(REWARD_FILES, filesAppends.toString());
            serviceDetail.setDetailsAddition(detailsAddition);
        }
        return serviceDetail;
    }

    public ServiceDetail reproduceServiceDetailForTask(ServiceDetail serviceDetail, String serviceType) {
        return serviceDetail;
    }

    public ServiceDetail reproduceServiceDetailForAgenda(ServiceDetail serviceDetail, String serviceType) {
        return serviceDetail;
    }

    public ServiceDetail reproduceServiceDetailForTeleText(ServiceDetail serviceDetail, String serviceType) {
        if (serviceType != null && serviceType.equals(ServiceTypeEnum.TELETEXT.getCode())) {// 素材管理特殊处理
            ServiceBaseVo serviceBaseVo = serviceDetail.getServiceBaseVo();
            serviceBaseVo.setServiceDescribe(HtmlUtils.htmlEscape(serviceBaseVo.getServiceDescribe()));
            serviceDetail.setServiceBaseVo(serviceBaseVo);
        }
        return serviceDetail;
    }
}
