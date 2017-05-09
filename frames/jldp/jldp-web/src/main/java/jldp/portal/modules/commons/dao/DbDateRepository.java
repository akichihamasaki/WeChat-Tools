package jldp.portal.modules.commons.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jldp.portal.modules.commons.model.DbDate;
@Repository("commons.dbDateRepository")
public interface DbDateRepository extends JpaRepository<DbDate,String>{
	
	@Override
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	List<DbDate> findAll();

	/**
	 * 获取数据库时间
	 * 
	 * @return
	 */
	@Query("select CURRENT_TIMESTAMP from DbDate")
	Date selectDbSysDate();
}