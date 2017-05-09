package jldp.portal.modules.security.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import jldp.portal.modules.security.model.HelpTypeCode;
import jldp.portal.modules.security.model.HelpTypeCodeMain;

public interface IHelpTypeCodeService {
	/**
	 * 分页查询所有数据字典分类
	 * 
	 * @param pageable
	 * @return
	 */
	Page<HelpTypeCodeMain> findHelpTypeCodeMain(Pageable pageable);

	/**
	 * 分页查询所有数据字典分类
	 * 
	 * @param pageable
	 * @return
	 */
	Page<HelpTypeCodeMain> findByTypeCodeAndTypeName(String typeCode, String typeName, Pageable pageable);

	/**
	 * 查询数据字典分类信息
	 * 
	 * @param nodeId
	 * @return
	 */
	HelpTypeCodeMain getHelpTypeCodeMain(String typeCode);

	/**
	 * 新增数据字典分类
	 * 
	 * @param helpTypeCodeMain
	 * @return
	 */
	HelpTypeCodeMain insertHelpTypeCodeMain(HelpTypeCodeMain helpTypeCodeMain);

	/**
	 * 修改数据字典分类
	 * 
	 * @param helpTypeCodeMain
	 * @return
	 */
	HelpTypeCodeMain updateHelpTypeCodeMain(HelpTypeCodeMain helpTypeCodeMain);

	/**
	 * 删除数据字典分类
	 * 
	 * @param helpTypeCodeMain
	 * @return
	 */
	void deleteHelpTypeCodeMain(String typeCode);

	/**
	 * 判断数据字典分类是否存在
	 * 
	 * @param typeCode
	 * @return
	 */
	boolean isExistTypeCode(HelpTypeCodeMain main);

	/**
	 * 分页查询所有数据字典分类
	 * 
	 * @param pageable
	 * @return
	 */
	Page<HelpTypeCode> findHelpTypeCode(Pageable pageable);

	/**
	 * 根据数据字典分类分页查询所有数据字典
	 * 
	 * @param pageable
	 * @return
	 */
	Page<HelpTypeCode> findByTypeCode(String typeCode, Pageable pageable);

	/**
	 * 根据数据字典名称分页查询所有数据字典
	 * 
	 * @param pageable
	 * @return
	 */
	Page<HelpTypeCode> findByMessage(String message, Pageable pageable);

	/**
	 * 获取数据字典分类信息
	 * 
	 * @param typeCode
	 * @param code
	 * @return
	 */
	HelpTypeCode getHelpTypeCode(String typeCode, String code);

	/**
	 * 新增数据字典分类
	 * 
	 * @param helpTypeCode
	 * @return
	 */
	HelpTypeCode addHelpTypeCode(HelpTypeCode helpTypeCode);

	/**
	 * 修改数据字典分类
	 * 
	 * @param helpTypeCode
	 * @return
	 */
	HelpTypeCode modHelpTypeCode(HelpTypeCode helpTypeCode);

	/**
	 * 删除数据字典分类
	 * 
	 * @param helpTypeCode
	 * @return
	 */
	void deleteHelpTypeCode(String typeCode, String code);

	/**
	 * 根据一个数据字典分类查询数据字典
	 * 
	 * @param typeCode
	 * @return
	 */
	List<HelpTypeCode> findByTypeCode(String typeCode);

	/**
	 * 根据多个数据字典分类查询数据字典
	 * 
	 * @param typeCodes
	 * @return
	 */
	Map<String, List<HelpTypeCode>> findByTypeCodes(String[] typeCodes);
}