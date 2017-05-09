package jldp.portal.modules.security.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import jldp.portal.modules.security.model.BaseLogs;

@Repository("security.logsRepository")
public interface LogsRepository extends PagingAndSortingRepository<BaseLogs, String> {

	Page<BaseLogs> findAll(Specification<BaseLogs> spec, Pageable pageable);

}