package jldp.portal.modules.security.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;

public class BaseRoleDto extends BaseRole{

	private static final long serialVersionUID = 2906025908534100472L;

	private List<BaseMenu> menus = new ArrayList<BaseMenu>();
	
	private boolean check;

	public BaseRoleDto() {
		super();
	}
	
	public BaseRoleDto(BaseRole baseRole) {
		super();
		if(baseRole!=null){
			BeanUtils.copyProperties(baseRole, this);
		}
	}
	public BaseRoleDto(BaseRole baseRole,boolean check) {
		this(baseRole);
		this.check=check;
	}
	
	public List<BaseMenu> getMenus() {
		return menus;
	}

	public void setMenus(List<BaseMenu> menus) {
		this.menus = menus;
	}

	public void addMenu(BaseMenu menu) {
		this.menus.add(menu);
	}

	public boolean isCheck() {
		return check;
	}	

}
