package jldp.portal.framework.components.navigator.menu;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.map.LinkedMap;
import org.apache.commons.lang.StringUtils;

public class MenuRepository {
	
	protected LinkedMap menus = new LinkedMap();

	@SuppressWarnings("unchecked")
	public List<MenuComponent> getTopMenus() {
		List<MenuComponent> topMenus = new ArrayList<MenuComponent>();
		if (menus == null) {
			return topMenus;
		}
		for (Iterator<String> it = menus.keySet().iterator(); it.hasNext();) {
			String id = (String) it.next();
			MenuComponent menu = getMenu(id);
			if (menu.getParent() == null) {
				topMenus.add(menu);
			}
		}
		Collections.sort(topMenus);
		return topMenus;
	}

	public MenuComponent getMenu(String id) {
		MenuComponent menu = (MenuComponent) menus.get(id);
		return menu;
	}

	public List<MenuComponent> getMenus(){
		List<MenuComponent> ms = new ArrayList<MenuComponent>();
		for(Object obj:menus.values()){
			ms.add((MenuComponent)obj);
		}
		return ms;
	}
	
	public void addMenu(MenuComponent menu) {
		if (menus.containsKey(menu.getId())) {
			List<MenuComponent> children = getMenu(menu.getId()).getComponents();
			if (children != null && menu.getComponents() != null) {
				List<MenuComponent> children2 = new ArrayList<MenuComponent>();
				children2.addAll(children);
				for (Iterator<?> it = children2.iterator(); it.hasNext();) {
					MenuComponent child = (MenuComponent) it.next();
					menu.addMenuComponent(child);
				}
			}
		}
		MenuComponent parent = menu.getParent();
		if (parent != null && StringUtils.isNotEmpty(parent.getId())) {
			String id = parent.getId();

			if (menus.containsKey(id)) {
				menu.setParent(getMenu(id));
			} else {
				menus.put(id, parent);
			}
			parent.addMenuComponent(menu);
		}
		menus.put(menu.getId(), menu);
	}

	@SuppressWarnings("unchecked")
	public void removeMenu(String id) {
		for (Iterator<Map.Entry<String,MenuComponent>> it = menus.entrySet().iterator(); it.hasNext();) {
			Map.Entry<String,MenuComponent> entry =  it.next();
			String key = (String) entry.getKey();
			if (StringUtils.equals(id, key)) {
				MenuComponent menu = (MenuComponent) entry.getValue();
				List<MenuComponent> children = menu.getComponents();
				for (int i = 0; i < children.size(); i++) {
					MenuComponent child = (MenuComponent) children.get(i);
					child.setParent(null);
					menus.put(child.getId(), child);
				}
				it.remove();
				continue;
			}
		}

	}
}
