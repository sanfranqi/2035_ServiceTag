package com.cyou.fz2035.servicetag.memcached.casopt;

import net.rubyeye.xmemcached.CASOperation;

/**
 * xmemcache 原子性操作.
 * @author yangz
 * @date 2013-9-3 下午4:50
 */
public interface XCASOperation<T> extends CASOperation<T> {
    /**
     * 操作成功后的值.
     * @return
     */
    public T getLastValue();
}
