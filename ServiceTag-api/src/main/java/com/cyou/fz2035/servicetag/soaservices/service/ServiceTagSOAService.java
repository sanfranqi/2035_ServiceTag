package com.cyou.fz2035.servicetag.soaservices.service;

import java.util.List;

import com.cyou.fz2035.servicetag.soaservices.dto.DCalendarDTO;
import com.cyou.fz2035.servicetag.soaservices.dto.ServiceTagDTO;

/**
 * @Description 服务号SOA.
 * @author QiSF
 * @date 2015年1月5日
 */
public interface ServiceTagSOAService {

	/**
	 * 获取服务号里不在黑名单里所有用户ID.（白名单）
	 * 
	 * @author QiSF
	 * @date 2015年1月5日
	 */
	public List<Long> queryWhiteList(Long serviceTagId);

	/**
	 * 获取服务号黑名单用户ID.
	 * 
	 * @author QiSF
	 * @date 2015年1月5日
	 */
	public List<Long> queryBlackList(Long serviceTagId);

	/**
	 * 查询所有我关注的服务号.
	 * 
	 * @author QiSF
	 * @date 2015年1月5日
	 */
	public List<ServiceTagDTO> queryAllFocusServiceTag(Long userId);

	/**
	 * 查询所有我关注的服务号(返回在用户中心对应的UserId).
	 * 
	 * @author QiSF
	 * @date 2015年1月6日
	 */
	public List<Long> queryAllFocusServiceTagAsUser(Long userId);

	/**
	 * 验证日程是否要发给用户.
	 * 
	 * @author QiSF
	 * @date 2015年1月7日
	 */
	public Boolean validDC(DCalendarDTO dCalendarDTO, Long userId, Long nowDate);

	/**
	 * 验证日程是否要发给用户.(批量)
	 * 
	 * @author QiSF
	 * @date 2015年1月7日
	 */
	public List<DCalendarDTO> validDC(List<DCalendarDTO> dCalendarDTO, Long userId, Long nowDate);

}
