package jldp.portal.core.exception.action;

import jldp.portal.core.exception.Retcode;

public class ValidationException extends ActionException{

	private static final long serialVersionUID = -7963978193470408315L;
	public ValidationException(String msg, Throwable cause) {
		super(Retcode.VALIDATION.value(),msg, cause);
	}

	public ValidationException(String msg) {
		super(Retcode.VALIDATION.value(),msg);
	}


}
