/**
 * @Title: WebRequestLogRecording.java
 * @Package jldp.portal.framework.logback
 * @Description: TODO
 * Copyright: Copyright (c) 2016
 * Company:北京国安创客
 *
 * @author Comsys-dengzongyu
 * @date 2016年12月6日 下午3:40:25
 * @version V1.0
 */

package jldp.portal.framework.logback;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jldp.portal.utils.IPUtils;

/**
 * @ClassName: WebRequestLogRecording
 * @Description: Web请求日志记录
 * @author dengzongyu
 * @date 2016年12月6日 下午3:40:25
 *
 */
@Aspect
@Component
@Order(-5)
public class WebRequestLogRecording {

	private static Logger logger = LoggerFactory.getLogger(WebRequestLogRecording.class);
	
	/**
	 * 每次请求的串
	 */
	private ThreadLocal<String> requestUUID = new ThreadLocal<String>();
	
	private ThreadLocal<Long> startTime = new ThreadLocal<Long>();
	
	/**
	 * 
	 * WebRequestLog: 定义拦截点
	 * @author dengzongyu
	 * @since JDK 1.8
	 */
	@Pointcut("execution(public * com.gack..controller..*.*(..))")
	public void webRequestLog(){}
	
	/**
	 * 
	 * doBefore:进入切入点前进行操作.
	 *
	 * @author dengzongyu
	 * @since JDK 1.8
	 */
	@Before("webRequestLog()")
	public void doBefore(JoinPoint joinPoint){
		//获取UUID标识
		String REQUEST_UUID = java.util.UUID.randomUUID().toString().replaceAll("-", "").toUpperCase();
		requestUUID.set(REQUEST_UUID);
		startTime.set(System.currentTimeMillis());
		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = attributes.getRequest();
		request.setAttribute("REQUEST_UUID", REQUEST_UUID);
		StringBuffer sbStr = new StringBuffer("ClentRequestInfoStar===REQUEST_UUID:")
				.append(REQUEST_UUID).append(",URL:")//监控参数
				.append(request.getRequestURL()).append(",")
				.append("HTTP_TYPE:").append(request.getMethod()).append(",")
				.append("CLASS_METHOD:").append(joinPoint.getSignature().getName()).append(",")
				.append("CLIENT_IP:").append(IPUtils.getClientIpAddress(request)).append(",")
				.append("PARAMS:");
		Enumeration<String> enu=request.getParameterNames(); 
        while(enu.hasMoreElements()){
        	String elementType = enu.nextElement();
            sbStr.append(elementType).append("=").append(request.getParameter(elementType)).append("&"); 
        }
        logger.info(sbStr.deleteCharAt(sbStr.length()-1).toString());
	}
	
    @AfterReturning(returning = "result", pointcut = "webRequestLog()")
    public void doAfterReturning(Object result) {
    	StringBuffer sbStr = new StringBuffer("ClentRequestInfoEnd===REQUEST_UUID:")
    			.append(requestUUID.get()).append(",REQUEST_TIME:"+(System.currentTimeMillis()-startTime.get())).append("ms");
        logger.info(sbStr.toString());
    }
}
