package com.cyou.fz2035.servicetag.memcached;

/**
 * 缓存原子性操作接口.
 *
 * @author yangz
 * @date 2013-9-3 上午9:55
 */
public abstract class AbsCASOpt<T> {

    public static final int MAX_TRIES = 8192;

    /**
     * 初始值.
     *
     * @return
     */
    public abstract T initValue();

    /**
     * 初始值过期时间, 0为永不过期.
     *
     * @return
     */
    public int initExp(){
        return 0;
    }

    /**
     * 初始化后是否设置新值, 即调用getNewValue(initValue());
     *
     * @return
     */
    public boolean isInitNewValue(){
        return false;
    }

    /**
     * 并发冲突时,是否重试。如果不重试，并发冲突时则抛异常。
     * @return
     */
    public boolean isRedoConflicts(){
        return false;
    }

    /**
     * 获取新值.
     *
     * @param current
     * @return
     */
    public abstract T getNewValue(T current);
}
