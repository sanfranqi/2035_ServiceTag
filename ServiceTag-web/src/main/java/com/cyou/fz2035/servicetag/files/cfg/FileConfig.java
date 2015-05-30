package com.cyou.fz2035.servicetag.files.cfg;


import com.cyou.fz2035.servicetag.config.SystemConfig;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;

/**
 * 文件上传配置.
 *
 * @author qingwu
 * @date 2014-1-22 下午2:08:01
 */
public class FileConfig implements java.io.Serializable, IHotDeployInit {

    private static final long serialVersionUID = -7896269265500161030L;

    /**
     * 临时文件位置.
     */
    public static String TEMP_PATH;

    /**
     * 文件大小.
     */
    public static Integer FILE_SIZE;

    static {
        new FileConfig().init();
    }

    @Override
    public void init() {
        TEMP_PATH = ApplicationContextUtil.getBean(SystemConfig.class).getTempPath();
        FILE_SIZE = ApplicationContextUtil.getBean(SystemConfig.class).getFileSize();
    }

}
