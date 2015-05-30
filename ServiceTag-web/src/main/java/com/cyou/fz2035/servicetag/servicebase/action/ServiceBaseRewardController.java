package com.cyou.fz2035.servicetag.servicebase.action;

import com.alibaba.dubbo.common.json.JSONObject;
import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.config.ServiceBaseStatusEnum;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import com.cyou.fz2035.servicetag.config.SystemConfig;
import com.cyou.fz2035.servicetag.servicebase.bean.ServiceBase;
import com.cyou.fz2035.servicetag.servicebase.service.ServiceBaseService;
import com.cyou.fz2035.servicetag.servicebase.vo.RewardOutPaged;
import com.cyou.fz2035.servicetag.servicebase.vo.RewardResponse;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ServiceRewardDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.servicedetail.factory.InnerServicePublishFactory;
import com.cyou.fz2035.servicetag.servicedetail.factory.InnerServiceRepublisherFactory;
import com.cyou.fz2035.servicetag.servicedetail.publisher.ServicePublishConfigure;
import com.cyou.fz2035.servicetag.servicedetail.publisher.ServicePublishEngine;
import com.cyou.fz2035.servicetag.servicedetail.service.ServiceDetailService;
import com.cyou.fz2035.servicetag.servicedetail.vo.FileVo;
import com.cyou.fz2035.servicetag.utils.bean.Box;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import com.cyou.fz2035.servicetag.utils.http.HttpClientReq;
import com.cyou.fz2035.servicetag.utils.http.HttpClientUtil;
import com.cyou.fz2035.servicetag.utils.http.ZHttpRequest;
import com.cyou.fz2035.servicetag.utils.web.JsonUtil;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.message.BasicNameValuePair;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * User: littlehui
 * Date: 15-1-4
 * Time: 上午10:48
 */
@Controller
@RequestMapping("/admin/service")
public class ServiceBaseRewardController {


    @Autowired
    ServiceDetailService serviceDetailService;

    @Autowired
    ServiceBaseService serviceBaseService;

    private final static String REWARD_DOMAIN = ApplicationContextUtil.getBean(SystemConfig.class).getRewardDomainUrl();

    @ResponseBody
    @RequestMapping(value = "/uploadRewardFiles", produces = MediaType.TEXT_HTML_VALUE)
    public Response<FileVo> uploadRewardFiles(HttpServletRequest request, MultipartFile file) {
        StringBuffer filesStr = new StringBuffer(ServiceTagConstants.DOMAIN_URL);
        try {
            ServicePublishConfigure configure = ApplicationContextUtil.getBean("servicePublishConfigure");
            String uploadUrl = configure.getFileUploadUrilByCode(ServiceTypeEnum.REWARD.getCode());
            Map<String, File> filesMap = new HashMap<String, File>();
            String filePath = request.getSession().getServletContext().getRealPath("/") + "tmp/" + file.getOriginalFilename();
            File tempFile = new File(filePath);
            tempFile.mkdirs();
            file.transferTo(tempFile);
            StringBuffer stringBuffer = new StringBuffer(uploadUrl);
            stringBuffer.append("?_t=" + WebContext.getLoginTokenString() + "&" + "_m=" + WebContext.getLoginUserId() + "&dir=file");//&filename=" + file.getOriginalFilename());
            Map<String, String> dataMaps = new HashMap<String, String>();
            filePath = URLDecoder.decode(filePath, "utf-8");
            dataMaps.put("imgFile", filePath);
            //String postResult = HttpClientUtil.post0(stringBuffer.toString(), filesMap, baseNameValuePairs, MediaType.MULTIPART_FORM_DATA_VALUE);
            ZHttpRequest zHttpRequest = new ZHttpRequest();
            Map<String, String> headers = new HashMap<String, String>();
            //headers.put("Content-Type", "multipart/form-data;;charset=utf-8");
            zHttpRequest.setHeaders(headers);
            zHttpRequest.setCharset(null);
            Map<String, String> valueMap = new HashMap<String, String>();
            valueMap.put("filename", file.getOriginalFilename());
            String postResult = zHttpRequest.post(URLDecoder.decode(stringBuffer.toString(), "utf-8"), valueMap, dataMaps);
            Box resultBox = JsonUtil.toObject(postResult, Box.class);
            if (resultBox.isIs_ok()) {
                Map<String, String> map = (HashMap<String, String>) resultBox.getDto();
                FileVo fileVo = new FileVo();
                fileVo.setFileName(map.get("file_name"));
                fileVo.setFileUrl(map.get("file_path"));
                tempFile.delete();
                return Response.getSuccessResponse(fileVo);
            } else {
                Response response = Response.getFailedResponse("上传失败.");
                response.setError(resultBox.getError());
                return response;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.getFailedResponse("上传附件失败。");
        }
    }

    @ResponseBody
    @RequestMapping(value = "/saveServiceReward", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<Integer> saveRewardServiceDetail(ServiceDetail serviceDetail, String additionFiles) {
        try {
            ServiceRewardDetail serviceRewardDetail = new ServiceRewardDetail();
            FileVo[] files = JsonUtil.toObject(additionFiles, FileVo[].class);
            serviceRewardDetail.setAdditionFiles(files);
            serviceRewardDetail.setServiceBaseVo(serviceDetail.getServiceBaseVo());
            serviceRewardDetail.setDetailsAddition(serviceDetail.getDetailsAddition());
            if (serviceRewardDetail.getServiceBaseVo().getId() != null) {
                serviceDetailService.transUpdateServiceDetail(serviceRewardDetail);
            } else {
                serviceDetailService.transInsertServiceDetail(serviceRewardDetail);
            }
            return Response.getSuccessResponse(serviceRewardDetail.getServiceBaseVo().getId());
        } catch (Exception e) {
            e.printStackTrace();
            return Response.getFailedResponse("保存失败。");
        }
    }


    /**
     * 重新发布服务 发布后的修改后重新发布
     *
     * @param request
     * @param serviceDetail
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/republishServiceReward", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<String> republishServiceDetail(HttpServletRequest request, ServiceDetail serviceDetail, String additionFiles) {
        try {
            // 先更新，后发布。
            ServiceRewardDetail serviceRewardDetail = new ServiceRewardDetail();
            FileVo[] files = JsonUtil.toObject(additionFiles, FileVo[].class);
            serviceRewardDetail.setAdditionFiles(files);
            serviceRewardDetail.setServiceBaseVo(serviceDetail.getServiceBaseVo());
            serviceRewardDetail.setDetailsAddition(serviceDetail.getDetailsAddition());
            if (serviceDetail.getServiceBaseVo().getId() == null) {
                return Response.getFailedResponse("服务ID为空。");
            }
            ServicePublishEngine servicePublishEngine = new ServicePublishEngine(InnerServiceRepublisherFactory.instance(), serviceDetail);
            ThirdResultVO thirdResultVO = servicePublishEngine.sendToRemoteService(request);
            if (thirdResultVO.isSuccess()) {
                serviceDetailService.transUpdateServiceDetail(serviceRewardDetail);
            }
            thirdResultVO.setData(serviceRewardDetail.getServiceBaseVo().getBusinessId());
            return thirdResultVO.toResponse();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return Response.getFailedResponse("发布失败。");
    }

    /**
     * 保存并发布服务到外系统
     *
     * @param request
     * @param serviceDetail
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/publishServiceReward", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<String> publishService(HttpServletRequest request, ServiceDetail serviceDetail, String additionFiles) {
        String result = "";
        try {
            // 先更新，后发布。
            ServiceRewardDetail serviceRewardDetail = new ServiceRewardDetail();
            FileVo[] files = JsonUtil.toObject(additionFiles, FileVo[].class);
            serviceRewardDetail.setAdditionFiles(files);
            serviceRewardDetail.setServiceBaseVo(serviceDetail.getServiceBaseVo());
            serviceRewardDetail.setDetailsAddition(serviceDetail.getDetailsAddition());
            if (serviceDetail.getServiceBaseVo().getId() != null) {
                serviceDetailService.transUpdateServiceDetail(serviceRewardDetail);
            } else {
                serviceDetailService.transInsertServiceDetail(serviceRewardDetail);
            }
            if (serviceDetail.getServiceBaseVo().getBusinessId() != null && serviceDetail.getServiceBaseVo().getBusinessId() > 0) {
                return Response.getFailedResponse("已发布，修改后才能再发布。");
            }
            ServicePublishEngine servicePublishEngine = new ServicePublishEngine(InnerServicePublishFactory.instance(), serviceDetail);
            ThirdResultVO resultVO = servicePublishEngine.sendToRemoteService(request);
            if (resultVO.isSuccess()) {
                resultVO.setData(serviceDetail.getServiceBaseVo().getBusinessId());
            } else {
                if (serviceDetail.getServiceBaseVo().getId() != null) {
                    Response response = resultVO.toResponse();
                    response.setResult("success");
                    response.setData("保存成功，但是发布失败。" + response.getMessages());
                    return response;
                }
            }
            return resultVO.toResponse();
        } catch (Exception ex) {
            ex.printStackTrace();
            result = ex.getMessage();
            if (serviceDetail.getServiceBaseVo().getId() != null) {
                Response response = Response.getSuccessResponse();
                response.setResult("success");
                response.setData("保存成功，但是发布失败。" + result);
                return response;
            }
            Response response = Response.getFailedResponse(ex.getMessage());
            if (ex.getCause() != null) {
                response.setError(ex.getCause().toString());
            }
            return response;
        }
    }


    @ResponseBody
    @RequestMapping(value = "/queryRewardIdeas", produces = MediaType.APPLICATION_JSON_VALUE)
    public RewardResponse queryRewardIdeas(Integer rewardId, Integer pageSize, Integer pageNo, Integer status) {
        List<BasicNameValuePair> basicNameValuePairList = new ArrayList<BasicNameValuePair>();
        basicNameValuePairList.add(new BasicNameValuePair("rid", rewardId + ""));
        basicNameValuePairList.add(new BasicNameValuePair("page", (pageNo == null ? 1 : pageNo) + ""));
        basicNameValuePairList.add(new BasicNameValuePair("pagesize", (pageSize == null ? 15 : pageSize) + ""));
        basicNameValuePairList.add(new BasicNameValuePair("status", status + ""));
        basicNameValuePairList.add(new BasicNameValuePair("_t", WebContext.getLoginTokenString() + ""));
        basicNameValuePairList.add(new BasicNameValuePair("_m", WebContext.getLoginUserId() + ""));
        String result = HttpClientUtil.get(REWARD_DOMAIN + "/audit/Getclist", basicNameValuePairList);
        Box<RewardOutPaged> box = JsonUtil.toObject(result, new TypeReference<Box<RewardOutPaged>>() {
        });
        return RewardResponse.getResultResponseFromBox(box, pageSize == null ? 15 : pageSize);
    }


    @ResponseBody
    @RequestMapping(value = "/setCreative", produces = MediaType.APPLICATION_JSON_VALUE)
    public RewardResponse countRewardIdeasStar(Integer replyId, Integer score, Integer serviceTagId) {
        List<BasicNameValuePair> basicNameValuePairList = new ArrayList<BasicNameValuePair>();
        basicNameValuePairList.add(new BasicNameValuePair("replyid", replyId + ""));
        basicNameValuePairList.add(new BasicNameValuePair("score", score + ""));
        basicNameValuePairList.add(new BasicNameValuePair("_t", WebContext.getLoginTokenString() + ""));
        basicNameValuePairList.add(new BasicNameValuePair("_m", WebContext.getLoginUserId() + ""));
        basicNameValuePairList.add(new BasicNameValuePair("serviceid", serviceTagId + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID  + ""));
        String result = HttpClientUtil.get(REWARD_DOMAIN + "/audit/SetCreative", basicNameValuePairList);
        Box box = JsonUtil.toObject(result, new TypeReference<Box>() {
        });
        return RewardResponse.getResultResponseFromBox(box);
    }

    @ResponseBody
    @RequestMapping(value = "/closeReward", produces = MediaType.APPLICATION_JSON_VALUE)
    public RewardResponse closeReward(Long rewarId, Integer serviceTagId) {
        List<BasicNameValuePair> basicNameValuePairList = new ArrayList<BasicNameValuePair>();
        basicNameValuePairList.add(new BasicNameValuePair("rid", rewarId + ""));
        basicNameValuePairList.add(new BasicNameValuePair("_t", WebContext.getLoginTokenString() + ""));
        basicNameValuePairList.add(new BasicNameValuePair("_m", WebContext.getLoginUserId() + ""));
        basicNameValuePairList.add(new BasicNameValuePair("serviceid", serviceTagId + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID  + ""));
        String result = HttpClientUtil.get(REWARD_DOMAIN + "/audit/CountMoneyStar", basicNameValuePairList);
        Box box = JsonUtil.toObject(result, Box.class);
        if (box.isIs_ok()) {
            serviceBaseService.changeServiceBaseStatusByBusinessId(ServiceBaseStatusEnum.END.getCode(), rewarId);
        }
        return RewardResponse.getResultResponseFromBox(box);
    }

    @ResponseBody
    @RequestMapping(value = "/queryAllIdeasAtEnd", produces = MediaType.APPLICATION_JSON_VALUE)
    public RewardResponse closeReward(Long rewardId, Integer pageSize, Integer pageNo) {
        List<BasicNameValuePair> basicNameValuePairList = new ArrayList<BasicNameValuePair>();
        basicNameValuePairList.add(new BasicNameValuePair("id", rewardId + ""));
        basicNameValuePairList.add(new BasicNameValuePair("page", (pageNo == null ? 1 : pageNo) + ""));
        basicNameValuePairList.add(new BasicNameValuePair("pagesize", (pageSize == null ? 15 : pageSize) + ""));
        basicNameValuePairList.add(new BasicNameValuePair("_t", WebContext.getLoginTokenString() + ""));
        basicNameValuePairList.add(new BasicNameValuePair("_m", WebContext.getLoginUserId() + ""));
        String result = HttpClientUtil.get(REWARD_DOMAIN + "/reward/getcreate", basicNameValuePairList);
        Box<RewardOutPaged> box = JsonUtil.toObject(result, new TypeReference<Box<RewardOutPaged>>() {
        });
        return RewardResponse.getResultResponseFromBox(box, pageSize == null ? 15 : pageSize);
    }
}
