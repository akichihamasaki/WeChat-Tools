/**
 * @Title: AvoidDuplicateSubmissionInterceptor.java
 * @Package jldp.portal.framework.web.annotation.repeated
 * Copyright: Copyright (c) 2016
 * Company:北京国安创客
 *
 * @author Comsys-dengzongyu
 * @date 2016年12月7日 下午1:22:17
 * @version V1.0
 */

package jldp.portal.framework.web.annotation.repeated;

import java.lang.reflect.Method;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import jldp.portal.utils.TokenProcessor;

/**
* @ClassName: AvoidDuplicateSubmissionInterceptor
* @Description: 防重复提交拦截器
* @author dengzongyu
* @date 2016年12月7日 下午1:22:17
*
*/
public class AvoidDuplicateSubmissionInterceptor implements HandlerInterceptor{

	private Logger logger = LoggerFactory.getLogger(AvoidDuplicateSubmissionInterceptor.class);
	
	/**
	 * 防重复提交注解
	 */
	private final String AVOID_TOKEN = "AVOID_TOKEN";
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		HandlerMethod handlerMethod = (HandlerMethod) handler;
        Method method = handlerMethod.getMethod();

        AvoidDuplicateSubmission annotation = method.getAnnotation(AvoidDuplicateSubmission.class);
        if (annotation != null) {
            boolean needSaveSession = annotation.saveToken();
            if (needSaveSession) {
//            	if(null == request.getSession(false)){
//            		logger.info("Session消失，请确认登录");
//            		return false;
//            	}
            	//TODO 根据业务需求看是否需要创建
                request.getSession(false).setAttribute(AVOID_TOKEN, TokenProcessor.getInstance().generateToken(request));
            }

            boolean needRemoveSession = annotation.removeToken();
            if (needRemoveSession) {
                if (isRepeatSubmit(request)) {
//                    logger.warn("please don't repeat submit,[user:" + user.getUsername() + ",url:"
//                            + request.getServletPath() + "]");
                	logger.info("重复提交:"+request.getServletPath());
                    return false;
                }
                request.getSession(false).removeAttribute(AVOID_TOKEN);
            }
        }
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
	}
	
	/**
	 * 
	 * isRepeatSubmit: 判断是否是重复提交
	 * 进入方法前判断：
	 * 1.服务器是否存有token，不存在禁止提交
	 * 2.客户端是否传送token，没有传送禁止提交
	 * 3.服务端和客户端的token不相同，禁止提交
	 * @author dengzongyu
	 * @param request
	 * @return true:重复提交，false:非重复提交
	 * @since JDK 1.8
	 */
    private boolean isRepeatSubmit(HttpServletRequest request) {
        String serverToken = (String) request.getSession(false).getAttribute(AVOID_TOKEN);
        if (serverToken == null) {
            return true;
        }
        String clinetToken = request.getParameter(AVOID_TOKEN);
        if (clinetToken == null) {
            return true;
        }
        if (!serverToken.equals(clinetToken)) {
            return true;
        }
        return false;
    }

}

