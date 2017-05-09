/**
 * @Title: BussinessException.java
 * @Package jldp.portal.framework.exceptions
 * @Description: TODO
 * Copyright: Copyright (c) 2016
 * Company:北京国安创客
 *
 * @author Comsys-dengzongyu
 * @date 2016年12月6日 上午10:32:34
 * @version V1.0
 */

package jldp.portal.framework.exceptions;

/**
 * @ClassName: BussinessException
 * @Description: 业务异常对象
 * @author dengzongyu
 * @date 2016年12月6日 上午10:32:34
 *
 */
public class BussinessException extends MyException {

	/**
	 * serialVersionUID:序列串号
	 * 
	 * @since JDK 1.8
	 */
	private static final long serialVersionUID = 1960424475924951920L;

	public BussinessException() {
	}

	/**
	 * Creates a new instance of BussinessException.
	 * @param throwable 异常对象
	 */
	public BussinessException(Throwable throwable) {
		super(throwable);
	}
	
	/**
	 * Creates a new instance of BussinessException.
	 * @param exceMsg 提示信息
	 */
	public BussinessException(String exceMsg) {
		super(exceMsg);
	}

	/**
	 * Creates a new instance of BussinessException.
	 * @param systemCode 系统编码
	 * @param exceMsg 提示信息
	 */
	public BussinessException(String systemCode, String exceMsg) {
		super(systemCode);
		super.systemCode = systemCode;
		super.message = exceMsg;
	}
	
	/**
	 * Creates a new instance of BussinessException.
	 * @param systemCode 系统编码
	 * @param exceType 异常类型
	 * @param exceMsg 提示信息
	 */
	public BussinessException(String systemCode, String exceType, String exceMsg) {
		super(systemCode);
		super.exceType = exceType;
		super.systemCode = systemCode;
		super.message = exceMsg;
	}
	
	/**
	 * Creates a new instance of BussinessException.
	 * @param systemCode 系统编码
	 * @param exceType 异常类型
	 * @param exceMsg 提示信息
	 * @param serialNubmer 流水号
	 */
	public BussinessException(String systemCode, String exceType, String exceMsg,String serialNubmer) {
		super(systemCode);
		super.exceType = exceType;
		super.systemCode = systemCode;
		super.message = exceMsg;
		super.serialNubmer = serialNubmer;
	}
	
	/**
	 * Creates a new instance of BussinessException.此构造只在cont层使用
	 * @param systemCode 系统编码
	 * @param exceType 异常类型
	 * @param exceMsg 提示信息
	 * @param serialNubmer 流水号
	 * @param requestNumber 请求串号
	 */
	public BussinessException(String systemCode, String exceType, String exceMsg,String serialNubmer,String requestNumber) {
		super(systemCode);
		super.exceType = exceType;
		super.systemCode = systemCode;
		super.message = exceMsg;
		super.serialNubmer = serialNubmer;
		super.requestNumber = requestNumber;
	}
	
	/**
	 * Creates a new instance of BussinessException.
	 * @param systemCode 系统编码
	 * @param exceType 异常类型
	 * @param exceMsg 提示信息
	 * @param serialNubmer 流水号
	 * @param requestNumber 请求串号
	 * @param throwable 异常对象
	 */
	public BussinessException(String systemCode, String exceType, String exceMsg,String serialNubmer,String requestNumber, Throwable throwable) {
		super(throwable);
		super.exceType = exceType;
		super.systemCode = systemCode;
		super.message = exceMsg;
		super.serialNubmer = serialNubmer;
		super.requestNumber = requestNumber;
	}

}
