package jldp.portal.modules.security.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import jldp.portal.core.base.model.BaseObject;

@Entity
@Table(name = "BASE_MENUS")
public class BaseMenu extends BaseObject /**implements Comparable<BaseMenu>*/{
	private static final long serialVersionUID = 1397543334800948394L;
	@Id
	@Column(name = "MENU_ID", length = 36)
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	private String menuid;
	/**
	 * 菜单title
	 */
	@Column(name = "NAME", length = 255)
	private String name;
	/**
	 * 菜单编码。编码唯一，用作权限判断
	 */
	@Column(name = "CODE", length = 20, unique = true)
	private String code;
	/**
	 * 顺序
	 */
	@Column(name = "ORDERNO")
	private int orderno = 9999;
	/**
	 * 父菜单
	 */
	@Column(name = "PARENT_ID", length = 36)
	private String parentid;
	/**
	 * 菜单地址
	 */
	@Column(name = "RES_URL", length = 255)
	private String url;
	/**
	 * 菜单样式
	 */
	@Column(name = "RES_CONFIG", length = 255)
	private String config;
	
	
//	@OneToMany(cascade={CascadeType.REMOVE})
//	@JoinColumn(name="PARENT_ID")
//	@OrderBy("orderno")
//	private List<BaseMenu> children = new ArrayList<BaseMenu>();
	
//	@Transient
//	private String label;
//
//	@Transient
//	private int treeLevel;	
	
	public String getMenuid() {
		return menuid;
	}

	public BaseMenu() {
	}

	public void setMenuid(String id) {
		this.menuid = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public int getOrderno() {
		return orderno;
	}

	public void setOrderno(int orderno) {
		this.orderno = orderno;
	}

	public String getParentid() {
		return parentid;
	}

	public void setParentid(String parentId) {
		this.parentid = parentId;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getConfig() {
		return config;
	}

	public void setConfig(String config) {
		this.config = config;
	}

//	public List<BaseMenu> getChildren() {
//		return children;
//	}
//
//	public void addChild(BaseMenu menu) {
//		children.add(menu);
//	}
//	public void setChildren(List<BaseMenu> children) {
//		this.children = children;
//	}
//
//	// 兄弟节点横向排序
//	public void sortChildren() {
//		if (children.size() != 0) {
//			// 对本层节点进行排序
//			Collections.sort(children);
//			// 对每个节点的下一层节点进行排序
//			for (int i = 0; i < children.size(); i++) {
//				((BaseMenu) children.get(i)).sortChildren();
//			}
//		}
//	}
//
//	@Override
//	public boolean equals(Object obj) {
//		BaseMenu bm = (BaseMenu) obj;
//		return id.equals(bm.id);
//	}
//
//	@Override
//	public int hashCode() {
//		return id.hashCode();
//	}

//	public String getLabel() {
//		return this.name;
//	}
//
//	public void setLabel(String label) {
//		this.name = label;
//	}
//
//	@Override
//	public int compareTo(BaseMenu o) {
//		int j1 = this.getOrderno();
//		int j2 = o.getOrderno();
//		return (j1 < j2 ? -1 : (j1 == j2 ? 0 : 1));
//	}
//
//	public int getTreeLevel() {
//		return treeLevel;
//	}
//
//	public void setTreeLevel(int treeLevel) {
//		this.treeLevel = treeLevel;
//	}
}
