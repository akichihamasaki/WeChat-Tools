package jldp.portal.modules;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter;
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled=true)
public class JldpSecurityConfiguration extends WebSecurityConfigurerAdapter {


	public JldpSecurityConfiguration() {
		//关闭默认配置
		super(true);
	}
	/**
	 * 密码加密
	 * 
	 * @return
	 */
	@Bean
	@Order(Ordered.LOWEST_PRECEDENCE)
	public PasswordEncoder passwordEncoder(){
		return new BCryptPasswordEncoder();
	}
//	/**
//	 * 设置Gold AuthenticationManagerBuilder
//	 * 不知为何，AuthenticationManager自动装载使用的是全局AuthenticationAuthenticationManager
//	 * 此AuthenticationManager由spring boot设置成InMemory UserDatailsService,待深入研究后优化
//	 * @param auth
//	 * @throws Exception
//	 */
	//@Autowired
//	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception{
//		UserDetailsService userDetailsService = this.getSingleBeanOrNull(UserDetailsService.class);
//		if(userDetailsService!=null){
//			DaoAuthenticationConfigurer<AuthenticationManagerBuilder, UserDetailsService> daoAuthenticationConfigurer = auth.userDetailsService(userDetailsService);
//			PasswordEncoder passwordEncoder = this.getSingleBeanOrNull(PasswordEncoder.class);
//			if(passwordEncoder!=null){
//				daoAuthenticationConfigurer.passwordEncoder(passwordEncoder);
//			}
//			
//		}
//	}
//	@Bean("security.authenticationManager")
//	@Override
//	public AuthenticationManager authenticationManagerBean() throws Exception {
//		return super.authenticationManagerBean();
//	}

	/* 
	 * 不使用默认配置，如login、logout。
	 * java只做服务，web交给nodejs或其他前端处理
	 * @see org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter#configure(org.springframework.security.config.annotation.web.builders.HttpSecurity)
	 */
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable()
		.addFilter(new WebAsyncManagerIntegrationFilter())
		.exceptionHandling().and()
		//TODO 有风险为知
//		.headers().and()
		.sessionManagement().and()
		.securityContext().and()
		.requestCache()/*.and()
		.anonymous().and()
		.servletApi().and()
		.apply(new DefaultLoginPageConfigurer<HttpSecurity>()).and()
		.logout()*/;	
		
	}
	
//	private <T> T getSingleBeanOrNull(Class<T> type) {
//		String[] beanNamesForType = this.getApplicationContext().getBeanNamesForType(type);
//		if (beanNamesForType == null || beanNamesForType.length == 0) {
//			return null;
//		}
//		return this.getApplicationContext().getBean(beanNamesForType[0], type);
//	}	
}
