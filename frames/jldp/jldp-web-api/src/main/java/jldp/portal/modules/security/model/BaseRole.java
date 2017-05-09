package jldp.portal.modules.security.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;

import jldp.portal.core.base.model.BaseObject;

@Entity
@Table(name = "BASE_ROLES")
public class BaseRole extends BaseObject {
	private static final long serialVersionUID = -6953468459751665281L;

	@Id
	@Column(name = "ROLE_ID", length = 36)
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	private String roleid;

	@Column(name = "NAME", length = 50)
	private String rolename;

	@Column(name = "DESCN", length = 255)
	private String descn;

	@Column(name = "CREATOR", length = 255)
	private String creator;

	@Temporal(TemporalType.DATE)
	@Column(name = "CREATE_TIME")
	private Date createTime;

	public String getRoleid() {
		return roleid;
	}

	public void setRoleid(String roleid) {
		this.roleid = roleid;
	}

	public String getRolename() {
		return rolename;
	}

	public void setRolename(String name) {
		this.rolename = name;
	}

	public String getDescn() {
		return descn;
	}

	public void setDescn(String descn) {
		this.descn = descn;
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