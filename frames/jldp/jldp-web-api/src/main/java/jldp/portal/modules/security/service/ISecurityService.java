package jldp.portal.modules.security.service;

public interface ISecurityService {
	/**
	 * 用户登录接口
	 * @param user
	 * @return
	 * @throws AuthenticationException
	 * code:1000,1001 用户名密码错误
	 */
//	BaseUser login(BaseUser user,String ip) throws AuthenticationException;
	
	/**
	 * 用户退出
	 * @param userid
	 */
	void logout(String userid,String ip);
}
