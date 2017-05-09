package jldp.portal.modules.security.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import jldp.portal.core.base.model.BaseObject;

@Entity
@Table(name="BASE_ROLE_MENU")
@IdClass(BaseRoleMenuPK.class)
public class BaseRoleMenu extends BaseObject{

	private static final long serialVersionUID = 6052356897167600023L;
	@Id
	@Column(name="ROLE_ID",length=36)
	private String roleid;
	@Id
	@Column(name="MENU_ID",length=36)
	private String menuid;
	
	@Column(name="CREATOR")
	private String creator;
	@Column(name="CREATE_TIME")
	@Temporal(TemporalType.TIMESTAMP)
	private Date createTime;
	
	public BaseRoleMenu() {
	}
	public BaseRoleMenu(String roleid, String menuid) {
		this.roleid = roleid;
		this.menuid = menuid;
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
	public String getCreator() {
		return creator;
	}
	public void setCreator(String creator) {
		this.creator = creator;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
}
