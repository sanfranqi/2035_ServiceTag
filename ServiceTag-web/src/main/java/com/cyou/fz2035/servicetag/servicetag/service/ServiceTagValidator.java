package com.cyou.fz2035.servicetag.servicetag.service;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.StringUtil;
import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.config.ServiceTagStatusEnum;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.param.ServiceTagParam;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagVo;
import com.cyou.fz2035.servicetag.servicetag.vo.ValidatorResultVo;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * User: littlehui
 * Date: 15-1-12
 * Time: 上午11:08
 */
@Service
public class ServiceTagValidator {

    @Autowired
    ServiceTagService serviceTagService;

    /**
     * 更新的时候进行验证
     * @return
     */
    public ValidatorResultVo updateValidation(ServiceTagVo serviceTagVo) {
        if (serviceTagVo.getId() == null) {
            return ValidatorResultVo.DefaultValidationFailureVo("ID不能为空。");
        }
        ServiceTag serviceTagTemp = serviceTagService.get(serviceTagVo.getId());
        if (serviceTagTemp == null) {
            return  ValidatorResultVo.DefaultValidationFailureVo("服务号不存在。");
        }
/*        if (ServiceTagStatusEnum.INUSE.getCode().equals(serviceTagTemp.getStatus()) && serviceTagVo.getServiceTagName() != null) {
            if (!serviceTagTemp.getServiceTagName().equals(serviceTagVo.getServiceTagName())) {
                return  ValidatorResultVo.DefaultValidationFailureVo("已经使用中的服务号不允许修改名称。");
            }
        }*/
        if (serviceTagVo.getServiceTagName() != null && !String.valueOf(serviceTagVo.getServiceTagName().charAt(0)).matches("((\\d)|([a-z])|([A-Z])|([\u4e00-\u9fa5]))+")) {
            return  ValidatorResultVo.DefaultValidationFailureVo("服务号名称的首字母必须为中文、英文或数字。");
        }
        if (serviceTagTemp.getCreateUser() != null) {
            if (!serviceTagTemp.getCreateUser().equals(WebContext.getLoginUserId())) {
                if (!WebContext.isLoginUserAdmin()) {
                    return  ValidatorResultVo.DefaultValidationFailureVo("非管理员与服务号拥有人不允许修改。");
                }
            }
        }
        //停用改启用
        if (ServiceTagStatusEnum.INUSE  == ServiceTagStatusEnum.valueOfCode(serviceTagVo.getStatus())) {
            if (ServiceTagStatusEnum.STOPUSE == ServiceTagStatusEnum.valueOfCode(serviceTagTemp.getStatus())) {
                if (WebContext.isUserAdmin(serviceTagTemp.getUpdateUser() + "")) {
                    //如果是管理员失效的
                    if (!WebContext.isLoginUserAdmin()) {
                        return ValidatorResultVo.DefaultValidationFailureVo("管理员停用的，非管理员不允许启用。");
                    }
                }
            }
        }
        return ValidatorResultVo.DefaultValidationSuccessVo();
    }
    /**
     * 新增的时候进行验证
     * @return
     */
    public ValidatorResultVo addValidation(ServiceTagVo serviceTagVo) {
        if (StringUtil.isEmpty(serviceTagVo.getServiceTagType())) {
            return ValidatorResultVo.DefaultValidationFailureVo("服务号类型不能为空。");
        }
        if (StringUtil.isEmpty(serviceTagVo.getServiceTagName())) {
            return ValidatorResultVo.DefaultValidationFailureVo("服务号名称不能为空。");
        }
        if (!String.valueOf(serviceTagVo.getServiceTagName().charAt(0)).matches("((\\d)|([a-z])|([A-Z])|([\u4e00-\u9fa5]))+")) {
            return ValidatorResultVo.DefaultValidationFailureVo("服务号名称的首字母必须为中文、英文或数字。");
        }
        return ValidatorResultVo.DefaultValidationSuccessVo();
    }

    /**
     * 删除时验证
     * @return
     */
    public ValidatorResultVo removeValidation(Integer serviceTagId) {
        if (serviceTagId == null) {
            return ValidatorResultVo.DefaultValidationFailureVo("ID不能为空。");
        }
        return ValidatorResultVo.DefaultValidationSuccessVo();
    }

    /**
     * 查询验证
     * @param serviceTagParam
     * @return
     */
    public ValidatorResultVo queryValidation(ServiceTagParam serviceTagParam) {

        return ValidatorResultVo.DefaultValidationSuccessVo();
    }
}
