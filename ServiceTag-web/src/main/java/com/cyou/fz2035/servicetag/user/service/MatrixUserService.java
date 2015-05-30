package com.cyou.fz2035.servicetag.user.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import org.springframework.stereotype.Service;

import com.cyou.fz2035.servicetag.user.vo.MatrixUserInfo;
import com.cyou.fz2035.servicetag.utils.UnCaughtException;
import com.cyou.fz2035.servicetag.utils.bean.Group;
import com.cyou.fz2035.servicetag.utils.context.AppContext;

/**
 * User: littlehui Date: 14-10-30 Time: 上午11:14
 */
@Service
@Deprecated
public class MatrixUserService extends BaseUserService {

	/**
	 * 根据userId获取用户所有圈子的圈子ID列表.
	 *
	 * @throws Exception
	 * @author QiSF
	 * @date 2014年10月30日
	 */
	@Deprecated
	public List<Long> getCommunityListByUserId(Long userId, String token) {
		List<Long> list = new ArrayList<Long>();
		try {
			List<Group> groupList = this.queryGroupListByUser(String.valueOf(userId), token);
			for (Group group : groupList) {
				list.add(new Long(group.getUuid()));
			}
		} catch (Exception e) {
			throw new UnCaughtException(e.getMessage());
		}
		return list;
	}

	public MatrixUserService() {

	}

	/**
	 * 根据userId获取用户所有朋友的朋友ID列表.
	 *
	 * @throws Exception
	 * @author QiSF
	 * @date 2014年10月30日
	 */
	@Deprecated
	public List<Long> getFriendListByUserId(Long userId, String token) {
		List<Long> list = new ArrayList<Long>();
		try {
			List<MatrixUserInfo> matrixUserInfoList = this.queryGroupListByQ(String.valueOf(userId), token);
			for (MatrixUserInfo matrixUserInfo : matrixUserInfoList) {
				list.add(matrixUserInfo.getUserId());
			}
		} catch (Exception e) {
			throw new UnCaughtException(e.getMessage());
		}
		return list;
	}

	@Deprecated
	public MatrixUserInfo getUserInfoByUserIdForApp(Long queryUserId) {
		MatrixUserInfo matrixUserInfo = null;
		try {
			matrixUserInfo = this.queryMuserByPhone(AppContext.getContextUserId().toString(), AppContext.getContextTokenString(), String.valueOf(queryUserId));
		} catch (Exception e) {
			throw new UnCaughtException(e.getMessage());
		}
		return matrixUserInfo;
	}

	@Deprecated
	public String getUserNameByUserIdForApp(Long queryUserId) {
		MatrixUserInfo matrixUserInfo = this.getUserInfoByUserIdForApp(queryUserId);
		if (matrixUserInfo != null) {
			return matrixUserInfo.getFullName();
		}
		return "";
	}

	public List<Long> getCommunitysByUserIdForApp(Long userId) {
		return this.getCommunityListByUserId(userId, AppContext.getContextTokenString());
	}

	/**
	 * 根据userId查询用户信息.
	 *
	 * @param userId
	 *            当前登入人ID
	 * @param token
	 *            当前登入人token
	 * @param queryUserId
	 *            被查询人ID
	 * @return
	 * @author QiSF
	 * @date 2014年10月31日
	 */
	@Deprecated
	public MatrixUserInfo getUserInfoByUserId(Long userId, String token, Long queryUserId) {
		MatrixUserInfo matrixUserInfo = null;
		try {
			matrixUserInfo = this.queryMuserByPhone(String.valueOf(userId), token, String.valueOf(queryUserId));
		} catch (Exception e) {
			throw new UnCaughtException(e.getMessage());
		}
		return matrixUserInfo;
	}

	/**
	 * 获取所有圈.
	 *
	 * @param userId
	 *            当前登入人ID
	 * @param token
	 *            当前登入人token
	 * @return
	 * @author haolin
	 * @date 2014年10月31日
	 */
	public List<LinkedHashMap> queryGroupAll(Long userId, String token) {
		List<LinkedHashMap> groups = null;
		try {
			groups = this.queryGroupAll(String.valueOf(userId), token);
		} catch (Exception e) {
			throw new UnCaughtException(e.getMessage());
		}
		return groups;
	}

}
