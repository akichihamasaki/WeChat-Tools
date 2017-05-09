package jldp.portal.framework.core.authentication;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;

public class JldpUser extends JldpUserDetails{

	private static final long serialVersionUID = 6341591054613965579L;

	public JldpUser(String username, String password, boolean enabled, boolean accountNonExpired,
			boolean credentialsNonExpired, boolean accountNonLocked,
			Collection<? extends GrantedAuthority> authorities) {
		super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
	}

//	String getUserid();
//
//	String getUsername();
//
//	String getPassword();
//
//	String getNodeid();
//
//	boolean isEnabled();
	

}
