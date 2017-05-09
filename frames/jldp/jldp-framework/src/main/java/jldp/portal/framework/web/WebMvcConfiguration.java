package jldp.portal.framework.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.BasicErrorController;
import org.springframework.boot.autoconfigure.web.DefaultErrorAttributes;
import org.springframework.boot.autoconfigure.web.ErrorAttributes;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import jldp.portal.framework.web.annotation.repeated.AvoidDuplicateSubmissionInterceptor;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
@EnableRedisHttpSession
public class WebMvcConfiguration extends WebMvcConfigurerAdapter{
	@Autowired
	private ServerProperties properties;
	@Bean
	public ErrorAttributes errorAttributes() {
		return new DefaultErrorAttributes();
	}
	@Bean
	public BasicErrorController basicErrorController(ErrorAttributes errorAttributes) {
		return new JldpBasicErrorController(errorAttributes, this.properties.getError());
	}
	
	@Bean(name="dev")
	@Profile("dev")
	public Docket createRestDevApi() {
		return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).select()
				.apis(RequestHandlerSelectors.basePackage("com.gack.itsystem")).paths(PathSelectors.any())
				.build();
	}
	
	@Bean(name="test")
	@Profile("test")
	public Docket createRestTestApi() {
		return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).select()
				.apis(RequestHandlerSelectors.basePackage("com.gack.itsystem")).paths(PathSelectors.any())
				.build();
	}
	
	@Bean(name="pro")
	@Profile("pro")
	public Docket createRestProApi() {
		return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).select()
				.apis(RequestHandlerSelectors.basePackage("xxx")).paths(PathSelectors.any())
				.build();
	}

	@SuppressWarnings("deprecation")
	private ApiInfo apiInfo() {
//		Contact con = new Contact("国安创客API","www.gack.citic","dengzongyu@genesis-china.com");
		return new ApiInfoBuilder().title("IT信息系统集成API列表").description("提供给移动端开发人员查阅的API接口")
				.termsOfServiceUrl("www.gack.citic").contact("").version("1.0").build();
	}

	public void addInterceptors(InterceptorRegistry registry){
		registry.addInterceptor(new AvoidDuplicateSubmissionInterceptor()).addPathPatterns("/api/gack/**/*Controller/**");
	}
}
