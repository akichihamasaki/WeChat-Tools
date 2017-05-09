package jldp.portal.modules.security.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.BeanUtils;

public class OrganizationDto extends Organization implements Comparable<OrganizationDto>{

	private static final long serialVersionUID = -1031835555362051403L;
	private List<OrganizationDto> children = new ArrayList<OrganizationDto>();
	private String nodetype;
	private int treeLevel;
	
	public OrganizationDto() {
	}
	
	public OrganizationDto(Organization organization) {
		if(organization != null){
			BeanUtils.copyProperties(organization, this);
		}
	}	

	public String getNodetype() {
		return nodetype;
	}
	
	public void setNodetype(String nodetype) {
		this.nodetype=nodetype;
	}
	public int getTreeLevel() {
		return this.treeLevel;
	}

	public void setTreeLevel(int treeLevel) {
		this.treeLevel=treeLevel;

	}
	// 兄弟节点横向排序
	public void sortChildren() {
		if (children.size() != 0) {
			// 对本层节点进行排序
			Collections.sort(children);
			// 对每个节点的下一层节点进行排序
			for (int i = 0; i < children.size(); i++) {
				((OrganizationDto) children.get(i)).sortChildren();
			}
		}
	}

	public List<OrganizationDto> getChildren() {
		return children;
	}

	public void setChildren(List<OrganizationDto> children) {
		this.children = children;
	}
	public void addChild(OrganizationDto org) {
		children.add(org);
	}
	@Override
	public int compareTo(OrganizationDto o) {
		int j1 = this.getOrderno();
		int j2 = o.getOrderno();
		return (j1 < j2 ? -1 : (j1 == j2 ? 0 : 1));
	}


	
}
