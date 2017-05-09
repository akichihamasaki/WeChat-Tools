package jldp.portal.modules.security.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Stack;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jldp.portal.modules.security.dao.OrganizationRepository;
import jldp.portal.modules.security.model.Employee;
import jldp.portal.modules.security.model.Organization;
import jldp.portal.modules.security.model.OrganizationDto;
import jldp.portal.modules.security.service.IOrganizationService;

@Service("security.organizationService")
public class OrganizationServiceImpl implements IOrganizationService {
	@Autowired
	@Qualifier("security.organizationRepository")
	private OrganizationRepository organizationRepository;

	public Page<Organization> findOrganization(final Organization org, Pageable pageable) {

		Page<Organization> page = organizationRepository.findAll(new Specification<Organization>() {
			public Predicate toPredicate(Root<Organization> root, CriteriaQuery<?> query, CriteriaBuilder cb) {

				List<Predicate> list = new ArrayList<>();
				if (StringUtils.isNotBlank(org.getNodename()))
					list.add(cb.like(root.get("nodename").as(String.class), "%" + org.getNodename() + "%"));

				if (StringUtils.isNotBlank(org.getStatus()))
					list.add(cb.equal(root.get("status").as(String.class), org.getStatus()));

				query.orderBy(cb.asc(root.get("orderno")));

				Predicate[] predicates = new Predicate[list.size()];
				predicates = list.toArray(predicates);
				return cb.and(predicates);
			}
		}, pageable);

		return page;
	}

	public Page<Organization> queryEmployeeByParentid(String parentid,List<String> nodetypes, Pageable pageable) {
		return organizationRepository.queryByParentidAndStatus(parentid, "1",nodetypes, pageable);
	}

	public Organization getOrganization(String nodeid) {
		return organizationRepository.findOne(nodeid);
	}

	public Organization saveOrganization(Organization org) {
		org.setStatus("1");
		return organizationRepository.save(org);
	}

	public Organization updateCurrentEmployee(Employee emp, String nodeId) {
		Employee oldEmp = (Employee) organizationRepository.findOne(nodeId);

		oldEmp.setAddress(emp.getAddress());
		oldEmp.setBirthdate(emp.getBirthdate());
		oldEmp.setCardid(emp.getCardid());
		oldEmp.setEmpphn(emp.getEmpphn());
		oldEmp.setMarriage(emp.getMarriage());
		oldEmp.setNationality(emp.getNationality());
		oldEmp.setPolitical(emp.getPolitical());
		oldEmp.setSex(emp.getSex());
		oldEmp.setTel(emp.getTel());

		return organizationRepository.save(oldEmp);
	}

	public Organization updateOrganization(Organization org) {
		return organizationRepository.save(org);
	}

	public void deleteOrganization(String nodeid) {
		//organizationRepository.delete(nodeid);
		Organization po = getOrganization(nodeid);
		List<Organization> pos = new ArrayList<Organization>();
		Stack<Organization> stack = new Stack<Organization>();
		stack.push(po);
		while(!stack.isEmpty()){
			Organization org=stack.pop();
			org.setStatus("0");
			pos.add(org);
			List<Organization> children = organizationRepository.findByParentid(org.getNodeid());
			if(!children.isEmpty()){
				stack.addAll(children);
			}
		}
		//organizationRepository.delete(pos);
		organizationRepository.save(pos);
	}

	public Organization updateOrganizationStatus(String status, String nodeId) {
		Organization oldOrg = organizationRepository.findOne(nodeId);
		oldOrg.setStatus(status);

		return organizationRepository.save(oldOrg);
	}

	public List<OrganizationDto> queryOrgTreeGird() {
		List<String> nodetypes = new ArrayList<String>();
		nodetypes.add("01");
		nodetypes.add("02");
		List<Organization> orgList = organizationRepository.queryByStatusAndNodetypeIn("1",nodetypes);

		OrganizationDto root = createTree(orgList);

		List<OrganizationDto> retTree = iteratorTree(root.getChildren(), 0);

		return retTree;
	}

	private OrganizationDto createTree(List<Organization> orgList) {
		Map<String, OrganizationDto> nodeList = new HashMap<String, OrganizationDto>();

		for (Organization org : orgList) {
			// 不加载员工
			if (Employee.NODETYPE.equals(org.getNodetype()))
				continue;
			OrganizationDto dto = new OrganizationDto(org);
			nodeList.put(org.getNodeid(), dto);
		}

		// 根节点
		OrganizationDto treeRoot = new OrganizationDto();

		Set<Map.Entry<String, OrganizationDto>> entrySet = nodeList.entrySet();
		for (Iterator<Map.Entry<String, OrganizationDto>> it = entrySet.iterator(); it.hasNext();) {
			OrganizationDto node = ((Map.Entry<String, OrganizationDto>) it.next()).getValue();
			if (StringUtils.isBlank(node.getParentid())) {
				treeRoot.addChild(node);
			} else {
				(nodeList.get(node.getParentid())).addChild(node);
			}
		}
		treeRoot.sortChildren();

		return treeRoot;
	}

	private List<OrganizationDto> iteratorTree(List<OrganizationDto> list, int level) {
		List<OrganizationDto> retList = new ArrayList<OrganizationDto>();
		for (OrganizationDto tree : list) {
			tree.setTreeLevel(level);
			retList.add(tree);
			if (tree.getChildren() != null) {
				retList.addAll(iteratorTree(tree.getChildren(), level + 1));
			}

			tree.getChildren().clear();
		}
		return retList;
	}
	
	@Override
	public Long queryCountByParentid(String parentid){
		return organizationRepository.countByParentid(parentid);
	}
}
