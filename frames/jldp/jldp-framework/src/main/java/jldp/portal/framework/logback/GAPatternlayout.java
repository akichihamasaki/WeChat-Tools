/**
 * @Title: GAPatternlayout.java
 * @Package jldp.portal.framework.logback
 * @Description: TODO
 * Copyright: Copyright (c) 2016
 * Company:北京国安创客
 *
 * @author Comsys-dengzongyu
 * @date 2016年12月5日 下午5:07:18
 * @version V1.0
 */

package jldp.portal.framework.logback;

import ch.qos.logback.classic.PatternLayout;

/**
* @ClassName: GAPatternlayout
* @Description: Logback配置文件注入
* @author dengzongyu
* @date 2016年12月5日 下午5:07:18
*
*/
public class GAPatternlayout extends PatternLayout {

	static{
		defaultConverterMap.put("ip", IpConverter.class.getName());
	}
	
}

