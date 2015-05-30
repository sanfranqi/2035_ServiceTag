package com.cyou.fz2035.servicetag.servicedetail;

import com.cyou.fz2035.servicetag.servicedetail.vo.FileVo;
import lombok.Data;

import java.util.List;

/**
 * User: littlehui
 * Date: 15-1-8
 * Time: 上午10:19
 */
@Data
public class ServiceRewardDetail extends ServiceDetail {
    FileVo[] additionFiles;
}
