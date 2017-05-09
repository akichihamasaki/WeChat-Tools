package jldp.portal.modules.security.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import jldp.portal.modules.security.model.Organization;

@Repository("security.organizationRepository")
public interface OrganizationRepository extends PagingAndSortingRepository<Organization, String> {
	Page<Organization> findAll(Specification<Organization> spec, Pageable pageable); // 分页按条件查询
	
	@Query("select org from Organization org where org.status=?1 and org.nodetype in ?2")
	List<Organization> queryByStatusAndNodetypeIn(String status,List<String> nodetypes);
	
	@Query("select org from Organization org where org.parentid=?1 and org.status=?2 and org.nodetype in ?3 ")
	Page<Organization> queryByParentidAndStatus(String nodeid, String status,List<String> nodetypes, Pageable pageable);
	
	List<Organization> findByParentid(String parentid);
	
	Long countByParentid(String parentid);
	
}