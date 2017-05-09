package jldp.portal.modules.security.action;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import jldp.portal.core.base.action.BaseAction;
import jldp.portal.core.exception.action.GenericActionException;
import jldp.portal.modules.security.model.HelpTypeCode;
import jldp.portal.modules.security.model.HelpTypeCodeMain;
import jldp.portal.modules.security.service.IHelpTypeCodeService;

@RestController
@Api("数据字典接口")
@RequestMapping("api/security/helptypecode")
public class HelpTypeCodeAction extends BaseAction {
	@Autowired
	@Qualifier("security.helpTypeCodeService")
	IHelpTypeCodeService helpTypeCodeService;

	@ApiOperation("获取数据字典分类列表")
	@RequestMapping(value = "/queryHelpTypeCodeMain", method = RequestMethod.GET)
	public Page<HelpTypeCodeMain> queryHelpTypeCodeMain(String typeCode, String typeName, Pageable pageable) {
		return helpTypeCodeService.findByTypeCodeAndTypeName(typeCode, typeName, pageable);
	}

	@ApiOperation("获取数据字典分类信息")
	@RequestMapping(value = "/getHelpTypeCodeMain", method = RequestMethod.GET)
	public HelpTypeCodeMain getHelpTypeCodeMain(String typeCode) {
		return helpTypeCodeService.getHelpTypeCodeMain(typeCode);
	}

	@ApiOperation("新增数据字典分类")
	@RequestMapping(value = "/addHelpTypeCodeMain", method = RequestMethod.POST)
	public HelpTypeCodeMain addHelpTypeCodeMain(@RequestBody HelpTypeCodeMain main) {
		if (StringUtils.isBlank(main.getTypeCode()))
			throw new GenericActionException(1021, "the typecode is must!");

		return helpTypeCodeService.insertHelpTypeCodeMain(main);
	}

	@ApiOperation("修改数据字典分类")
	@RequestMapping(value = "/updateHelpTypeCodeMain", method = RequestMethod.POST)
	public HelpTypeCodeMain updateHelpTypeCodeMain(@RequestBody HelpTypeCodeMain main) {
		if (StringUtils.isBlank(main.getTypeCode()))
			throw new GenericActionException(1021, "the typecode is must!");

		return helpTypeCodeService.updateHelpTypeCodeMain(main);
	}

	@ApiOperation("删除数据字典分类")
	@RequestMapping(value = "/deleteHelpTypeCodeMain", method = RequestMethod.GET)
	public void deleteHelpTypeCodeMain(@RequestParam String typeCode,
			@RequestParam(defaultValue = "false") boolean includeChild) {
		Assert.hasText(typeCode);
		if (!includeChild) {
			List<HelpTypeCode> list = helpTypeCodeService.findByTypeCode(typeCode);
			if (list.size() > 0) {
				throw new GenericActionException(1014, "the typecode have children !");
			}
		}
		helpTypeCodeService.deleteHelpTypeCodeMain(typeCode);
	}

	@ApiOperation("获取全部数据字典列表")
	@RequestMapping(value = "/queryHelpTypeCode", method = RequestMethod.GET)
	public Page<HelpTypeCode> queryHelpTypeCode(Pageable pageable) {
		return helpTypeCodeService.findHelpTypeCode(pageable);
	}

	@ApiOperation("根据多个数据字典分类查询数据字典")
	@RequestMapping(value = "/typecodes/{typeCodes}", method = RequestMethod.GET)
	public Map<String, List<HelpTypeCode>> queryByTypeCodes(@PathVariable("typeCodes") String typeCodes) {
		String[] codes = StringUtils.split(typeCodes, ",");
		Map<String, List<HelpTypeCode>> maps = helpTypeCodeService.findByTypeCodes(codes);

		// Map<String, List<HelpTypeCodeVO>> retMap = new LinkedHashMap<String,
		// List<HelpTypeCodeVO>>();
		// for (String key : maps.keySet()) {
		// List<HelpTypeCode> tempList = maps.get(key);
		// List<HelpTypeCodeVO> voList = new ArrayList<HelpTypeCodeVO>();
		// for (HelpTypeCode type : tempList) {
		// HelpTypeCodeVO vo = typeCodePO2VO(type);
		// voList.add(vo);
		// }
		// retMap.put(key, voList);
		// }

		return maps;
	}

	@ApiOperation("根据一个数据字典分类查询数据字典")
	@RequestMapping(value = "/typecode/{typeCode}", method = RequestMethod.GET)
	public List<HelpTypeCode> queryByTypeCode(@PathVariable("typeCode") String typeCode) {
		List<HelpTypeCode> tempList = helpTypeCodeService.findByTypeCode(typeCode);
		return tempList;

		// List<HelpTypeCodeVO> voList = new ArrayList<HelpTypeCodeVO>();
		// for (HelpTypeCode type : tempList) {
		// HelpTypeCodeVO vo = typeCodePO2VO(type);
		// voList.add(vo);
		// }

		// return voList;
	}

	@ApiOperation("根据数据字典分类获取数据字典列表分页")
	@RequestMapping(value = "/queryHelpTypeCodeByTypeCode", method = RequestMethod.GET)
	public Page<HelpTypeCode> queryHelpTypeCodeByTypeCode(String typeCode, Pageable pageable) {
		return helpTypeCodeService.findByTypeCode(typeCode, pageable);
	}

	@ApiOperation("根据数据字典名称获取数据字典列表")
	@RequestMapping(value = "/queryHelpTypeCodeByMessage", method = RequestMethod.GET)
	public Page<HelpTypeCode> queryHelpTypeCodeByMessage(String message, Pageable pageable) {
		return helpTypeCodeService.findByMessage(message, pageable);
	}

	@ApiOperation("获取数据字典信息")
	@RequestMapping(value = "/getHelpTypeCode", method = RequestMethod.GET)
	public HelpTypeCode getHelpTypeCode(String typeCode, String code) {
		return helpTypeCodeService.getHelpTypeCode(typeCode, code);
	}

	@ApiOperation("新增数据字典")
	@RequestMapping(value = "/addHelpTypeCode", method = RequestMethod.POST)
	public HelpTypeCode addHelpTypeCode(@RequestBody HelpTypeCode type) {
		if (StringUtils.isBlank(type.getCode()) || StringUtils.isBlank(type.getTypeCode()))
			throw new GenericActionException(1022, "the typecode and code is must!");

		return helpTypeCodeService.addHelpTypeCode(type);
	}

	@ApiOperation("修改数据字典")
	@RequestMapping(value = "/updateHelpTypeCode", method = RequestMethod.POST)
	public HelpTypeCode updateHelpTypeCode(@RequestBody HelpTypeCode type) {
		if (StringUtils.isBlank(type.getCode()) || StringUtils.isBlank(type.getTypeCode()))
			throw new GenericActionException(1022, "the typecode and code is must!");

		return helpTypeCodeService.modHelpTypeCode(type);
	}

	@ApiOperation("删除数据字典")
	@RequestMapping(value = "/deleteHelpTypeCode", method = RequestMethod.GET)
	public void deleteHelpTypeCode(String typeCode, String code) {
		helpTypeCodeService.deleteHelpTypeCode(typeCode, code);
	}

	// private HelpTypeCodeVO typeCodePO2VO(HelpTypeCode type) {
	// HelpTypeCodeVO vo = new HelpTypeCodeVO();
	//
	// vo.setCode(type.getCode());
	// vo.setTypeCode(type.getTypeCode());
	// vo.setMessage(type.getMessage());
	// vo.setOrderNo(type.getOrderNo());
	//
	// return vo;
	// }
}