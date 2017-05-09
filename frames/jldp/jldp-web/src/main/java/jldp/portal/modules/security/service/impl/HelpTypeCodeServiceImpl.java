package jldp.portal.modules.security.service.impl;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.transaction.Transactional;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jldp.portal.modules.security.dao.HelpTypeCodeMainRepository;
import jldp.portal.modules.security.dao.HelpTypeCodeRepository;
import jldp.portal.modules.security.model.HelpTypeCode;
import jldp.portal.modules.security.model.HelpTypeCodeMain;
import jldp.portal.modules.security.model.HelpTypeCodePK;
import jldp.portal.modules.security.service.IHelpTypeCodeService;

@Service("security.helpTypeCodeService")
public class HelpTypeCodeServiceImpl implements IHelpTypeCodeService {
	@Autowired
	@Qualifier("security.helpTypeCodeRepository")
	private HelpTypeCodeRepository helpTypeCodeRepository;

	@Autowired
	@Qualifier("security.helpTypeCodeMainRepository")
	private HelpTypeCodeMainRepository helpTypeCodeMainRepository;

	public Page<HelpTypeCode> findHelpTypeCode(Pageable pageable) {
		return helpTypeCodeRepository.findAll(pageable);
	}

	public Page<HelpTypeCode> findByTypeCode(String typeCode, Pageable pageable) {
		return helpTypeCodeRepository.findByTypeCode(typeCode, pageable);
	}

	public Page<HelpTypeCode> findByMessage(String message, Pageable pageable) {
		if (StringUtils.isBlank(message)) 
			return helpTypeCodeRepository.findAll(pageable);
		else 
			return helpTypeCodeRepository.findByMessage(message, pageable);
	}

	public HelpTypeCode getHelpTypeCode(String typeCode, String code) {
		return helpTypeCodeRepository.getHelpTypeCode(typeCode, code);
	}

	public HelpTypeCode addHelpTypeCode(HelpTypeCode helpTypeCode) {
		return helpTypeCodeRepository.save(helpTypeCode);
	}

	public HelpTypeCode modHelpTypeCode(HelpTypeCode helpTypeCode) {
		return helpTypeCodeRepository.save(helpTypeCode);
	}

	public void deleteHelpTypeCode(String typeCode, String code) {
		HelpTypeCodePK pk = new HelpTypeCodePK();
		pk.setCode(code);
		pk.setTypeCode(typeCode);

		helpTypeCodeRepository.delete(pk);
	}

	public Page<HelpTypeCodeMain> findHelpTypeCodeMain(Pageable pageable) {
		return helpTypeCodeMainRepository.findAll(pageable);
	}

	public Page<HelpTypeCodeMain> findByTypeCodeAndTypeName(String typeCode, String typeName, Pageable pageable) {
		if (StringUtils.isNotBlank(typeCode) && StringUtils.isNotBlank(typeName))
			return helpTypeCodeMainRepository.findByTypeCodeAndTypeNameLikeOrderByOrderNoDesc(typeCode,
					"%" + typeName + "%", pageable);
		else {
			if (StringUtils.isNotBlank(typeCode))
				return helpTypeCodeMainRepository.findByTypeCodeOrderByOrderNoDesc(typeCode, pageable);
			else if (StringUtils.isNotBlank(typeName))
				return helpTypeCodeMainRepository.findByTypeNameLikeOrderByOrderNoDesc("%" + typeName + "%", pageable);
			else
				return helpTypeCodeMainRepository.findAll(pageable);
		}
	}

	public HelpTypeCodeMain getHelpTypeCodeMain(String typeCode) {
		return helpTypeCodeMainRepository.findOne(typeCode);
	}

	public HelpTypeCodeMain insertHelpTypeCodeMain(HelpTypeCodeMain helpTypeCodeMain) {
		return helpTypeCodeMainRepository.save(helpTypeCodeMain);
	}

	public HelpTypeCodeMain updateHelpTypeCodeMain(HelpTypeCodeMain helpTypeCodeMain) {
		return helpTypeCodeMainRepository.save(helpTypeCodeMain);
	}
	@Transactional
	public void deleteHelpTypeCodeMain(String typeCode) {
		helpTypeCodeRepository.deleteByTypeCode(typeCode);
		helpTypeCodeMainRepository.delete(typeCode);
	}

	public boolean isExistTypeCode(HelpTypeCodeMain main) {
		List<HelpTypeCodeMain> list = helpTypeCodeMainRepository.findByTypeCode(main.getTypeCode());

		if (list == null || list.size() == 0)// code不存在
			return false;
		else if (list.size() == 1) {
			if (StringUtils.isNotBlank(main.getTypeCode()) && main.getTypeCode().equals(list.get(0).getTypeCode()))
				return false;
			else
				return true;
		} else
			return true;
	}

	public List<HelpTypeCode> findByTypeCode(String typeCode) {
		List<HelpTypeCode> list = helpTypeCodeRepository.findByTypeCode(typeCode);

		return list;
	}

	public Map<String, List<HelpTypeCode>> findByTypeCodes(String[] typeCode) {
		Map<String, List<HelpTypeCode>> typeCodeMap = new HashMap<String, List<HelpTypeCode>>();

		//去重
		Set<String> set = new HashSet<String>();
		set.addAll(Arrays.asList(typeCode));

		for(String code : set){
			List<HelpTypeCode> list = helpTypeCodeRepository.findByTypeCode(code);

			typeCodeMap.put(code, list);
		}

		return typeCodeMap;
	}

}
