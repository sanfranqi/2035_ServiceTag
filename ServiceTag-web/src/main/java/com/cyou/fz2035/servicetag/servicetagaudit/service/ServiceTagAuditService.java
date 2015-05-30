package com.cyou.fz2035.servicetag.servicetagaudit.service;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Query;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.service.BaseService;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.servicetag.cached.UserCachedHandler;
import com.cyou.fz2035.servicetag.config.ServiceTagAuditEnum;
import com.cyou.fz2035.servicetag.config.ServiceTagStatusEnum;
import com.cyou.fz2035.servicetag.config.ServiceTagTypeEnum;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.servicetagaudit.bean.ServiceTagAudit;
import com.cyou.fz2035.servicetag.servicetagaudit.param.ServiceTagAuditParam;
import com.cyou.fz2035.servicetag.servicetagaudit.vo.ServiceTagAndAuditVo;
import com.cyou.fz2035.servicetag.servicetagaudit.vo.ServiceTagAuditVo;
import com.cyou.fz2035.servicetag.springmvc.exception.BusinessException;
import com.cyou.fz2035.servicetag.utils.ListUtils;
import com.cyou.fz2035.servicetag.utils.bean.transer.impl.AbstractSimpleBeanTranser;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * User: littlehui
 * Date: 15-3-9
 * Time: 上午10:54
 */
@Service
public class ServiceTagAuditService extends BaseService<ServiceTagAudit> {

    @Getter
    public AbstractSimpleBeanTranser<ServiceTagAudit, ServiceTagAuditVo> abstractSimpleBeanTranser = new AbstractSimpleBeanTranser<ServiceTagAudit, ServiceTagAuditVo>() {

        @Override
        public ServiceTagAuditVo beanToVo(ServiceTagAudit serviceTagAudit) {
            ServiceTagAuditVo serviceTagAuditVo =  defaultBeanToVo(serviceTagAudit, ServiceTagAuditVo.class);
            if (serviceTagAuditVo.getCreateUser() != null) {
                serviceTagAuditVo.setCreateUserName(UserCachedHandler.getMatrixUserInfo(serviceTagAuditVo.getCreateUser()).getFullName());
            }
            return serviceTagAuditVo;
        }

        @Override
        public ServiceTagAudit voToBean(ServiceTagAuditVo serviceTagAuditVo) {
            return defaultVoToBean(serviceTagAuditVo, ServiceTagAudit.class);
        }
    };

    @Getter
    public AbstractSimpleBeanTranser<ServiceTagAudit, ServiceTag> auditToServiceTagTranser = new AbstractSimpleBeanTranser<ServiceTagAudit, ServiceTag>() {
        @Override
        public ServiceTag beanToVo(ServiceTagAudit serviceTagAudit) {
            ServiceTag serviceTag = defaultBeanToVo(serviceTagAudit, ServiceTag.class);
            serviceTag.setId(serviceTagAudit.getServiceTagId());
            serviceTag.setDeleteFlag(false);
            serviceTag.setStatus(null);
            serviceTag.setSecondCheckStatus(serviceTagAudit.getStatus());
            return serviceTag;
        }

        @Override
        public ServiceTagAudit voToBean(ServiceTag serviceTag) {
            ServiceTagAudit audit = defaultVoToBean(serviceTag, ServiceTagAudit.class);
            ServiceTagAudit serviceTagAudit = ServiceTagAuditService.this.getServiceTagAuditVoByServiceTagId(serviceTag.getId());
            if (serviceTagAudit != null && serviceTagAudit.getId() != null) {
                audit.setId(serviceTagAudit.getId());
                audit.setStatus(serviceTag.getSecondCheckStatus());
            } else {
                audit.setId(null);
                audit.setStatus(ServiceTagAuditEnum.INCHECK.getCode());
            }
            audit.setServiceTagId(serviceTag.getId());
            return audit;
        }
    };

    @Autowired
    private ServiceTagService serviceTagService;

    /**
     * 基础查询
     *
     * @param serviceTagAuditParam
     * @return
     */
    public List<ServiceTagAudit> queryByParam(ServiceTagAuditParam serviceTagAuditParam) {
        Query serviceTagAuditQuery = Query.build(ServiceTagAudit.class);
        serviceTagAuditQuery.addEq("createUser", serviceTagAuditParam.getCreateUser());
        serviceTagAuditQuery.addOrder("createTime", Query.DBOrder.DESC);
        serviceTagAuditQuery.addEq("serviceTagId", serviceTagAuditParam.getServiceTagId());
        serviceTagAuditQuery.addEq("status", serviceTagAuditParam.getStatus());
        serviceTagAuditQuery.addLike("serviceTagName", serviceTagAuditParam.getServiceTagName());
        serviceTagAuditQuery.addEq("deleteFlag", Boolean.FALSE);
        serviceTagAuditQuery.setPaged(serviceTagAuditParam.getPageNo(), serviceTagAuditParam.getPageSize());
        serviceTagAuditParam.setTotalHit(this.count(serviceTagAuditQuery));
        List<ServiceTagAudit> serviceTagAudits = this.findByQuery(serviceTagAuditQuery);
        return serviceTagAudits;
    }

    /**
     * 通过serviceTagId获取修改内容
     *
     * @param serviceTagId
     * @return
     */
    public ServiceTagAudit getServiceTagAuditVoByServiceTagId(Integer serviceTagId) {
        ServiceTagAuditParam serviceTagAuditParam = new ServiceTagAuditParam();
        serviceTagAuditParam.setServiceTagId(serviceTagId);
        List<ServiceTagAudit> serviceTagAudits = this.queryByParam(serviceTagAuditParam);
        if (ListUtils.isNotEmpty(serviceTagAudits)) {
            return serviceTagAudits.get(0);
        }
        return null;
    }

    /**
     * 判断是否需要审核的修改
     *
     * @param serviceTag
     * @return
     */
    public boolean isNeedAuditWhenUpdateServiceTag(ServiceTag serviceTag) {
        int serviceTagId = serviceTag.getId();
        if (serviceTagId > 0) {
            ServiceTag beforeUpdate = serviceTagService.get(serviceTagId);
            return isNeedAuditWhenUpdateServiceTag(beforeUpdate, serviceTag);
        }
        return false;
    }

    /**
     * 判断是否需要审核的修改
     *
     * @param beforeUpdateBean
     * @param updateBean
     * @return
     */
    public boolean isNeedAuditWhenUpdateServiceTag(ServiceTag beforeUpdateBean, ServiceTag updateBean) {
        //未通过，未审核，和其他的状态不用处理
        if (beforeUpdateBean.getStatus().equals(ServiceTagStatusEnum.UNCHECK.getCode()) ||
                beforeUpdateBean.getStatus().equals(ServiceTagStatusEnum.RECHECK.getCode()) ||
                beforeUpdateBean.getStatus().equals(ServiceTagStatusEnum.OTHERS.getCode())) {
            return false;
        }
        boolean isNeedAudit = false;
        if (updateBean.getServiceTagName() != null) {
            //有修改名称
            if (!updateBean.getServiceTagName().equals(beforeUpdateBean.getServiceTagName())) {
                isNeedAudit = true;
            }
        }
        if (updateBean.getServiceTagImg() != null) {
            //有修改头像
            if (!updateBean.getServiceTagImg().equals(beforeUpdateBean.getServiceTagImg())) {
                isNeedAudit = true;
            }
        }
        if (updateBean.getRemark() != null) {
            //有修改名称
            if (!updateBean.getRemark().equals(beforeUpdateBean.getRemark())) {
                isNeedAudit = true;
            }
        }
        return isNeedAudit;
    }

    public void addAuditServiceTagByVo(ServiceTagAuditVo auditVo) throws BusinessException {
        ServiceTagAudit serviceTagAudit = abstractSimpleBeanTranser.voToBean(auditVo);
        serviceTagAudit.setStatus(ServiceTagAuditEnum.INCHECK.getCode());
        serviceTagAudit.setCreateUser(WebContext.getLoginUserId());
        ServiceTag updateServiceTag = new ServiceTag();
        updateServiceTag.setId(auditVo.getServiceTagId());
        if (updateServiceTag.getId() == null) {
            throw new BusinessException("服务号ID不能为空。");
        }
        updateServiceTag.setInAuthDetails(true);
        updateServiceTag.setSecondCheckStatus(ServiceTagAuditEnum.INCHECK.getCode());
        updateServiceTag.setUpdateUser(WebContext.getLoginUserId());
        serviceTagService.update(updateServiceTag);
        this.insert(serviceTagAudit);
    }

    public void updateAuditServiceTagByVo(ServiceTagAuditVo auditVo) throws BusinessException {
        ServiceTagAudit serviceTagAudit = abstractSimpleBeanTranser.voToBean(auditVo);
        serviceTagAudit.setCreateTime(System.currentTimeMillis());
        ServiceTag updateServiceTag = new ServiceTag();
        updateServiceTag.setId(auditVo.getServiceTagId());
        if (updateServiceTag.getId() == null) {
            throw new BusinessException("服务号ID不能为空。");
        }
        if (auditVo.getId() == null) {
            throw new BusinessException("提交的修改ID不能为空。");
        }
        updateServiceTag.setInAuthDetails(true);
        updateServiceTag.setSecondCheckStatus(ServiceTagAuditEnum.INCHECK.getCode());
        serviceTagService.update(updateServiceTag);
        this.update(serviceTagAudit);
    }

    public void deleteAuditServiceTagByVo(ServiceTagAuditVo auditVo) {
        if (auditVo.getId() != null) {
            this.delete(auditVo.getId());
        }
    }

    /**
     * 审核通过
     */
    public void checkAuditServiceTag(Integer auditId, Integer serviceTagId) {
        ServiceTagAudit serviceTagAudit =  this.get(auditId);
        serviceTagAudit.setStatus(ServiceTagAuditEnum.CHECKED.getCode());
        serviceTagAudit.setDeleteFlag(true);
        this.update(serviceTagAudit);
        ServiceTag serviceTag = this.getAuditToServiceTagTranser().beanToVo(serviceTagAudit);
        serviceTag.setInAuthDetails(false);
        serviceTagService.transUpdateServiceTag(serviceTag);
        this.update(serviceTagAudit);
    }

    /**
     * 审核不通过
     */
    public void unCheckAuditServiceTag(Integer auditId, Integer serviceTagId) {
        ServiceTagAudit serviceTagAudit =  this.get(auditId);
        serviceTagAudit.setStatus(ServiceTagAuditEnum.RECHECK.getCode());
        serviceTagAudit.setDeleteFlag(true);
        ServiceTag serviceTag = serviceTagService.get(serviceTagId);
        serviceTag.setInAuthDetails(false);
        serviceTag.setSecondCheckStatus(ServiceTagAuditEnum.RECHECK.getCode());
        serviceTagService.update(serviceTag);
        this.update(serviceTagAudit);
    }

    public  void addAuditServiceTag(ServiceTagAudit serviceTagAudit) {
        ServiceTag updateServiceTag = new ServiceTag();
        serviceTagAudit.setCreateTime(System.currentTimeMillis());
        serviceTagAudit.setCreateUser(WebContext.getLoginUserId());
        updateServiceTag.setId(serviceTagAudit.getServiceTagId());
        updateServiceTag.setInAuthDetails(true);
        updateServiceTag.setSecondCheckStatus(ServiceTagAuditEnum.INCHECK.getCode());
        updateServiceTag.setCreateTime(System.currentTimeMillis());
        serviceTagService.update(updateServiceTag);
        this.insert(serviceTagAudit);
    }

    /**
     * 审核的详情，包括未修改前的信息
     * @param auditId
     * @return
     */
    public ServiceTagAndAuditVo getAuditDetails(Integer auditId) throws BusinessException {
        ServiceTagAudit serviceTagAudit = this.get(auditId);
        ServiceTagAuditVo serviceTagAuditVo = this.getAbstractSimpleBeanTranser().beanToVo(serviceTagAudit);
        if (serviceTagAuditVo == null || serviceTagAuditVo.getServiceTagId() == null) {
            throw new BusinessException("不存在的审核信息。");
        }
        ServiceTag serviceTag = serviceTagService.getServiceTagById(serviceTagAuditVo.getServiceTagId());
        if (serviceTag == null) {
            throw new BusinessException("不存在的服务号信息。", "ID" + serviceTagAuditVo.getServiceTagId());
        }
        ServiceTagAndAuditVo serviceTagAndAuditVo = ObjectUtil.convertObj(serviceTagAuditVo, ServiceTagAndAuditVo.class);
        serviceTagAndAuditVo.setOldRemark(serviceTag.getRemark());
        serviceTagAndAuditVo.setOldServiceTagFacade(serviceTag.getServiceTagFacade());
        serviceTagAndAuditVo.setOldServiceTagImg(serviceTag.getServiceTagImg());
        serviceTagAndAuditVo.setOldServiceTagName(serviceTag.getServiceTagName());
        serviceTagAndAuditVo.setOldServiceTagType(serviceTag.getServiceTagType());
        serviceTagAndAuditVo.setOldServiceTagTypeName(ServiceTagTypeEnum.valueOfCode(serviceTagAndAuditVo.getServiceTagType()).getName());
        serviceTagAndAuditVo.setServiceTagTypeName(ServiceTagTypeEnum.valueOfCode(serviceTagAndAuditVo.getOldServiceTagType()).getName());
        return serviceTagAndAuditVo;
    }
}
