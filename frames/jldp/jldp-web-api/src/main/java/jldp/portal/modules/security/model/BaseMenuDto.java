package jldp.portal.modules.security.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.BeanUtils;

public class BaseMenuDto extends BaseMenu implements Comparable<BaseMenuDto>{

	private static final long serialVersionUID = -7044609822898563912L;

	private boolean isCheck;

	private int treeLevel;
	private List<BaseMenuDto> children = new ArrayList<BaseMenuDto>();

	public BaseMenuDto() {

	}

	public BaseMenuDto(BaseMenu baseMenu) {
		BeanUtils.copyProperties(baseMenu, this);
	}

	public boolean isCheck() {
		return isCheck;
	}

	public void setCheck(boolean isCheck) {
		this.isCheck = isCheck;
	}

	public String getLabel() {
		return this.getName();
	}

	public void setLabel(String label) {
		this.setName(label);
	}

	public int getTreeLevel() {
		return treeLevel;
	}

	public void setTreeLevel(int treeLevel) {
		this.treeLevel = treeLevel;
	}

	public List<BaseMenuDto> getChildren() {
		return children;
	}

	public void addChild(BaseMenuDto menu) {
		children.add(menu);
	}

	public void setChildren(List<BaseMenuDto> children) {
		this.children = children;
	}

	public void sortChildren() {
		if (children.size() != 0) {
			// 对本层节点进行排序
			Collections.sort(children);
			// 对每个节点的下一层节点进行排序
			for (int i = 0; i < children.size(); i++) {
				((BaseMenuDto) children.get(i)).sortChildren();
			}
		}
	}

	public int compareTo(BaseMenuDto o) {
		int j1 = this.getOrderno();
		int j2 = o.getOrderno();
		return (j1 < j2 ? -1 : (j1 == j2 ? 0 : 1));
	}
}
