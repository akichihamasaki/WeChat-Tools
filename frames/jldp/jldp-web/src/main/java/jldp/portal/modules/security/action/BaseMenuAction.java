package jldp.portal.modules.security.action;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import jldp.portal.core.base.action.BaseAction;
import jldp.portal.core.exception.action.GenericActionException;
import jldp.portal.framework.core.authentication.annotation.Security;
import jldp.portal.modules.security.model.BaseMenu;
import jldp.portal.modules.security.model.BaseMenuDto;
import jldp.portal.modules.security.service.IMenuService;

@RestController
@Api(tags={"菜单管理","BaseMenuAction"})
@RequestMapping("api/security/menu")
public class BaseMenuAction extends BaseAction {
	@Autowired
	@Qualifier("security.menuService")
	IMenuService menuService;

//	@ApiOperation("获取菜单列表")
//	@RequestMapping(value = "/queryBaseMenu", method = RequestMethod.GET)
//	public Page<BaseMenu> queryBaseMenu(Pageable pageable) {
//		return menuService.findBaseMenu(pageable);
//	}

	@ApiOperation("获取全部菜单树")
	@RequestMapping(value = "/queryAllBaseMenuTree", method = RequestMethod.GET)
	public List<BaseMenuDto> queryAllBaseMenuTree() {
		return menuService.queryAllBaseMenuTree();
	}

	@ApiOperation("获取全部菜单列表")
	@RequestMapping(value = "/queryAllBaseMenu", method = RequestMethod.GET)
	public List<BaseMenu> queryAllBaseMenu() {
		return menuService.queryAllBaseMenu();
	}

	@ApiOperation("查询所有菜单，按treegrid结构返回")
	@RequestMapping(value = "/queryMenuTreeGird", method = RequestMethod.GET)
	public List<BaseMenuDto> queryMenuTreeGird(@RequestParam String roleid) {
		return menuService.queryMenuTreeGridByRoleid(roleid);
	}

	@ApiOperation("根据用户获取已分配的菜单树")
	@ApiImplicitParams(
			@ApiImplicitParam(paramType="query",name="userId",dataType="String",required=true,value="用户ID")
	)
	@RequestMapping(value = "/queryMenuByUserId", method = RequestMethod.GET)
	public List<BaseMenu> queryMenuByUserId(@RequestParam String userid) {
		return menuService.queryMenu(userid);
	}

	@ApiOperation("获取菜单信息")
	@RequestMapping(value = "/getBaseMenu", method = RequestMethod.GET)
	public BaseMenu getBaseMenu(String menuId) {
		return menuService.getBaseMenu(menuId);
	}

	@ApiOperation("新增菜单")
	@RequestMapping(value = "/addBaseMenu", method = RequestMethod.POST)
	public BaseMenu addBaseMenu(@RequestBody BaseMenu menu) {
		// 如果URL不为空，表示该节点为叶子，这时CODE不能为空
//		if (StringUtils.isBlank(menu.getCode()) && StringUtils.isNotBlank(menu.getUrl()))
//			throw new GenericActionException(1011, "url not null,the code is must!");

		if (menuService.isExistMenuCode(menu))
			throw new GenericActionException(1012, "code:" + menu.getCode() + ",is exist!");

		return menuService.insertBaseMenu(menu);
	}

	@ApiOperation("修改菜单")
	@RequestMapping(value = "/updateBaseMenu", method = RequestMethod.POST)
	@Security
	public BaseMenu updateBaseMenu(@RequestBody BaseMenu menu) {
		
		if (StringUtils.isNotBlank(menu.getMenuid())) {
			BaseMenu bm = menuService.getBaseMenu(menu.getMenuid());
			if (bm == null)
				throw new GenericActionException(1010, "the menu not exist!");
		} else
			throw new GenericActionException(1010, "the menu not exist!");
		
//		if (StringUtils.isBlank(menu.getCode()) && StringUtils.isNotBlank(menu.getUrl()))
//			throw new GenericActionException(1011, "url not null,the code is must!");

		if (menuService.isExistMenuCode(menu))
			throw new GenericActionException(1012, "code:" + menu.getCode() + ",is exist!");

		return menuService.updateBaseMenu(menu);
	}

	@ApiOperation("删除菜单")
	@RequestMapping(value = "/deleteBaseMenu", method = RequestMethod.GET)
	public void deleteBaseMenu(@RequestParam String menuid,@RequestParam(defaultValue="false") boolean includeChild) {
		BaseMenu bm = menuService.getBaseMenu(menuid);
		if(bm == null)
			throw new GenericActionException(1010, "the menu not exist!");
		List<BaseMenu> children = menuService.findByParentid(bm.getMenuid());
		if(!children.isEmpty() && !includeChild){
			throw new GenericActionException(1014, "code:" + bm.getCode() + ",chlidren is exist!");
		}
		menuService.deleteBaseMenu(menuid);
	}

}