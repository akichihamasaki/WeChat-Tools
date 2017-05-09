/**
 * @Title: ExceptionCode.java
 * @Package jldp.portal.framework.exceptions
 * @Description: TODO
 * Copyright: Copyright (c) 2016
 * Company:北京国安创客
 *
 * @author Comsys-dengzongyu
 * @date 2016年12月6日 上午10:46:15
 * @version V1.0
 */

package jldp.portal.framework.exceptions;

/**
 * @ClassName: ExceptionCode
 * @Description: 异常公共对象类
 * @author dengzongyu
 * @date 2016年12月6日 上午10:46:15
 *
 */
public class MyException extends RuntimeException {

	/**
	 * serialVersionUID:序列化串号
	 * @since JDK 1.8
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 系统编码
	 */
	protected String systemCode;

	/**
	 * 异常类型编码
	 */
	protected String exceType;

	/**
	 * 异常信息
	 */
	protected String message;
	
	/**
	 * 流水号
	 */
	protected String serialNubmer;
	
	/**
	 * request请求串号
	 */
	protected String requestNumber;
	
	public MyException() {
		super();
	}

	public MyException(Throwable throwable) {
		super(throwable);
	}

	/**
	 * Creates a new instance of MyException.
	 * @param exceMsg 提示信息
	 */
	public MyException(String exceMsg) {
		super(exceMsg);
		this.message = exceMsg;
	}

	/**
	 * Creates a new instance of MyException.
	 * @param systemCode 系统编码
	 * @param exceMsg 提示信息
	 */
	public MyException(String systemCode, String exceMsg) {
		super(exceMsg);
		this.systemCode = systemCode;
		this.message = exceMsg;
	}
	
	/**
	 * Creates a new instance of MyException.
	 * @param systemCode 系统编码
	 * @param exceType 异常类型
	 * @param exceMsg 提示信息
	 */
	public MyException(String systemCode, String exceType, String exceMsg) {
		super(exceMsg);
		this.exceType = exceType;
		this.systemCode = systemCode;
		this.message = exceMsg;
	}
	
	/**
	 * Creates a new instance of MyException.
	 * @param systemCode 系统编码
	 * @param exceType 异常类型
	 * @param exceMsg 提示信息
	 * @param serialNubmer 流水号
	 */
	public MyException(String systemCode, String exceType, String exceMsg,String serialNubmer) {
		super(exceMsg);
		this.exceType = exceType;
		this.systemCode = systemCode;
		this.message = exceMsg;
		this.serialNubmer = serialNubmer;
	}
	
	/**
	 * Creates a new instance of MyException.此构造只在cont层使用
	 * @param systemCode 系统编码
	 * @param exceType 异常类型
	 * @param exceMsg 提示信息
	 * @param serialNubmer 流水号
	 * @param requestNumber 请求串号
	 */
	public MyException(String systemCode, String exceType, String exceMsg,String serialNubmer,String requestNumber) {
		super(exceMsg);
		this.exceType = exceType;
		this.systemCode = systemCode;
		this.message = exceMsg;
		this.serialNubmer = serialNubmer;
		this.requestNumber = requestNumber;
	}
	
	/**
	 * Creates a new instance of MyException.
	 * @param systemCode 系统编码
	 * @param exceType 异常类型
	 * @param exceMsg 提示信息
	 * @param serialNubmer 流水号
	 * @param requestNumber 请求串号
	 * @param throwable 异常对象
	 */
	public MyException(String systemCode, String exceType, String exceMsg,String serialNubmer,String requestNumber, Throwable throwable) {
		super(throwable);
		this.exceType = exceType;
		this.systemCode = systemCode;
		this.message = exceMsg;
		this.serialNubmer = serialNubmer;
		this.requestNumber = requestNumber;
	}
	
	public String getSystemCode() {
		return systemCode;
	}

	public void setSystemCode(String systemCode) {
		this.systemCode = systemCode;
	}

	public String getExceType() {
		return exceType;
	}

	public void setExceType(String exceType) {
		this.exceType = exceType;
	}

	public String getSerialNubmer() {
		return serialNubmer;
	}

	public void setSerialNubmer(String serialNubmer) {
		this.serialNubmer = serialNubmer;
	}

	public String getRequestNumber() {
		return requestNumber;
	}

	public void setRequestNumber(String requestNumber) {
		this.requestNumber = requestNumber;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
}
