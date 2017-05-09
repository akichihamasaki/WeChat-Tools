package jldp.portal.core.exception.action;

public class GenericActionException extends ActionException{

	private static final long serialVersionUID = 4194450280049174827L;

	public GenericActionException(int retcode, String retmsg) {
		super(retcode, retmsg);
	}

	public GenericActionException(int retcode, String retmsg, Throwable cause) {
		super(retcode, retmsg, cause);
	}

}
