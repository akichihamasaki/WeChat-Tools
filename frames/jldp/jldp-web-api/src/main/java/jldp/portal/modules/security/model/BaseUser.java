package jldp.portal.modules.security.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.beans.BeanUtils;

import com.alibaba.fastjson.annotation.JSONField;

import jldp.portal.core.base.model.BaseObject;

@Entity
@Table(name = "BASE_USERS")
public class BaseUser extends BaseObject {

	private static final long serialVersionUID = 7018156852947792621L;
	@Id
	@Column(name = "USER_ID", length = 36)
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	private String userid;

	@Column(name = "USERNAME", length = 20, unique = true)
	private String username;
	
	@JSONField(serialize = false)
	@Column(name = "PASSWORD", length = 255)	
	private String password;

	@Column(name = "STATUS", length = 2)
	private String status="1";

	@Column(name = "EXPIREDATE", length = 10)
	private String expireDate;

	@Column(name = "USER_TYPE", length = 2)
	private String userType="50";

	@Temporal(TemporalType.DATE)
	@Column(name = "CREATE_TIME", length = 20)
	private Date createTime;

	@Column(name = "ONLINE_STATUS", length = 2)
	private String onlineStatus;
	
	@Column(name = "CREATOR", length = 36)
	private String creator;	

	@ManyToOne
	@JoinColumn(name = "NODEID")
	private Employee employee;

	public BaseUser() {
	}

	public BaseUser(BaseUser baseUser,Employee employee) {
		if(baseUser!=null){
			BeanUtils.copyProperties(baseUser, this);
		}
		if(employee!=null){
			this.setEmployee(employee);
		}
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userId) {
		this.userid = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getExpireDate() {
		return expireDate;
	}

	public void setExpireDate(String expireDate) {
		this.expireDate = expireDate;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getOnlineStatus() {
		return onlineStatus;
	}

	public void setOnlineStatus(String onlineStatus) {
		this.onlineStatus = onlineStatus;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}


//	public void addRoles(Set<BaseRole> roles) {
//		this.roles.addAll(roles);
//	}

//	public void clearRoles() {
//		this.roles.clear();
//	}

//	public String getEmpNodeId() {
//		return empNodeId;
//	}
//
//	public void setEmpNodeId(String empNodeId) {
//		this.empNodeId = empNodeId;
//	}
//
//	public String getOrgNodeName() {
//		return orgNodeName;
//	}
//
//	public void setOrgNodeName(String orgNodeName) {
//		this.orgNodeName = orgNodeName;
//	}

//	public String getEmpName() {
//		return empName;
//	}
//
//	public void setEmpName(String empName) {
//		this.empName = empName;
//	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}
}