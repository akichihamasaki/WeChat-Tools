package jldp.portal.modules.security.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import jldp.portal.modules.security.model.BaseRole;
import jldp.portal.modules.security.model.BaseRoleDto;

public interface IRoleService {
	/**
	 * 分页查询所有角色
	 * 
	 * @param pageable
	 * @return
	 */
	Page<BaseRole> findBaseRole(String roleName,Pageable pageable);

	/**
	 * 查询所有角色不分页
	 * 
	 * @param pageable
	 * @return
	 */
	List<BaseRole> findAllBaseRole(String rolename);

	/**
	 * 查询角色信息
	 * 
	 * @param roleid
	 * @return
	 */
	BaseRole getBaseRole(String roleid);

	/**
	 * 保存角色
	 * 
	 * @param baseRole
	 * @return
	 */
	BaseRole saveBaseRole(BaseRole baseRole);

	/**
	 * 保存角色菜单
	 * 
	 * @param baseRole
	 * @return
	 */
	void saveRoleMenu(BaseRoleDto role,String userid);

	/**
	 * 删除角色
	 * 
	 * @param roleid
	 * @return
	 */
	void deleteBaseRole(String roleid);
	
	List<BaseRole> queryBaseRoleByUserid(String userid);

	List<BaseRoleDto> queryBaseRoleByUserid(String userid, String rolename);
}