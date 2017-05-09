package jldp.portal.modules.security.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import jldp.portal.modules.security.model.BaseMenu;

@Repository("security.menuRepository")
public interface MenuRepository extends PagingAndSortingRepository<BaseMenu, String> {
	
	/**
	 * 获取用户所拥有的菜单
	 * @param userId
	 * @return
	 */
	@Query("select m from BaseMenu m left join BaseRoleMenu rm on rm.menuid=m.menuid left join BaseRole r on r.roleid=rm.roleid left join BaseUserRole ur on ur.roleid=r.roleid left join BaseUser u on u.userid=ur.userid where u.userid=?1")
	List<BaseMenu> queryMenuByUserId(String userId);

	List<BaseMenu> findAll();
	
	List<BaseMenu> findByCode(String code);
	
	List<BaseMenu> findByParentid(String parentid);
	@Query("select m,r from BaseMenu m left join BaseRoleMenu rm on rm.menuid=m.menuid and rm.roleid=?1 left join BaseRole r on r.roleid=rm.roleid")
	List<?> queryMenuByRoleid(String roleid);
}