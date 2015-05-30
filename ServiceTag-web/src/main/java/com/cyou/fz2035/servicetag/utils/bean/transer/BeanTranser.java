package com.cyou.fz2035.servicetag.utils.bean.transer;

import java.util.List;

/**
 * User: littlehui
 * Date: 14-12-1
 * Time: 上午11:10
 */
public interface BeanTranser<B, V> {

    public V beanToVo(B b, Class<V> vClass);

    public B voToBean(V v, Class<B> bClass);

    public List<V> beanToVos(List<B> bs, Class<V> vClass);

    public List<B> voToBeans(List<V> vs, Class<B> bClass);
}
