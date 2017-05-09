/**
 * @Title: BussinesLogger.java
 * @Package jldp.portal.framework.logback
 * Copyright: Copyright (c) 2016
 * Company:北京国安创客
 *
 * @author Comsys-dengzongyu
 * @date 2016年12月5日 下午4:29:48
 * @version V1.0
 */

package jldp.portal.framework.logback;

import java.net.InetAddress;

import ch.qos.logback.classic.pattern.ClassicConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;

/**
* @ClassName: BussinesLogger
* @Description: 业务日志记录类
* @author dengzongyu
* @date 2016年12月5日 下午4:29:48
*
*/
public class IpConverter extends ClassicConverter {
	
	/**
	 * 业务系统机器名称
	 */
	private static String hostName = "";

	/**
	 * 业务系统机器的IP
	 */
	private static String hostIp = "";
	
	static {
		InetAddress ia = null;
		try {
			ia = InetAddress.getLocalHost();
			hostIp = ia.getHostAddress();
			hostName = ia.getHostName();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public String convert(ILoggingEvent event) {
		return new StringBuilder(hostIp).append(":").append(hostName).toString();
	}

}

