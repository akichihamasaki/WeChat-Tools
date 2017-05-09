package jldp.portal.core.exception;

public enum Retcode {

	OK(200, "OK"),
	BADCREDENTIAL(401,"NO LOGIN") ,
	VALIDATION(1000,"Validation");
	
	private final int retcode;

	private final String retmsg;
	
	private Retcode(int retcode, String retmsg) {
		this.retcode = retcode;
		this.retmsg = retmsg;
	}
	
	public int value() {
		return this.retcode;
	}
	public String getRetmsg() {
		return retmsg;
	}
	public String toString() {
		return Integer.toString(retcode);
	}	
}
