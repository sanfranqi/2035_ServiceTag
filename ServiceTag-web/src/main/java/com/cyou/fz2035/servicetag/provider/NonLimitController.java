package com.cyou.fz2035.servicetag.provider;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz.commons.mybatis.selecterplus.web.Response;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.servicebase.vo.ServiceBaseVo;
import com.cyou.fz2035.servicetag.servicedetail.ServiceDetail;
import com.cyou.fz2035.servicetag.servicedetail.ServiceRewardDetail;
import com.cyou.fz2035.servicetag.servicetag.bean.ServiceTag;
import com.cyou.fz2035.servicetag.servicetag.service.ServiceTagService;
import com.cyou.fz2035.servicetag.servicetag.vo.ServiceTagListVo;
import com.cyou.fz2035.servicetag.utils.ListUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;

/**
 * User: littlehui
 * Date: 15-1-7
 * Time: 下午5:03
 */
@Controller
@RequestMapping("/nonlimit")
public class NonLimitController {

    @Autowired
    ServiceTagService serviceTagService;

    @ResponseBody
    @RequestMapping(value = "/viewImage/{serviceTagId}/max.avt", produces = MediaType.IMAGE_JPEG_VALUE)
    public void viewImageMax(HttpServletRequest request, HttpServletResponse response, @PathVariable Long serviceTagId) {
        try {
            response.setContentType("image/jpeg");
            Long temId = serviceTagId - ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID;
            Integer serviceTagRealId = temId.intValue();
            ServiceTag serviceTag = serviceTagService.get(serviceTagRealId);
            URL url = new URL(ServiceTagConstants.ZIMG_URL + "/"  + serviceTag.getServiceTagImg() + "?w=200&h=200&f=jpg");
            HttpURLConnection uc = (HttpURLConnection) url.openConnection();
            uc.setDoInput(true);//设置是否要从 URL 连接读取数据,默认为true
            uc.connect();
            InputStream iputstream = uc.getInputStream();
            //System.out.println("file size is:"+uc.getContentLength());//打印文件长度
            byte[] buffer = new byte[4*1024];
            int byteRead = -1;
            OutputStream stream = response.getOutputStream();
            while((byteRead = iputstream.read(buffer)) != -1 ) {
                stream.write(buffer, 0, byteRead);
            }
            iputstream.close();
            stream.flush();
            stream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ResponseBody
    @RequestMapping(value = "/viewImage/{serviceTagId}/middle.avt", produces = MediaType.IMAGE_JPEG_VALUE)
    public void viewImageMiddle(HttpServletRequest request, HttpServletResponse response, @PathVariable Long serviceTagId) {
        try {
            response.setContentType("image/jpeg");
            Long temId = serviceTagId - ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID;
            Integer serviceTagRealId = temId.intValue();
            ServiceTag serviceTag = serviceTagService.get(serviceTagRealId);
            URL url = new URL(ServiceTagConstants.ZIMG_URL + "/"  + serviceTag.getServiceTagImg() + "?w=96&h=96&f=jpg");
            HttpURLConnection uc = (HttpURLConnection) url.openConnection();
            uc.setDoInput(true);//设置是否要从 URL 连接读取数据,默认为true
            uc.connect();
            InputStream iputstream = uc.getInputStream();
            //System.out.println("file size is:"+uc.getContentLength());//打印文件长度
            byte[] buffer = new byte[4*1024];
            int byteRead = -1;
            OutputStream stream = response.getOutputStream();
            while((byteRead = iputstream.read(buffer)) != -1 ) {
                stream.write(buffer, 0, byteRead);
            }
            iputstream.close();
            stream.flush();
            stream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ResponseBody
    @RequestMapping(value = "/viewImage/{serviceTagId}/min.avt", produces = MediaType.IMAGE_JPEG_VALUE)
    public void viewImageMin(HttpServletRequest request, HttpServletResponse response, @PathVariable Long serviceTagId) {
        try {
            response.setContentType("image/jpeg");
            Long temId = serviceTagId - ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID;
            Integer serviceTagRealId = temId.intValue();
            ServiceTag serviceTag = serviceTagService.get(serviceTagRealId);
            URL url = new URL(ServiceTagConstants.ZIMG_URL + "/"  + serviceTag.getServiceTagImg() + "?w=50&h=50&f=jpg");
            HttpURLConnection uc = (HttpURLConnection) url.openConnection();
            uc.setDoInput(true);//设置是否要从 URL 连接读取数据,默认为true
            uc.connect();
            InputStream iputstream = uc.getInputStream();
            //System.out.println("file size is:"+uc.getContentLength());//打印文件长度
            byte[] buffer = new byte[4*1024];
            int byteRead = -1;
            OutputStream stream = response.getOutputStream();
            while((byteRead = iputstream.read(buffer)) != -1 ) {
                stream.write(buffer, 0, byteRead);
            }
            iputstream.close();
            stream.flush();
            stream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @ResponseBody
    @RequestMapping(value = "/serviceRewardDetail", produces = MediaType.APPLICATION_JSON_VALUE ,method = RequestMethod.POST)
    public void testServiceRewardDetail(@RequestBody ServiceBaseVo detailsAddition) {
        System.out.print("进来了");
        //System.out.print(detailsAddition);
        System.out.print(detailsAddition);

    }


    @ResponseBody
    @RequestMapping(value = "/serviceTag/isUserFocusServiceTag", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<Boolean> isUserFocusServiceTag(Long userId, Long serviceTagId) {
        List<Integer> serviceTagIds;
        if (ObjectUtil.isEmpty(userId))
            return Response.getFailedResponse("用户ID不能为空!");
        try {
            List<ServiceTagListVo> list = serviceTagService.queryAllFocusServiceTag(userId);
            if (ListUtils.isNotEmpty(list)) {
                serviceTagIds = ListUtils.getListItemsSingleColumnList(list, "id", Integer.class);
                if (ListUtils.isNotEmpty(serviceTagIds)) {
                    for (Integer id : serviceTagIds) {
                        if (id.longValue() == ((serviceTagId - ServiceTagConstants.SERVICETAG_MATRIX_BASE_ID))) {
                            return Response.getSuccessResponse(true);
                        }
                    }
                } else {
                    return Response.getSuccessResponse(false);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.getFailedResponse(e.getMessage());
        }
        return Response.getSuccessResponse(false);
    }
}
