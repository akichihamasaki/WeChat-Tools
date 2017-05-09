package jldp.portal.modules.security.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

import jldp.portal.core.base.test.BaseTestCase;
import jldp.portal.modules.security.model.BaseRoleMenu;
import jldp.portal.modules.security.model.BaseRoleMenuPK;
import jldp.portal.modules.security.service.IMenuService;

public class BaseMenuRepositoryTest extends BaseTestCase {
	@Autowired
	@Qualifier("security.menuService")
	IMenuService menuService;
	@Autowired
	@Qualifier("security.menuRepository")
	MenuRepository menuRepository;
	@Autowired
	@Qualifier("security.roleMenuRepository")
	RoleMenuRepository roleMenuRepository;
	@Autowired
	@Qualifier("security.roleRepository")
	RoleRepository roleRepository;
    @Autowired
	private TransactionTemplate transactionTemplate;
	@Autowired
	List<HttpMessageConverter<?>> messageConverters;
	public void transaction(){
		transactionTemplate.execute(new TransactionCallbackWithoutResult() {
			protected void doInTransactionWithoutResult(TransactionStatus status) {
				query();
			}
		});		
	}
//	@Test
//	public void save(){
//		BaseRoleMenu rm1 = new BaseRoleMenu("1","2");
//		roleMenuRepository.save(rm1);
//	}
	@Test
	@Transactional
	@Rollback(false)
	public void query(){
		System.out.println(messageConverters);
		List<?> list = menuRepository.queryMenuByRoleid("566cb4bf-e93c-4e53-9247-1f480a5e424c");
		System.out.println(list);
		BaseRoleMenuPK pk = new BaseRoleMenuPK("566cb4bf-e93c-4e53-9247-1f480a5e424c","e4aa3a4a-1692-4696-81e0-449cab58217d");
		BaseRoleMenu rm =roleMenuRepository.findOne(pk);
		System.out.println(rm);
		list = roleMenuRepository.findByRoleid("566cb4bf-e93c-4e53-9247-1f480a5e424c");
		System.out.println(list);
		
//		BaseRoleMenu rm1 = new BaseRoleMenu("1","2");
		//roleMenuRepository.save(rm1);
//		roleMenuRepository.deleteByMenuid("2");
//		Page<?> page= roleRepository.queryAllByUserid("d248373e-53d5-459c-a1ce-42bc1888ff17");
//		System.out.println(page);
	}
}