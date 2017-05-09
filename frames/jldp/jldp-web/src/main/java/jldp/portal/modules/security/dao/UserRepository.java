package jldp.portal.modules.security.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import jldp.portal.modules.security.model.BaseUser;

@Repository("security.userRepository")
public interface UserRepository extends PagingAndSortingRepository<BaseUser, String> {
	
	BaseUser findByUsername(String username);

	BaseUser findByUserid(String userid);
	
	List<BaseUser> findByEmployeeNodeid(String nodeid);

	Page<BaseUser> findByUsername(String username, Pageable pageable);

	@Query("select new jldp.portal.modules.security.model.BaseUser(bu,e) from Employee e LEFT JOIN BaseUser bu on bu.employee.nodeid = e.nodeid where e.status='1'")
	Page<BaseUser> findUsers(Pageable pageable);

	@Query("select bu from Employee e LEFT JOIN BaseUser bu on bu.employee.nodeid = e.nodeid where e.status='1' and bu.username like ?1")
	Page<BaseUser> findUsersByUsername(String username, Pageable pageable);

	@Query("select bu from Employee e LEFT JOIN BaseUser bu on bu.employee.nodeid = e.nodeid where e.status='1' and e.nodename like ?1")
	Page<BaseUser> findUsersByNodename(String nodename, Pageable pageable);

	@Query("select bu from Employee e LEFT JOIN BaseUser bu on bu.employee.nodeid = e.nodeid where e.status='1' and e.nodename like ?1 and bu.username like ?2")
	Page<BaseUser> findUsersByNodenameAndUsername(String nodename, String username, Pageable pageable);
}