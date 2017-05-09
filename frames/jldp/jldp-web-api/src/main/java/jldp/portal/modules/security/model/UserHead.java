package jldp.portal.modules.security.model;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

import com.alibaba.fastjson.annotation.JSONField;

import jldp.portal.core.base.model.BaseObject;

@Entity
@Table(name = "BASE_USER_HEAD")
public class UserHead extends BaseObject {

	private static final long serialVersionUID = 1497124452855750811L;

	@Id
	@Column(name = "USER_ID", length = 36)
	private String userid;

	@Lob
	@Basic(fetch = FetchType.EAGER)
	@JSONField(serialize = false)
	@Column(name = "IMG")
	private byte[] img = new byte[0];

	@Column(name = "FILE_NAME", length = 255)
	private String fileName;

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public byte[] getImg() {
		return img;
	}

	public void setImg(byte[] img) {
		this.img = img;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
}
