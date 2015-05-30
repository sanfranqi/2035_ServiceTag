package com.cyou.fz2035.servicetag.servicetag.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.dao.BaseDAO;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagListVo;

/**
 * User: littlehui Date: 14-11-27 Time: 下午2:21
 */
@Repository
public interface ServiceTagDAO extends BaseDAO<ServiceTag> {

    /**
     * 分页查询我关注服务号列表
     *
     * @author QiSF
     * @date 2014年12月4日
     */
    public List<ServiceTagListVo> queryFocusServiceTag(@Param("userId") Long userId, @Param("rowStart") Integer rowStart, @Param("pageSize") Integer pageSize);

    /**
     * 分页查询我关注服务号列表(count)
     *
     * @author QiSF
     * @date 2014年12月4日
     */
    public int countFocusServiceTag(@Param("userId") Long userId);

    /**
     * 查询我关注服务号全部列表
     *
     * @author QiSF
     * @date 2014年12月4日
     */
    public List<ServiceTagListVo> queryAllFocusServiceTag(@Param("userId") Long userId);

}
