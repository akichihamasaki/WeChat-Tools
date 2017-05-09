package jldp.portal.modules.security.model;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.SecondaryTable;

@Entity
//@Table(name = "BASE_BRANCH")
@DiscriminatorValue("01")
@SecondaryTable(name="BASE_BRANCH")
public class Branch extends Organization {

	private static final long serialVersionUID = -1755995080907269956L;

	public final static String NODETYPE = "01";

	@Column(name = "MANAGER", length = 36,table="BASE_BRANCH")
	private String manager;

	@Column(name = "ORG_ADDR", length = 255,table="BASE_BRANCH")
	private String orgaddr;

	@Column(name = "LINK_TEL", length = 255,table="BASE_BRANCH")
	private String linktel;
	
//	@Transient
//	private int treeLevel;

	public Branch() {
		super();
		this.setNodetype(NODETYPE);
	}

	@Override
	public String getNodetype() {
		return NODETYPE;
	}

	@Override
	public void setNodetype(String nodetype) {
		
	}

	public String getManager() {
		return manager;
	}

	public void setManager(String manager) {
		this.manager = manager;
	}

//	public int getTreeLevel() {
//		return treeLevel;
//	}
//
//	public void setTreeLevel(int treeLevel) {
//		this.treeLevel = treeLevel;
//	}
	
	public String getLinktel() {
		return linktel;
	}

	public void setLinktel(String linktel) {
		this.linktel = linktel;
	}
	
	public String getOrgaddr() {
		return orgaddr;
	}

	public void setOrgaddr(String orgaddr) {
		this.orgaddr = orgaddr;
	}
}