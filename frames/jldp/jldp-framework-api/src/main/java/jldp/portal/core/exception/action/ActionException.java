package jldp.portal.core.exception.action;

import jldp.portal.core.exception.BaseRuntimeException;

public abstract class ActionException extends BaseRuntimeException{

	private static final long serialVersionUID = -6981179493032614079L;

//	public ActionException(String msg, Throwable cause) {
//		super(msg, cause);
//	}
//
//	public ActionException(String msg) {
//		super(msg);
//	}

	public ActionException(int retcode, String retmsg, Throwable cause) {
		super(retcode, retmsg, cause);
	}

	public ActionException(int retcode, String retmsg) {
		super(retcode, retmsg);
	}

}
