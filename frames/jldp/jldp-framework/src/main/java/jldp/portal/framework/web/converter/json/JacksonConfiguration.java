package jldp.portal.framework.web.converter.json;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;

@Configuration
@ConditionalOnClass(Hibernate5Module.class)
public class JacksonConfiguration {
	@Bean
	public Module  Hibernate5Module(){
		return new Hibernate5Module();
	}
}
