package jldp.portal.core.exception;

import java.io.Serializable;

public abstract class BaseException extends Exception implements Serializable{

	private static final long serialVersionUID = -5610619323750735757L;
	
	private int retcode=Retcode.OK.value();
	
	private String retmsg=Retcode.OK.getRetmsg();
	public BaseException(String msg) {
		super(msg);
		retmsg=msg;
	}

	public BaseException(String msg, Throwable cause) {
		super(msg, cause);
		retmsg=msg;
	}

	public BaseException(int retcode, String retmsg) {
		super(retmsg);
		this.retcode = retcode;
		this.retmsg = retmsg;
	}

	public BaseException(int retcode, String retmsg, Throwable cause) {
		super(retmsg, cause);
		this.retcode = retcode;
		this.retmsg = retmsg;
	}

	public int getRetcode() {
		return retcode;
	}

	public void setRetcode(int retcode) {
		this.retcode = retcode;
	}

	public String getRetmsg() {
		return retmsg;
	}

	public void setRetmsg(String retmsg) {
		this.retmsg = retmsg;
	}	
}
