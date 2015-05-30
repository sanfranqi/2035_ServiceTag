package com.cyou.fz2035.servicetag.utils.bean.transer.impl;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.servicetag.servicetag.vo.ValidatorResultVo;
import com.cyou.fz2035.servicetag.utils.ListUtils;
import com.cyou.fz2035.servicetag.utils.bean.transer.BeanTranser;

import java.util.ArrayList;
import java.util.List;

/**
 * User: littlehui
 * Date: 15-3-12
 * Time: 上午11:15
 */
public abstract class AbstractSimpleBeanTranser<B, V> {

    AbstractBeanTranser<B, V> defaultAbstractTranser = new AbstractBeanTranser<B, V>() {
    };

    public V defaultBeanToVo(B b, Class<V> vClass) {
        return defaultAbstractTranser.beanToVo(b, vClass);
    }

    public B defaultVoToBean(V v, Class<B> bClass) {
        return defaultAbstractTranser.voToBean(v, bClass);
    }

    public abstract V beanToVo(B b);

    public abstract B voToBean(V v) ;

    public List<V> beanToVos(List<B> bs) {
        List<V> vs = new ArrayList<V>();
        if (ListUtils.isNotEmpty(bs)) {
            for (B b : bs) {
                vs.add(beanToVo(b));
            }
        }
        return vs;
    }

    public List<B> voToBeans(List<V> vs) {
        List<B> bs = new ArrayList<B>();
        if (ListUtils.isNotEmpty(bs)) {
            for (V v : vs) {
                bs.add(voToBean(v));
            }
        }
        return bs;
    }
}
