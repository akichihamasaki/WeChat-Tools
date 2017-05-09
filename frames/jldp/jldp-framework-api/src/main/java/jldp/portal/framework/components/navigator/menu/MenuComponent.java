package jldp.portal.framework.components.navigator.menu;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.builder.CompareToBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import com.alibaba.fastjson.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class MenuComponent extends MenuBase implements Serializable, Comparable<MenuComponent> {
	private static final long serialVersionUID = 1L;

	protected static MenuComponent[] _menuComponent = new MenuComponent[0];

	protected List<MenuComponent> menuComponents = new ArrayList<MenuComponent>();
	protected MenuComponent parentMenu = null;
	
	public void setParent(MenuComponent parentMenu) {
		if (parentMenu != null) {
			// look up the parent and make sure that it has this menu as a child
			if (!parentMenu.getComponents().contains(this)) {
				parentMenu.addMenuComponent(this);
			}
		}
		this.parentMenu = parentMenu;
	}
	@JsonIgnore
	@JSONField(serialize=false)
	public MenuComponent getParent() {

		return parentMenu;
	}

	public String getParentId(){
		if(parentMenu!=null){
			return parentMenu.getId();
		}else{
			return null;
		}
	}
	
	public void addMenuComponent(MenuComponent menuComponent) {
		if ((menuComponent.getId() == null) || (menuComponent.getId().equals(""))) {
			menuComponent.setId(this.getId() + menuComponents.size());
		}
		if (!menuComponents.contains(menuComponent)) {
			menuComponents.add(menuComponent);
			menuComponent.setParent(this);
		}
		Collections.sort(menuComponents);

	}

//	public MenuComponent[] getMenuComponents() {
//		MenuComponent[] menus = (MenuComponent[]) getComponents().toArray(_menuComponent);
//		return menus;
//	}

//	public void setMenuComponents(MenuComponent[] menus) {
//
//	}

	public List<MenuComponent> getComponents() {
		return menuComponents;
	}

//	public void setComponents(List<MenuComponent> components) {
//
//	}

	public boolean equals(Object o) {
		if (!(o instanceof MenuComponent)) {
			return false;
		}
		MenuComponent m = (MenuComponent) o;

		return new EqualsBuilder().append(getId(), m.getId()).isEquals();
	}

	public int compareTo(MenuComponent other) {
		// log.debug(other);
		if (!(other instanceof MenuComponent)) {
			return new CompareToBuilder().append(this, other).toComparison();
		}
		MenuComponent castOther = (MenuComponent) other;
		if (StringUtils.equals(castOther.getId(), getId())) {
			return 0;
		}
		if ((getParent() == castOther.getParent()) || (getParent() != null && castOther.getParent() != null
				&& StringUtils.equals(getParent().getId(), castOther.getParent().getId()))) {
			return new CompareToBuilder().append(getOrderno(), castOther.getOrderno()).toComparison();
		}
		return new CompareToBuilder().append(getTitle(), castOther.getTitle()).toComparison();
	}

	public int hashCode() {

		return new HashCodeBuilder().append(getId()).toHashCode();
	}

	public String toString() {
		ToStringBuilder builder = new ToStringBuilder(this).append("id", getId()).append("name", getName())
				.append("title", getTitle()).append("url", getUrl()).append("orderno", getOrderno());

		MenuComponent parent = getParent();
		if (parent != null) {
			builder.append("parent", parent.getId());
		} else {
			builder.append("parent", null + "");
		}
		builder.append("components.size", getComponents().size());
		return builder.toString();
	}
}
