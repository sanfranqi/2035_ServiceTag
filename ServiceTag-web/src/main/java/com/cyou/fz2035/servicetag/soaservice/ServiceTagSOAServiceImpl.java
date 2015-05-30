package com.cyou.fz2035.servicetag.soaservice;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.collections.iterators.ArrayListIterator;
import org.springframework.beans.factory.annotation.Autowired;

import com.cyou.fz2035.servicetag.focustime.service.FocusTimeService;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagListVo;
import com.cyou.fz2035.servicetag.soaservices.dto.DCalendarDTO;
import com.cyou.fz2035.servicetag.soaservices.dto.ServiceTagDTO;
import com.cyou.fz2035.servicetag.soaservices.service.ServiceTagSOAService;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.utils.bean.ServiceTagIdUtil;

/**
 * @Description 服务号SOA.
 * @author QiSF
 * @date 2015年1月5日
 */
public class ServiceTagSOAServiceImpl implements ServiceTagSOAService {

	@Autowired
	private ServiceTagService serviceTagService;

	@Autowired
	private UserGroupRelUserService userGroupRelUserService;

	@Autowired
	private FocusTimeService focusTimeService;

	/**
	 * 获取服务号里不在黑名单里所有用户ID.（白名单）.
	 * 
	 * @author QiSF
	 * @date 2015年1月5日
	 */
	@Override
	public List<Long> queryWhiteList(Long serviceTagId) {
		return userGroupRelUserService.queryUserIdListNotInBlack(ServiceTagIdUtil.convertToInnerId(serviceTagId));
	}

	/**
	 * 获取服务号黑名单用户ID.
	 * 
	 * @author QiSF
	 * @date 2015年1月5日
	 */
	@Override
	public List<Long> queryBlackList(Long serviceTagId) {
		return userGroupRelUserService.queryBlackList(ServiceTagIdUtil.convertToInnerId(serviceTagId));
	}

	/**
	 * 查询所有我关注的服务号.
	 * 
	 * @author QiSF
	 * @date 2015年1月5日
	 */
	@Override
	public List<ServiceTagDTO> queryAllFocusServiceTag(Long userId) {
		List<ServiceTagListVo> list = serviceTagService.queryAllFocusServiceTag(userId);
		List<ServiceTagDTO> serviceTagDTOList = new ArrayList<ServiceTagDTO>();
		for (ServiceTagListVo serviceTagListVo : list) {
			ServiceTagDTO dto = new ServiceTagDTO();
			dto.setId(ServiceTagIdUtil.convertToOuterId(serviceTagListVo.getId()));
			dto.setServiceTagImg(serviceTagListVo.getServiceTagImg());
			dto.setServiceTagName(serviceTagListVo.getServiceTagName());
			dto.setRemark(serviceTagListVo.getRemark());
			dto.setFirstChar(serviceTagListVo.getFirstChar());
			serviceTagDTOList.add(dto);
		}

		return serviceTagDTOList;
	}

	/**
	 * 查询所有我关注的服务号(返回在用户中心对应的UserId).
	 * 
	 * @author QiSF
	 * @date 2015年1月6日
	 */
	@Override
	public List<Long> queryAllFocusServiceTagAsUser(Long userId) {
		return serviceTagService.queryAllFocusServiceTagAsUser(userId);
	}

	/**
	 * 验证服务号日程是否要发给用户.
	 * 
	 * @author QiSF
	 * @date 2015年1月7日
	 */
	@Override
	public Boolean validDC(DCalendarDTO dCalendarDTO, Long userId, Long nowDate) {
		try {
			String tag = dCalendarDTO.getCreateUser().toString().substring(0, 1);
			if ("2".equals(tag)) {
				int serviceTagId = ServiceTagIdUtil.convertToInnerId(dCalendarDTO.getCreateUser());
				if (!serviceTagService.isEnable(serviceTagId)) {
					return false;
				} else {
					if (dCalendarDTO.getDcType() == 1) {
						if (!userGroupRelUserService.validUserIsInGroup(serviceTagId, userId)
								|| !focusTimeService.validDC(serviceTagId, userId, nowDate + dCalendarDTO.getReturnStartTime(), nowDate + dCalendarDTO.getReturnEndTime())) {
							return false;
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return true;
	}

	/**
	 * 
	 * 验证服务号日程是否要发给用户.(批量)
	 * 
	 * @author QiSF
	 * @date 2015年1月9日
	 */
	@Override
	public List<DCalendarDTO> validDC(List<DCalendarDTO> dCalendarDTOList, Long userId, Long nowDate) {
		Iterator<DCalendarDTO> iterator = new ArrayListIterator(dCalendarDTOList.toArray());
		while (iterator.hasNext()) {
			DCalendarDTO dCalendarDTO = iterator.next();
			try {
				String tag = dCalendarDTO.getCreateUser().toString().substring(0, 1);
				if ("2".equals(tag)) {
					int serviceTagId = ServiceTagIdUtil.convertToInnerId(dCalendarDTO.getCreateUser());
					if (!serviceTagService.isEnable(serviceTagId)) {
						dCalendarDTOList.remove(dCalendarDTO);
					} else {
						if (dCalendarDTO.getDcType() == 1) {
							if (!userGroupRelUserService.validUserIsInGroup(serviceTagId, userId)
									|| !focusTimeService.validDC(serviceTagId, userId, nowDate + dCalendarDTO.getReturnStartTime(), nowDate + dCalendarDTO.getReturnEndTime())) {
								dCalendarDTOList.remove(dCalendarDTO);
							}
						}
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return dCalendarDTOList;
	}
}
