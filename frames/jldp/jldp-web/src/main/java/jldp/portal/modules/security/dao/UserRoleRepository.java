package jldp.portal.modules.security.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import jldp.portal.modules.security.model.BaseUserRole;
import jldp.portal.modules.security.model.BaseUserRolePK;
@Repository("security.userRoleRepository")
public interface UserRoleRepository extends CrudRepository<BaseUserRole, BaseUserRolePK>{
	List<BaseUserRole> findByRoleid(String roleid);
	List<BaseUserRole> findByUserid(String userid);
	Long deleteByUserid(String userid);
	Long deleteByRoleid(String roleid);
}
