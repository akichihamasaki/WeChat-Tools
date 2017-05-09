package jldp.portal.core.base.action;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;

import jldp.portal.framework.core.authentication.JldpUser;

/**
 * 
 * @ClassName: BaseAction
 * @Description: 公用的BaseController
 * @author dengzongyu
 * @date 2016年12月7日 下午1:39:59
 */
public abstract class BaseAction {
	
	protected Logger logger = LoggerFactory.getLogger(getClass());
	
	public JldpUser getUser(){
		if(SecurityContextHolder.getContext().getAuthentication()!=null){
			return (JldpUser)SecurityContextHolder.getContext().getAuthentication().getCredentials();
		}else{
			return null;
		}
	}
	
	/**
	 * 获取当前请求的request的串标识
	 * currentRequestUUID:(这里用一句话描述这个方法的作用).
	 * @author dengzongyu
	 * @param request 请求
	 * @return 贯穿整个请求的UUID
	 * @since JDK 1.8
	 */
	public String currentRequestUUID(HttpServletRequest request){
		return request.getAttribute("REQUEST_UUID").toString();
	}
}
