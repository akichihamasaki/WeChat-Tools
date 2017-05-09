package jldp.portal.modules.security.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import jldp.portal.modules.security.model.BaseRole;

@Repository("security.roleRepository")
public interface RoleRepository extends PagingAndSortingRepository<BaseRole, String> {
	List<BaseRole> findAll();

	List<BaseRole> findByRolenameLike(String rolename);

	Page<BaseRole> findByRolenameLike(String rolename, Pageable pageable);
	@Query("select r from BaseRole r left join BaseUserRole ur on ur.roleid=r.roleid left join BaseUser u on u.userid=ur.userid where u.userid=?1")
	List<BaseRole> queryByUserid(String userid);
	
	@Query("select r, ur,u from BaseRole r left join BaseUserRole ur on ur.roleid=r.roleid and ur.userid=?1 left join BaseUser u on u.userid=ur.userid where r.rolename like ?2 order by ( case when u.userid is null then 0 else 1 end ) desc")
	List<?> queryAllByUserid(String userid,String rolename);
}