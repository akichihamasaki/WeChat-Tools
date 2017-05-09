package jldp.portal.modules.security.dao;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import jldp.portal.core.base.test.BaseTestCase;

public class BaseOrganizationTest extends BaseTestCase {
	@Autowired
	@Qualifier("security.organizationRepository")
	OrganizationRepository organizationRepository;

	@Test
	@Transactional
	public void insert() {
		List<String> nodetypes = new ArrayList<String>();
		nodetypes.add("01");
		nodetypes.add("02");
//		List<Organization> list=organizationRepository.findOrganizationByParentIdAndStatusAndNodetypeIn(null,"1",nodetypes);
//		System.out.println(list);
	}
}