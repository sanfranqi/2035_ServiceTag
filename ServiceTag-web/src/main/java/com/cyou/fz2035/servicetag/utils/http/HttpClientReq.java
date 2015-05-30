package com.cyou.fz2035.servicetag.utils.http;


import com.cyou.fz2035.servicetag.utils.web.JsonUtil;
import org.apache.http.Consts;
import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.InputStreamBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.codehaus.jackson.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class HttpClientReq {

    private static Logger logger = LoggerFactory.getLogger(HttpClientReq.class);
    private static final String CHARSET ="UTF-8";
    private static final int CONNECT_TIMEOUT = 20000;

    /**
     * 发送的地址
     */
    private String url;
    /**
     * 保存inputStream
     */
    private Map<String , InputStreamBody> inputStreamBodyMap = new HashMap<String , InputStreamBody>();
    /**
     * 保存文件
     */
    private Map<String , FileBody> fileBodyMap = new HashMap<String , FileBody>();
    /**
     * 保存参数
     */
    private List<BasicNameValuePair> nameValuePairs = new ArrayList<BasicNameValuePair>();

    public static HttpClientReq build(String url) {
        HttpClientReq httpClientReq = new HttpClientReq();
        httpClientReq.url = url;
        return httpClientReq;
    }

    public HttpClientReq addParam(String name , String value) {
        nameValuePairs.add( new BasicNameValuePair(name , value));
        return this;
    }

    public HttpClientReq addInputStream(String fieldName ,String filename, InputStream inputStream) {
        inputStreamBodyMap.put(fieldName, new InputStreamBody(inputStream, filename));
        return this;
    }


    public HttpClientReq addMultipartFile(String fieldName ,MultipartFile multipartFile) {
        try {
            inputStreamBodyMap.put(fieldName, new InputStreamBody(multipartFile.getInputStream(), multipartFile.getOriginalFilename()));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return this;
    }

    public HttpClientReq addFile(String fieldName , File file) {
        fileBodyMap.put(  fieldName, new FileBody( file));
        return this;
    }

    private  HttpEntity getFileEntity() throws UnsupportedEncodingException {
        MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create().setCharset(Consts.UTF_8);  //

        //添加文件参数
        for (String fileKey : fileBodyMap.keySet()) {
            multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
            multipartEntityBuilder.addPart(fileKey, fileBodyMap.get(fileKey));
        }
        for (String fileKey : inputStreamBodyMap.keySet()) {
            multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
            multipartEntityBuilder.addPart(fileKey, inputStreamBodyMap.get(fileKey));
        }

        ContentType strContentType = ContentType.create("text/plain", Consts.UTF_8);
        //添加其他参数
        if(nameValuePairs != null){
            for(BasicNameValuePair nameValuePair:nameValuePairs){
                StringBody stringBody = new StringBody(nameValuePair.getValue(),strContentType);
                multipartEntityBuilder.addPart(nameValuePair.getName(),stringBody);
            }
        }
        return multipartEntityBuilder.build();
    }

    public String post() {
        CloseableHttpClient client =  HttpClients.createDefault();

        HttpPost httppost = new HttpPost(url);
        httppost.setConfig(getRequestConfig());
        String content = "";
        HttpEntity httpEntity;
        try {
            if (fileBodyMap.isEmpty() && inputStreamBodyMap.isEmpty()) {
                httpEntity = new UrlEncodedFormEntity(nameValuePairs, CHARSET);
            }else {
                httpEntity = getFileEntity();
            }

            httppost.setEntity(httpEntity);
            CloseableHttpResponse response = client.execute(httppost);
            HttpEntity entity = response.getEntity();
            Integer statusCode =response.getStatusLine().getStatusCode();
            if(statusCode==HttpStatus.SC_OK){
                if (entity != null) {
                    content = EntityUtils.toString(entity,CHARSET);
                }
            }else{
                logger.error("返回码错误,网络访问异常*statusCode:" + statusCode + ", url :" + url);
                throw new HttpRuntimeException("网络访问异常");
            }
        }catch (HttpRuntimeException e) {
            throw e;
        }  catch (Exception e) {
            logger.error("网络访问异常*url:"+url,e);
            throw new HttpRuntimeException("网络访问异常*url:"+url,e);
        } finally {
            // 关闭连接,释放资源
            try {
                client.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return content;
    }

    /**
     * 获取内容
     * @return
     */
    public String get() {
        try {
            byte[] bytes = getForEntityData();
            return new String(bytes, CHARSET);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取字节流
     * @return
     */
    public ByteArrayInputStream getForByteArrayInputStream() {
        byte[] bytes = getForEntityData();
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes) ;
        return byteArrayInputStream;
    }

    /**
     * 检查url是否存在
     * @param paramUrl
     * @return
     * @throws java.io.IOException
     */
    public static boolean checkUrlExist(String paramUrl) throws IOException {
        CloseableHttpClient client =  HttpClients.createDefault();
        try {
            if (logger.isInfoEnabled()) {
                logger.info("get param url is:" + paramUrl);
            }
            HttpGet httpGet = new HttpGet(paramUrl);
            httpGet.setConfig(getRequestConfig());
            CloseableHttpResponse response = client.execute(httpGet);
            Integer statusCode = response.getStatusLine().getStatusCode();
            if (statusCode == HttpStatus.SC_OK) {
                return true;
            }
        }finally {
            client.close();
        }
        return false;
    }

    private byte[] getForEntityData() {
        CloseableHttpClient client =  HttpClients.createDefault();

        try {
            String paramUrl = getEncodeUrl(url , nameValuePairs);

            if (logger.isInfoEnabled()) {
                logger.info("get param url is:"+paramUrl);
            }

            HttpGet httpGet = new HttpGet(paramUrl);
            httpGet.setConfig(getRequestConfig());

            CloseableHttpResponse response = client.execute(httpGet);

            Integer statusCode =response.getStatusLine().getStatusCode();
            if(statusCode==HttpStatus.SC_OK){
                return EntityUtils.toByteArray(response.getEntity());
            }else{
                logger.error("返回码错误,网络访问异常*statusCode:" + statusCode);
                throw new HttpRuntimeException("网络访问异常");
            }
        }catch (HttpRuntimeException e) {
            throw e;
        }  catch (Exception e) {
            logger.error("网络访问异常*url:"+url,e);
            throw new HttpRuntimeException("网络访问异常*url:"+url,e);
        } finally {
            // 关闭连接,释放资源
            try {
                client.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }



    /**
     * 设置超时间
     */
    private static  RequestConfig getRequestConfig(){
        return RequestConfig
                .custom()
                .setConnectTimeout(CONNECT_TIMEOUT)
                .setSocketTimeout(CONNECT_TIMEOUT)
                .setConnectionRequestTimeout(CONNECT_TIMEOUT).build();
    }

    /**
     * 对url进行编码
     * @param url
     * @param parameters
     * @return
     * @throws java.io.UnsupportedEncodingException
     */
    private  String getEncodeUrl(String url,List<BasicNameValuePair> parameters) throws UnsupportedEncodingException {
        StringBuffer urlSb = new StringBuffer(url);

        String beginChar = "?";
        if (url.contains("?")) {
            beginChar = "&";
        }

        if(parameters!=null&&parameters.size()>0){
            urlSb.append(beginChar);
            for(BasicNameValuePair parameter:parameters){
                urlSb.append(parameter.getName()).append("=").append(URLEncoder.encode(parameter.getValue(), CHARSET)).append("&");
            }
            urlSb.deleteCharAt(urlSb.length()-1);
        }
        return urlSb.toString();
    }

    /**
     *
     * @param param 请求参数
     * @param type 请求返回对象
     * @param <K> 对象泛型
     * @return
     */
    public <K> K post(Map<String, Object> param,TypeReference<K> type){
        if(param==null||param.isEmpty()){
            throw new RuntimeException("param is null");
        }
        for(Map.Entry<String, Object> entry:param.entrySet()){
            this.addParam(entry.getKey(),entry.getValue().toString());
        }
        String response = this.post();
        return JsonUtil.toObject(response, type);
    }


    public static void main(String[] args) {
        List<BasicNameValuePair> params = new ArrayList<BasicNameValuePair>();
        params.add(new BasicNameValuePair("id","12545"));
        params.add(new BasicNameValuePair("channelId","4521"));
        params.add(new BasicNameValuePair("name","/nizhege 你这个碧池"));
        params.add(new BasicNameValuePair("path","/nizhege 路径"));
        params.add(new BasicNameValuePair("open","true"));
        params.add(new BasicNameValuePair("isTrue","true"));
        File file1 = new File("e:/cd.txt");
        File file2 = new File("e:/我去呀.txt");
        Map fileMap = new HashMap();
        fileMap.put("file1",file1);
        fileMap.put("file2",file2);
        String content = null;
        try {
            HttpClientReq util = HttpClientReq.build("http://127.0.0.1:8080/hello/postData.do?h=1");
            util.addParam("id" , "123");
            content = util.get();
            System.out.println(content);

            //get请求方式一  参数列表
//            content = HttpClientUtil.instance.get("http://127.0.0.1:8080/hello/postData.do",params);
//            //gen请求方式二
//            content = HttpClientUtil.get("http://127.0.0.1:8080/hello/postData.do?name=你好");
//
//            //post请求一   参数列表
//            content = HttpClientUtil.post("http://127.0.0.1:8080/hello/postData.do", params);
//            //post请求二   文件名 文件
//            content = HttpClientUtil.post("http://127.0.0.1:8080/hello/file2.do","file2",file2);
//            //post请求三   文件名 文件  参数列表
//            content = HttpClientUtil.post("http://127.0.0.1:8080/hello/file2.do","file2",file2,params);
//            //post请求四  文件map  参数列表
//            content = HttpClientUtil.post("http://127.0.0.1:8080/hello/file2.do",fileMap,params);
        }catch(HttpRuntimeException e){
            e.printStackTrace();
        }
        System.out.println(content);
    }
}
