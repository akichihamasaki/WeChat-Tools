package jldp.portal.modules.security.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import jldp.portal.modules.security.model.HelpTypeCodeMain;

@Repository("security.helpTypeCodeMainRepository")
public interface HelpTypeCodeMainRepository extends PagingAndSortingRepository<HelpTypeCodeMain, String> {
	Page<HelpTypeCodeMain> findByTypeCodeAndTypeNameLikeOrderByOrderNoDesc(String typeCode, String typeName, Pageable pageable);

	Page<HelpTypeCodeMain> findByTypeCodeOrderByOrderNoDesc(String typeCode, Pageable pageable);

	Page<HelpTypeCodeMain> findByTypeNameLikeOrderByOrderNoDesc(String typeName, Pageable pageable);
	
	List<HelpTypeCodeMain> findByTypeCode(String typeCode);
}