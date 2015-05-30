package com.cyou.fz2035.servicetag.memcached.casopt.impl;


import com.cyou.fz2035.servicetag.memcached.AbsCASOpt;
import com.cyou.fz2035.servicetag.memcached.casopt.XCASOperation;

/**
 * User: littlehui
 * Date: 14-11-7
 * Time: 下午6:03
 */
public class DefaultCASOperation<T> implements XCASOperation<T> {

    private T lastValue;

    private AbsCASOpt<T> casOpt = null;

        public DefaultCASOperation(AbsCASOpt<T> casOpt) {
        this.casOpt = casOpt;
    }


    @Override
    public int getMaxTries() {
        return casOpt.isRedoConflicts() ? AbsCASOpt.MAX_TRIES
                : 0;
    }

    @Override
    public T getNewValue(long currentCAS, T currentValue) {
        lastValue = casOpt.getNewValue(currentValue);
        return lastValue;
    }

    @Override
    public T getLastValue() {
        return this.lastValue;
    }
}

