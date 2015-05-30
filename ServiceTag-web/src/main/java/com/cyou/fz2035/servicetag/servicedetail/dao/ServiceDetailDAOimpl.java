package com.cyou.fz2035.servicetag.servicedetail.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.servicetag.config.ServiceAttrTypeEnum;
import com.cyou.fz2035.servicetag.config.ServiceTypeEnum;
import com.cyou.fz2035.servicetag.serviceattr.bean.ServiceAttr;
import com.cyou.fz2035.servicetag.serviceattr.dao.ServiceAttrDAO;
import com.cyou.fz2035.servicetag.serviceattrvalue.bean.ServiceAttrValue;
import com.cyou.fz2035.servicetag.serviceattrvalue.dao.ServiceAttrValueDAO;
import com.cyou.fz2035.servicetag.servicebase.bean.ServiceBase;
import com.cyou.fz2035.servicetag.servicebase.dao.ServiceBaseDAO;
import com.cyou.fz2035.servicetag.servicebase.vo.ServiceBaseVo;
import com.cyou.fz2035.servicetag.servicedetail.ServiceAttrValueCover;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.utils.ListUtils;
import com.cyou.fz2035.servicetag.utils.bean.ClassUtils;
import com.cyou.fz2035.servicetag.utils.context.WebContext;

/**
 * User: littlehui Date: 14-11-28 Time: 下午3:15
 */
@Repository("serviceDetailDAOImpl")
public class ServiceDetailDAOimpl implements ServiceDetailDAO {

	@Autowired
	ServiceBaseDAO serviceBaseDAO;

	@Autowired
	ServiceAttrValueDAO serviceAttrValueDAO;

	@Autowired
	ServiceAttrDAO serviceAttrDAO;

	@Autowired
	@Qualifier("serviceAttrValueCover")
	ServiceAttrValueCover serviceAttrValueCover;

	public void insertServiceDetail(ServiceDetail serviceDetail) {
		ServiceBase serviceBase = ObjectUtil.convertObj(serviceDetail.getServiceBaseVo(), ServiceBase.class);
		serviceBase.setUpdateTime(System.currentTimeMillis());
        serviceBase.setCreateUser(WebContext.getLoginUserId());
		serviceBase.setUpdateUser(WebContext.getLoginUserId());
		serviceBaseDAO.insert(serviceBase);
		List<String> attrs = serviceAttrDAO.findAttrByServiceType(serviceBase.getServiceType());
		// 回填ID
		serviceDetail.getServiceBaseVo().setId(serviceBase.getId());
		if (ListUtils.isNotEmpty(attrs) && !ObjectUtil.isEmpty(serviceDetail.getDetailsAddition())) {
			List<ServiceAttrValue> attrValues = serviceAttrValueCover.coverToBeanList(serviceDetail.getDetailsAddition(), attrs);
			serviceAttrValueDAO.insertAttrValues(serviceBase.getId(), attrValues);
		}
	}

	public ServiceDetail getServiceDetail(ServiceBase serviceBase) {
		ServiceDetail serviceDetail = new ServiceDetail();
		ServiceBaseVo serviceBaseVo = ObjectUtil.convertObj(serviceBase, ServiceBaseVo.class);
		serviceBaseVo.setServiceTypeName(ServiceTypeEnum.valueOfCode(serviceBase.getServiceType()).getName());
		serviceDetail.setServiceBaseVo(serviceBaseVo);
		List<String> attrs = serviceAttrDAO.findAttrByServiceType(serviceBase.getServiceType());
		List<ServiceAttr> serviceAttrs = serviceAttrDAO.findAttrsByServiceType(serviceBase.getServiceType());
		Map<String, Object> attrValueMap = serviceAttrValueDAO.findAttrValuesMapByServiceBase(serviceBase.getId(), attrs);
		if (ListUtils.isNotEmpty(serviceAttrs) && attrValueMap != null) {
			for (ServiceAttr serviceAttr : serviceAttrs) {
				Object obj = attrValueMap.get(serviceAttr.getServiceAttrCode());
				if (obj != null) {
					Class aclass = ServiceAttrTypeEnum.valueOfCode(serviceAttr.getServiceAttrType()).getType();
					Object desertObject = ClassUtils.castToClassObject(aclass, obj.toString());
					if (desertObject != null) {
						attrValueMap.put(serviceAttr.getServiceAttrCode(), desertObject);
					}
				}
			}
		}
		serviceDetail.setDetailsAddition(attrValueMap);
		return serviceDetail;
	}

	public void updateServiceDetail(ServiceDetail serviceDetail) {
		ServiceBase serviceBase = ObjectUtil.convertObj(serviceDetail.getServiceBaseVo(), ServiceBase.class);
		serviceBase.setUpdateTime(System.currentTimeMillis());
		serviceBase.setUpdateUser(WebContext.getLoginUserId());
		// 更新附加属性
		if (serviceDetail.getDetailsAddition() != null) {
			List<String> attrCodes = new ArrayList<String>(serviceDetail.getDetailsAddition().keySet());
			serviceAttrValueDAO.deleteAttrValuesByServiceBaseIdAndAttrs(serviceBase.getId(), attrCodes);
		}
		if(!ObjectUtil.isEmpty(serviceDetail.getDetailsAddition())){
			List<ServiceAttrValue> attrValues = serviceAttrValueCover.coverToBeanList(serviceDetail.getDetailsAddition());
			serviceAttrValueDAO.insertAttrValues(serviceBase.getId(), attrValues);
		}
		serviceBaseDAO.save(serviceBase);
	}
}
