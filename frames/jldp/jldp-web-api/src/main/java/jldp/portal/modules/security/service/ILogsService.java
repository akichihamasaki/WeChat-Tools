package jldp.portal.modules.security.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import jldp.portal.modules.security.model.BaseLogs;
import jldp.portal.modules.security.model.BaseUser;

public interface ILogsService {
	
	void saveBaseLogs(BaseLogs baseLogs);
	/**
	 * insert on logs. date and time dont set
	 * @param baseLogs
	 * @param user
	 */
	void insertBaseLogs(BaseLogs baseLogs,BaseUser user);
	/**
	 * 分页查询所有日志
	 * 
	 * @param pageable
	 * @return
	 */

	Page<BaseLogs> findBaseLogs(Pageable pageable);

	/**
	 * 分页查询所有日志
	 * 
	 * @param startDate
	 * @param endDate
	 * @param nodeId
	 * @param pageable
	 * @return
	 */
	Page<BaseLogs> findBaseLogs(String startDate, String endDate, String nodeId, Pageable pageable);
}
