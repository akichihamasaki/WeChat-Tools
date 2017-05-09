package jldp.portal.modules.security.model;

import jldp.portal.core.base.model.BaseObject;

public class HelpTypeCodePK extends BaseObject {

	private static final long serialVersionUID = 5000469973864606349L;

	private String typeCode;

	private String code;

	public HelpTypeCodePK() {
		super();
	}

	public HelpTypeCodePK(String typeCode, String code) {
		super();
		this.typeCode = typeCode;
		this.code = code;
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

	@Override
	public int hashCode() {
		final int hash = 31;
		int result = 1;

		result = hash * result + ((code == null) ? 0 : code.hashCode());
		result = hash * result + ((typeCode == null) ? 0 : typeCode.hashCode());

		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;

		final HelpTypeCodePK typeCodePk = (HelpTypeCodePK) obj;

		if (code == null) {
			if (typeCodePk.code != null)
				return false;
		} else if (!code.equals(typeCodePk.code))
			return false;

		if (typeCode == null) {
			if (typeCodePk.typeCode != null)
				return false;
		} else if (!typeCode.equals(typeCodePk.typeCode))
			return false;

		return true;
	}
}