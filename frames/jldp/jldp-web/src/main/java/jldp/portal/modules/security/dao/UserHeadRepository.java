package jldp.portal.modules.security.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import jldp.portal.modules.security.model.UserHead;

@Repository("security.userHeadRepository")
public interface UserHeadRepository extends CrudRepository<UserHead, String> {
	Long deleteByUserid(String userid);
}