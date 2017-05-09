package jldp.portal.modules.security.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Stack;

import javax.transaction.Transactional;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import jldp.portal.framework.components.navigator.menu.MenuComponent;
import jldp.portal.modules.security.dao.MenuRepository;
import jldp.portal.modules.security.dao.RoleMenuRepository;
import jldp.portal.modules.security.model.BaseMenu;
import jldp.portal.modules.security.model.BaseMenuDto;
import jldp.portal.modules.security.model.BaseRole;
import jldp.portal.modules.security.service.IMenuService;

@Service("security.menuService")
public class MenuServiceImpl implements IMenuService {
	@Autowired
	@Qualifier("security.menuRepository")
	private MenuRepository menuRepository;
	@Autowired
	@Qualifier("security.roleMenuRepository")
	private RoleMenuRepository roleMenuRepository;
	
//	public void saveMenu(BaseMenu menu) {
//		menuRepository.save(menu);
//	}

//	public Page<BaseMenu> findBaseMenu(Pageable pageable) {
//		return menuRepository.findAll(pageable);
//	}

	public List<BaseMenu> queryMenu(String userId) {
		List<BaseMenu> menuList = menuRepository.queryMenuByUserId(userId);
		return menuList;
	}
	
	public List<BaseMenu> findByParentid(String parentid){
		return menuRepository.findByParentid(parentid);
	}

	/**
	 * 根据用户Id获取菜单
	 * 登录用户菜单
	 * 
	 * @param userId
	 * @return
	 */
	public List<MenuComponent> queryMenuByUserId(String userId) {
		jldp.portal.framework.components.navigator.menu.MenuRepository repo = new jldp.portal.framework.components.navigator.menu.MenuRepository();
		List<BaseMenu> menuList = queryMenu(userId);
		for (BaseMenu menu : menuList) {
			MenuComponent comp = new MenuComponent();
			initMenuComponent(menu, comp);
			if (StringUtils.isNotBlank(menu.getParentid())) {
				MenuComponent parent = new MenuComponent();
				parent.setId(menu.getParentid());
				comp.setParent(parent);
			}
			repo.addMenu(comp);
		}
		int count = 0;
		while (true) {
			count++;
			boolean isBreak = true;
			List<MenuComponent> menus = repo.getMenus();//new ArrayList<MenuComponent>(); 
			//menus.addAll(repo.getMenus());
			for (MenuComponent menu : menus) {
				if (StringUtils.isNotBlank(menu.getId()) && menu.getData() == null) {
					BaseMenu bm = menuRepository.findOne(menu.getId());
					if (bm == null) {
						menu.setParent(null);
					} else {
						initMenuComponent(bm, menu);
						menu.setData(bm);
						if (StringUtils.isNotBlank(bm.getParentid())) {
							MenuComponent parent = new MenuComponent();
							parent.setId(bm.getParentid());
							menu.setParent(parent);
						}
						repo.addMenu(menu);
					}
					isBreak = false;
				}
			}
			//防止死循环
			if (isBreak || count >= 1000) {
				break;
			}
		}
		return repo.getTopMenus();
	}

	private void initMenuComponent(BaseMenu menu, MenuComponent comp) {
		comp.setId(menu.getMenuid());
		comp.setLabel(menu.getName());
		comp.setUrl(menu.getUrl());
		comp.setOrderno(menu.getOrderno());
		comp.setDescription(menu.getConfig());
	}

	public List<BaseMenu> queryAllBaseMenu() {
		return menuRepository.findAll();
	}

	/* 
	 * 获取所有菜单，父子树型结构。
	 */

	public List<BaseMenuDto> queryAllBaseMenuTree() {
		BaseMenuDto menuRoot = createMenuTree(menuRepository.findAll());
		return menuRoot.getChildren();
	}
	
	public List<BaseMenuDto> queryMenuTreeGridByRoleid(String roleid){
		List<?> list = menuRepository.queryMenuByRoleid(roleid);
		List<BaseMenu> dtos = new ArrayList<BaseMenu>();
		for(Object objs : list){
			Object[] obj = (Object[])objs;
			BaseMenu baseMenu = (BaseMenu) obj[0];
			BaseRole baseRole = (BaseRole) obj[1];
			BaseMenuDto dto = new BaseMenuDto(baseMenu);
			if(baseRole!=null){
				dto.setCheck(true);
			}else{
				dto.setCheck(false);
			}
			dtos.add(dto);
		}
		BaseMenuDto root = createMenuTree(dtos);

		List<BaseMenuDto> retTree = iteratorTree(root.getChildren(), 0);

		return retTree;		
	}
	
//	public List<BaseMenuDto> queryMenuTreeGird() {
//		List<BaseMenu> menuList = menuRepository.findAll();
//
//		BaseMenuDto root = createMenuTree(menuList);
//
//		List<BaseMenuDto> retTree = iteratorTree(root.getChildren(), 0);
//
//		return retTree;
//	}

	private BaseMenuDto createMenuTree(List<BaseMenu> menuList) {

		// 节点列表（映射表，用于临时存储节点对象）
		Map<String, BaseMenuDto> nodeList = new HashMap<String, BaseMenuDto>();

		for (BaseMenu tmpBm : menuList) {
			if(tmpBm instanceof BaseMenuDto){
				nodeList.put(tmpBm.getMenuid(), (BaseMenuDto)tmpBm);
			}else{
				nodeList.put(tmpBm.getMenuid(), new BaseMenuDto(tmpBm));
			}
		}

		// 根节点
		BaseMenuDto menuRoot = new BaseMenuDto();
		menuRoot.setMenuid("root");

		Set<Map.Entry<String, BaseMenuDto>> entrySet = nodeList.entrySet();
		for (Iterator<Map.Entry<String, BaseMenuDto>> it = entrySet.iterator(); it.hasNext();) {
			BaseMenuDto node = ((Map.Entry<String, BaseMenuDto>) it.next()).getValue();
			if (StringUtils.isBlank(node.getParentid())) {
				menuRoot.addChild(node);
			} else {
				BaseMenuDto parent=(nodeList.get(node.getParentid()));
				if(parent!=null){
					parent.addChild(node);
				}else{
					node.setParentid(null);
					menuRoot.addChild(node);
				}
			}
		}
		menuRoot.sortChildren();

		return menuRoot;
	}

	private List<BaseMenuDto> iteratorTree(List<BaseMenuDto> list, int level) {
		List<BaseMenuDto> retList = new ArrayList<BaseMenuDto>();
		for (BaseMenuDto tree : list) {
			tree.setTreeLevel(level);
			retList.add(tree);
			if (tree.getChildren() != null) {
				retList.addAll(iteratorTree(tree.getChildren(), level + 1));
			}
			tree.getChildren().clear();
		}

		return retList;
	}

	public BaseMenu getBaseMenu(String menuId) {
		return menuRepository.findOne(menuId);
	}

	public BaseMenu insertBaseMenu(BaseMenu baseMenu) {
		return menuRepository.save(baseMenu);
	}

	public BaseMenu updateBaseMenu(BaseMenu baseMenu) {
		return menuRepository.save(baseMenu);
	}

	@Transactional
	public void deleteBaseMenu(String menuid) {
		BaseMenu po =menuRepository.findOne(menuid);
		List<BaseMenu> dels = new ArrayList<BaseMenu>();
		Stack<BaseMenu> stack = new Stack<BaseMenu>();
		stack.push(po);
		while(!stack.isEmpty()){
			BaseMenu bm = stack.pop();
			dels.add(bm);
			roleMenuRepository.deleteByMenuid(bm.getMenuid());
			List<BaseMenu> children = menuRepository.findByParentid(bm.getMenuid());
			if(!children.isEmpty()){
				stack.addAll(children);
			}
		}
		menuRepository.delete(dels);

	}
	public boolean isExistMenuCode(BaseMenu menu) {
		if(StringUtils.isBlank(menu.getCode()))
			return false;
		
		List<BaseMenu> list = menuRepository.findByCode(menu.getCode());

		if (list == null || list.size() == 0)// code不存在
			return false;
		else if (list.size() == 1) {
			if (StringUtils.isNotBlank(menu.getMenuid()) && menu.getMenuid().equals(list.get(0).getMenuid()))
				return false;
			else
				return true;
		} else
			return true;
	}
}