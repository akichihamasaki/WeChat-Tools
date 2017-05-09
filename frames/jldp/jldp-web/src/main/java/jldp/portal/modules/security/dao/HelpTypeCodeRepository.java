package jldp.portal.modules.security.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import jldp.portal.modules.security.model.HelpTypeCode;
import jldp.portal.modules.security.model.HelpTypeCodePK;

@Repository("security.helpTypeCodeRepository")
public interface HelpTypeCodeRepository extends PagingAndSortingRepository<HelpTypeCode, HelpTypeCodePK> {
	@Query("select hyc from HelpTypeCode hyc where hyc.typeCode = ?1 and hyc.code = ?2 ")
	HelpTypeCode getHelpTypeCode(String typeCode, String code);
	
	@Query("select hyc from HelpTypeCode hyc where hyc.typeCode = ?1 order by hyc.orderNo asc ")
	Page<HelpTypeCode> findByTypeCode(String typeCode, Pageable pageable);

	@Query("select hyc from HelpTypeCode hyc where hyc.typeCode = ?1 order by hyc.orderNo asc")
	List<HelpTypeCode> findByTypeCode(String typeCode);

	Page<HelpTypeCode> findByMessage(String message, Pageable pageable);
	
	Long countByTypeCode(String typeCode);
	
	Long deleteByTypeCode(String typeCode);
}