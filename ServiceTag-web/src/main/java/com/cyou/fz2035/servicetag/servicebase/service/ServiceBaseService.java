package com.cyou.fz2035.servicetag.servicebase.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.cyou.fz2035.servicetag.utils.context.WebContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Query;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.service.BaseService;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.servicetag.config.ServiceBaseStatusEnum;
import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import com.cyou.fz2035.servicetag.servicebase.bean.ServiceBase;
import com.cyou.fz2035.servicetag.servicebase.param.ServiceBaseParam;
import com.cyou.fz2035.servicetag.servicebase.vo.ServiceBaseVo;
import com.cyou.fz2035.servicetag.servicetag.code.ServiceCodeCrypt;
import com.cyou.fz2035.servicetag.utils.ListUtils;
import com.cyou.fz2035.servicetag.utils.bean.transer.BeanTranser;
import com.cyou.fz2035.servicetag.utils.bean.transer.impl.AbstractBeanTranser;

/**
 * User: littlehui Date: 14-11-26 Time: 下午4:51
 */
@Service
public class ServiceBaseService extends BaseService<ServiceBase> {

	@Autowired
	ServiceCodeCrypt serviceCodeCrypt;

	private BeanTranser<ServiceBase, ServiceBaseVo> beanTranser = new AbstractBeanTranser<ServiceBase, ServiceBaseVo>() {

		public ServiceBaseVo beanToVo(ServiceBase b, Class<ServiceBaseVo> vClass) {
			if (b != null) {
				ServiceBaseVo serviceBaseVo = ObjectUtil.convertObj(b, vClass);
				serviceBaseVo.setServiceTypeName(ServiceTypeEnum.valueTextOfCode(serviceBaseVo.getServiceType()));
				return serviceBaseVo;
			}
			return new ServiceBaseVo();
		}

		public List<ServiceBaseVo> beanToVos(List<ServiceBase> bs, Class<ServiceBaseVo> vClass) {
			if (ListUtils.isNotEmpty(bs)) {
				List<ServiceBaseVo> serviceBaseVos = ObjectUtil.convertList(bs, vClass);
				if (ListUtils.isNotEmpty(serviceBaseVos)) {
					for (ServiceBaseVo serviceBaseVo : serviceBaseVos) {
						serviceBaseVo.setStatusName(ServiceBaseStatusEnum.valueOfCode(serviceBaseVo.getStatus()).getName());
						serviceBaseVo.setServiceTypeName(ServiceTypeEnum.valueTextOfCode(serviceBaseVo.getServiceType()));
					}
				}
				return serviceBaseVos;
			}
			return new ArrayList<ServiceBaseVo>();
		}
	};

	public BeanTranser<ServiceBase, ServiceBaseVo> getBeanTranser() {
		return beanTranser;
	}

	public List<ServiceBase> queyByParam(ServiceBaseParam serviceBaseParam) {
		Query serviceBaseQuery = Query.build(ServiceBase.class);
		serviceBaseQuery.addEq("serviceTagId", serviceBaseParam.getServiceTagId());
		serviceBaseQuery.addIn("serviceType", serviceBaseParam.getServiceType());
		serviceBaseQuery.addEq("deleteFlag", Boolean.FALSE);
		serviceBaseQuery.addOrder("updateTime", Query.DBOrder.DESC);
		serviceBaseQuery.addEq("businessId", serviceBaseParam.getBusinessId());
		serviceBaseQuery.addBetween("updateTime", serviceBaseParam.getUpdateTimeStart(), serviceBaseParam.getUpdateTimeEnd());
		serviceBaseQuery.addEq("status", serviceBaseParam.getStatus());
		serviceBaseQuery.addLike("serviceName", serviceBaseParam.getServiceName());
        serviceBaseQuery.addOrder("updateTime", Query.DBOrder.DESC);
		serviceBaseQuery.setPaged(serviceBaseParam.getPageNo(), serviceBaseParam.getPageSize());
		serviceBaseParam.setTotalHit(this.count(serviceBaseQuery));
		List<ServiceBase> serviceBases = this.findByQuery(serviceBaseQuery);
		return serviceBases;
	}

	public List<ServiceBase> getServiceBaseByServiceTagId(Integer serviceTagId) {
		ServiceBaseParam serviceBaseParam = new ServiceBaseParam();
		serviceBaseParam.setServiceTagId(serviceTagId);
		serviceBaseParam.setPaged(false);
		List<ServiceBase> serviceBases = this.queyByParam(serviceBaseParam);
		return serviceBases;
	}

	public ServiceBase getServiceBaseByBussinessIdAndType(Long bussinesseId, String type) {
		ServiceBaseParam serviceBaseParam = new ServiceBaseParam();
		serviceBaseParam.setPaged(false);
		serviceBaseParam.setServiceType(new String[]{type});
		serviceBaseParam.setBusinessId(bussinesseId);
		List<ServiceBase> serviceBases = this.queyByParam(serviceBaseParam);
		if (ListUtils.isNotEmpty(serviceBases)) {
			return serviceBases.get(0);
		}
		return null;
	}

	public ServiceBase transAddServiceBase(ServiceBase serviceBase) {
        serviceBase.setCreateUser(WebContext.getLoginUserId());
		ServiceBase serviceBaseAfterSave = this.insert(serviceBase);
		return serviceBaseAfterSave;
	}

	public void delete(int id) {
		ServiceBase serviceBase = new ServiceBase();
		serviceBase.setId(id);
		serviceBase.setDeleteFlag(true);
		this.update(serviceBase);
	}

	public void reDelete(int id) {
		ServiceBase serviceBase = new ServiceBase();
		serviceBase.setId(id);
		serviceBase.setDeleteFlag(false);
		this.update(serviceBase);
	}

    public void changeServiceBaseStatusByBusinessId(String status, Long bussinessId) {
        ServiceBaseParam serviceBaseParam = new ServiceBaseParam();
        serviceBaseParam.setBusinessId(bussinessId);
        serviceBaseParam.setPaged(false);
        List<ServiceBase> serviceBases = this.queyByParam(serviceBaseParam);
        if (serviceBases != null && !serviceBases.isEmpty()) {
            ServiceBase s  = serviceBases.get(0);
            s.setStatus(status);
            this.update(s);
        }
    }

    public ServiceBase getServiceBaseByBusinessId(Long bussinessId) {
        ServiceBaseParam serviceBaseParam = new ServiceBaseParam();
        serviceBaseParam.setBusinessId(bussinessId);
        serviceBaseParam.setPaged(false);
        List<ServiceBase> serviceBases = this.queyByParam(serviceBaseParam);
        if (serviceBases != null && !serviceBases.isEmpty()) {
            ServiceBase s  = serviceBases.get(0);
            return s;
        }
        return null;
    }

}
