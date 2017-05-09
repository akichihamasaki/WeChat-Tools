/**
 * @Title: BeanTools.java
 * @Package jldp.portal.framework.context
 * Copyright: Copyright (c) 2016
 * Company:北京国安创客
 * @author BambooJN-dengzongyu
 * @date 2016年12月12日 下午3:11:41
 * @version V1.0
 */

package jldp.portal.framework.context;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Configuration;

/**
 * @ClassName: BeanTools
 * @Description: 让非Spring类获取spring类
 * @author dengzongyu
 * @date 2016年12月12日 下午3:11:41
 *
 */
@Configuration
public class BeanTools implements ApplicationContextAware {

	private static ApplicationContext applicationContext;

	@Override
	public void setApplicationContext(ApplicationContext arg0) throws BeansException {
		applicationContext = arg0;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static Object getBean(Class classname) {
		try {
			return applicationContext.getBean(classname);
		} catch (Exception e) {
			return "";
		}
	}

}
