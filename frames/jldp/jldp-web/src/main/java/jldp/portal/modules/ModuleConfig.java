package jldp.portal.modules;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.session.web.http.HeaderHttpSessionStrategy;
import org.springframework.session.web.http.HttpSessionStrategy;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * 模块配置文件。此package下所有注解生效。
 * 新建项目或模块参考此模块配置
 * 
 * @author zhongli
 *
 */
//必须 spring configurate 每个配置都需要
@Configuration
//restful api 暂不使用
//@EnableSwagger2
//开启事物管理 不需要重复配置
@EnableTransactionManagement
//开启 redis session 不需要重复配置，理论上应该在属性文件中配置
//@EnableRedisHttpSession
//扫描此package下所有的组件 每个项目或模块都需要配置
@ComponentScan
//Jpa 配置 jldp-web使用 未使用jpa项目或模块不需要配置此项
@EntityScan
//Jpa 配置 jldp-web使用 未使用jpa项目或模块不需要配置此项
@EnableJpaRepositories
//mybatis 配置 使用mybatis，扫描basepackage下的所有mybaits配置 项目或模块都需要配置此项 注意参数
//@MapperScan(basePackageClasses = ModuleConfig.class, annotationClass = Mapper.class)
public class ModuleConfig extends WebMvcConfigurerAdapter {
	
	/**
	 * 配置session id。在http header中使用x-auth-token设置session id
	 * 以后可能会扩展成session id为userid
	 * @return
	 */
	@Bean
	public HttpSessionStrategy httpSessionStrategy() {
		return new HeaderHttpSessionStrategy(); 
	}
	
}
