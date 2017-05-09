package jldp.portal.core.exception.service;

import jldp.portal.core.exception.BaseRuntimeException;

public abstract class ServiceException extends BaseRuntimeException{

	private static final long serialVersionUID = 4756719868173118276L;

//	public ServiceException(String msg, Throwable cause) {
//		super(msg, cause);
//	}
//
//	public ServiceException(String msg) {
//		super(msg);
//	}

	public ServiceException(int retcode, String retmsg, Throwable cause) {
		super(retcode, retmsg, cause);
	}

	public ServiceException(int retcode, String retmsg) {
		super(retcode, retmsg);
	}

}
