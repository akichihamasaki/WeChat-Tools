package jldp.portal.modules.security.model;

import jldp.portal.core.base.model.BaseObject;

public class BaseUserRolePK extends BaseObject{

	private static final long serialVersionUID = -5954181337077423884L;
	
	private String userid;
	private String roleid;
	
	public BaseUserRolePK() {
	}
	public BaseUserRolePK(String userid, String roleid) {
		this.userid = userid;
		this.roleid = roleid;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public String getRoleid() {
		return roleid;
	}
	public void setRoleid(String roleid) {
		this.roleid = roleid;
	}
	
	

}
