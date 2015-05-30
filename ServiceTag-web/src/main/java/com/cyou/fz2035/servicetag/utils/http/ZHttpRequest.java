package com.cyou.fz2035.servicetag.utils.http;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.ContentBody;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;
import org.apache.http.protocol.HTTP;

import java.io.*;
import java.nio.charset.Charset;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;


/**
 * User: littlehui
 * Date: 15-1-9
 * Time: 上午10:00
 */
public class ZHttpRequest {
    protected String url = "";

    protected Map<String, String> headers = null;

    protected int connectionTimeout = 5000;

    protected int soTimeout = 10000;

    protected int statusCode = 200;

    protected String charset = HTTP.UTF_8;

    protected HttpGet httpGet;

    protected HttpPost httpPost;

    protected HttpParams httpParameters;

    protected HttpResponse httpResponse;

    protected HttpClient httpClient;

    protected String inputContent;

    /**
     * 设置当前请求的链接
     *
     * @param url
     * @return
     */
    public ZHttpRequest setUrl(String url) {
        this.url = url;
        return this;
    }

    /**
     * 设置请求的 header 信息
     *
     * @param headers
     * @return
     */
    public ZHttpRequest setHeaders(Map headers) {
        this.headers = headers;
        return this;
    }

    /**
     * 设置连接超时时间
     *
     * @param timeout 单位（毫秒），默认 5000
     * @return
     */
    public ZHttpRequest setConnectionTimeout(int timeout) {
        this.connectionTimeout = timeout;
        return this;
    }

    /**
     * 设置 socket 读取超时时间
     *
     * @param timeout 单位（毫秒），默认 10000
     * @return
     */
    public ZHttpRequest setSoTimeout(int timeout) {
        this.soTimeout = timeout;
        return this;
    }

    /**
     * 设置获取内容的编码格式
     *
     * @param charset 默认为 UTF-8
     * @return
     */
    public ZHttpRequest setCharset(String charset) {
        this.charset = charset;
        return this;
    }

    /**
     * 获取 HTTP 请求响应信息
     *
     * @return
     */
    public HttpResponse getHttpResponse() {
        return this.httpResponse;
    }

    /**
     * 获取 HTTP 客户端连接管理器
     *
     * @return
     */
    public HttpClient getHttpClient() {
        return this.httpClient;
    }

    /**
     * 获取请求的状态码
     *
     * @return
     */
    public int getStatusCode() {
        return this.statusCode;
    }

    /**
     * 通过 GET 方式请求数据
     *
     * @param url
     * @return
     * @throws IOException
     */
    public String get(String url) throws IOException {
        // 设置当前请求的链接
        this.setUrl(url);
        // 实例化 GET 连接
        this.httpGet = new HttpGet(this.url);
        // 自定义配置 header 信息
        this.addHeaders(this.httpGet);
        // 初始化客户端请求
        this.initHttpClient();
        // 发送 HTTP 请求
        this.httpResponse = this.httpClient.execute(this.httpGet);
        // 读取远程数据
        this.getInputStream();
        // 远程请求状态码是否正常
        if (this.statusCode != HttpStatus.SC_OK) {
            return null;
        }
        // 返回全部读取到的字符串
        return this.inputContent;
    }

    public String post(String url, Map<String, String> datas, Map<String, String> files) throws IOException {
        this.setUrl(url);
        // 实例化 GET 连接
        this.httpPost = new HttpPost(this.url);
        // 自定义配置 header 信息
        this.addHeaders(this.httpPost);
        // 初始化客户端请求
        this.initHttpClient();
        Iterator iterator = datas.entrySet().iterator();
        MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
        multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        if (this.charset != null) {
            multipartEntityBuilder.setCharset(Charset.forName(this.charset));
        }
        // 发送的数据
        while (iterator.hasNext()) {
            Map.Entry<String, String> entry = (Map.Entry<String, String>) iterator.next();
            multipartEntityBuilder.addTextBody(entry.getKey(), entry.getValue(), ContentType.create("text/plain", Charset.forName(HTTP.UTF_8)));
        }
        // 发送的文件
        if (files != null) {
            iterator = files.entrySet().iterator();
            while (iterator.hasNext()) {
                Map.Entry<String, String> entry = (Map.Entry<String, String>) iterator.next();
                String path = entry.getValue();
                if ("".equals(path) || path == null) continue;
                File file = new File(entry.getValue());
                FileBody fileBody = new FileBody(file);
                multipartEntityBuilder.addPart(entry.getKey(), fileBody);
            }
        }
        // 生成 HTTP 实体
        HttpEntity httpEntity = multipartEntityBuilder.build();
        // 设置 POST 请求的实体部分
        this.httpPost.setEntity(httpEntity);
        // 发送 HTTP 请求
        this.httpResponse = this.httpClient.execute(this.httpPost);
        // 读取远程数据
        this.getInputStream();
        // 远程请求状态码是否正常
        if (this.statusCode != HttpStatus.SC_OK) {
            throw new RuntimeException("请求错误，错误码" + this.statusCode);
        }
        // 返回全部读取到的字符串
        return this.inputContent.toString();
    }

    /**
     * 为 HTTP 请求添加 header 信息
     *
     * @param request
     */
    protected void addHeaders(HttpRequestBase request) {
        if (this.headers != null) {
            Set keys = this.headers.entrySet();
            Iterator iterator = keys.iterator();
            Map.Entry<String, String> entry;
            while (iterator.hasNext()) {
                entry = (Map.Entry<String, String>) iterator.next();
                request.addHeader(entry.getKey().toString(), entry.getValue().toString());
            }
        }
    }

    /**
     * 配置请求参数
     */
    protected void setParams() {
        this.httpParameters = new BasicHttpParams();
        this.httpParameters.setParameter("charset", this.charset);
        // 设置 连接请求超时时间
        HttpConnectionParams.setConnectionTimeout(this.httpParameters, this.connectionTimeout);
        // 设置 socket 读取超时时间
        HttpConnectionParams.setSoTimeout(this.httpParameters, this.soTimeout);
    }

    /**
     * 初始化配置客户端请求
     */
    protected void initHttpClient() {
        // 配置 HTTP 请求参数
        this.setParams();
        // 开启一个客户端 HTTP 请求
        this.httpClient = new DefaultHttpClient(this.httpParameters);
    }

    /**
     * 读取远程数据
     *
     * @throws IOException
     */
    protected void getInputStream() throws IOException {
        // 接收远程输入流
        InputStream inStream = this.httpResponse.getEntity().getContent();
        // 分段读取输入流数据
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buf = new byte[1024];
        int len = -1;
        while ((len = inStream.read(buf)) != -1) {
            baos.write(buf, 0, len);
        }
        // 将数据转换为字符串保存
        this.inputContent = new String(baos.toByteArray());
        // 数据接收完毕退出
        inStream.close();
        // 获取请求返回的状态码
        this.statusCode = this.httpResponse.getStatusLine().getStatusCode();
    }

    /**
     * 关闭连接管理器释放资源
     */
    protected void shutdownHttpClient() {
        if (this.httpClient != null && this.httpClient.getConnectionManager() != null) {
            this.httpClient.getConnectionManager().shutdown();
        }
    }
}
