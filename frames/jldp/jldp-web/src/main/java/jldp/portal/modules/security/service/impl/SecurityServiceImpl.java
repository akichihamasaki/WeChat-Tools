package jldp.portal.modules.security.service.impl;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.session.events.SessionDestroyedEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

import jldp.portal.framework.core.authentication.JldpUser;
import jldp.portal.framework.core.authentication.web.WebAuthenticationDetails;
import jldp.portal.modules.security.model.BaseLogs;
import jldp.portal.modules.security.model.BaseUser;
import jldp.portal.modules.security.service.ILogsService;
import jldp.portal.modules.security.service.ISecurityService;
import jldp.portal.modules.security.service.IUserService;
@Service("security.securityService")
public class SecurityServiceImpl implements ISecurityService,ApplicationListener<ApplicationEvent>{
	@Autowired
	@Qualifier("security.userService")
	private IUserService userService;
	@Autowired
	@Qualifier("security.LogsService")
	private ILogsService logService;
    @Autowired
	private TransactionTemplate transactionTemplate;
	
	@Transactional
	public void logout(String userid,String ip){
		signup(userid,ip,0);
	}
	
	private void signup(String userid,String ip,int type){
		BaseUser po = userService.getBaseUser(userid);
		if (po != null) {
			po.setOnlineStatus(IUserService.USER_STATU_OFFLINE);
			userService.saveBaseUser(po);
			BaseLogs logs = new BaseLogs();
			logs.setOpIP(ip);
			logs.setOpType("SYSTEM");
			if(type==0){
				logs.setOpCode("USER_LOGOUT");
			}else if(type==1){
				logs.setOpCode("SESSION_TIMEOUT");
			}
			logService.insertBaseLogs(logs, po);
		}		
	}
	
	/**
	 * 类似此接口方法是不能加@Transactional产生事务的。
     * 解决方案:1.使用PlatformTransactionManager,此次使用此方法
     * 2.调用另一接口类的接口方法，事务在另一接口类方法实现上，推荐使用此方法
	 * @param event
	 */
	public void onApplicationEvent(ApplicationEvent event) {
		if(event instanceof SessionDestroyedEvent){
			doSessionDestroyedEvent((SessionDestroyedEvent) event);
		}else if(event instanceof AuthenticationSuccessEvent){
			doAuthenticationSuccessEvent((AuthenticationSuccessEvent)event);
		}
		
	}
	
	private void doSessionDestroyedEvent(SessionDestroyedEvent event){
		HttpSession session = event.getSession();
		SecurityContext context = (SecurityContext) session.getAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
		if(context != null){
			Authentication auth=context.getAuthentication();
			if (auth != null && auth.getPrincipal() != null) {
				JldpUser user = (JldpUser)auth.getPrincipal();
				if(user!=null){
					transactionTemplate.execute(new TransactionCallbackWithoutResult() {
						protected void doInTransactionWithoutResult(TransactionStatus status) {
							signup(user.getUserid(), null, 1);
						}
					});
				}
			}
		}
	}
	
	private void doAuthenticationSuccessEvent(AuthenticationSuccessEvent event){
		Authentication auth=event.getAuthentication();
		if(auth != null && auth.getPrincipal() != null){
			WebAuthenticationDetails details = (WebAuthenticationDetails)auth.getDetails();
			JldpUser user = (JldpUser)auth.getPrincipal();
			BaseUser po = userService.getBaseUser(user.getUserid());
			po.setOnlineStatus(IUserService.USER_STATU_ONLINE);
			userService.saveBaseUser(po);
			BaseLogs logs = new BaseLogs();
			logs.setOpIP(details.getRemoteAddress());
			logs.setOpType("SYSTEM");
			logs.setOpCode("USER_LOGIN");
			logService.insertBaseLogs(logs, po);
		}
	}
}
