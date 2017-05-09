package jldp.portal.modules.security.model;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.SecondaryTable;

@Entity
//@Table(name = "BASE_DEPARTMENT")
//@PrimaryKeyJoinColumn(name = "NODEID")
@DiscriminatorValue("02")
@SecondaryTable(name="BASE_DEPARTMENT")
public class Department extends Organization {
	private static final long serialVersionUID = 5398929913365832192L;

	public final static String NODETYPE = "02";

	@Column(name = "MANAGER", length = 36,table="BASE_DEPARTMENT")
	private String manager;

	@Column(name = "RESPONSIBILITY", length = 255,table="BASE_DEPARTMENT")
	private String responsibility;

	@Column(name = "DESCRIPTION", length = 255,table="BASE_DEPARTMENT")
	private String description;

	@Column(name = "LINK_TEL", length = 255,table="BASE_DEPARTMENT")
	private String linktel;
	
//	@Transient
//	private int treeLevel;
	
	public Department() {
		super();
		this.setNodetype(NODETYPE);
	}

	public String getNodetype() {
		return NODETYPE;
	}

	public void setNodetype(String nodetype) {
		
	}

	public String getManager() {
		return manager;
	}

	public void setManager(String manager) {
		this.manager = manager;
	}

	public String getResponsibility() {
		return responsibility;
	}

	public void setResponsibility(String responsibility) {
		this.responsibility = responsibility;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getLinktel() {
		return linktel;
	}

	public void setLinktel(String linktel) {
		this.linktel = linktel;
	}

//	public int getTreeLevel() {
//		return treeLevel;
//	}
//
//	public void setTreeLevel(int treeLevel) {
//		this.treeLevel = treeLevel;
//	}
}