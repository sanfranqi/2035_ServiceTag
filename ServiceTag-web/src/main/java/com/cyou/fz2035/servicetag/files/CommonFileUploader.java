package com.cyou.fz2035.servicetag.files;

import com.cyou.fz2035.servicetag.exception.UnCaughtException;
import com.cyou.fz2035.servicetag.files.cfg.FileConfig;
import com.cyou.fz2035.servicetag.utils.ListUtils;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * User: littlehui
 * Date: 14-12-16
 * Time: 下午3:25
 */
public class CommonFileUploader extends AbstractFileUpload {

    HttpServletRequest request;

    private String ADDTIONFILEPATH;


    public CommonFileUploader(HttpServletRequest request) {
        super(request);
        this.request = request;
    }

    public CommonFileUploader(HttpServletRequest request, String path) {
        super(request);
        this.request = request;
        ADDTIONFILEPATH = path;
    }

    public ResultVO saveFiles() {
        ResultVO resultVO = fileCheck();
        List<FileItem> fileItemList = getFileList();
        List<String> msg = new ArrayList<String>();
        if (ListUtils.isNotEmpty(fileItemList)) {
            for (FileItem item : fileItemList) {
                try {
                    item.write(new File(ADDTIONFILEPATH +"/" + item.getFieldName()));
                    msg.add(item.getFieldName());
                } catch (Exception e) {
                    e.printStackTrace();
                    resultVO.addMsg(e.getMessage());
                    resultVO.setSuccess(false);
                }
            }
        }
        resultVO.setMsg(msg);
        return resultVO;
    }

    @Override
    public ResultVO fileCheck() {
        ResultVO resultVO = new ResultVO();
        if (ListUtils.isNotEmpty(getFileList())) {
            resultVO.setSuccess(true);
        } else {
            resultVO.setSuccess(false);
        }
        return resultVO;
    }
}
