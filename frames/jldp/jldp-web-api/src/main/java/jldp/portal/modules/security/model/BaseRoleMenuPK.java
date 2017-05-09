package jldp.portal.modules.security.model;

import jldp.portal.core.base.model.BaseObject;

public class BaseRoleMenuPK extends BaseObject{
	private static final long serialVersionUID = 27877465131412621L;
	private String roleid;
	private String menuid;

	public BaseRoleMenuPK(String roleid, String menuid) {
		this.roleid = roleid;
		this.menuid = menuid;
	}
	
	public BaseRoleMenuPK() {
	}

	public String getRoleid() {
		return roleid;
	}
	public void setRoleid(String roleid) {
		this.roleid = roleid;
	}
	public String getMenuid() {
		return menuid;
	}
	public void setMenuid(String menuid) {
		this.menuid = menuid;
	}
	
	
}