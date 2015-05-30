package com.cyou.fz2035.servicetag.user.service;

import com.cyou.fz.commons.mybatis.selecterplus.mybatis.util.ObjectUtil;
import com.cyou.fz2035.servicetag.config.ServiceTagConstants;
import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.utils.bean.Box;
import com.cyou.fz2035.servicetag.utils.bean.Group;
import com.cyou.fz2035.servicetag.utils.bean.Token;
import com.cyou.fz2035.servicetag.utils.http.HttpClientReq;
import com.cyou.fz2035.servicetag.utils.web.JsonUtil;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@SuppressWarnings("unchecked")
@Deprecated
public class BaseUserService {

    private static BaseUserService baseUserService;

    public static BaseUserService instance() {
        if (baseUserService != null) {
            return baseUserService;
        }
        baseUserService = new BaseUserService();
        return baseUserService;
    }

    protected BaseUserService() {

    }

    final String url = ServiceTagConstants.MATRIXURL;
//	final String url = "http://user.2035.jzmom.com/device?";


    //获取指定用户信息
    @Deprecated
    public MatrixUserInfo queryMuserByPhone(String _m, String _t, String userId) throws Exception {
        HttpClientReq h = go("qId", _m, _t);
        h.addParam("userId", userId);
        MatrixUserInfo t = (MatrixUserInfo) back(h).getDto();
        return t;
    }

    // 登錄
    @Deprecated
    public Token login(String _m, String pwd, String key, String type) throws Exception {
        HttpClientReq h = go("login", _m, null);
        h.addParam("pwd", pwd);
        h.addParam("key", key);
        h.addParam("type", type);
        Box box = back(h);
        Token t = (Token) box.getDto();
        return t;
    }

    // 获取单个用户信息/判断用户时效性
    @Deprecated
    public MatrixUserInfo queryMuserAuth(String _m, String _t, String key) throws Exception {
        HttpClientReq h = go("auth", _m, _t);
        h.addParam("key", key);
        Token t = (Token) back(h).getDto();
        return t.getUser();
    }

    // 获取指定圈内的所有用户
    @Deprecated
    public List<LinkedHashMap> queryMuserListByQ(String _m, String _t, String uuid) throws Exception {
        HttpClientReq h = go("qUbQ", _m, _t);
        h.addParam("uuid", uuid);
        List<LinkedHashMap> list = (List<LinkedHashMap>) backList(h).getDto();
        return list;
    }

    // 获取个人所有圈
    @Deprecated
    public List<Group> queryGroupListByUser(String _m, String _t) throws Exception {
        HttpClientReq h = go("qGbQ", _m, _t);
        List<Map<String, Object>> list = (List<Map<String, Object>>) backList(h).getDto();
        List<Group> listGroup = ObjectUtil.toBeanList(Group.class, list);
        return listGroup;
    }

    // 获取所有圈
    @Deprecated
    public List<LinkedHashMap> queryGroupAll(String _m, String _t) throws Exception {
        HttpClientReq h = go("qGbP", _m, _t);
        h.addParam("pId", "-1");
        List<LinkedHashMap> list = (List<LinkedHashMap>) backList(h).getDto();
        return list;
    }

    // 获取个人所有圈内的所有人(排除自己)
    @Deprecated
    public List<MatrixUserInfo> queryGroupListByQ(String _m, String _t) throws Exception {
        HttpClientReq h = go("qUbU", _m, _t);
        List<MatrixUserInfo> list = (List<MatrixUserInfo>) backList(h).getDto();
        return list;
    }

    public static void main(String[] args) {
        try {
            String _t = "w13599088095cd775350";
            new BaseUserService().login("13599088095", "123456", "10.5.117.141", "1");
//			 new BaseUserService().queryMuserByPhone("13599088095", _t, "13599088095");
//			 new BaseUserService().queryGroupAll("13599088095", _t);
//			 new BaseUserService().queryMuserListByQ("13599088095", _t, "85");
            //new BaseUserService().queryGroupListByUser("13599088095", _t);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Deprecated
    private HttpClientReq go(String act, String _m, String _t) {
        HttpClientReq util = HttpClientReq.build(url + "act=" + act);
        if (_t != null)
            util.addParam("_t", _t);
        if (_m != null)
            util.addParam("_m", _m);
        return util;
    }
    @Deprecated
    private Box backList(HttpClientReq p) throws Exception {
        String content = p.get();
        Box box = JsonUtil.toObject(content, new Box().getClass());
        if (box == null || !box.isIs_ok()) {
            throw new Exception("远程访问接口异常" + box.getError());
        }
        return box;
    }
    @Deprecated
    private Box back(HttpClientReq p) throws Exception {
        String content = p.get();
        Box box = JsonUtil.toObject(content, new Box().getClass());
        if (box == null || !box.isIs_ok()) {
            throw new Exception("远程访问接口异常" + box.getError());
        }
        Map<String, Object> token_ = (Map<String, Object>) box.getDto();
        Token t = new Token();
        t.setDeviceToken(String.valueOf(token_.get("deviceToken") != null ? token_.get("deviceToken") : ""));
        t.setWebToken(String.valueOf(token_.get("webToken") != null ? token_.get("webToken") : ""));
        MatrixUserInfo user = new MatrixUserInfo();
        if (t.getDeviceToken().equals("") && t.getWebToken().equals("")) {

            user.setAvatar(token_.get("avatar") == null ? "" : token_.get("avatar") + "");
            user.setFullName(token_.get("fullName") == null ? "" : token_.get("fullName") + "");
            user.setEMail(token_.get("eMail") == null ? "" : token_.get("eMail") + "");
            user.setGender(token_.get("gender") == null ? "" : token_.get("gender") + "");
            user.setHardKey(token_.get("hardKey") == null ? "" : token_.get("hardKey") + "");
            user.setNameCode(token_.get("nameCode") == null ? "" : token_.get("nameCode") + "");
            user.setPwdMail(token_.get("pwdMail") == null ? "" : token_.get("pwdMail") + "");
            user.setQq(token_.get("qq") == null ? "" : token_.get("qq") + "");
            user.setSortCode(token_.get("sortCode") == null ? "" : token_.get("sortCode") + "");
            user.setUserId(Long.valueOf(token_.get("userId") == null ? "" : token_.get("userId") + ""));
            user.setUserNick(token_.get("userNick") == null ? "" : token_.get("userNick") + "");
            user.setWeiboSina(token_.get("weiboSina") == null ? "" : token_.get("weiboSina") + "");
            box.setDto(user);
        } else {
            Map<String, Object> user_ = (Map<String, Object>) token_.get("user");
            user.setAvatar(user_.get("avatar") == null ? "" : user_.get("avatar") + "");
            user.setFullName(user_.get("fullName") == null ? "" : user_.get("fullName") + "");
            user.setEMail(user_.get("eMail") == null ? "" : user_.get("eMail") + "");
            user.setGender(user_.get("gender") == null ? "" : user_.get("gender") + "");
            user.setHardKey(user_.get("hardKey") == null ? "" : user_.get("hardKey") + "");
            user.setNameCode(user_.get("nameCode") == null ? "" : user_.get("nameCode") + "");
            user.setPwdMail(user_.get("pwdMail") == null ? "" : user_.get("pwdMail") + "");
            user.setQq(user_.get("qq") == null ? "" : user_.get("qq") + "");
            user.setSortCode(user_.get("sortCode") == null ? "" : user_.get("sortCode") + "");
            user.setUserId(Long.valueOf(user_.get("userId") == null ? "" : user_.get("userId") + ""));
            user.setUserNick(user_.get("userNick") == null ? "" : user_.get("userNick") + "");
            user.setWeiboSina(user_.get("weiboSina") == null ? "" : user_.get("weiboSina") + "");
            t.setUser(user);
            box.setDto(t);
        }
        return box;
    }
}
