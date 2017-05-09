package jldp.portal.modules.security.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import jldp.portal.core.base.model.BaseObject;

@Entity
@Table(name = "BASE_LOGS")
public class BaseLogs extends BaseObject {
	private static final long serialVersionUID = -6518355451613796091L;
	@Id
	@Column(name = "LOG_ID", length = 36)
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	private String id;
	@Column(name = "LOG_DATE", length = 10)
	private String logDate;
	@Column(name = "LOG_TIME", length = 20)
	private String logTime;
	@Column(name = "OP_TYPE", length = 20)
	private String opType;
	@Column(name = "OP_CODE", length = 20)
	private String opCode;
	@Column(name = "OP_DESC", length = 255)
	private String opDesc;
	// @Column(name = "NODEID", length = 36)
	// private String nodeid;
	@Column(name = "OP_IP", length = 20)
	private String opIP;

	@ManyToOne(optional = true)
	@JoinColumn(name = "NODEID")
	private Employee organization;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getLogDate() {
		return logDate;
	}

	public void setLogDate(String logDate) {
		this.logDate = logDate;
	}

	public String getLogTime() {
		return logTime;
	}

	public void setLogTime(String logTime) {
		this.logTime = logTime;
	}

	public String getOpType() {
		return opType;
	}

	public void setOpType(String opType) {
		this.opType = opType;
	}

	public String getOpCode() {
		return opCode;
	}

	public void setOpCode(String opCode) {
		this.opCode = opCode;
	}

	public String getOpDesc() {
		return opDesc;
	}

	public void setOpDesc(String opDesc) {
		this.opDesc = opDesc;
	}

	// public String getNodeid() {
	// return nodeid;
	// }
	//
	// public void setNodeid(String nodeid) {
	// this.nodeid = nodeid;
	// }

	public String getOpIP() {
		return opIP;
	}

	public void setOpIP(String opIP) {
		this.opIP = opIP;
	}

	public Employee getOrganization() {
		return organization;
	}

	public void setOrganization(Employee organization) {
		this.organization = organization;
	}

}
