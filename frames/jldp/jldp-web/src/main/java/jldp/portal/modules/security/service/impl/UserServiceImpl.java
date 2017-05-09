package jldp.portal.modules.security.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jldp.portal.core.exception.service.GenericServiceException;
import jldp.portal.modules.security.dao.UserHeadRepository;
import jldp.portal.modules.security.dao.UserRepository;
import jldp.portal.modules.security.dao.UserRoleRepository;
import jldp.portal.modules.security.model.BaseRole;
import jldp.portal.modules.security.model.BaseUser;
import jldp.portal.modules.security.model.BaseUserDto;
import jldp.portal.modules.security.model.BaseUserRole;
import jldp.portal.modules.security.model.UserHead;
import jldp.portal.modules.security.service.IRoleService;
import jldp.portal.modules.security.service.IUserService;

@Service("security.userService")
public class UserServiceImpl implements IUserService {

	@Autowired
	@Qualifier("security.userRepository")
	private UserRepository userRepository;
	@Autowired
	@Qualifier("security.userRoleRepository")
	private UserRoleRepository userRoleRepository;
	@Autowired
	@Qualifier("security.userHeadRepository")
	private UserHeadRepository userHeadRepository;

	@Autowired
	@Qualifier("security.roleService")
	IRoleService roleService;
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	public Page<BaseUser> findUser(String nodename, String username, Pageable pageable) {
		Page<BaseUser> page;
		if (StringUtils.isNotBlank(username) && StringUtils.isNotBlank(nodename)) {
			page = userRepository.findUsersByNodenameAndUsername("%" + nodename + "%", "%" + username + "%", pageable);
		} else {
			if (StringUtils.isNotBlank(username)) {
				page = userRepository.findUsersByUsername("%" + username + "%", pageable);
			} else if (StringUtils.isNotBlank(nodename)) {
				page = userRepository.findUsersByNodename("%" + nodename + "%", pageable);
			} else {
				page= userRepository.findUsers(pageable);
				
			}
		}
		//cut password
		List<BaseUser> baseUsers = page.getContent();
		for(BaseUser baseUser : baseUsers){
			if(baseUser!=null){
				baseUser.setPassword("");
			}
			
		}
		
		return page;
	}

	public BaseUser getBaseUser(String userid) {
		return userRepository.findOne(userid);
	}
	
	public BaseUser getBaseUserNoPassword(String userid){
		BaseUser bu = getBaseUser(userid);
		bu.setPassword("");
		return bu;
	}
	
	
	public BaseUserDto getUserAndRole(String userid){
		BaseUser baseUser = getBaseUserNoPassword(userid);
		BaseUserDto dto = new BaseUserDto(baseUser);
		List<BaseRole> roles=roleService.queryBaseRoleByUserid(baseUser.getUserid());
		dto.setRoles(roles);
		return dto;
	}

	/**
	 * 保存baseuser。
	 * 
	 * @param user
	 */
	public BaseUser saveBaseUser(BaseUser user) {
		return userRepository.save(user);
	}

	public BaseUser saveUser(BaseUser user) {
		if (StringUtils.isNotBlank(user.getUserid())) {
			BaseUser oldUser = this.getBaseUser(user.getUserid());//userRepository.findOne(user.getUserId());
			oldUser.setExpireDate(user.getExpireDate());
			oldUser.setUserType(user.getUserType());
			//修改用户启用/禁用状态  2016-10-13 by furh
			if (StringUtils.isNotBlank(user.getStatus())) oldUser.setStatus(user.getStatus());
			//
			// BeanUtils.copyProperties(user, oldUser,
			// new String[] { "password", "createTime", "creator",
			// "onlineStatus", "roles", "employee" });

			BaseUser u= saveBaseUser(oldUser);
			u.setPassword("");
			return u;
		} else {
			List<BaseUser> list= userRepository.findByEmployeeNodeid(user.getEmployee().getNodeid());
			if(!list.isEmpty()){
				throw new GenericServiceException(1010,"employee have a user");
			}
			String pwd = passwordEncoder.encode(user.getPassword());
			user.setCreateTime(new Date());
			user.setPassword(pwd);
			BaseUser u= saveBaseUser(user);
			u.setPassword("");
			return u;
		}
	}

	@Override
	public void updateBaseUserStatus(String userid,String status){
		BaseUser baseUser = this.getBaseUser(userid);
		baseUser.setStatus(status);
		this.saveBaseUser(baseUser);
	}
	
	public BaseUser getBaseUserByUsername(String username) {
		BaseUser user = userRepository.findByUsername(username);
		return user;
	}

	public boolean isExistUsername(String username) {
		BaseUser user = userRepository.findByUsername(username);
		if (user == null || user.getUserid() == null)
			return false;
		else
			return true;
	}

	@Transactional
	public void deleteBaseUser(String userid) {
		userRepository.delete(userid);
		userRoleRepository.deleteByUserid(userid);
		userHeadRepository.deleteByUserid(userid);
	}

	@Transactional
	public void saveUserRole(BaseUserDto user,String userid) {
		List<BaseRole> newSet = user.getRoles();

		BaseUser oldUser = userRepository.findOne(user.getUserid());
		userRoleRepository.deleteByUserid(oldUser.getUserid());
		List<BaseUserRole> brs = new ArrayList<BaseUserRole>();
		Date date = new Date();
		for(BaseRole role : newSet){
			BaseRole po = roleService.getBaseRole(role.getRoleid());
			BaseUserRole ur = new BaseUserRole(oldUser.getUserid(),po.getRoleid());
			ur.setCreateTime(date);
			ur.setCreator(userid);
			brs.add(ur);
		}
		userRoleRepository.save(brs);
	}

	public void updateUserPassword(String password, String userid) {
		BaseUser user = userRepository.findOne(userid);

		String pwd = passwordEncoder.encode( password);
		user.setPassword(pwd);
		saveBaseUser(user);
	}
	public void updateUserPassword(String oldpassword,String newpassword, String userid) {
		if(!this.validateUserPassword(userid, oldpassword)){
			throw new GenericServiceException(1003, "old password is error !");
		}
		updateUserPassword(newpassword,userid);
	}
	public boolean validateUserPassword(String userid, String password) {
		BaseUser user = this.getBaseUser(userid);
		return passwordEncoder.matches(password,user.getPassword());

	}

	public void saveUserHeadImg(UserHead head) {
		userHeadRepository.save(head);
	}

	public void deleteUserHeadImg(String userId) {
		userHeadRepository.delete(userId);
	}

	public UserHead getUserHeadImg(String userId) {
		return userHeadRepository.findOne(userId);
	}
}