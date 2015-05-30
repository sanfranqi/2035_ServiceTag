package com.cyou.fz2035.servicetag.provider;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.StringUtil;
import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.context.dto.AppResponse;
import com.cyou.fz2035.servicetag.messagebox.service.MessageBoxService;
import com.cyou.fz2035.servicetag.servicebase.bean.ServiceBase;
import com.cyou.fz2035.servicetag.servicebase.service.ServiceBaseService;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagListOutVo;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagListVo;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.utils.ListUtils;
import com.cyou.fz2035.servicetag.utils.bean.ServiceTagIdUtil;
import org.apache.commons.collections.iterators.ArrayListIterator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

/**
 * User: littlehui
 * Date: 15-1-15
 * Time: 下午4:42
 */
@Controller
@RequestMapping("/provider")
public class ProviderWebController {
    @Autowired
    private UserGroupRelUserService userGroupRelUserService;

    @Autowired
    private ServiceTagService serviceTagService;

    @Autowired
    private ServiceBaseService serviceBaseService;

    @Autowired
    private MessageBoxService messageBoxService;

    /**
     * 获取服务号的白名单
     *
     * @param serviceTagCode
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/serviceTag/focusUsers", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<List<Long>> queryFocusServiceTagUsers(String serviceTagCode) {
        if (StringUtil.isEmpty(serviceTagCode)) {
            Response.getSuccessResponse("服务号不能为空。");
        }
        try {
            ServiceTag serviceTag = serviceTagService.getServiceTagByServiceTagCode(serviceTagCode);
            List<Long> userIds = userGroupRelUserService.queryUserIdListNotInBlack(serviceTag.getId());
            return Response.getSuccessResponse(userIds);
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.getFailedResponse("获取失败。");
        }
    }

    /**
     * 获取服务的白名单
     *
     * @param serviceId
     * @param serviceType
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/service/focusUsers", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<List<Long>> queryFocusServiceUsers(Long serviceId, String serviceType) {
        try {
            ServiceBase serviceBase = serviceBaseService.getServiceBaseByBussinessIdAndType(serviceId, serviceType);
            List<Long> userIds = userGroupRelUserService.queryUserIdListNotInBlack(serviceBase.getServiceTagId());
            return Response.getSuccessResponse(userIds);
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.getFailedResponse("获取失败。");
        }
    }

    /**
     *
     * @param userId
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/serviceTag/focusServiceTagCodes", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<List<String>> focusServiceTagCodes(Long userId) {
        List<String> serviceTagCodes = new ArrayList<String>();
        if (ObjectUtil.isEmpty(userId))
            return Response.getFailedResponse("用户ID不能为空!");
        try {
            List<ServiceTagListVo> list = serviceTagService.queryAllFocusServiceTag(userId);
            if (ListUtils.isNotEmpty(list)) {
                ListIterator<ServiceTagListVo> listVoListIterator = new ArrayListIterator(list.toArray());
                while (listVoListIterator.hasNext()) {
                    ServiceTagListVo serviceTagListVo = listVoListIterator.next();
                    if (userGroupRelUserService.validIsInblack(serviceTagListVo.getId(), userId)) {
                        list.remove(serviceTagListVo);
                    }
                }
                serviceTagCodes = ListUtils.getListItemsSingleColumnList(list, "serviceTagCode", String.class);
                return Response.getSuccessResponse(serviceTagCodes);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.getFailedResponse(e.getMessage());
        }
        return Response.getFailedResponse(serviceTagCodes);
    }
}
