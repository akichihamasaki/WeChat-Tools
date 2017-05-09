package jldp.portal.modules.security.model;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Table;
import javax.persistence.Version;

import org.hibernate.annotations.GenericGenerator;

import jldp.portal.core.base.model.BaseObject;

@Entity
@Table(name = "BASE_ORGANIZATION")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "NODETYPE", length = 2)
public abstract class Organization extends BaseObject  {

	private static final long serialVersionUID = 4972757509244366307L;

	@Id
	@Column(name = "NODEID", length = 36)
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	private String nodeid;

	@Column(name = "PARENT_ID", length = 36)
	private String parentid;

	@Version
	@Column(name = "VERSION")
	private int version;

	@Column(name = "NODECODE", length = 20)
	private String nodecode;

	@Column(name = "NODENAME", length = 255)
	private String nodename;

	@Column(name = "SHORTNAME", length = 80)
	private String shortname;

	@Column(name = "STATUS", length = 2)
	private String status;
	
	@Column(name="NODETYPE",length=2,nullable=false,insertable=false,updatable=false)
//	@Transient
	private String nodetype;

	@Column(name = "ORDERNO")
	private int orderno;

//	@OneToMany(cascade={CascadeType.REMOVE})
//	@JoinColumn(name="PARENT_ID")
//	@OrderBy("orderno")
//	private List<Organization> children = new ArrayList<Organization>();

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	public String getNodename() {
		return nodename;
	}

	public void setNodename(String nodename) {
		this.nodename = nodename;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getParentid() {
		return parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}
	
	public String getNodeid() {
		return nodeid;
	}

	public void setNodeid(String nodeid) {
		this.nodeid = nodeid;
	}

	public String getNodecode() {
		return nodecode;
	}

	public void setNodecode(String nodecode) {
		this.nodecode = nodecode;
	}

	public String getShortname() {
		return shortname;
	}

	public void setShortname(String shortname) {
		this.shortname = shortname;
	}

	public int getOrderno() {
		return orderno;
	}

	public void setOrderno(int orderno) {
		this.orderno = orderno;
	}
	
	public String getNodetype(){
		return nodetype;
	}

	public void setNodetype(String nodetype) {
		this.nodetype=nodetype;
	}
//
//	public abstract int getTreeLevel();
//
//	public abstract void setTreeLevel(int treeLevel);



//
//	@Override
//	public boolean equals(Object obj) {
//		Organization bm = (Organization) obj;
//		return nodeid.equals(bm.nodeid);
//	}
//
//	@Override
//	public int hashCode() {
//		return nodeid.hashCode();
//	}



}
