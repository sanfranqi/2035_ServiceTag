package com.cyou.fz2035.servicetag.utils.bean;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.StringUtil;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

/**
 * Created by littlehui on 2015/1/4.
 */
public class ClassUtils {
    public static <T> T castToClassObject(Class<T> type, String value) {
        try {
            Constructor<T> constructor = type.getDeclaredConstructor(String.class);
            try {
                if (StringUtil.isNotEmpty(value)) {
                    T t = constructor.newInstance(value);
                    return t;
                }
            } catch (InstantiationException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static void main(String[] args) {
        String number = "423434232";
        Object destert = ClassUtils.castToClassObject(Long.class, number);
        System.out.print(destert.getClass());
    }
}
