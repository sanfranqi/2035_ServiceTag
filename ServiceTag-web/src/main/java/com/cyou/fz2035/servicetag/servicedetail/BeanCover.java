package com.cyou.fz2035.servicetag.servicedetail;

import java.util.List;
import java.util.Map;

/**
 * User: littlehui
 * Date: 14-11-28
 * Time: 下午5:26
 */
public interface BeanCover<T> {

    /**
     * 前端给的detailMap 转成serviceBase后剩下的转成 List<ServiceAttrValue>
     *     注意。没有serviceAttrValueId。
     * @param additionMap
     * @return
     */
    public List<T> coverToBeanList(Map<String, Object> additionMap);

    /**
     * 转成map
     * @param attrValues
     * @return
     */
    public Map<String, Object> coverTomap(List<T> attrValues);

    /**
     * 前端给的detailMap 转成serviceBase后剩下的转成 List<ServiceAttrValue>
     *     注意。没有serviceAttrValueId。
     * @param additionMap
     * @return
     */
    public List<T> coverToBeanList(Map<String, Object> additionMap, List<String> attrs);
}
