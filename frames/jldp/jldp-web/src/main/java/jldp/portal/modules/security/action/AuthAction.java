package jldp.portal.modules.security.action;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import jldp.portal.core.base.action.BaseAction;
import jldp.portal.core.exception.action.GenericActionException;
import jldp.portal.framework.components.navigator.menu.MenuComponent;
import jldp.portal.framework.core.authentication.JldpUser;
import jldp.portal.framework.core.authentication.JldpUserDetails;
import jldp.portal.framework.core.authentication.annotation.CurrentUser;
import jldp.portal.framework.core.authentication.annotation.Security;
import jldp.portal.framework.core.authentication.web.WebAuthenticationDetails;
import jldp.portal.modules.security.model.BaseUser;
import jldp.portal.modules.security.model.Employee;
import jldp.portal.modules.security.service.IMenuService;
import jldp.portal.modules.security.service.IOrganizationService;
import jldp.portal.modules.security.service.ISecurityService;
/**
 * 用户认证
 * @author zhongli
 *
 */
import jldp.portal.modules.security.service.IUserService;
import jldp.portal.utils.IPUtils;

@RestController
@RequestMapping("api/security/auth")
@Api("用户权限相关")
public class AuthAction extends BaseAction {

	@Autowired
	@Qualifier("security.securityService")
	private ISecurityService securityService;
	@Autowired
	@Qualifier("security.userService")
	private IUserService userService;
	@Autowired
	@Qualifier("security.menuService")
	private IMenuService menuService;
	@Autowired
	@Qualifier("security.organizationService")
	private IOrganizationService organizationService;
	@Autowired
	private AuthenticationManager authenticationManager;

	/**
	 * 用户登录
	 * 
	 * @param user
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/signin", method = RequestMethod.POST)
	public BaseUser signin(@RequestBody BaseUser user, HttpServletRequest request) {
		String username = user.getUsername();
		String password = user.getPassword();
		UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);

		String ip = IPUtils.getClientIpAddress(request);
		HttpSession session = request.getSession(false);
		String sessionId = (session != null) ? session.getId() : null;
		WebAuthenticationDetails detail = new WebAuthenticationDetails(ip, sessionId);
		authRequest.setDetails(detail);
		Authentication authResult;
		try {
			authResult = authenticationManager.authenticate(authRequest);
		} catch (InternalAuthenticationServiceException failed) {
			logger.error("An internal error occurred while trying to authenticate the user.", failed);
			unsuccessfulAuthentication(request, failed);
			return null;
		} catch (AuthenticationException failed) {
			unsuccessfulAuthentication(request, failed);
			return null;
		}
		successfulAuthentication(request, authResult);
		JldpUser jldpUser = (JldpUser) authResult.getPrincipal();
		BaseUser po = userService.getBaseUser(jldpUser.getUserid());
		po.setPassword("");
		Employee emp = (Employee) organizationService.getOrganization(po.getEmployee().getNodeid());
		po.setEmployee(emp);
		//po.setEmpName(emp.getNodename());
		return po;
	}

	protected void successfulAuthentication(HttpServletRequest request, Authentication authResult) {
		if (logger.isDebugEnabled()) {
			logger.debug("Authentication success. Updating SecurityContextHolder to contain: " + authResult);
		}
		SecurityContextHolder.getContext().setAuthentication(authResult);

	}

	protected void unsuccessfulAuthentication(HttpServletRequest request, AuthenticationException failed) {
		SecurityContextHolder.clearContext();

		if (logger.isDebugEnabled()) {
			logger.debug("Authentication request failed: " + failed.toString(), failed);
			logger.debug("Updated SecurityContextHolder to contain null Authentication");
		}
		throw new GenericActionException(1000, failed.getMessage());

	}

	@RequestMapping(value = "/signup", method = RequestMethod.GET)
	public void signup(@CurrentUser JldpUser auth, HttpServletRequest request) {
		if (auth != null) {
			JldpUser user = (JldpUser) auth;
			String userid = user.getUserid();
			if (StringUtils.isNotBlank(userid)) {
				String ip = IPUtils.getClientIpAddress(request);
				this.securityService.logout(userid, ip);
			}
		}
		request.getSession().invalidate();
	}

	@RequestMapping(value = "getLogged", method = RequestMethod.GET)
	public BaseUser getLogged(@CurrentUser JldpUser auth, HttpServletRequest request) {
		if (auth != null) {
			BaseUser po = userService.getBaseUser(auth.getUserid());
			Employee emp = (Employee) organizationService.getOrganization(po.getEmployee().getNodeid());
			po.setEmployee(emp);
			//po.setEmpName(emp.getNodename());
			return po;
		} else {
			return null;
		}
	}

	@RequestMapping(value = "getmenus", method = RequestMethod.GET)
	@Security
	public List<MenuComponent> getMenus(@CurrentUser JldpUserDetails auth, HttpServletRequest request) {
		return menuService.queryMenuByUserId(auth.getUserid());
	}

}
