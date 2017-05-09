package jldp.portal.modules.security.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import jldp.portal.modules.security.model.BaseUser;
import jldp.portal.modules.security.model.BaseUserDto;
import jldp.portal.modules.security.model.UserHead;

public interface IUserService {

	final String USER_STATU_ONLINE = "1";
	final String USER_STATU_OFFLINE = "0";

	/**
	 * 分页查询所有用户
	 * 
	 * @param pageable
	 * @return
	 */
	Page<BaseUser> findUser(String nodename, String username, Pageable pageable);

	/**
	 * 查询用户信息
	 * 
	 * @param userid
	 * @return
	 */
	BaseUser getBaseUser(String userid);
	
	BaseUser getUserAndRole(String userId);

	BaseUser getBaseUserByUsername(String username);

	/**
	 * 保存baseuser。
	 * 
	 * @param user
	 * 
	 */
	BaseUser saveBaseUser(BaseUser user);

	/**
	 * 保存用户
	 * 
	 * @param user
	 * @return
	 */
	BaseUser saveUser(BaseUser user);

	/**
	 * 删除用户
	 * 
	 * @param user
	 * @return
	 */
	void deleteBaseUser(String userid);

	/**
	 * 判断loginId是否存在
	 * 
	 * @param loginId
	 * @return
	 */
	boolean isExistUsername(String loginId);

	/**
	 * 根据userId获取user
	 * 
	 * @param userId
	 * @return
	 */
//	BaseUser getUserByUserId(String userId);

	/**
	 * 修改用户的角色
	 * 
	 * @param userId
	 * @return
	 */
	void saveUserRole(BaseUserDto user,String userid);

	/**
	 * 修改用户的密码
	 * 
	 * @param password
	 * @param userid
	 * @return
	 */
	void updateUserPassword(String password, String userid);
	
	void updateUserPassword(String oldpassword,String newpassword, String userid);

	/**
	 * 判断用户的密码是否正确
	 * 
	 * @param userid
	 * @param password
	 * @return
	 */
	boolean validateUserPassword(String userid, String password);

	/**
	 * 保存用户头像
	 * 
	 * @param head
	 * @return
	 */
	void saveUserHeadImg(UserHead head);

	/**
	 * 删除用户头像
	 * 
	 * @param userId
	 * @return
	 */
	void deleteUserHeadImg(String userId);

	/**
	 * 获取用户头像
	 * 
	 * @param userId
	 * @return
	 */
	UserHead getUserHeadImg(String userId);

	void updateBaseUserStatus(String userid, String status);
}