package jldp.portal.framework.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import jldp.portal.core.exception.BaseException;
import jldp.portal.core.exception.BaseRuntimeException;

@ControllerAdvice
public class DefaultExceptionHandler {
	@ExceptionHandler({AuthenticationException.class,BaseRuntimeException.class,BaseException.class,MethodArgumentNotValidException.class})
	@ResponseBody
	public ResponseEntity<Map<String, Object>> conversionErrorHandler(Exception ex){
		Map<String, Object> body = new HashMap<String,Object>();
		if(ex instanceof AuthenticationException){
			return new ResponseEntity<Map<String, Object>>(body, HttpStatus.UNAUTHORIZED);
		}else if(ex instanceof BaseRuntimeException){
			BaseRuntimeException be = (BaseRuntimeException)ex;
			body.put("retcode", be.getRetcode());
			body.put("retmsg", be.getRetmsg());
		}else if(ex instanceof MethodArgumentNotValidException){
			MethodArgumentNotValidException vex = (MethodArgumentNotValidException)ex;
			List<ObjectError> errors = vex.getBindingResult().getAllErrors();
			List<String> list = new ArrayList<String>();
			for(ObjectError error : errors){
				if(error instanceof FieldError){
					FieldError fe = (FieldError) error;
					list.add(fe.getField()+" "+error.getDefaultMessage());
				}else{
					list.add(error.getObjectName()+" "+error.getDefaultMessage());
				}
			}
			body.put("retcode", HttpStatus.BAD_REQUEST.value());
			body.put("retmsg", list);
		}
		return new ResponseEntity<Map<String, Object>>(body, HttpStatus.OK);
	}
}
