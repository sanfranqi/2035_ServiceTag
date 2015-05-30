package com.cyou.fz2035.servicetag.utils.bean.transer.impl;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.servicetag.utils.bean.transer.BeanTranser;
import org.springframework.expression.spel.ast.TypeReference;

import java.util.ArrayList;
import java.util.List;

/**
 * User: littlehui
 * Date: 14-12-1
 * Time: 上午11:18
 */
public abstract class AbstractBeanTranser<B, V> implements BeanTranser<B, V>{

    public V beanToVo(B b, Class<V> vClass) {
        if (b == null) {
            return null;
        }
        return ObjectUtil.convertObj(b, vClass);
    }

    public B voToBean(V v, Class<B> bClass) {
        if (v == null) {
            return null;
        }
        return ObjectUtil.convertObj(v, bClass);
    }

    public List<V> beanToVos(List<B> bs, Class<V> vClass) {
        return ObjectUtil.convertList(bs, vClass);
    }

    public List<B> voToBeans(List<V> vs, Class<B> bClass) {
        return ObjectUtil.convertList(vs, bClass);
    }
}
