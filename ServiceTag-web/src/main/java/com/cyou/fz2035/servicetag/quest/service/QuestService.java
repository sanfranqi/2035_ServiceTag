package com.cyou.fz2035.servicetag.quest.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz2035.servicetag.cached.UserCachedHandler;
import com.cyou.fz2035.servicetag.config.PublishTypeEnum;
import com.cyou.fz2035.servicetag.quest.bean.Quest;
import com.cyou.fz2035.servicetag.quest.bean.QuestClass;
import com.cyou.fz2035.servicetag.quest.vo.QuestClassVo;
import com.cyou.fz2035.servicetag.quest.vo.QuestVo;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.usergroupreluser.service.UserGroupRelUserService;
import com.cyou.fz2035.servicetag.utils.ListUtils;
import com.cyou.fz2035.servicetag.utils.UnCaughtException;
import com.cyou.fz2035.servicetag.utils.bean.ServiceTagIdUtil;

/**
 * @Description .
 * @author QiSF
 * @date 2014年12月17日
 */
@Service
public class QuestService {

	@Autowired
	private UserGroupRelUserService userGroupRelUserService;
	@Autowired
	private ServiceTagService serviceTagService;

	/**
	 * 获取问卷分类列表.
	 * 
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	public List<QuestClassVo> getQuestClassList() {
		List<QuestClassVo> questClassVoList = new ArrayList<QuestClassVo>();
		List<QuestClass> questClassList = QuestBaseService.getQuestClassList();
		for (QuestClass questClass : questClassList) {
			QuestClassVo questClassVo = new QuestClassVo();
			questClassVo.setClassId(questClass.getClassid());
			questClassVo.setName(questClass.getName());
			questClassVoList.add(questClassVo);
		}
		return questClassVoList;
	}

	/**
	 * 问卷添加.
	 * 
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	public boolean addQuest(String title, String classId, String serviceTagId) {
		String serviceTagName = serviceTagService.get(ServiceTagIdUtil.convertToInnerId(Long.parseLong(serviceTagId))).getServiceTagName();
		return QuestBaseService.addQuest(title, classId, serviceTagId, serviceTagName);
	}

	/**
	 * 问卷删除.
	 * 
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	public boolean delQuest(int id, String serviceTagId) {
		return QuestBaseService.delQuest(id, serviceTagId);
	}

	/**
	 * 问卷发布.
	 * 
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	public boolean publishQuest(Integer id, Integer serviceTagId) {
		List<Long> userIdList = userGroupRelUserService.queryUserIdListNotInBlack(serviceTagId);
		if (userIdList == null || userIdList.size() == 0) {
			throw new UnCaughtException("服务号关注的用户数为0,不能发布!");
		}
		String userIds = ListUtils.list2String(userIdList, ",");
		StringBuffer userNames = new StringBuffer("");
		int i = 0;
		for (Long userId : userIdList) {
			MatrixUserInfo matrixUserInfo = UserCachedHandler.getMatrixUserInfo(userId);
			userNames.append(matrixUserInfo.getFullName());
			i++;
			if (i < userIdList.size()) {
				userNames.append(",");
			}
		}
		return QuestBaseService.publishQuest(id, userIds, userNames.toString());
	}

	/**
	 * 查询问卷列表.
	 * 
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	public Paged<QuestVo> queryQuestPageList(String serviceTagId, String title, Integer status, Integer pageNo, Integer pageSize) {
		List<QuestVo> questVoList = new ArrayList<QuestVo>();
		List<Quest> questList = QuestBaseService.queryQuestPageList(serviceTagId, title, status, pageNo, pageSize);
		for (Quest quest : questList) {
			QuestVo questVo = new QuestVo();
			questVo.setId(quest.getId());
			questVo.setName(quest.getName());
			questVo.setCreateDate(quest.getCreate_date());
			questVo.setEditDate(quest.getEdit_date());
			questVo.setCount(quest.getCount());
			questVo.setServiceTagId(quest.getUser_server_id());
			questVo.setStatusName(PublishTypeEnum.valueOfCode(quest.getStatus()));
			questVoList.add(questVo);
		}
		Paged<QuestVo> paged = new Paged<QuestVo>(questVoList, questVoList.size(), pageNo, pageSize);
		return paged;
	}

	/**
	 * 更新问卷关注对象.
	 * 
	 * @return
	 * @author QiSF
	 * @date 2015年1月16日
	 */
	public boolean updateFocus(int type, Long serviceTagId) {
		return QuestBaseService.updateFocus(type, String.valueOf(serviceTagId));
	}

	/**
	 * 更新问卷关注对象.
	 * 
	 * @return
	 * @author QiSF
	 * @date 2015年1月16日
	 */
	public boolean updateServiceTagName(int serviceTagId, String serviceTagName) {
		return QuestBaseService.updateServiceTagName(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)), serviceTagName);
	}

	/**
	 * 更新服务号状态通知.
	 * 
	 * @param type
	 *            1-停用；2启用
	 * @author QiSF
	 * @date 2015年1月29日
	 */
	public boolean updateServiceTagStatus(int serviceTagId, int type) {
		return QuestBaseService.updateServiceTagStatus(String.valueOf(ServiceTagIdUtil.convertToOuterId(serviceTagId)), type);
	}
}
