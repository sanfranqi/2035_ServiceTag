package com.cyou.fz2035.servicetag.provider;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.StringUtil;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.context.dto.AppPaged;
import com.cyou.fz2035.servicetag.context.dto.AppResponse;
import com.cyou.fz2035.servicetag.messagebox.service.MessageBoxService;
import com.cyou.fz2035.servicetag.servicebase.bean.ServiceBase;
import com.cyou.fz2035.servicetag.servicebase.service.ServiceBaseService;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.param.ServiceTagParam;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagListOutVo;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagListVo;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagOutVo;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagVo;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.utils.bean.ServiceTagIdUtil;

/**
 * @Description 外部接口.
 * 
 * @author QiSF
 * @date 2014年12月4日
 */
@Controller
@RequestMapping("/provider")
public class ProviderController {

	@Autowired
	private UserGroupRelUserService userGroupRelUserService;

	@Autowired
	private ServiceTagService serviceTagService;

	@Autowired
	private ServiceBaseService serviceBaseService;

	@Autowired
	private MessageBoxService messageBoxService;

	/**
	 * 服务号添加关注.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	@ResponseBody
	@RequestMapping(value = "/focusServiceTag", produces = MediaType.APPLICATION_JSON_VALUE)
	public AppResponse<Boolean> focusServiceTag(Long serviceTagId, Long _m) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return AppResponse.getFailedResponse("服务号ID不能为空!");
		if (ObjectUtil.isEmpty(_m))
			return AppResponse.getFailedResponse("用户ID不能为空!");
		try {
			return AppResponse.getSuccessResponse(userGroupRelUserService.transFocusServiceTag(ServiceTagIdUtil.convertToInnerId(serviceTagId), _m));
		} catch (Exception e) {
			e.printStackTrace();
			return AppResponse.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 服务号取消关注.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	@ResponseBody
	@RequestMapping(value = "/cancelFocus", produces = MediaType.APPLICATION_JSON_VALUE)
	public AppResponse<Boolean> cancelFocus(Long serviceTagId, Long _m) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return AppResponse.getFailedResponse("服务号ID不能为空!");
		if (ObjectUtil.isEmpty(_m))
			return AppResponse.getFailedResponse("用户ID不能为空!");
		try {
			return AppResponse.getSuccessResponse(userGroupRelUserService.transCancelFocus(ServiceTagIdUtil.convertToInnerId(serviceTagId), _m));
		} catch (Exception e) {
			e.printStackTrace();
			return AppResponse.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 获取服务号里不在黑名单里所有用户ID.（白名单）
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryWhiteList", produces = MediaType.APPLICATION_JSON_VALUE)
	public AppResponse<List<Long>> queryWhiteList(Long serviceTagId) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return AppResponse.getFailedResponse("服务号ID不能为空!");
		try {
			List<Long> list = userGroupRelUserService.queryUserIdListNotInBlack(ServiceTagIdUtil.convertToInnerId(serviceTagId));
			return AppResponse.getSuccessResponse(list);
		} catch (Exception e) {
			e.printStackTrace();
			return AppResponse.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 分页查询我关注的服务号.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryFocusServiceTag", produces = MediaType.APPLICATION_JSON_VALUE)
	public AppResponse<AppPaged<ServiceTagListOutVo>> queryFocusServiceTag(Long _m, Integer pageNo, Integer pageSize) {
		if (ObjectUtil.isEmpty(_m))
			return AppResponse.getFailedResponse("用户ID不能为空!");
		if (ObjectUtil.isEmpty(pageNo))
			return AppResponse.getFailedResponse("页号不能为空!");
		if (ObjectUtil.isEmpty(pageSize))
			return AppResponse.getFailedResponse("页大小不能为空!");
		try {
			Paged<ServiceTagListVo> paged = serviceTagService.queryFocusServiceTag(_m, pageNo, pageSize);
			List<ServiceTagListOutVo> serviceTagListOutVos = new ArrayList<ServiceTagListOutVo>();
			for (ServiceTagListVo serviceTagListVo : paged.getListData()) {
				ServiceTagListOutVo vo = new ServiceTagListOutVo();
				vo.setId(ServiceTagIdUtil.convertToOuterId(serviceTagListVo.getId()));
				vo.setServiceTagImg(serviceTagListVo.getServiceTagImg());
				vo.setServiceTagName(serviceTagListVo.getServiceTagName());
				vo.setRemark(serviceTagListVo.getRemark());
				vo.setFirstChar(serviceTagListVo.getFirstChar());
				serviceTagListOutVos.add(vo);
			}
			AppPaged<ServiceTagListOutVo> appPaged = new AppPaged<ServiceTagListOutVo>(serviceTagListOutVos, paged.getTotalHit(), pageNo, pageSize);
			return AppResponse.getSuccessResponse(appPaged);
		} catch (Exception e) {
			e.printStackTrace();
			return AppResponse.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 根据ID查询服务号信息.
	 * 
	 * @author QiSF
	 * @date 2014年12月25日
	 */
	@ResponseBody
	@RequestMapping(value = "/getServiceTagById", produces = MediaType.APPLICATION_JSON_VALUE)
	public AppResponse<ServiceTagOutVo> getServiceTagById(Long serviceTagId, Long _m) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return AppResponse.getFailedResponse("服务号ID不能为空!");
		try {
			AppResponse<ServiceTagOutVo> response = AppResponse.getSuccessResponse();
			ServiceTagVo serviceTagVo = serviceTagService.getServiceTagById(ServiceTagIdUtil.convertToInnerId(serviceTagId), _m);
			ServiceTagOutVo vo = new ServiceTagOutVo();
			vo.setId(ServiceTagIdUtil.convertToOuterId(serviceTagVo.getId()));
			vo.setServiceTagImg(serviceTagVo.getServiceTagImg());
			vo.setServiceTagName(serviceTagVo.getServiceTagName());
			vo.setRemark(serviceTagVo.getRemark());
			vo.setFirstChar(serviceTagVo.getFirstChar());
			vo.setServiceTagType(serviceTagVo.getServiceTagType());
			vo.setServiceTagFacade(serviceTagVo.getServiceTagFacade());
			vo.setStatus(serviceTagVo.getStatus());
			vo.setServiceTagCode(serviceTagVo.getServiceTagCode());
			vo.setCreateUser(serviceTagVo.getCreateUser());
			vo.setUserName(serviceTagVo.getUserName());
			vo.setIsFocus(serviceTagVo.getIsFocus());
			response.setData(vo);
			return response;
		} catch (Exception e) {
			e.printStackTrace();
			return AppResponse.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 添加消息.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	@ResponseBody
	@RequestMapping(value = "/addMessage", produces = MediaType.APPLICATION_JSON_VALUE)
	public AppResponse<Boolean> addMessage(Long serviceTagId, String serviceType, Long _m, String content) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return AppResponse.getFailedResponse("服务号ID不能为空!");
		if (ObjectUtil.isEmpty(_m))
			return AppResponse.getFailedResponse("发送用户ID不能为空!");
		if (ObjectUtil.isEmpty(content))
			return AppResponse.getFailedResponse("内容不能为空!");
		try {
			return AppResponse.getSuccessResponse(messageBoxService.addMessage(ServiceTagIdUtil.convertToInnerId(serviceTagId), serviceType, _m, content));
		} catch (Exception e) {
			e.printStackTrace();
			return AppResponse.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 分页查询所有服务号.
	 * 
	 * @author QiSF
	 * @date 2014年12月26日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryServiceTagList", produces = MediaType.APPLICATION_JSON_VALUE)
	public AppResponse<AppPaged<ServiceTagOutVo>> queryServiceTagList(Long _m, Integer pageNo, Integer pageSize, String serviceTagName) {
		if (ObjectUtil.isEmpty(_m))
			return AppResponse.getFailedResponse("用户ID不能为空!");
		if (ObjectUtil.isEmpty(pageNo))
			return AppResponse.getFailedResponse("页号不能为空!");
		if (ObjectUtil.isEmpty(pageSize))
			return AppResponse.getFailedResponse("页大小不能为空!");
		try {
			ServiceTagParam serviceTagParam = new ServiceTagParam();
			serviceTagParam.setPageNo(pageNo);
			serviceTagParam.setPageSize(pageSize);
			serviceTagParam.setStatus(ServiceTagConstants.SERVICETAG_STATUS_USE);
			serviceTagParam.setServiceTagName(serviceTagName);

			List<ServiceTagOutVo> serviceTagVos = new ArrayList<ServiceTagOutVo>();
			List<ServiceTag> serviceTags = serviceTagService.queryByParam(serviceTagParam);
			for (ServiceTag serviceTag : serviceTags) {
				ServiceTagOutVo vo = new ServiceTagOutVo();
				vo.setId(ServiceTagIdUtil.convertToOuterId(serviceTag.getId()));
				vo.setServiceTagImg(serviceTag.getServiceTagImg());
				vo.setServiceTagName(serviceTag.getServiceTagName());
				vo.setRemark(serviceTag.getRemark());
				vo.setFirstChar(serviceTag.getFirstChar());
				vo.setServiceTagType(serviceTag.getServiceTagType());
				vo.setServiceTagFacade(serviceTag.getServiceTagFacade());
				vo.setStatus(serviceTag.getStatus());
				vo.setServiceTagCode(serviceTag.getServiceTagCode());
				vo.setCreateUser(serviceTag.getCreateUser());
				serviceTagVos.add(vo);
			}
			AppPaged<ServiceTagOutVo> appPaged = new AppPaged<ServiceTagOutVo>(serviceTagVos, serviceTagParam.getTotalHit(), pageNo, pageSize);
			return AppResponse.getSuccessResponse(appPaged);
		} catch (Exception e) {
			e.printStackTrace();
			return AppResponse.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 查询所有服务号.
	 * 
	 * @author QiSF
	 * @date 2014年12月26日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryAllServiceTagList", produces = MediaType.APPLICATION_JSON_VALUE)
	public AppResponse<List<ServiceTagListOutVo>> queryAllServiceTagList() {
		try {
			List<ServiceTagListVo> list = serviceTagService.queryAllServiceTagList();
			List<ServiceTagListOutVo> serviceTagListOutVos = new ArrayList<ServiceTagListOutVo>();
			for (ServiceTagListVo serviceTagListVo : list) {
				ServiceTagListOutVo vo = new ServiceTagListOutVo();
				vo.setId(ServiceTagIdUtil.convertToOuterId(serviceTagListVo.getId()));
				vo.setServiceTagImg(serviceTagListVo.getServiceTagImg());
				vo.setServiceTagName(serviceTagListVo.getServiceTagName());
				vo.setRemark(serviceTagListVo.getRemark());
				vo.setFirstChar(serviceTagListVo.getFirstChar());
				serviceTagListOutVos.add(vo);
			}
			return AppResponse.getSuccessResponse(serviceTagListOutVos);
		} catch (Exception e) {
			e.printStackTrace();
			return AppResponse.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 查询所有我关注的服务号.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryAllFocusServiceTag", produces = MediaType.APPLICATION_JSON_VALUE)
	public AppResponse<List<ServiceTagListOutVo>> queryAllFocusServiceTag(Long _m) {
		if (ObjectUtil.isEmpty(_m))
			return AppResponse.getFailedResponse("用户ID不能为空!");
		try {
			List<ServiceTagListVo> list = serviceTagService.queryAllFocusServiceTag(_m);
			List<ServiceTagListOutVo> serviceTagListOutVos = new ArrayList<ServiceTagListOutVo>();
			for (ServiceTagListVo serviceTagListVo : list) {
				ServiceTagListOutVo vo = new ServiceTagListOutVo();
				vo.setId(ServiceTagIdUtil.convertToOuterId(serviceTagListVo.getId()));
				vo.setServiceTagImg(serviceTagListVo.getServiceTagImg());
				vo.setServiceTagName(serviceTagListVo.getServiceTagName());
				vo.setRemark(serviceTagListVo.getRemark());
				vo.setFirstChar(serviceTagListVo.getFirstChar());
				serviceTagListOutVos.add(vo);
			}
			return AppResponse.getSuccessResponse(serviceTagListOutVos);
		} catch (Exception e) {
			e.printStackTrace();
			return AppResponse.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 查询最新的九个服务号.
	 * 
	 * @author QiSF
	 * @date 2015年1月4日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryLastServiceTag", produces = MediaType.APPLICATION_JSON_VALUE)
	public AppResponse<List<ServiceTagListOutVo>> queryLastServiceTag() {
		try {
			List<ServiceTagListVo> list = serviceTagService.queryLastServiceTag();
			List<ServiceTagListOutVo> serviceTagListOutVos = new ArrayList<ServiceTagListOutVo>();
			for (ServiceTagListVo serviceTagListVo : list) {
				ServiceTagListOutVo vo = new ServiceTagListOutVo();
				vo.setId(ServiceTagIdUtil.convertToOuterId(serviceTagListVo.getId()));
				vo.setServiceTagImg(serviceTagListVo.getServiceTagImg());
				vo.setServiceTagName(serviceTagListVo.getServiceTagName());
				vo.setRemark(serviceTagListVo.getRemark());
				vo.setFirstChar(serviceTagListVo.getFirstChar());
				serviceTagListOutVos.add(vo);
			}
			return AppResponse.getSuccessResponse(serviceTagListOutVos);
		} catch (Exception e) {
			e.printStackTrace();
			return AppResponse.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 服务号批量添加关注.
	 * 
	 * @author QiSF
	 * @date 2015年1月4日
	 */
	@ResponseBody
	@RequestMapping(value = "/focusServiceTagList", produces = MediaType.APPLICATION_JSON_VALUE)
	public AppResponse<Boolean> focusServiceTagList(String serviceTagIdArr, Long _m) {
		if (ObjectUtil.isEmpty(serviceTagIdArr))
			return AppResponse.getFailedResponse("服务号ID不能为空!");
		if (ObjectUtil.isEmpty(_m))
			return AppResponse.getFailedResponse("用户ID不能为空!");
		try {
			return AppResponse.getSuccessResponse(userGroupRelUserService.focusServiceTagList(serviceTagIdArr, _m));
		} catch (Exception e) {
			e.printStackTrace();
			return AppResponse.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 获取服务号黑名单用户ID.
	 * 
	 * @author QiSF
	 * @date 2014年11月28日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryBlackList", produces = MediaType.APPLICATION_JSON_VALUE)
	public AppResponse<List<Long>> queryBlackList(Long serviceTagId) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return AppResponse.getFailedResponse("服务号ID不能为空!");
		try {
			List<Long> list = userGroupRelUserService.queryBlackList(ServiceTagIdUtil.convertToInnerId(serviceTagId));
			return AppResponse.getSuccessResponse(list);
		} catch (Exception e) {
			e.printStackTrace();
			return AppResponse.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 查询所有我关注的服务号(返回在用户中心对应的UserId).
	 * 
	 * @author QiSF
	 * @date 2015年1月6日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryAllFocusServiceTagAsUser", produces = MediaType.APPLICATION_JSON_VALUE)
	public AppResponse<List<Long>> queryAllFocusServiceTagAsUser(Long _m) {
		if (ObjectUtil.isEmpty(_m))
			return AppResponse.getFailedResponse("用户ID不能为空!");
		try {
			return AppResponse.getSuccessResponse(serviceTagService.queryAllFocusServiceTagAsUser(_m));
		} catch (Exception e) {
			e.printStackTrace();
			return AppResponse.getFailedResponse(e.getMessage());
		}
	}
}
