package jldp.portal.modules.security.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jldp.portal.modules.security.dao.LogsRepository;
import jldp.portal.modules.security.model.BaseLogs;
import jldp.portal.modules.security.model.BaseUser;
import jldp.portal.modules.security.service.ILogsService;

@Service("security.LogsService")
public class LogsServiceImpl implements ILogsService {
	@Autowired
	@Qualifier("security.logsRepository")
	private LogsRepository logsRepository;
	
	public void saveBaseLogs(BaseLogs baseLogs){		
		logsRepository.save(baseLogs);
	}
	/**
	 * insert on logs. date and time dont set
	 * @param baseLogs
	 * @param user
	 */
	public void insertBaseLogs(BaseLogs baseLogs,BaseUser user){
		Date date = new Date();
		baseLogs.setLogDate(DateFormatUtils.ISO_DATE_FORMAT.format(date));
		baseLogs.setLogTime(DateFormatUtils.ISO_TIME_NO_T_FORMAT.format(date));
		if(user!=null){
			baseLogs.setOrganization(user.getEmployee());
		}
		saveBaseLogs(baseLogs);
	}
	
	public Page<BaseLogs> findBaseLogs(Pageable pageable) {
		return logsRepository.findAll(pageable);
	}

	public Page<BaseLogs> findBaseLogs(final String startDate, final String endDate, final String nodeId,
			Pageable pageable) {

		Page<BaseLogs> page = logsRepository.findAll(new Specification<BaseLogs>() {
			public Predicate toPredicate(Root<BaseLogs> root, CriteriaQuery<?> query, CriteriaBuilder cb) {

				List<Predicate> list = new ArrayList<>();
				if (StringUtils.isNotBlank(startDate) && StringUtils.isNotBlank(endDate))
					list.add(cb.between(root.get("logDate").as(String.class), startDate, endDate));

				if (StringUtils.isNotBlank(startDate) && StringUtils.isBlank(endDate))
					list.add(cb.equal(root.get("logDate").as(String.class), startDate));

				if (StringUtils.isBlank(startDate) && StringUtils.isBlank(endDate))
					list.add(cb.equal(root.get("logDate").as(String.class), DateFormatUtils.ISO_DATE_FORMAT.format(new Date())));

				if (StringUtils.isNotBlank(nodeId))
					list.add(cb.equal(root.get("nodeId").as(String.class), nodeId));

				query.orderBy(cb.desc(root.get("logDate")), cb.desc(root.get("logTime")));

				Predicate[] predicates = new Predicate[list.size()];
				predicates = list.toArray(predicates);
				return cb.and(predicates);
			}
		}, pageable);

		return page;
	}
}
