package jldp.portal.modules.security.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

import javax.transaction.Transactional;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jldp.portal.modules.security.dao.RoleMenuRepository;
import jldp.portal.modules.security.dao.RoleRepository;
import jldp.portal.modules.security.model.BaseMenu;
import jldp.portal.modules.security.model.BaseRole;
import jldp.portal.modules.security.model.BaseRoleDto;
import jldp.portal.modules.security.model.BaseRoleMenu;
import jldp.portal.modules.security.model.BaseUser;
import jldp.portal.modules.security.service.IMenuService;
import jldp.portal.modules.security.service.IRoleService;

@Service("security.roleService")
public class RoleServiceImpl implements IRoleService {
	@Autowired
	@Qualifier("security.roleRepository")
	private RoleRepository roleRepository;
	@Autowired
	@Qualifier("security.menuService")
	private IMenuService menuService;
	@Autowired
	@Qualifier("security.roleMenuRepository")
	private RoleMenuRepository roleMenuRepository;

	public Page<BaseRole> findBaseRole(String roleName, Pageable pageable) {
		Page<BaseRole> page;
		if (StringUtils.isNotBlank(roleName)) {
			page = roleRepository.findByRolenameLike(roleName, pageable);
		} else {
			page = roleRepository.findAll(pageable);
		}

		return page;
	}

	@Override
	public List<BaseRoleDto> queryBaseRoleByUserid(String userid, String rolename) {
		String name = "%";
		if (StringUtils.isNotBlank(rolename)) {
			name = "%" + rolename + "%";
		}
		List<?> list = roleRepository.queryAllByUserid(userid, name);
		List<BaseRoleDto> dtos = new ArrayList<BaseRoleDto>();
		for (Object source : list) {
			Object[] array = (Object[]) source;
			BaseRole baseRole = (BaseRole) array[0];
			// BaseUserRole baseUserRole = (BaseUserRole)array[1];
			BaseUser baseUser = (BaseUser) array[2];
			boolean check = baseUser == null ? false : true;
			BaseRoleDto dto = new BaseRoleDto(baseRole, check);
			dtos.add(dto);
		}
		return dtos;

	}

	public List<BaseRole> findAllBaseRole(String rolename) {
		if (StringUtils.isNotBlank(rolename))
			return roleRepository.findByRolenameLike(rolename);
		else
			return roleRepository.findAll();
	}

	public BaseRole getBaseRole(String roleid) {
		return roleRepository.findOne(roleid);
	}

	public BaseRole saveBaseRole(BaseRole baseRole) {
		return roleRepository.save(baseRole);
	}

	@Transactional
	public void deleteBaseRole(String roleid) {
		roleRepository.delete(roleid);
		roleMenuRepository.deleteByRoleid(roleid);
	}

	@Transactional
	public void saveRoleMenu(BaseRoleDto role, String userid) {
		List<BaseMenu> newMenus = role.getMenus();
		BaseRole oldRole = roleRepository.findOne(role.getRoleid());
		List<BaseRoleMenu> rms = roleMenuRepository.findByRoleid(oldRole.getRoleid());
		roleMenuRepository.delete(rms);
		rms.clear();
		Date date = new Date();
		for (BaseMenu menu : newMenus) {
			if (StringUtils.isNotBlank(menu.getMenuid())) {
				BaseMenu po = menuService.getBaseMenu(menu.getMenuid());
				if (po != null) {
					BaseRoleMenu rm = new BaseRoleMenu(oldRole.getRoleid(), po.getMenuid());
					rm.setCreator(userid);
					rm.setCreateTime(date);
					rms.add(rm);
				}
			}
		}
		Map<String,BaseRoleMenu> map = new HashMap<String,BaseRoleMenu>();
		Stack<BaseRoleMenu> stack = new Stack<BaseRoleMenu>();
		stack.addAll(rms);
		while(!stack.isEmpty()){
			BaseRoleMenu rm = stack.pop();
			if(!map.containsKey(rm.getMenuid())){
				map.put(rm.getMenuid(), rm);
			}
			BaseMenu menu = menuService.getBaseMenu(rm.getMenuid());
			if(StringUtils.isNotBlank(menu.getParentid())){
				BaseMenu parentMenu = menuService.getBaseMenu(menu.getParentid());
				if(parentMenu!=null){
					BaseRoleMenu brm = new BaseRoleMenu(oldRole.getRoleid(), parentMenu.getMenuid());
					brm.setCreator(userid);
					brm.setCreateTime(date);
					stack.push(brm);
				}
			}
			
		}
		roleMenuRepository.save(map.values());
	}

	public List<BaseRole> queryBaseRoleByUserid(String userid) {
		return roleRepository.queryByUserid(userid);
	}
}