package com.cyou.fz2035.servicetag.servicetag.action;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagValidator;
import com.cyou.fz2035.servicetag.servicetag.vo.ValidatorResultVo;
import com.cyou.fz2035.servicetag.servicetagaudit.bean.ServiceTagAudit;
import com.cyou.fz2035.servicetag.servicetagaudit.service.ServiceTagAuditService;
import com.cyou.fz2035.servicetag.springmvc.exception.NeedAuditServiceTagException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.StringUtil;
import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.config.ServiceTagStatusEnum;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.param.ServiceTagParam;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagImageVo;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagVo;
import com.cyou.fz2035.servicetag.user.service.MatrixUserSoaService;
import com.cyou.fz2035.servicetag.utils.bean.transer.BeanTranser;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import com.cyou.fz2035.servicetag.utils.data.RandomUtil;
import com.cyou.fz2035.servicetag.utils.http.HttpClientUtil;

/**
 * User: littlehui Date: 14-11-27 Time: 下午5:42
 */
@Controller
@RequestMapping("/admin/serviceTag")
public class ServiceTagAdminController {

    @Autowired
    ServiceTagService serviceTagService;

    @Autowired
    MatrixUserSoaService matrixUserSoaService;

    @Autowired
    ServiceTagValidator serviceTagValidator;

    @Autowired
    ServiceTagAuditService serviceTagAuditService;

    @ResponseBody
    @RequestMapping(value = "/query", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<Paged<ServiceTagVo>> queryServiceTags(ServiceTagParam serviceTagParam, boolean isAdminModel) {
        Paged<ServiceTagVo> paged = new Paged();
        List<ServiceTagVo> serviceTagVos = null;
        BeanTranser serviceTagTranser = serviceTagService.getBeanTranser();
        try {
            if (WebContext.isLoginUserAdmin()) {
                if (!isAdminModel) {
                    serviceTagParam.setCreateUser(WebContext.getLoginUserId());
                }
            } else {
                serviceTagParam.setCreateUser(WebContext.getLoginUserId());
            }
            List<ServiceTag> serviceTags = serviceTagService.queryByParam(serviceTagParam);
            serviceTagVos = serviceTagTranser.beanToVos(serviceTags, ServiceTagVo.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        paged.setListData(serviceTagVos);
        paged.setTotalHit(serviceTagParam.getTotalHit());
        paged.setPageNo(serviceTagParam.getPageNo());
        paged.setPageSize(serviceTagParam.getPageSize());
        return Response.getSuccessResponse(paged);
    }

    @ResponseBody
    @RequestMapping(value = "/add", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<ServiceTagVo> addServiceTag(ServiceTag serviceTag) {
        BeanTranser<ServiceTag, ServiceTagVo> beanTranser = serviceTagService.getBeanTranser();
        ServiceTagVo serviceTagVo = null;
        serviceTag.setCreateUser(WebContext.getLoginUserId());
        try {
            serviceTagVo = beanTranser.beanToVo(serviceTag, ServiceTagVo.class);
            ValidatorResultVo validatorResultVo = serviceTagValidator.addValidation(serviceTagVo);
            if (!validatorResultVo.getResult()) {
                return validatorResultVo.toResponse();
            }
            serviceTagService.transAddServiceTag(serviceTag);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.getFailedResponse(e.getMessage());
        }
        return Response.getSuccessResponse(serviceTagVo);
    }

    @ResponseBody
    @RequestMapping(value = "/remove", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<String> removeServiceTag(Integer serviceTagId) {
        try {
            ValidatorResultVo validatorResultVo = serviceTagValidator.removeValidation(serviceTagId);
            if (!validatorResultVo.getResult()) {
                return validatorResultVo.toResponse();
            }
            serviceTagService.delete(serviceTagId);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.getFailedResponse(e.getMessage());
        }
        return Response.getSuccessResponse("删除成功。");
    }

    /**
     * 服务号修改
     *
     * @param serviceTagVoParam
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<ServiceTagVo> updateServiceTag(ServiceTagVo serviceTagVoParam) {
        BeanTranser<ServiceTag, ServiceTagVo> beanTranser = serviceTagService.getBeanTranser();
        ServiceTagVo serviceTagVo = null;
        ServiceTag serviceTag = null;
        ServiceTag serviceTagNeedValidate = beanTranser.voToBean(serviceTagVoParam, ServiceTag.class);
        try {
            ValidatorResultVo validatorResultVo = serviceTagValidator.updateValidation(serviceTagVoParam);
            if (!validatorResultVo.getResult()) {
                return validatorResultVo.toResponse();
            }
            if (serviceTagAuditService.isNeedAuditWhenUpdateServiceTag(serviceTagNeedValidate)) {
                //需要审核的流程走向
                throw new NeedAuditServiceTagException();
            }
            serviceTag = serviceTagService.transUpdateServiceTag(beanTranser.voToBean(serviceTagVoParam, ServiceTag.class));
            serviceTagVo = beanTranser.beanToVo(serviceTag, ServiceTagVo.class);
        } catch (NeedAuditServiceTagException ex) {
            ServiceTagAudit serviceTagAudit = serviceTagAuditService.getAuditToServiceTagTranser().voToBean(serviceTagNeedValidate);
            serviceTagAuditService.addAuditServiceTag(serviceTagAudit);
            ex.printStackTrace();
            Response response = Response.getSuccessResponse(serviceTagVo);
            response.setMessage(ex.getMessage());
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            Response response = Response.getFailedResponse(serviceTagVo);
            response.setMessage(e.getMessage());
            return response;
        }
        return Response.getSuccessResponse(serviceTagVo);
    }

    /**
     * 上传服务号头像，头像用zimg服务
     *
     * @param request
     * @param file
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/uploadServiceTagImage", produces = MediaType.TEXT_HTML_VALUE)
    public Response<String> uploadImageRemote(HttpServletRequest request, MultipartFile file) {
        Map<String, File> fileMap = new HashMap<String, File>();
        if (file.getSize() > ServiceTagConstants.SERVICETAG_IMAGE_SIZE) {
            return Response.getFailedResponse("头像超过2M。");
        }
        String imgUrl = "";
        String filePath = request.getSession().getServletContext().getRealPath("/") + "tmp/" + file.getOriginalFilename();
        File imageFile = new File(filePath);
        imageFile.mkdirs();
        try {
            file.transferTo(imageFile);
            fileMap.put("file", new File(filePath));
            String result = HttpClientUtil.post0(ServiceTagConstants.ZIMG_UPDATE_URL, fileMap, null, "jpeg");
            if (result.contains("success")) {
                String resultMessage = result;
                imgUrl = resultMessage.substring(resultMessage.indexOf("MD5: ") + "MD5: ".length(), resultMessage.indexOf("</h1>"));
                imageFile.delete();
                Response response = Response.getSuccessResponse();
                response.setData(imgUrl);
                return response;
            } else {
                return Response.getFailedResponse("上传失败。");
            }
        } catch (IOException e) {
            e.printStackTrace();
            return Response.getFailedResponse("发布失败");
        }
    }

    /**
     * 废弃
     *
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/uploadServiceTagImage1", produces = MediaType.TEXT_HTML_VALUE)
    @Deprecated
    public Response<List<ServiceTagImageVo>> uploadImage(HttpServletRequest request) {
        String imgCode = RandomUtil.randomString(8);
        try {
            com.cyou.fz2035.servicetag.files.ResultVO resultVO = serviceTagService.uploadServiceTagImage(request, imgCode);
            if ((Integer.parseInt(resultVO.getMsg().get(1)) < 200) || (Integer.parseInt(resultVO.getMsg().get(2)) < 200)) {
                return Response.getFailedResponse("尺寸不合适。");
            }
            com.cyou.fz2035.servicetag.files.ResultVO result = serviceTagService.cutServiceTagImageAndSave(imgCode, 0, 0, 200, 200);
            List<ServiceTagImageVo> serviceTagImageVos = new ArrayList<ServiceTagImageVo>();
            if (result.isSuccess()) {
                serviceTagImageVos.add(ServiceTagImageVo.createLargeServiceTagImage(imgCode));
                serviceTagImageVos.add(ServiceTagImageVo.createMiddleServiceTagImage(imgCode));
                serviceTagImageVos.add(ServiceTagImageVo.createSmallServiceTagImage(imgCode));
            }
            Response response = resultVO.toResponse();
            /*
			 * ServiceTagImageVo serviceTagImageVo = new ServiceTagImageVo(); if
			 * (response.getResult().equals(Response.RESULT_SUCCESS)) {
			 * serviceTagImageVo.setUrl(ServiceTagConstants.FILE_IMAGEPATH +
			 * resultVO.getMsg().get(0).replace("\\", "/"));
			 * serviceTagImageVo.setWidth
			 * (Integer.parseInt(resultVO.getMsg().get(1)));
			 * serviceTagImageVo.setHeight
			 * (Integer.parseInt(resultVO.getMsg().get(2)));
			 */
            response.setData(serviceTagImageVos);
            return response;
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.getFailedResponse("上传失败");
        }
    }

    /**
     * 废弃
     *
     * @param serviceTagId
     * @param x
     * @param y
     * @param width
     * @param height
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/cutServiceTagImage", produces = MediaType.APPLICATION_JSON_VALUE)
    @Deprecated
    public Response<String> cuServiceTagImage(String serviceTagId, int x, int y, int width, int height) {
        try {
            com.cyou.fz2035.servicetag.files.ResultVO result = serviceTagService.cutServiceTagImageAndSave(serviceTagId, x, y, width, height);
            return result.toResponse();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return Response.getFailedResponse("剪切失败。");
    }

}
