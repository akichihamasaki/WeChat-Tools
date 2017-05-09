package jldp.portal.modules.security.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

import jldp.portal.core.base.model.BaseObject;

@Entity
@Table(name = "BASE_HELP_TYPECODE")
@IdClass(HelpTypeCodePK.class)
public class HelpTypeCode extends BaseObject {

	private static final long serialVersionUID = -8619731060875962088L;
	
	@Id
	@Column(name = "TYPECODE", length = 50)
	private String typeCode;
	
	@Id
	@Column(name = "CODE", length = 50)
	private String code;
	
	@Column(name = "MESSAGE", length = 50)
	private String message;

	@Column(name = "ORDERNO")
	private int orderNo;

	@Column(name = "REMARK", length = 255)
	private String remark;

	@Column(name = "PARENT_ID", length = 50)
	private String parentId;

//	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.EAGER, optional = false)
//	@JoinColumn(name = "TYPECODE", referencedColumnName = "TYPECODE", insertable = false, updatable = false)
//	private HelpTypeCodeMain helpTypeCodeMain;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public int getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(int orderNo) {
		this.orderNo = orderNo;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getTypeCode() {
		return typeCode;
	}

	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode;
	}

//	public HelpTypeCodeMain getHelpTypeCodeMain() {
//		return helpTypeCodeMain;
//	}
//
//	public void setHelpTypeCodeMain(HelpTypeCodeMain helpTypeCodeMain) {
//		this.helpTypeCodeMain = helpTypeCodeMain;
//	}
}
