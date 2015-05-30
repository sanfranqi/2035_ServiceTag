package com.cyou.fz2035.servicetag.servicetagaudit.action;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.servicetagaudit.bean.ServiceTagAudit;
import com.cyou.fz2035.servicetag.servicetagaudit.param.ServiceTagAuditParam;
import com.cyou.fz2035.servicetag.servicetagaudit.service.ServiceTagAuditService;
import com.cyou.fz2035.servicetag.servicetagaudit.vo.ServiceTagAndAuditVo;
import com.cyou.fz2035.servicetag.servicetagaudit.vo.ServiceTagAuditVo;
import com.cyou.fz2035.servicetag.springmvc.exception.BusinessException;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * User: littlehui
 * Date: 15-3-9
 * Time: 上午10:53
 */
@Controller
@RequestMapping("/admin/serviceTag")
public class ServiceTagAuditController {

    @Autowired
    private ServiceTagAuditService serviceTagAuditService;

    /**
     * 查看单个
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getAuditByServiceTagId", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<ServiceTagAuditVo> getAuditByServiceTagId(Integer serviceTagId) {
        ServiceTagAudit serviceTagAudit = serviceTagAuditService.getServiceTagAuditVoByServiceTagId(serviceTagId);
        ServiceTagAuditVo serviceTagAuditVo = serviceTagAuditService.getAbstractSimpleBeanTranser().beanToVo(serviceTagAudit);
        return Response.getSuccessResponse(serviceTagAuditVo);
    }

    /**
     * 查看单个
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getAuditById", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<ServiceTagAuditVo> getAuditById(Integer auditId) {
        ServiceTagAudit serviceTagAudit = serviceTagAuditService.get(auditId);
        ServiceTagAuditVo serviceTagAuditVo = serviceTagAuditService.getAbstractSimpleBeanTranser().beanToVo(serviceTagAudit);
        return Response.getSuccessResponse(serviceTagAuditVo);
    }

    /**
     * 超管页面展示的
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/queryAuditServiceTags", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<Paged<ServiceTagAuditVo>> queryAuditServiceTags(String serviceTagName, Integer pageNo, Integer pageSize) throws BusinessException {
        if (!WebContext.isLoginUserAdmin()) {
            throw new BusinessException("必须为管理员。");
        }
        Paged<ServiceTagAuditVo> serviceTagAuditVoPaged = new Paged<ServiceTagAuditVo>();
        ServiceTagAuditParam serviceTagAuditParam = new ServiceTagAuditParam();
        serviceTagAuditParam.setServiceTagName(serviceTagName);
        serviceTagAuditParam.setPageNo(pageNo == null ? 1 : pageNo);
        serviceTagAuditParam.setPageSize(pageSize == null ? 15 : pageSize);
        List<ServiceTagAuditVo> serviceTagAuditVos = serviceTagAuditService.getAbstractSimpleBeanTranser()
                .beanToVos(serviceTagAuditService.queryByParam(serviceTagAuditParam));
        serviceTagAuditVoPaged.setListData(serviceTagAuditVos);
        serviceTagAuditVoPaged.setTotalHit(serviceTagAuditParam.getTotalHit());
        serviceTagAuditVoPaged.setPageSize(serviceTagAuditParam.getPageSize());
        serviceTagAuditVoPaged.setPageNo(serviceTagAuditParam.getPageNo());
        return Response.getSuccessResponse(serviceTagAuditVoPaged);
    }

    /**
     * 增加
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/addAuditServiceTag", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<Boolean> addAuditServiceTag(ServiceTagAuditVo serviceTagAuditVo) throws BusinessException {
        serviceTagAuditService.addAuditServiceTagByVo(serviceTagAuditVo);
        return Response.getSuccessResponse(true);
    }

    /**
     * 修改
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/updateAuditServiceTag", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<Boolean> updateAuditServiceTag(ServiceTagAuditVo serviceTagAuditVo) throws BusinessException{
        serviceTagAuditService.updateAuditServiceTagByVo(serviceTagAuditVo);
        return Response.getSuccessResponse(true);
    }

    /**
     * 二次修改审核通过
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/checkAuditServiceTag", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<Boolean> checkAuditServiceTag(Integer id, Integer serviceTagId) {
        serviceTagAuditService.checkAuditServiceTag(id, serviceTagId);
        return Response.getSuccessResponse(true);
    }

    /**
     * 二次修改审核退回
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/unCheckAuditServiceTag", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<Boolean> unCheckAuditServiceTag(Integer id, Integer serviceTagId) {
        serviceTagAuditService.unCheckAuditServiceTag(id, serviceTagId);
        return Response.getSuccessResponse(true);
    }

    /**
     * 审核修改详情
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getAuditVoDetails", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<ServiceTagAndAuditVo> getAuditVoDetails(Integer auditId) throws BusinessException {
        return Response.getSuccessResponse(serviceTagAuditService.getAuditDetails(auditId));
    }
}
