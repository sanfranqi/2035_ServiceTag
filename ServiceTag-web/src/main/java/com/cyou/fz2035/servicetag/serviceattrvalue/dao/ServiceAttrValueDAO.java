package com.cyou.fz2035.servicetag.serviceattrvalue.dao;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.dao.BaseDAO;
import com.cyou.fz2035.servicetag.serviceattrvalue.bean.ServiceAttrValue;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * User: littlehui
 * Date: 14-11-28
 * Time: 下午3:33
 */
@Repository
public interface ServiceAttrValueDAO extends BaseDAO<ServiceAttrValue> {

    public String findAttrValueByServiceBaseAndAttr(@Param("serviceBaseId")Integer serviceBaseId, @Param("attrCode")String attrCode);

    public List<ServiceAttrValue> findAttrValuesByServiceBase(@Param("serviceBaseId")Integer serviceBaseId);

    public void deleteAttrValuesByServiceBase(@Param("serviceBaseId")Integer serviceBaseId);

    public void insertAttrValues(@Param("serviceBaseId")Integer serviceBaseId, @Param("attrValues")List<ServiceAttrValue> attrValues);

    public void deleteAttrValuesByServiceBaseIdAndAttrs(@Param("serviceBaseId")Integer serviceBaseId, @Param("attrCodes")List<String> attrCodes);

    public Map<String, Object> findAttrValuesMapByServiceBase(@Param("serviceBaseId")Integer serviceBaseId, @Param("attrCodes")List<String> attrCodes);
    
    public void upateAttrValues(@Param("serviceBaseId")Integer serviceBaseId, @Param("attrCodes")String attrCodes,@Param("value")String value);
}
