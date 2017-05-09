package jldp.portal.modules.security.dao;

import java.util.Date;

import org.apache.commons.lang.time.DateFormatUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import jldp.portal.core.base.test.BaseTestCase;
//import jldp.portal.modules.commons.service.ICommonsService;
import jldp.portal.modules.security.model.BaseLogs;

public class BaseLogsRepositoryTest extends BaseTestCase {
	@Autowired
	@Qualifier("security.logsRepository")
	LogsRepository baseLogsRepository;
//	@Autowired
//	@Qualifier("commons.commonsService")
//	ICommonsService commonsService;
	// @Test
	public void insert() {
		// for(int i=0;i<1000;i++){
		BaseLogs logs = new BaseLogs();
		logs.setId("999");
		Date date = new Date();
		logs.setLogDate(DateFormatUtils.ISO_DATE_FORMAT.format(date));
		logs.setLogTime(DateFormatUtils.ISO_TIME_TIME_ZONE_FORMAT.format(date));
		logs.setOpCode("testCode");
		logs.setOpType("testType");
		baseLogsRepository.save(logs);
		// }
	}
	
	@Test
	public void test() {
		//commonsService.getNextSeqVal("aaa", "bbb", 1);
		//System.out.println("###"+commonsService.getDBDate());
		

	}

	public void selectLogs(final String startDate, final String endDate) {
//		Pageable pageable = new PageRequest(0, 1);
//		Page<BaseLogsVO> page = baseLogsRepository.findLogs(new Specification<BaseLogs>() {
//			public Predicate toPredicate(Root<BaseLogs> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
//
//				List<Predicate> list = new ArrayList<>();
//				if (StringUtils.isNotBlank(startDate) && StringUtils.isNotBlank(endDate))
//					list.add(cb.between(root.get("logDate").as(String.class), startDate, endDate));
//
//				if (StringUtils.isNotBlank(startDate) && StringUtils.isBlank(endDate))
//					list.add(cb.equal(root.get("logDate").as(String.class), startDate));
//
//				if (StringUtils.isBlank(startDate) && StringUtils.isBlank(endDate))
//					list.add(cb.equal(root.get("logDate").as(String.class),
//							DateFormatUtils.ISO_DATE_FORMAT.format(new Date())));
//
//				query.orderBy(cb.desc(root.get("logDate")), cb.desc(root.get("logTime")));
//
//				Predicate[] predicates = new Predicate[list.size()];
//				predicates = list.toArray(predicates);
//				return cb.and(predicates);
//			}
//		}, pageable);
//
//		System.out.println(page.getContent().size());
	}

}
