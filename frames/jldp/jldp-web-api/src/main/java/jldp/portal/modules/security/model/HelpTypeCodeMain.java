package jldp.portal.modules.security.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import jldp.portal.core.base.model.BaseObject;

@Entity
@Table(name = "BASE_HELP_TYPECODE_MAIN")
public class HelpTypeCodeMain extends BaseObject {

	private static final long serialVersionUID = 7833364254385398827L;
	@Id
	@Column(name = "TYPECODE", length = 255)
	private String typeCode;

	@Column(name = "TYPENAME", length = 255)
	private String typeName;

	@Column(name = "ORDERNO")
	private int orderNo;

	@Column(name = "REMARK", length = 255)
	private String remark;

	// @OneToMany(cascade = CascadeType.REFRESH, fetch = FetchType.EAGER,
	// mappedBy = "id.typeCode")
	// @OrderBy(value = "ORDERNO ASC")
	// private Set<BaseHelpTypeCode> baseHelpTypeCode = new
	// HashSet<BaseHelpTypeCode>();

	public String getTypeCode() {
		return typeCode;
	}

	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
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

	// public Set<BaseHelpTypeCode> getBaseHelpTypeCode() {
	// return baseHelpTypeCode;
	// }
	//
	// public void setBaseHelpTypeCode(Set<BaseHelpTypeCode> baseHelpTypeCode) {
	// this.baseHelpTypeCode = baseHelpTypeCode;
	// }
}
