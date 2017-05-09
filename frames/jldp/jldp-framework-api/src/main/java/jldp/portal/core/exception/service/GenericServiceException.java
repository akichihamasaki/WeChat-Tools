package jldp.portal.core.exception.service;

public class GenericServiceException extends ServiceException{

	private static final long serialVersionUID = -5007629293684210339L;
	public GenericServiceException(int retcode, String retmsg) {
		super(retcode, retmsg);
	}
	public GenericServiceException(int retcode, String retmsg, Throwable cause) {
		super(retcode, retmsg, cause);
	}
}
