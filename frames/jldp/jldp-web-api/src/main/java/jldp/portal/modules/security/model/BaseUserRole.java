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
@Table(name="BASE_USER_ROLE")
@IdClass(BaseUserRolePK.class)
public class BaseUserRole extends BaseObject{
	private static final long serialVersionUID = 8457787285977152219L;
	@Id
	@Column(name="user_id",length=36)
	private String userid;
	@Column(name="role_id",length=36)
	private String roleid;
	
	@Column(name="CREATOR")
	private String creator;
	@Column(name="CREATE_TIME")
	@Temporal(TemporalType.TIMESTAMP)
	private Date createTime;
	
	public BaseUserRole() {
		super();
	}
	public BaseUserRole(String userid, String roleid) {
		super();
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
