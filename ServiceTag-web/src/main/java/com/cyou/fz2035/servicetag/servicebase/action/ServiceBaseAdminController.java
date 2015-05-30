package com.cyou.fz2035.servicetag.servicebase.action;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.bean.Paged;
import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.servicebase.bean.ServiceBase;
import com.cyou.fz2035.servicetag.servicebase.param.ServiceBaseParam;
import com.cyou.fz2035.servicetag.servicebase.service.ServiceBaseService;
import com.cyou.fz2035.servicetag.servicebase.vo.ServiceBaseVo;
import com.cyou.fz2035.servicetag.servicebase.vo.TeletextResponse;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ThirdResultVO;
import com.cyou.fz2035.servicetag.servicedetail.ender.ServiceEndEngine;
import com.cyou.fz2035.servicetag.servicedetail.factory.InnerServiceEnderFactory;
import com.cyou.fz2035.servicetag.servicedetail.factory.InnerServicePublishFactory;
import com.cyou.fz2035.servicetag.servicedetail.factory.InnerServiceRepublisherFactory;
import com.cyou.fz2035.servicetag.servicedetail.publisher.ServicePublishEngine;
import com.cyou.fz2035.servicetag.servicedetail.service.ServiceDetailService;
import com.cyou.fz2035.servicetag.utils.bean.transer.BeanTranser;
import com.cyou.fz2035.servicetag.utils.http.HttpClientUtil;

/**
 * User: littlehui Date: 14-11-26 Time: 下午4:54
 */
@Controller
@RequestMapping("/admin/service")
public class ServiceBaseAdminController {

	@Autowired
	ServiceBaseService serviceBaseService;

	@Autowired
	ServiceDetailService serviceDetailService;

	@ResponseBody
	@RequestMapping(value = "/query", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Paged<ServiceBaseVo>> queryServiceBase(ServiceBaseParam serviceBaseParam) {
		List<ServiceBase> serviceBases = serviceBaseService.queyByParam(serviceBaseParam);
		BeanTranser<ServiceBase, ServiceBaseVo> beanTranser = serviceBaseService.getBeanTranser();
		Paged<ServiceBaseVo> paged = new Paged();
		paged.setListData(beanTranser.beanToVos(serviceBases, ServiceBaseVo.class));
		paged.setPageNo(serviceBaseParam.getPageNo());
		paged.setPageSize(serviceBaseParam.getPageSize());
		paged.setTotalHit(serviceBaseParam.getTotalHit());
		return Response.getSuccessResponse(paged);
	}

	@ResponseBody
	@RequestMapping(value = "/addServiceDetail", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<ServiceDetail> add(ServiceDetail serviceDetail) {
		try {
			serviceDetailService.transInsertServiceDetail(serviceDetail);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse("保存失败。");
		}
		return Response.getSuccessResponse(serviceDetail);
	}

	@ResponseBody
	@RequestMapping(value = "/uploadAddtionFiles", produces = MediaType.TEXT_HTML_VALUE)
	public Response<String> uploadFiles(HttpServletRequest request, MultipartFile file) {
		StringBuffer filesStr = new StringBuffer(ServiceTagConstants.DOMAIN_URL);
		try {
			if (file != null) {
				if (file.getOriginalFilename().endsWith(".exe")) {
					return Response.getFailedResponse("不允许的附件后缀。");
				}
				int i = 0;
				// 文件保存路径
				String filePath = request.getSession().getServletContext().getRealPath("/") + "addition/" + file.getOriginalFilename();
				// 转存文件
				file.transferTo(new File(filePath));
				if (i > 0) {
					filesStr.append(",");
				}
				filesStr.append("/addition/" + file.getOriginalFilename());
			} else {
				return Response.getFailedResponse("文件为空。");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse("上传附件失败。");
		}
		Response response = Response.getSuccessResponse(filesStr.toString());
		response.setData(filesStr);
		return response;
	}

	@ResponseBody
	@RequestMapping(value = "/saveServiceDetail", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<ServiceDetail> save(ServiceDetail serviceDetail) {
		try {
			ServiceBaseVo serviceBaseVo = serviceDetail.getServiceBaseVo();
			if (serviceBaseVo.getId() != null) {
				serviceDetailService.transUpdateServiceDetail(serviceDetail);
			} else {
				serviceDetailService.transInsertServiceDetail(serviceDetail);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse("保存失败。");
		}
		return Response.getSuccessResponse(serviceDetail);
	}

	@ResponseBody
	@RequestMapping(value = "/getServiceDetail", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<ServiceDetail> getServiceDetail(Integer serviceBaseId) {
		ServiceDetail serviceDetail;
		if (serviceBaseId == null) {
			return Response.getFailedResponse("id不能为空。");
		}
		try {
			serviceDetail = serviceDetailService.getServiceDetail(serviceBaseId);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse("获取失败。");
		}
		return Response.getSuccessResponse(serviceDetail);
	}

	/**
	 * 重新发布服务 发布后的修改后重新发布
	 * 
	 * @param request
	 * @param serviceDetail
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/republishService", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<ServiceDetail> republishServiceDetail(HttpServletRequest request, ServiceDetail serviceDetail) {
		try {
			// 先更新，后发布。
			if (serviceDetail.getServiceBaseVo().getId() == null) {
				return Response.getFailedResponse("服务ID为空。");
			}
			ServicePublishEngine servicePublishEngine = new ServicePublishEngine(InnerServiceRepublisherFactory.instance(), serviceDetail);
			ThirdResultVO thirdResultVO = servicePublishEngine.sendToRemoteService(request);
			if (thirdResultVO.isSuccess()) {
				serviceDetailService.transUpdateServiceDetail(serviceDetail);
			}
			thirdResultVO.setData(serviceDetailService.getServiceDetail(serviceDetail.getServiceBaseVo().getId()));
			return thirdResultVO.toResponse();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return Response.getFailedResponse("发布失败。");
	}

	@ResponseBody
	@RequestMapping(value = "/republishServiceById", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<String> republishServiceDetailById(HttpServletRequest request, Integer serviceBaseId) {
		try {
			ServiceDetail serviceDetail = serviceDetailService.getServiceDetail(serviceBaseId);
			ServicePublishEngine servicePublishEngine = new ServicePublishEngine(InnerServiceRepublisherFactory.instance(), serviceDetail);
			ThirdResultVO thirdResultVO = servicePublishEngine.sendToRemoteService(request);
			return thirdResultVO.toResponse();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return Response.getFailedResponse("发布失败。");
	}

	/**
	 * 根据ID发布到外系统
	 * 
	 * @param request
	 * @param serviceBaseId
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/publishServiceById", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<String> publishServiceDetail(HttpServletRequest request, Integer serviceBaseId) {
		try {
			// 先更新，后发布。
			// serviceDetailService.transUpdateServiceDetail(serviceDetail);
			ServiceDetail serviceDetail = serviceDetailService.getServiceDetail(serviceBaseId);
			if (serviceDetail.getServiceBaseVo().getBusinessId() != null) {
				return Response.getFailedResponse("已发布，不允许再发布。");
			}
			ServicePublishEngine servicePublishEngine = new ServicePublishEngine(InnerServicePublishFactory.instance(), serviceDetail);
			ThirdResultVO resultVO = servicePublishEngine.sendToRemoteService(request);
			return resultVO.toResponse();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return Response.getFailedResponse("发布失败。");
	}

	/**
	 * 保存并发布服务到外系统
	 * 
	 * @param request
	 * @param serviceDetail
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/publishService", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<ServiceDetail> publishService(HttpServletRequest request, ServiceDetail serviceDetail) {
		String result = "";
		try {
			// 先更新，后发布。
			if (serviceDetail.getServiceBaseVo().getId() != null) {
				serviceDetailService.transUpdateServiceDetail(serviceDetail);
			} else {
				serviceDetailService.transInsertServiceDetail(serviceDetail);
			}
			if (serviceDetail.getServiceBaseVo().getBusinessId() != null && serviceDetail.getServiceBaseVo().getBusinessId() > 0) {
				return Response.getFailedResponse("已发布，修改后才能再发布。");
			}
			ServicePublishEngine servicePublishEngine = new ServicePublishEngine(InnerServicePublishFactory.instance(), serviceDetail);
			ThirdResultVO resultVO = servicePublishEngine.sendToRemoteService(request);
			if (resultVO.isSuccess()) {
				resultVO.setData(serviceDetail);
			} else {
				if (serviceDetail.getServiceBaseVo().getId() != null) {
					Response response = resultVO.toResponse();
					response.setResult("success");
					response.setData("保存成功，但是发布失败。" + response.getMessages());
					return response;
				}
			}
			return resultVO.toResponse();
		} catch (Exception ex) {
			ex.printStackTrace();
			result = ex.getMessage();
			if (serviceDetail.getServiceBaseVo().getId() != null) {
				Response response = Response.getSuccessResponse();
				response.setResult("success");
				response.setData("保存成功，但是发布失败。" + result);
				return response;
			}
			Response response = Response.getFailedResponse(ex.getMessage());
			if (ex.getCause() != null) {
				response.setError(ex.getCause().toString());
			}
			return response;
		}
	}

	/**
	 * （删除服务）并且在外系统结束服务
	 * 
	 * @param servletRequest
	 * @param serviceBaseId
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/endService", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<String> endServiceDetail(HttpServletRequest servletRequest, Integer serviceBaseId) {
		ThirdResultVO thirdResultVO = new ThirdResultVO();
		try {
			ServiceDetail serviceDetail = serviceDetailService.getServiceDetail(serviceBaseId);
			ServiceEndEngine endEngine = new ServiceEndEngine(InnerServiceEnderFactory.instance(), serviceDetail);
			thirdResultVO = endEngine.sendToEndRemoteService(servletRequest);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return thirdResultVO.toResponse();
	}

	/**
	 * 单纯修改数据库内容
	 * 
	 * @param serviceDetail
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/updateServiceDetail", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<ServiceDetail> updateService(ServiceDetail serviceDetail) {
		try {
			serviceDetailService.transUpdateServiceDetail(serviceDetail);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse("保存失败。");
		}
		return Response.getSuccessResponse(serviceDetail);
	}

	@ResponseBody
	@RequestMapping(value = "/mapTest")
	public Response<ServiceDetail> mapTest(Map<String, Object> map) {
		try {
			System.out.println(map.get("test"));
			// serviceDetailService.transUpdateServiceDetail(serviceDetail);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse("保存失败。");
		}
		return Response.getSuccessResponse();
	}

	/**
	 * 上传素材管理图片.
	 * 
	 * @param request
	 * @param imgFile
	 * @return
	 * @author QiSF
	 * @date 2014年12月24日
	 */
	@ResponseBody
	@RequestMapping(value = "/uploadTeletextImageOld", produces = MediaType.TEXT_HTML_VALUE)
	@Deprecated
	public TeletextResponse uploadTeletextImageOld(HttpServletRequest request, MultipartFile imgFile) {
		String imgType = "jpg|gif|png|bmp";
		TeletextResponse response = new TeletextResponse();
		Map<String, File> fileMap = new HashMap<String, File>();
		String imgUrl = "";
		String filePath = request.getSession().getServletContext().getRealPath("/") + "tmp/" + imgFile.getOriginalFilename();
		File imageFile = new File(filePath);
		imageFile.mkdirs();
		try {
			if (!imgType.contains(this.getImageFileType(imgFile.getBytes()))) {
				response.setError(1);
				response.setMessage("上传类型只能为：jpg|gif|png|bmp");
				return response;
			}
			imgFile.transferTo(imageFile);
			fileMap.put("file", new File(filePath));
			String result = HttpClientUtil.post0(ServiceTagConstants.ZIMG_UPDATE_URL, fileMap, null, "jpg");
			if (result.contains("success")) {
				String resultMessage = result;
				imgUrl = resultMessage.substring(resultMessage.indexOf("MD5: ") + "MD5: ".length(), resultMessage.indexOf("</h1>"));
				imageFile.delete();
				response.setUrl(ServiceTagConstants.ZIMG_URL + "/" + imgUrl);
				response.setError(0);
				return response;
			} else {
				response.setError(1);
				response.setMessage("上传失败!");
				return response;
			}
		} catch (IOException e) {
			e.printStackTrace();
			response.setError(1);
			response.setMessage("Failure:" + e.getMessage());
			return response;
		}
	}

	/**
	 * 上传素材管理图片,获取上传配置.(新接口)
	 * 
	 * @param request
	 * @param imgFile
	 * @return
	 * @author QiSF
	 * @date 2014年12月24日
	 */
	@ResponseBody
	@RequestMapping(value = "/uploadTeletextImage", produces = MediaType.TEXT_HTML_VALUE, method = RequestMethod.GET)
	public TeletextResponse uploadTeletextImage(HttpServletRequest request, String action) {
		TeletextResponse response = new TeletextResponse();
		if ("config".equals(action)) {
			response.setImageActionName("uploadImg");
			response.setImageFieldName("imgFile");
			response.setImageMaxSize(2048000);
			String allowFiles[] = { ".png", ".jpg", ".jpeg", ".gif", ".bmp" };
			response.setImageAllowFiles(allowFiles);
			response.setImageCompressEnable(false);
			response.setImageInsertAlign("none");
			response.setImageUrlPrefix(ServiceTagConstants.ZIMG_URL + "/");
			return response;
		} else {
			response.setMessage("上传失败!");
			return response;
		}
	}

	/**
	 * 上传素材管理图片.(新接口)
	 * 
	 * @param request
	 * @param imgFile
	 * @return
	 * @author QiSF
	 * @date 2014年12月24日
	 */
	@ResponseBody
	@RequestMapping(value = "/uploadTeletextImage", produces = MediaType.TEXT_HTML_VALUE, method = RequestMethod.POST)
	public TeletextResponse uploadTeletextImage(HttpServletRequest request, MultipartFile imgFile, String action) {
		TeletextResponse response = new TeletextResponse();
		if ("config".equals(action)) {
			response.setImageActionName("uploadImg");
			response.setImageFieldName("imgFile");
			response.setImageMaxSize(2048000);
			String allowFiles[] = { ".png", ".jpg", ".jpeg", ".gif", ".bmp" };
			response.setImageAllowFiles(allowFiles);
			response.setImageCompressEnable(false);
			response.setImageInsertAlign("none");
			response.setImageUrlPrefix(ServiceTagConstants.ZIMG_URL + "/");
			return response;
		} else if ("uploadImg".equals(action)) {
			// MultipartFile imgFile = (MultipartFile)
			// request.getAttribute("imgFile");
			String imgType = "png|jpg|jpeg|gif|bmp";
			Map<String, File> fileMap = new HashMap<String, File>();
			String imgUrl = "";
			String filePath = request.getSession().getServletContext().getRealPath("/") + "tmp/" + imgFile.getOriginalFilename();
			File imageFile = new File(filePath);
			imageFile.mkdirs();
			try {
				if (!imgType.contains(this.getImageFileType(imgFile.getBytes()))) {
					response.setError(1);
					response.setState("FAILURE");
					response.setMessage("上传类型只能为：png|jpg|jpeg|gif|bmp");
					return response;
				}
				imgFile.transferTo(imageFile);
				fileMap.put("file", new File(filePath));
				String result = HttpClientUtil.post0(ServiceTagConstants.ZIMG_UPDATE_URL, fileMap, null, "jpg");
				if (result.contains("success")) {
					String resultMessage = result;
					imgUrl = resultMessage.substring(resultMessage.indexOf("MD5: ") + "MD5: ".length(), resultMessage.indexOf("</h1>"));
					imageFile.delete();
					response.setUrl(imgUrl);
					response.setTitle(imgFile.getOriginalFilename());
					response.setState("SUCCESS");
					response.setOriginal(imgFile.getOriginalFilename());
					response.setError(0);
					return response;
				} else {
					response.setError(1);
					response.setState("FAILURE");
					response.setMessage("上传失败!");
					return response;
				}
			} catch (IOException e) {
				e.printStackTrace();
				response.setError(1);
				response.setState("FAILURE");
				response.setMessage("Failure:" + e.getMessage());
				return response;
			}
		} else {
			response.setMessage("上传失败!");
			return response;
		}
	}

	/**
	 * 返回验证的图片类型.
	 * 
	 * @author QiSF
	 * @date 2015年1月9日
	 */
	private String getImageFileType(byte[] bytes) {
		try {
			String start = (Integer.toHexString(bytes[0] & 0xFF) + Integer.toHexString(bytes[1] & 0xFF)).toLowerCase();
			if (start.equals("ffd8")) {
				// jpg格式的图片是以ffd8开头
				return "jpg";
			} else if (start.equals("4749")) {
				// gif格式的图片是以4749开头
				return "gif";
			} else if (start.equals("8950")) {
				// png格式的图片是以8950开头
				return "png";
			} else if (start.equals("424d")) {
				// bmp格式的图片是以424d开头
				return "bmp";
			}
		} catch (Exception e) {
			// do nothing
		}
		return "no";
	}
}
