package jldp.portal.modules.commons.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Version;

import jldp.portal.core.base.model.BaseObject;

@Entity
@Table(name = "COMM_SEQ_GEN")
public class SeqGen extends BaseObject {
	private static final long serialVersionUID = 7557192140493659005L;

	@Id
	@Column(name = "ID", length = 255)
	private String id;

	/**
	 * 表名
	 */
	@Column(name = "TABLE_NAME", length = 100)
	private String tableName;

	/**
	 * 列名
	 */
	@Column(name = "COLUMN_NAME", length = 100)
	private String columnName;
	/**
	 * 当前序列值
	 */
	@Column(name = "COLUMN_VALUE", length = 255)
	private int columnValue;

	@Version
	@Column(name = "VERSION")
	private int version;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getColumnName() {
		return columnName;
	}

	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}

	public int getColumnValue() {
		return columnValue;
	}

	public void setColumnValue(int columnValue) {
		this.columnValue = columnValue;
	}
}
