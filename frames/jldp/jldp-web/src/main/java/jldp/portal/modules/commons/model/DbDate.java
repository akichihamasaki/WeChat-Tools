package jldp.portal.modules.commons.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import jldp.portal.core.base.model.BaseObject;

@Entity
@Table(name = "COMM_DB_DATE")
public class DbDate extends BaseObject {
	private static final long serialVersionUID = 7557192140493659005L;

	@Id
	@Column(name = "ID", length = 36)
	private String id;
	
	//private int version;

	public DbDate() {
	}

	public DbDate(String id) {
		this.id = id;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	
}
