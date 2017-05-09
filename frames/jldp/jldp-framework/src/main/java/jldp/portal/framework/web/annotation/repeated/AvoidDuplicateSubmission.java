/**
 * @Title: AvoidDuplicateSubmission.java
 * @Package jldp.portal.framework.web.annotation.repeated
 * @Description: TODO
 * Copyright: Copyright (c) 2016
 * Company:北京国安创客
 *
 * @author Comsys-dengzongyu
 * @date 2016年12月7日 上午11:02:48
 * @version V1.0
 */

package jldp.portal.framework.web.annotation.repeated;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


/**
* @ClassName: AvoidDuplicateSubmission
* @Description: <p>
* 验证重复提交注解
* 在进去需要进行验证重复提交的页面时，需要saveToken=true
* 在需要验证重复提交的方法前增加removeToken=true
* </p>
* @author dengzongyu
* @date 2016年12月7日 上午11:02:48
*
*/
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AvoidDuplicateSubmission {

	/**
	 * saveToken:生产Token，默认不生产，true为生产
	 * @author dengzongyu
	 * @return 生产Token
	 * @since JDK 1.8
	 */
	boolean saveToken() default false;
	
	/**
	 * removeToken: 删除Token，默认不删除，true为删除，删除后不能重复提交
	 * @author dengzongyu
	 * @return 删除Token
	 * @since JDK 1.8
	 */
	boolean removeToken() default false;
	
}

