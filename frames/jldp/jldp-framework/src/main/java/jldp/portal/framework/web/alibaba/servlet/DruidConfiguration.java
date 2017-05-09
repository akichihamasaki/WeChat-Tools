package jldp.portal.framework.web.alibaba.servlet;

import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DruidConfiguration {

	//private Logger logger = LoggerFactory.getLogger(DruidConfiguration.class);
    //
	//@Value("${spring.datasource.url}")
	//private String dbUrl;
    //
	//@Value("${spring.datasource.username}")
	//private String username;
    //
	//@Value("${spring.datasource.password}")
	//private String password;
    //
	//@Value("${spring.datasource.driver-class-name}")
	//private String driverClassName;
    //
	//@Value("${spring.datasource.initialSize}")
	//private int initialSize;
    //
	//@Value("${spring.datasource.minIdle}")
	//private int minIdle;
    //
	//@Value("${spring.datasource.maxActive}")
	//private int maxActive;
    //
	//@Value("${spring.datasource.maxWait}")
	//private int maxWait;
    //
	//@Value("${spring.datasource.timeBetweenEvictionRunsMillis}")
	//private int timeBetweenEvictionRunsMillis;
    //
	//@Value("${spring.datasource.minEvictableIdleTimeMillis}")
	//private int minEvictableIdleTimeMillis;
    //
	//@Value("${spring.datasource.validationQuery}")
	//private String validationQuery;
    //
	//@Value("${spring.datasource.testWhileIdle}")
	//private boolean testWhileIdle;
    //
	//@Value("${spring.datasource.testOnBorrow}")
	//private boolean testOnBorrow;
    //
	//@Value("${spring.datasource.testOnReturn}")
	//private boolean testOnReturn;
    //
	//@Value("${spring.datasource.poolPreparedStatements}")
	//private boolean poolPreparedStatements;
    //
	//@Value("${spring.datasource.maxPoolPreparedStatementPerConnectionSize}")
	//private int maxPoolPreparedStatementPerConnectionSize;
    //
	//@Value("${spring.datasource.filters}")
	//private String filters;
    //
	//@Value("{spring.datasource.connectionProperties}")
	//private String connectionProperties;

	@Bean
	public ServletRegistrationBean druidStatViewServle() {
		ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(new StatViewServlet(),
				"/druid/*");
		servletRegistrationBean.setName("druidStatViewServle");
		servletRegistrationBean.addInitParameter("resetEnable", "false");
		servletRegistrationBean.addInitParameter("allow", "127.0.0.1");
		// servletRegistrationBean.addInitParameter("deny","192.168.1.73");//黑名单，与白名单同时存在的时候以白名单为准
//		servletRegistrationBean.addInitParameter("loginUsername", "gack");
//		servletRegistrationBean.addInitParameter("loginPassword", "gack2016");
		return servletRegistrationBean;
	}
	@Bean
	public FilterRegistrationBean druidStatFilter() {
		FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean(new WebStatFilter());
		filterRegistrationBean.setName("druidStatFilter");
		filterRegistrationBean.addUrlPatterns("/*");
		filterRegistrationBean.addInitParameter("exclusions", "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");
		return filterRegistrationBean;
	}

    //@Primary
    //@Bean
    //public DataSource druidDataSource() {
    //    DruidDataSource druidDataSource = new DruidDataSource();
    //    druidDataSource.setDriverClassName(this.driverClassName);
    //    druidDataSource.setUrl(this.dbUrl);
    //    druidDataSource.setUsername(username);
    //    druidDataSource.setPassword(password);
    //
		//druidDataSource.setInitialSize(initialSize);
		//druidDataSource.setMinIdle(minIdle);
		//druidDataSource.setMaxActive(maxActive);
		//druidDataSource.setMaxWait(maxWait);
		//druidDataSource.setTimeBetweenEvictionRunsMillis(timeBetweenEvictionRunsMillis);
		//druidDataSource.setMinEvictableIdleTimeMillis(minEvictableIdleTimeMillis);
		//druidDataSource.setValidationQuery(validationQuery);
		//druidDataSource.setTestWhileIdle(testWhileIdle);
		//druidDataSource.setTestOnBorrow(testOnBorrow);
		//druidDataSource.setTestOnReturn(testOnReturn);
		//druidDataSource.setPoolPreparedStatements(poolPreparedStatements);
		//druidDataSource.setMaxPoolPreparedStatementPerConnectionSize(maxPoolPreparedStatementPerConnectionSize);
    //    try {
    //        druidDataSource.setFilters("stat, wall");
    //    } catch (SQLException e) {
		//	logger.error("druid configuration initialization filter", e);
		//}
		//druidDataSource.setConnectionProperties(connectionProperties);
    //    return druidDataSource;
    //}
}
