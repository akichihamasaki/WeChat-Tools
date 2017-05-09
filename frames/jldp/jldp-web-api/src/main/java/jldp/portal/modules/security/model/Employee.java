package jldp.portal.modules.security.model;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.SecondaryTable;

@Entity
//@Table(name = "BASE_EMPLOYEE")
//@PrimaryKeyJoinColumn(name = "NODEID")
@DiscriminatorValue("03")
@SecondaryTable(name="BASE_EMPLOYEE")
public class Employee extends Organization {

	private static final long serialVersionUID = 3364297033475208093L;

	public final static String NODETYPE = "03";

	@Column(name = "SEX", length = 1,table="BASE_EMPLOYEE")
	private String sex;

	@Column(name = "CARD_ID", length = 255,table="BASE_EMPLOYEE")
	private String cardid;

	@Column(name = "EMPPHN", length = 255,table="BASE_EMPLOYEE")
	private String empphn;

	@Column(name = "BIRTHDATE", length = 10,table="BASE_EMPLOYEE")
	private String birthdate;

	@Column(name = "NATIONALITY", length = 2,table="BASE_EMPLOYEE")
	private String nationality;

	@Column(name = "MARRIAGE", length = 20,table="BASE_EMPLOYEE")
	private String marriage;

	@Column(name = "POLITICAL", length = 20,table="BASE_EMPLOYEE")
	private String political;
	
	@Column(name = "TEL", length = 20,table="BASE_EMPLOYEE")
	private String tel;
	
	@Column(name = "ADDRESS", length = 200,table="BASE_EMPLOYEE")
	private String address;
	
//	@Transient
//	private int treeLevel;
	
	public Employee() {
		super();
		this.setNodetype(NODETYPE);
	}

	public String getNodetype() {
		return NODETYPE;
	}

	public void setNodetype(String nodetype) {
		
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getEmpphn() {
		return empphn;
	}

	public void setEmpphn(String empphn) {
		this.empphn = empphn;
	}

	public String getNationality() {
		return nationality;
	}

	public void setNationality(String nationality) {
		this.nationality = nationality;
	}

	public String getMarriage() {
		return marriage;
	}

	public void setMarriage(String marriage) {
		this.marriage = marriage;
	}

	public String getPolitical() {
		return political;
	}

	public void setPolitical(String political) {
		this.political = political;
	}

//	public int getTreeLevel() {
//		return treeLevel;
//	}
//
//	public void setTreeLevel(int treeLevel) {
//		this.treeLevel = treeLevel;
//	}

	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	
	public String getCardid() {
		return cardid;
	}

	public void setCardid(String cardid) {
		this.cardid = cardid;
	}

	public String getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(String birthdate) {
		this.birthdate = birthdate;
	}
}