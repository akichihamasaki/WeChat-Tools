package jldp.portal.modules.commons.dao;

import javax.persistence.LockModeType;

import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import jldp.portal.modules.commons.model.SeqGen;

@Repository("commons.seqGenRepository")
public interface SeqGenRepository extends PagingAndSortingRepository<SeqGen, String> {

	@Lock(value = LockModeType.PESSIMISTIC_WRITE)
	@Query(value = "select sg from SeqGen sg where sg.id = ?1")
	public SeqGen findSeqForUpdate(String id);
}