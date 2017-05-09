package jldp.portal.modules.security.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import jldp.portal.modules.security.model.Employee;
import jldp.portal.modules.security.model.Organization;
import jldp.portal.modules.security.model.OrganizationDto;

public interface IOrganizationService {
	/**
	 * 分页查询所有组织机构
	 * 
	 * @param pageable
	 * @return
	 */
	Page<Organization> findOrganization(final Organization org, Pageable pageable);

	/**
	 * 获取组织机构信息
	 * 
	 * @param nodeid
	 * @return
	 */
	Organization getOrganization(String nodeid);

	/**
	 * 保存组织机构
	 * 
	 * @param org
	 * @return
	 */
	Organization saveOrganization(Organization org);

	/**
	 * 修改组织机构
	 * 
	 * @param org
	 * @return
	 */
	Organization updateOrganization(Organization org);

	/**
	 * 删除组织机构
	 * 
	 * @param org
	 * @return
	 */
	void deleteOrganization(String nodeid);

	/**
	 * 修改组织机构状态
	 * 
	 * @param status
	 * @param nodeId
	 * @return
	 */
	Organization updateOrganizationStatus(String status, String nodeId);

	/**
	 * 修改组织机构treelist
	 * 
	 * @param status
	 * @param nodeId
	 * @return
	 */
	List<OrganizationDto> queryOrgTreeGird();

	/**
	 * 获取机构下的员工列表
	 * 
	 * @param pageable
	 * @param parentid
	 * @return
	 */
	Page<Organization> queryEmployeeByParentid(String parentid,List<String> nodetypes, Pageable pageable);

	/**
	 * 修改当前用户的用户信息
	 * 
	 * @param emp
	 * @param nodeId
	 * @return
	 */
	Organization updateCurrentEmployee(Employee emp, String nodeId);

	Long queryCountByParentid(String parentid);
}