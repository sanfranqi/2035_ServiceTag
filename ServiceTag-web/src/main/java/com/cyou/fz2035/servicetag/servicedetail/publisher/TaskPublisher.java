package com.cyou.fz2035.servicetag.servicedetail.publisher;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.http.message.BasicNameValuePair;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.StringUtil;
import com.cyou.fz2035.servicetag.config.ServiceBaseStatusEnum;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.servicebase.service.ServiceBaseService;
import com.cyou.fz2035.servicetag.servicebase.vo.ServiceBaseVo;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.servicedetail.service.ServiceDetailService;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.utils.ListUtils;
import com.cyou.fz2035.servicetag.utils.bean.Box;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.data.DateUtil;
import com.cyou.fz2035.servicetag.utils.http.HttpClientUtil;
import com.cyou.fz2035.servicetag.utils.web.JsonUtil;

/**
 * User: littlehui Date: 14-12-2 Time: 上午10:51
 */
public class TaskPublisher extends AbstractHttpPublisher {

	private String CONTEXT_URL;

	protected List<BasicNameValuePair> finalBasicNameValuePairs = new ArrayList<BasicNameValuePair>();

	private ServiceBaseService serviceBaseService = ApplicationContextUtil.getBean(ServiceBaseService.class);

	private Map<String, File> postFilesMap = new HashMap<String, File>();

	private ServiceBaseVo serviceBaseVo;

	private UserGroupRelUserService userGroupRelUserService = ApplicationContextUtil.getBean(UserGroupRelUserService.class);

	private ServiceDetailService serviceDetailService = ApplicationContextUtil.getBean(ServiceDetailService.class);

    /**
     * 准备要发送到外系统的参数和一些细微调整
     * @param code
     * @param serviceDetail
     */
    @Override
    protected void initPublisher(String code, ServiceDetail serviceDetail) {
        super.initPublisher(code, serviceDetail);
        serviceBaseVo = serviceDetail.getServiceBaseVo();
        finalBasicNameValuePairs.addAll(baseBasicNameValuePair);
        if (ListUtils.isNotEmpty(baseBasicNameValuePair)) {
            for (BasicNameValuePair basicNameValuePair : baseBasicNameValuePair) {
                if (basicNameValuePair.getName().contains("time")) {
                    Long times = Long.parseLong(basicNameValuePair.getValue());
                    String intimes = DateUtil.formatDate(new Date(times), DateUtil.ISO_DATE_TIME_FORMAT);
                    finalBasicNameValuePairs.remove(basicNameValuePair);
                    finalBasicNameValuePairs.add(new BasicNameValuePair(basicNameValuePair.getName(), intimes));
                }
            }
        }
        String receviIds = userGroupRelUserService.queryWhiteList(serviceDetail.getServiceBaseVo().getServiceTagId());
        finalBasicNameValuePairs.add(new BasicNameValuePair("receiver_ids", receviIds));
        finalBasicNameValuePairs.add(new BasicNameValuePair("taskReceipt.sender_id", serviceBaseVo.getServiceTagId() + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID + ""));
        finalBasicNameValuePairs.add(new BasicNameValuePair("_serviceid", serviceBaseVo.getServiceTagId() + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID + ""));
        String[] attachFiles = new String[3];
        attachFiles[0] = (String) serviceDetail.getDetailsAddition().get("attachFiles1");
        attachFiles[1] = (String) serviceDetail.getDetailsAddition().get("attachFiles2");
        attachFiles[2] = (String) serviceDetail.getDetailsAddition().get("attachFiles3");
        if (attachFiles != null && attachFiles.length > 0) {
            int i = 1;
            for (String fileStr : attachFiles) {
                if (StringUtil.isEmpty(fileStr) || "0".equals(fileStr)) {
                    i++;
                    continue;
                }
                if (!fileStr.startsWith(ServiceTagConstants.DOMAIN_URL)) {
                    i++;
                    continue;
                }
                String filePath = CONTEXT_URL + fileStr.substring(ServiceTagConstants.DOMAIN_URL.length(), fileStr.length());
                File file = new File(filePath);
                postFilesMap.put("task_att_" + i, file);
                i++;
            }
        }
    }



        @Override
	public ThirdResultVO publishService(ServiceDetail serviceDetail, HttpServletRequest request) {
		CONTEXT_URL = request.getSession().getServletContext().getRealPath("/");
		this.initPublisher(serviceDetail.getServiceBaseVo().getServiceType(), serviceDetail);
		publishResult = sendToRemoteService();
		return afterSend(serviceDetail);
	}

	@Override
	public String sendToRemoteService() {
		return HttpClientUtil.post(PUBLISH_URL, postFilesMap, finalBasicNameValuePairs);
	}

	@Override
	public ThirdResultVO afterSend(ServiceDetail serviceDetail) {
		Box resultBox = JsonUtil.toObject(publishResult, Box.class);
		ThirdResultVO thirdResultVO = new ThirdResultVO();
		if (resultBox.isIs_ok()) {
			Map<String, Object> resultDtos = (Map<String, Object>) resultBox.getDto();
			long businessId = Long.parseLong(resultDtos.get("id").toString());
			// 更新serviceBase状态
			serviceDetail.getServiceBaseVo().setBusinessId(businessId);
			serviceDetail.getServiceBaseVo().setStatus(ServiceBaseStatusEnum.PUBLISHED.getCode());
			serviceDetail.getServiceBaseVo().setPublishTime(System.currentTimeMillis());
			serviceDetail.getServiceBaseVo().setBusinessId(businessId);
			// 更新附件
			List<LinkedHashMap<String, String>> attaches = (List<LinkedHashMap<String, String>>) resultDtos.get("attaches");
            List<String> tempFiles = new ArrayList<String>();
			int i = 1;
			if (ListUtils.isNotEmpty(attaches)) {
				for (Map<String, String> map : attaches) {
                    if (serviceDetail.getDetailsAddition().get("attachFiles" + i) != null) {
                        String fileStr = serviceDetail.getDetailsAddition().get("attachFiles" + i).toString();
                        tempFiles.add( CONTEXT_URL + fileStr.substring(ServiceTagConstants.DOMAIN_URL.length(), fileStr.length()));
                    }
					serviceDetail.getDetailsAddition().put("attachFiles" + i, map.get("download_url"));
					i++;
				}
			}
			serviceDetailService.transUpdateServiceDetail(serviceDetail);
			// 删除本机附件
            if (ListUtils.isNotEmpty(tempFiles)) {
                for (String fileStr : tempFiles) {
                    File tempFile = new File(fileStr);
                    if (tempFile.exists()) {
                        tempFile.delete();
                    }
                }
            }
			HashMap<String, Object> returnData = new HashMap<String, Object>();
			returnData.put("businessId", resultDtos.get("id"));
			thirdResultVO.setData(returnData);
			thirdResultVO.setSuccess(true);
		} else {
			thirdResultVO.addErrorCode(resultBox.getError_code() + "");
			thirdResultVO.addMsg(resultBox.getError());
			thirdResultVO.setSuccess(false);
		}
		return thirdResultVO;
	}
}
