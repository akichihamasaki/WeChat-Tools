package jldp.portal.modules.security.action;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import jldp.portal.core.base.action.BaseAction;
import jldp.portal.core.exception.action.GenericActionException;
import jldp.portal.framework.core.authentication.JldpUser;
import jldp.portal.framework.core.authentication.annotation.CurrentUser;
import jldp.portal.modules.security.model.BaseUser;
import jldp.portal.modules.security.model.Branch;
import jldp.portal.modules.security.model.Department;
import jldp.portal.modules.security.model.Employee;
import jldp.portal.modules.security.model.Organization;
import jldp.portal.modules.security.model.OrganizationDto;
import jldp.portal.modules.security.service.IOrganizationService;
import jldp.portal.modules.security.service.IUserService;

@RestController
@Api("组织机构表接口")
@RequestMapping("api/security/organization")
public class OrganizationAction extends BaseAction {
	@Autowired
	@Qualifier("security.organizationService")
	IOrganizationService organizationService;

	@Autowired
	@Qualifier("security.userService")
	IUserService userService;

	@ApiOperation("获取组织机构")
	@RequestMapping(value = "/queryOrganization", method = RequestMethod.GET)
	public List<OrganizationDto> queryOrganization() {
		return organizationService.queryOrgTreeGird();
	}

	@ApiOperation("获取机构下的员工")
	@RequestMapping(value = "/queryEmployee", method = RequestMethod.GET)
	public Page<Employee> queryEmployee(String nodeid, Pageable pageable) {
		List<String> nodetypes = new ArrayList<String>();
		nodetypes.add("03");
		Page<Organization> p = organizationService.queryEmployeeByParentid(nodeid, nodetypes, pageable);
		return p.map(new Converter<Organization, Employee>() {
			public Employee convert(Organization source) {
				return (Employee) source;
			}
		});
	}

	@ApiOperation("获取组织机构信息")
	@RequestMapping(value = "/getOrganization", method = RequestMethod.GET)
	public Organization getOrganization(String nodeid) {
		Organization org = organizationService.getOrganization(nodeid);

		if ("01".equals(org.getNodetype()))
			return (Branch) org;
		else if ("02".equals(org.getNodetype()))
			return (Department) org;
		else if ("03".equals(org.getNodetype()))
			return (Employee) org;
		else
			throw new GenericActionException(1003, "nodeId :" + nodeid + ",is not exist!");
	}

	@ApiOperation("新增机构")
	@RequestMapping(value = "/saveBranch", method = RequestMethod.POST)
	public Branch saveBranch(@RequestBody Branch branch) {
		return (Branch) organizationService.saveOrganization(branch);
	}

	@ApiOperation("新增部门")
	@RequestMapping(value = "/saveDepartment", method = RequestMethod.POST)
	public Department saveDepartment(@RequestBody Department dep) {
		return (Department) organizationService.saveOrganization(dep);
	}

	@ApiOperation("修改当前用户的用户信息")
	@RequestMapping(value = "/saveCurrentEmployee", method = RequestMethod.POST)
	public Employee saveCurrentEmployee(@CurrentUser JldpUser auth, @RequestBody Employee emp) {
		BaseUser user = userService.getBaseUser(auth.getUserid());

		return (Employee) organizationService.updateCurrentEmployee(emp, user.getEmployee().getNodeid());
	}

	@ApiOperation("新增员工")
	@RequestMapping(value = "/saveEmployee", method = RequestMethod.POST)
	public Employee saveEmployee(@RequestBody Employee emp) {
		return (Employee) organizationService.saveOrganization(emp);
	}

	@ApiOperation("删除组织机构")
	@RequestMapping(value = "/deleteOrganization", method = RequestMethod.GET)
	public void deleteOrganization(@RequestParam String nodeid,
			@RequestParam(defaultValue = "false") boolean includeChild) {
		// organizationService.updateOrganizationStatus("0", nodeid);
		if (!includeChild) {
			Long childrenCnt = organizationService.queryCountByParentid(nodeid);
			if (childrenCnt > 0) {
				throw new GenericActionException(1014, "nodeid :" + nodeid + " children is exist!");
			}
		}
		organizationService.deleteOrganization(nodeid);
	}
}