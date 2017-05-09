package jldp.portal.modules.security.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;

public class BaseUserDto extends BaseUser {

	private static final long serialVersionUID = 5077644691903380223L;

	private List<BaseRole> roles = new ArrayList<BaseRole>();
	
	public BaseUserDto() {
		super();
	}

	public BaseUserDto(BaseUser baseUser) {
		BeanUtils.copyProperties(baseUser, this);
	}
	
	public List<BaseRole> getRoles() {
		return roles;
	}

	public void setRoles(List<BaseRole> roles) {
		this.roles = roles;
	}

	public void addRole(BaseRole role) {
		this.roles.add(role);
	}	
}
