package jldp.portal.modules.security.action;

import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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
import jldp.portal.framework.core.authentication.annotation.Security;
import jldp.portal.modules.security.model.BaseRole;
import jldp.portal.modules.security.model.BaseRoleDto;
import jldp.portal.modules.security.service.IRoleService;

@RestController
@Api("角色表接口")
@RequestMapping("api/security/role")
public class BaseRoleAction extends BaseAction {
	@Autowired
	@Qualifier("security.roleService")
	IRoleService roleService;

	@ApiOperation("获取全部角色分页")
	@RequestMapping(value = "/queryRole", method = RequestMethod.GET)
	public Page<BaseRole> queryRole(String rolename, Pageable pageable) {
		return roleService.findBaseRole(rolename, pageable);
	}

	@ApiOperation("获取全部角色")
	@RequestMapping(value = "/queryAllRole", method = RequestMethod.GET)
	public List<BaseRole> queryAllRole(String rolename) {
		return roleService.findAllBaseRole(rolename);
	}
	@ApiOperation("获取全部角色,并标记改用户拥有的角色")
	@RequestMapping(value = "/queryAllRoleByUserid", method = RequestMethod.GET)
	public List<BaseRoleDto> queryAllRoleByUserid(@RequestParam String userid,String rolename) {
		return roleService.queryBaseRoleByUserid(userid,rolename);
	}
	@ApiOperation("获取角色")
	@RequestMapping(value = "/getRole", method = RequestMethod.GET)
	public BaseRole getRole(String roleid) {
		return roleService.getBaseRole(roleid);
	}

	@ApiOperation("保存角色")
	@RequestMapping(value = "/saveRole", method = RequestMethod.POST)
	@Security
	public BaseRole saveRole(@CurrentUser JldpUser auth,
			@RequestBody BaseRole role) {
		if (StringUtils.isBlank(role.getRoleid())){
			role.setCreator(auth.getUserid());
			role.setCreateTime(new Date());
		}
		return roleService.saveBaseRole(role);
	}

	@ApiOperation("保存角色菜单")
	@RequestMapping(value = "/saveRoleMenu", method = RequestMethod.POST)
	@Security
	public void saveRoleMenu(@RequestBody BaseRoleDto baseRoleDto,@CurrentUser JldpUser jldpUser) {
		BaseRole role = roleService.getBaseRole(baseRoleDto.getRoleid());
		if(role==null){
			throw new GenericActionException(1010, "the role not exist!");
		}
	
		roleService.saveRoleMenu(baseRoleDto, jldpUser.getUserid());
	}

	@ApiOperation("删除角色")
	@RequestMapping(value = "/deleteRole", method = RequestMethod.GET)
	public void deleteRole(@RequestParam String roleid) {
		BaseRole role = roleService.getBaseRole(roleid);
		if(role==null){
			throw new GenericActionException(1010, "the role not exist!");
		}
		roleService.deleteBaseRole(roleid);
	}
}