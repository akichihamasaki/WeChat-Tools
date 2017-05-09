package jldp.portal.modules.security.service;

import java.util.List;

import jldp.portal.framework.components.navigator.menu.MenuComponent;
import jldp.portal.modules.security.model.BaseMenu;
import jldp.portal.modules.security.model.BaseMenuDto;

public interface IMenuService {
	/**
	 * 分页查询所有菜单
	 * 
	 * @param pageable
	 * @return
	 */
//	Page<BaseMenu> findBaseMenu(Pageable pageable);

	/**
	 * 查询所有菜单
	 * 
	 * @param pageable
	 * @return
	 */
	List<BaseMenu> queryAllBaseMenu();
	
	List<BaseMenu> findByParentid(String parentid);

	/**
	 * 查询所有菜单
	 * 
	 * @param pageable
	 * @return
	 */
	List<BaseMenuDto> queryAllBaseMenuTree();

	/**
	 * 查询所有菜单，按treegrid结构返回
	 * 
	 * @param pageable
	 * @return
	 */
	List<BaseMenuDto> queryMenuTreeGridByRoleid(String roleid);

	/**
	 * 根据用户Id获取菜单
	 * 登录用户菜单
	 * 
	 * @param userId
	 * @return
	 */
	List<MenuComponent> queryMenuByUserId(String userId);

	List<BaseMenu> queryMenu(String userId);

	/**
	 * 查询用户信息
	 * 
	 * @param menuId
	 * @return
	 */
	BaseMenu getBaseMenu(String menuId);

	/**
	 * 新增菜单
	 * 
	 * @param baseMenu
	 * @return
	 */
	BaseMenu insertBaseMenu(BaseMenu baseMenu);

	/**
	 * 修改菜单
	 * 
	 * @param baseMenu
	 * @return
	 */
	BaseMenu updateBaseMenu(BaseMenu baseMenu);

	/**
	 * 删除菜单
	 * @param baseMenu
	 * 
	 * @return
	 */
//	void deleteBaseMenu(String menuid);
	
	void deleteBaseMenu(String menuid);

	/**
	 * 是否存在菜单的CODE
	 * 
	 * @param baseMenu
	 * @return
	 */
	boolean isExistMenuCode(BaseMenu baseMenu);
}
