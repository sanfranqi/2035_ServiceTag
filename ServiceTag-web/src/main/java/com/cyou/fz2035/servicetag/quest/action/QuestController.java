package com.cyou.fz2035.servicetag.quest.action;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.quest.service.QuestService;
import com.cyou.fz2035.servicetag.quest.vo.QuestClassVo;
import com.cyou.fz2035.servicetag.quest.vo.QuestVo;
import com.cyou.fz2035.servicetag.utils.bean.ServiceTagIdUtil;

/**
 * @Description .
 * @author QiSF
 * @date 2014年12月17日
 */
@Controller
@RequestMapping("/admin/quest")
public class QuestController {

	private static final Logger log = Logger.getLogger(QuestController.class);

	@Autowired
	private QuestService questService;

	/**
	 * 获取问卷分类列表.
	 * 
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	@ResponseBody
	@RequestMapping(value = "/getQuestClassList", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<List<QuestClassVo>> getQuestClassList() {
		try {
			return Response.getSuccessResponse(questService.getQuestClassList());
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 问卷添加.
	 * 
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	@ResponseBody
	@RequestMapping(value = "/addQuest", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Boolean> addQuest(String title, String classId, String serviceTagId) {
		if (ObjectUtil.isEmpty(title))
			return Response.getFailedResponse("问卷标题不能为空!");
		if (ObjectUtil.isEmpty(classId))
			return Response.getFailedResponse("问卷分类不能为空!");
		if (ObjectUtil.isEmpty(serviceTagId))
			return Response.getFailedResponse("服务号ID不能为空!");
		try {
			return Response.getSuccessResponse(questService.addQuest(title, classId, serviceTagId));
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 问卷删除.
	 * 
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	@ResponseBody
	@RequestMapping(value = "/delQuest", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Boolean> delQuest(Integer id, String serviceTagId) {
		if (ObjectUtil.isEmpty(id))
			return Response.getFailedResponse("问卷ID不能为空!");
		try {
			return Response.getSuccessResponse(questService.delQuest(id, serviceTagId));
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 问卷发布.
	 * 
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	@ResponseBody
	@RequestMapping(value = "/publishQuest", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Boolean> publishQuest(Integer id, String serviceTagId) {
		if (ObjectUtil.isEmpty(id))
			return Response.getFailedResponse("问卷ID不能为空!");
		if (ObjectUtil.isEmpty(serviceTagId))
			return Response.getFailedResponse("服务号ID不能为空!");
		try {
			return Response.getSuccessResponse(questService.publishQuest(id, ServiceTagIdUtil.convertToInnerId(Long.parseLong(serviceTagId))));
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * 查询问卷列表.
	 * 
	 * @author QiSF
	 * @date 2014年12月17日
	 */
	@ResponseBody
	@RequestMapping(value = "/queryQuestPageList", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Paged<QuestVo>> queryQuestPageList(String serviceTagId, String title, Integer status, Integer pageNo, Integer pageSize) {
		if (ObjectUtil.isEmpty(serviceTagId))
			return Response.getFailedResponse("问卷ID不能为空!");
		if (ObjectUtil.isEmpty(status))
			return Response.getFailedResponse("问卷状态不能为空!");
		if (ObjectUtil.isEmpty(pageNo))
			return Response.getFailedResponse("pageNo不能为空!");
		if (ObjectUtil.isEmpty(pageSize))
			return Response.getFailedResponse("pageSize不能为空!");
		try {
			return Response.getSuccessResponse(questService.queryQuestPageList(serviceTagId, title, status, pageNo, pageSize));
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}
}
