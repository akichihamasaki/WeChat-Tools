package jldp.portal.modules.security.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import jldp.portal.modules.security.model.BaseRoleMenu;
import jldp.portal.modules.security.model.BaseRoleMenuPK;
@Repository("security.roleMenuRepository")
public interface RoleMenuRepository extends CrudRepository<BaseRoleMenu, BaseRoleMenuPK>{
	
	List<BaseRoleMenu> findByRoleid(String roleid);
	
	List<BaseRoleMenu> findByMenuid(String menuid);
	
	Long deleteByRoleid(String roleid);
	
	void deleteByMenuid(String menuid);
}
