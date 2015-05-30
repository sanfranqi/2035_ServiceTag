package com.cyou.fz2035.servicetag.servicetag.service;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.cyou.fz2035.servicetag.servicetagaudit.bean.ServiceTagAudit;
import com.cyou.fz2035.servicetag.servicetagaudit.service.ServiceTagAuditService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Query;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.service.BaseService;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz.commons.mybatis.selecterplus.pinyin.PinyinTools;
import com.cyou.fz2035.servicetag.cached.UserCachedHandler;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.config.ServiceTagStatusEnum;
import com.cyou.fz2035.servicetag.config.ServiceTagTypeEnum;
import com.cyou.fz2035.servicetag.files.CommonFileUploader;
import com.cyou.fz2035.servicetag.files.ResultVO;
import com.cyou.fz2035.servicetag.files.ServiceTagImageUploader;
import com.cyou.fz2035.servicetag.files.Thumbnail;
import com.cyou.fz2035.servicetag.quest.service.QuestService;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.code.ServiceCodeCrypt;
import com.cyou.fz2035.servicetag.servicetag.dao.ServiceTagDAO;
import com.cyou.fz2035.servicetag.servicetag.param.ServiceTagParam;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagListVo;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagVo;
import com.cyou.fz2035.servicetag.user.service.MatrixUserSoaService;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.usergroup.service.UserGroupService;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.utils.ListUtils;
import com.cyou.fz2035.servicetag.utils.UnCaughtException;
import com.cyou.fz2035.servicetag.utils.bean.transer.BeanTranser;
import com.cyou.fz2035.servicetag.utils.bean.transer.impl.AbstractBeanTranser;
import com.cyou.fz2035.servicetag.utils.context.ApplicationContextUtil;
import com.cyou.fz2035.servicetag.utils.context.WebContext;
import com.cyou.fz2035.task.rpc.api.ITaskService;

/**
 * User: littlehui Date: 14-11-27 Time: 上午10:58
 */
@Service
public class ServiceTagService extends BaseService<ServiceTag> {

	Logger logger = Logger.getLogger(ServiceTagService.class);

	@Autowired
	ServiceCodeCrypt serviceCodeCrypt;

	@Autowired
	WebUserService webUserService;

	@Autowired
	UserGroupService userGroupService;

	@Autowired
	MatrixUserSoaService matrixUserSoaService;

	@Autowired
	private ServiceTagDAO serviceTagDAO;

	@Autowired
	private UserGroupRelUserService userGroupRelUserService;

	@Autowired
	private QuestService questService;

	private ITaskService taskService = ApplicationContextUtil.getBean("taskService");

    @Autowired
    private ServiceTagAuditService serviceTagAuditService;

	private BeanTranser<ServiceTag, ServiceTagVo> beanTranser = new AbstractBeanTranser<ServiceTag, ServiceTagVo>() {
		@Override
		public ServiceTagVo beanToVo(ServiceTag serviceTag, Class<ServiceTagVo> serviceTagVoClass) {
			ServiceTagVo serviceTagVo = super.beanToVo(serviceTag, serviceTagVoClass);
			MatrixUserInfo userInfo = UserCachedHandler.getMatrixUserInfo(serviceTagVo.getCreateUser());
			serviceTagVo.setUserName(userInfo.getFullName());
			serviceTagVo.setServiceTagTypeName(ServiceTagTypeEnum.valueOfCode(serviceTagVo.getServiceTagType()).getName());
			return serviceTagVo;
		}

		@Override
		public List<ServiceTagVo> beanToVos(List<ServiceTag> serviceTags, Class<ServiceTagVo> serviceTagVoClass) {
			List<ServiceTagVo> serviceTagVos = new ArrayList<ServiceTagVo>();
			if (ListUtils.isNotEmpty(serviceTags)) {
				serviceTagVos = ObjectUtil.convertList(serviceTags, serviceTagVoClass);
				for (ServiceTagVo serviceTagVo : serviceTagVos) {
					MatrixUserInfo userInfo = UserCachedHandler.getMatrixUserInfo(serviceTagVo.getCreateUser());
					serviceTagVo.setUserName(userInfo.getFullName());
					serviceTagVo.setServiceTagTypeName(ServiceTagTypeEnum.valueOfCode(serviceTagVo.getServiceTagType()).getName());
				}
			}
			return serviceTagVos;
		}
	};

	public BeanTranser<ServiceTag, ServiceTagVo> getBeanTranser() {
		return beanTranser;
	}

	/**
	 * 基础查询
	 *
	 * @param serviceTagParam
	 * @return
	 */
	public List<ServiceTag> queryByParam(ServiceTagParam serviceTagParam) {
		Query serviceTagQuery = Query.build(ServiceTag.class);
		serviceTagQuery.addEq("createUser", serviceTagParam.getCreateUser());
		serviceTagQuery.addEq("id", serviceTagParam.getId());
		serviceTagQuery.addBetween("updateTime", serviceTagParam.getUpdateStartTime(), serviceTagParam.getUpdateEndTime());
		serviceTagQuery.addEq("status", serviceTagParam.getStatus());
		serviceTagQuery.addEq("deleteFlag", Boolean.FALSE);
		serviceTagQuery.addOrder("updateTime", Query.DBOrder.DESC);
		serviceTagQuery.addEq("serviceTagCode", serviceTagParam.getServiceTagCode());
		serviceTagQuery.addLike("serviceTagName", serviceTagParam.getServiceTagName());
		serviceTagQuery.setPaged(serviceTagParam.getPageNo(), serviceTagParam.getPageSize());
		serviceTagParam.setTotalHit(this.count(serviceTagQuery));
		List<ServiceTag> serviceTags = this.findByQuery(serviceTagQuery);
		return serviceTags;
	}

	public ServiceTag transAddServiceTag(ServiceTag serviceTag) {
		char name = serviceTag.getServiceTagName().charAt(0);
		String firstChar = PinyinTools.getPinyinHeads(name).toUpperCase();
		if (!Character.isLetter(firstChar.charAt(0))) {
			firstChar = "#";
		}
		serviceTag.setFirstChar(firstChar);
		serviceTag.setUpdateTime(System.currentTimeMillis());
		serviceTag.setUpdateUser(WebContext.getLoginUserId());
		serviceTag.setCreateUser(WebContext.getLoginUserId());
		serviceTag.setCreateTime(System.currentTimeMillis());
		serviceTag.setStatus(ServiceTagConstants.SERVICETAG_STATUS_NEW);
		ServiceTag serviceTagAfterSave = this.insert(serviceTag);
		serviceCodeCrypt.setId(serviceTag.getId().toString());
		serviceCodeCrypt.setNumber(serviceTag.getCreateUser().toString());
		serviceCodeCrypt.setType(serviceTag.getServiceTagType());
		serviceTagAfterSave.setServiceTagCode(serviceCodeCrypt.getServiceCode());
		// 保存Code
		update(serviceTagAfterSave);
		// serviceTagAfterSave = this.get(serviceTagAfterSave.getId());
		boolean isResiter = matrixUserSoaService.register(serviceTagAfterSave.getId() + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID, serviceTagAfterSave.getServiceTagName());
		if (!isResiter) {
			this.delete(serviceTagAfterSave.getId());
			logger.info("用户中心注册失败。" + serviceTagAfterSave.getServiceTagName() + "可能名字过长。");
			throw new RuntimeException("用户中心注册失败。");
		}
		// 添加默认的两个分组
		userGroupService.addGroup(serviceTagAfterSave.getId(), ServiceTagConstants.GROUP_FRIEND_NAME, ServiceTagConstants.GROUP_TYPE_FRIEND);
		userGroupService.addGroup(serviceTagAfterSave.getId(), ServiceTagConstants.GROUP_BLACK_NAME, ServiceTagConstants.GROUP_TYPE_BLACKLIST);
		return serviceTagAfterSave;
	}

	public ServiceTag getServiceTagByServiceTagCode(String serviceTagCode) {
		ServiceTagParam serviceTagParam = new ServiceTagParam();
		serviceTagParam.setServiceTagCode(serviceTagCode);
		serviceTagParam.setPaged(false);
		List<ServiceTag> serviceTags = this.queryByParam(serviceTagParam);
		if (ListUtils.isNotEmpty(serviceTags)) {
			return serviceTags.get(0);
		}
		return null;
	}

	/**
	 * 裁剪头像
	 *
	 * @param serviceTagCode
	 * @param x
	 * @param y
	 * @param width
	 * @param height
	 * @return
	 */
	@Deprecated
	public ResultVO cutServiceTagImageAndSave(String serviceTagCode, int x, int y, int width, int height) {
		ResultVO result = new ResultVO(true);
		// 1.进行头像图片的上传
		String serviceTagPath = ServiceTagConstants.FILE_IMAGEPATH + serviceTagCode + "/";
		String srcpath = serviceTagPath + "source.jpg";
		File file = new File(srcpath);
		if (!file.exists()) {
			result.setSuccess(false);
			result.addMsg("文件不存在");
			return result;
		}
		String uploadLargePath = serviceTagPath + ServiceTagConstants.AVATAR_LARGE;
		String uploadMediumPath = serviceTagPath + ServiceTagConstants.AVATAR_MEDIUM;
		String uploadSmallPath = serviceTagPath + ServiceTagConstants.AVATAR_SMALL;
		String uploadMiniPath = serviceTagPath + ServiceTagConstants.AVATAR_MIN;
		try {
			Thumbnail.cut(srcpath, uploadLargePath, x, y, width, height);
			Thumbnail.saveImageAsJpg(uploadLargePath, uploadLargePath, ServiceTagConstants.AVATAR_LARGE_SIZE, ServiceTagConstants.AVATAR_LARGE_SIZE, false);
			Thumbnail.saveImageAsJpg(uploadLargePath, uploadMediumPath, ServiceTagConstants.AVATAR_MEDIUM_SIZE, ServiceTagConstants.AVATAR_MEDIUM_SIZE, false);
			Thumbnail.saveImageAsJpg(uploadLargePath, uploadSmallPath, ServiceTagConstants.AVATAR_SMALL_SIZE, ServiceTagConstants.AVATAR_SMALL_SIZE, false);
			Thumbnail.saveImageAsJpg(uploadLargePath, uploadMiniPath, ServiceTagConstants.AVATAR_MINI_SIZE, ServiceTagConstants.AVATAR_MINI_SIZE, false);
		} catch (Exception e) {
			e.printStackTrace();
		}

		String serviceTagImage = serviceTagCode + "/" + ServiceTagConstants.AVATAR_LARGE;
		// 2.保存到数据库
		/*
		 * ServiceTag serviceTag = new ServiceTag();
		 * serviceTag.setId(Integer.parseInt(serviceTagCode));
		 * serviceTag.setServiceTagImg(serviceTagImage);
		 * this.update(serviceTag);
		 */
		List<String> msg = new ArrayList<String>();
		msg.add(serviceTagImage);
		result.setMsg(msg);
		return result;
	}

	@Deprecated
	public ResultVO uploadServiceTagImage(HttpServletRequest request, String serviceTagId) {
		String uploadPath = ServiceTagConstants.FILE_IMAGEPATH + serviceTagId + "/";
		File file = new File(uploadPath);
		file.mkdirs();
		ServiceTagImageUploader uau = new ServiceTagImageUploader(request, uploadPath);
		ResultVO result = uau.saveAvatarFile();
		return result;
	}

	public ResultVO uploadAddtionFiles(HttpServletRequest request) {
		String uploadPath = ServiceTagConstants.FILE_PATH;
		CommonFileUploader commonFileUploader = new CommonFileUploader(request, uploadPath);
		ResultVO result = commonFileUploader.saveFiles();
		return result;
	}

	public ServiceTag transUpdateServiceTag(ServiceTag serviceTag) {
		char name = serviceTag.getServiceTagName() == null ? ' ' : serviceTag.getServiceTagName().charAt(0);
		serviceTag.setUpdateTime(System.currentTimeMillis());
		ServiceTag beforeUpdate = this.get(serviceTag.getId());
        if (!ServiceTagStatusEnum.STOPUSE.getCode().equals(beforeUpdate.getStatus())) {
			// 如果是停用不设置updateUser
			serviceTag.setUpdateUser(WebContext.getLoginUserId());
		}
		if (name != ' ') {
			String firstChar = PinyinTools.getPinyinHeads(name).toUpperCase();
			if (!Character.isLetter(firstChar.charAt(0))) {
				firstChar = "#";
			}
			serviceTag.setFirstChar(firstChar);
			this.update(serviceTag);
		} else {
			this.update(serviceTag);
		}
		// 有改名称
		if (!beforeUpdate.getServiceTagName().equals(serviceTag.getServiceTagName()) && serviceTag.getServiceTagName() != null) {
			// 名称有变
			boolean isupdateOk = matrixUserSoaService.update(serviceTag.getId() + ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID, serviceTag.getServiceTagName());
			if (!isupdateOk) {
				this.update(beforeUpdate);
				throw new RuntimeException("用户中心更新服务号信息失败。");
			}
			// 更新问卷服务号名称
			try {
				isupdateOk = questService.updateServiceTagName(serviceTag.getId(), serviceTag.getServiceTagName());
			} catch (Exception e) {
				this.update(beforeUpdate);
				throw new RuntimeException("问卷系统更新服务号信息失败。" + e.getMessage());
			}
		}
		// 有改状态
		if (serviceTag.getStatus() != null) {
			// 停用
			if (serviceTag.getStatus().equals(ServiceTagStatusEnum.STOPUSE.getCode()) && !beforeUpdate.getStatus().equals(ServiceTagStatusEnum.STOPUSE.getCode())) {
				// 停用
				questService.updateServiceTagStatus(beforeUpdate.getId(), 1);
				taskService.serviceStopped(ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID + beforeUpdate.getId());
			} else if (serviceTag.getStatus().equals(ServiceTagStatusEnum.INUSE.getCode()) && !beforeUpdate.getStatus().equals(ServiceTagStatusEnum.INUSE.getCode())) {
				// 启用
				taskService.serviceRecovery(ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID + beforeUpdate.getId());
				questService.updateServiceTagStatus(beforeUpdate.getId(), 2);
			}
		}
		return this.get(serviceTag.getId());
	}

	/**
	 * 分页查询我关注服务号列表
	 *
	 * @author QiSF
	 * @date 2014年12月4日
	 */
	public Paged<ServiceTagListVo> queryFocusServiceTag(Long userId, Integer pageNo, Integer pageSize) {
		Paged<ServiceTagListVo> paged = new Paged<ServiceTagListVo>(null, 0, pageNo, pageSize);
		int rowStart = (pageNo - 1) * pageSize;
		if (rowStart < 0)
			rowStart = 0;
		paged.setListData(serviceTagDAO.queryFocusServiceTag(userId, rowStart, pageSize));
		paged.setTotalHit(serviceTagDAO.countFocusServiceTag(userId));
		return paged;
	}

	/**
	 * 查询我关注服务号全部列表
	 *
	 * @author QiSF
	 * @date 2014年12月4日
	 */
	public List<ServiceTagListVo> queryAllFocusServiceTag(Long userId) {
		List<ServiceTagListVo> serviceTagVos = serviceTagDAO.queryAllFocusServiceTag(userId);
		// for (int i = 0; i < serviceTagVos.size(); i++) {
		// if (serviceTagVos.get(i).getFirstChar().equals("#")) {
		// serviceTagVos.add(serviceTagVos.get(i));
		// serviceTagVos.remove(i);
		// } else {
		// break;
		// }
		// }
		Collections.sort(serviceTagVos, new Comparator<ServiceTagListVo>() {
			@Override
			public int compare(ServiceTagListVo o1, ServiceTagListVo o2) {
				if ("#".equals(o1.getFirstChar())) {
					return 1;
				}
				if ("#".equals(o2.getFirstChar())) {
					return -1;
				}
				return o1.getFirstChar().compareTo(o2.getFirstChar());
			}
		});
		return serviceTagVos;
	}

	/**
	 * 查询所有我关注的服务号(返回在用户中心对应的UserId).
	 * 
	 * @author QiSF
	 * @date 2015年1月6日
	 */
	public List<Long> queryAllFocusServiceTagAsUser(Long userId) {
		List<ServiceTagListVo> serviceTagVos = serviceTagDAO.queryAllFocusServiceTag(userId);
		List<Long> list = new ArrayList<Long>();
		for (ServiceTagListVo temp : serviceTagVos) {
			list.add(ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID + temp.getId());
		}
		return list;
	}

	/**
	 * 根据ID查询服务号信息.
	 * 
	 * @author QiSF
	 * @date 2014年12月25日
	 */
	public ServiceTagVo getServiceTagById(int serviceTagId, long userId) {
		ServiceTag serviceTag = this.get(serviceTagId);
		ServiceTagVo serviceTagVo = ObjectUtil.convertObj(serviceTag, ServiceTagVo.class);
		serviceTagVo.setIsFocus(userGroupRelUserService.validUserIsInGroup(serviceTagId, userId));
		return serviceTagVo;
	}

	/**
	 * 查询所有服务号.
	 * 
	 * @author QiSF
	 * @date 2014年12月26日
	 */
	public List<ServiceTagListVo> queryAllServiceTagList() {
		Query serviceTagQuery = Query.build(ServiceTag.class);
		serviceTagQuery.addEq("status", ServiceTagConstants.SERVICETAG_STATUS_USE);
		serviceTagQuery.addEq("deleteFlag", Boolean.FALSE);
		serviceTagQuery.addOrder("firstChar", Query.DBOrder.ASC);
		List<ServiceTag> serviceTags = this.findByQuery(serviceTagQuery);
		List<ServiceTagListVo> serviceTagVos = ObjectUtil.convertList(serviceTags, ServiceTagListVo.class);
		// for (int i = 0; i < serviceTagVos.size(); i++) {
		// if (serviceTagVos.get(i).getFirstChar().equals("#")) {
		// serviceTagVos.add(serviceTagVos.get(i));
		// serviceTagVos.remove(i);
		// } else {
		// break;
		// }
		// }
		Collections.sort(serviceTagVos, new Comparator<ServiceTagListVo>() {
			@Override
			public int compare(ServiceTagListVo o1, ServiceTagListVo o2) {
				if ("#".equals(o1.getFirstChar())) {
					return 1;
				}
				if ("#".equals(o2.getFirstChar())) {
					return -1;
				}
				return o1.getFirstChar().compareTo(o2.getFirstChar());
			}
		});
		return serviceTagVos;
	}

	/**
	 * 查询最新的九个服务号.
	 * 
	 * @author QiSF
	 * @date 2015年1月4日
	 */
	public List<ServiceTagListVo> queryLastServiceTag() {
		Query serviceTagQuery = Query.build(ServiceTag.class);
		serviceTagQuery.addEq("deleteFlag", Boolean.FALSE);
		serviceTagQuery.addEq("status", ServiceTagConstants.SERVICETAG_STATUS_USE);
		serviceTagQuery.addOrder("createTime", Query.DBOrder.DESC);
		serviceTagQuery.setPaged(1, 9);
		List<ServiceTag> serviceTagList = this.findByQuery(serviceTagQuery);
		List<ServiceTagListVo> serviceTagVos = ObjectUtil.convertList(serviceTagList, ServiceTagListVo.class);
		return serviceTagVos;
	}

	@Override
	public void delete(int id) {
		ServiceTag serviceTag = new ServiceTag();
		serviceTag.setId(id);
		serviceTag.setDeleteFlag(true);
		this.transUpdateServiceTag(serviceTag);
	}

	public boolean isAuthUserServiceTag(Integer serviceTagId, Long userId) {
		ServiceTagParam serviceTagParam = new ServiceTagParam();
		serviceTagParam.setCreateUser(userId);
		serviceTagParam.setId(serviceTagId);
		List<ServiceTag> serviceTags = this.queryByParam(serviceTagParam);
		if (ListUtils.isNotEmpty(serviceTags)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 根据服务号ID获取服务号信息.
	 * 
	 * @author QiSF
	 * @date 2015年2月4日
	 */
	public ServiceTag getServiceTagById(Integer serviceTagId) {
		ServiceTag serviceTag = this.get(serviceTagId);
		if (ObjectUtil.isEmpty(serviceTag)) {
			throw new UnCaughtException("服务号[" + serviceTagId + "]不存在!");
		}
		return serviceTag;
	}

	/**
	 * 根据服务号ID判断服务号是否启用.
	 * 
	 * @author QiSF
	 * @date 2015年2月4日
	 */
	public boolean isEnable(Integer serviceTagId) {
		try {
			ServiceTag serviceTag = this.getServiceTagById(serviceTagId);
			if (ServiceTagStatusEnum.INUSE.getCode().equals(serviceTag.getStatus())) {
				return true;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return false;
	}
}
