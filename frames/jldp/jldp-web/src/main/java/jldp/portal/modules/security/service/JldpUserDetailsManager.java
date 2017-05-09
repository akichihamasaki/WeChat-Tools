/**
 * 
 */
package jldp.portal.modules.security.service;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.SpringSecurityMessageSource;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Component;

import jldp.portal.framework.core.authentication.JldpUser;
import jldp.portal.modules.security.dao.UserRepository;
import jldp.portal.modules.security.model.BaseUser;

/**
 * @author leo
 *
 */
@Component
@Order(Ordered.LOWEST_PRECEDENCE)
public class JldpUserDetailsManager implements UserDetailsManager {
	
	protected final Logger logger = LoggerFactory.getLogger(getClass());
	protected MessageSourceAccessor messages = SpringSecurityMessageSource.getAccessor();
	@Autowired
	@Qualifier("security.userRepository")
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		BaseUser po = userRepository.findByUsername(username);
		if(po==null){
			this.logger.debug("Query returned no results for user '" + username + "'");

			throw new UsernameNotFoundException(
					this.messages.getMessage("JldpUserDetailsManager.notFound",
							new Object[] { username }, "Username {0} not found"));			
		}
		boolean enabled=false;
		if(StringUtils.equals("1", po.getStatus())){
			enabled=true;
		}
		JldpUser user = new JldpUser(po.getUsername(),po.getPassword(),enabled,true,true,true,AuthorityUtils.NO_AUTHORITIES);
		user.setUserid(po.getUserid());
		if(po.getEmployee() != null){
			user.setNodeid(po.getEmployee().getNodeid());
		}
		return user;
	}

	/* (non-Javadoc)
	 * @see org.springframework.security.provisioning.UserDetailsManager#changePassword(java.lang.String, java.lang.String)
	 */
	@Override
	public void changePassword(String oldPassword, String newPassword) {
		// TODO Auto-generated method stub

	}

	@Override
	public void createUser(UserDetails user) {
		// TODO Auto-generated method stub

	}

	@Override
	public void deleteUser(String username) {
		// TODO Auto-generated method stub

	}

	@Override
	public void updateUser(UserDetails user) {
		// TODO Auto-generated method stub

	}

	@Override
	public boolean userExists(String username) {
		// TODO Auto-generated method stub
		return false;
	}

}
