package jldp.portal.modules.demo.dao;

import java.util.List;
import java.util.Map;

import org.junit.Test;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import jldp.portal.core.base.test.BaseTestCase;
import jldp.portal.modules.security.model.BaseLogs;
public class BaseLogsMapperTest extends BaseTestCase{
	@Autowired
	@Qualifier("demo.baseLogsMapper")
	BaseLogsMapper mapper;
	@Autowired
	SqlSessionTemplate sqlSessionTemplate;
	@Test
	public void test() {
		BaseLogs baseLogs = new BaseLogs();
		baseLogs.setId("1");
		List<Map<String,Object>> list=mapper.selectBaseLogs(baseLogs);
		System.out.println(list);
		System.out.println(mapper.queryBaseLogs("2","1"));
		list=sqlSessionTemplate.selectList("jldp.portal.modules.demo.dao.BaseLogsMapper.queryBaseLogs","2");
		System.out.println("@@"+list);
		Sort sort = new Sort("OP_CODE","LOG_DATE");
		PageRequest pageable = new PageRequest(0, 1,sort);
		Page<BaseLogs> ls= mapper.selectBaseLogs(baseLogs,pageable);
		System.out.println(ls.getTotalElements()+"::"+ls.getContent());
		Page<BaseLogs> ls2=mapper.findBaseLogs(pageable);
		System.out.println(ls2.getTotalElements());
	}

}
