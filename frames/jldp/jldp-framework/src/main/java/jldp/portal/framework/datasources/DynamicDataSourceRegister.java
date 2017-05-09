package jldp.portal.framework.datasources;

import com.alibaba.druid.pool.DruidDataSource;
import jldp.portal.framework.components.encry.ENCEncryptProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.GenericBeanDefinition;
import org.springframework.boot.bind.RelaxedPropertyResolver;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.ImportBeanDefinitionRegistrar;
import org.springframework.core.env.Environment;
import org.springframework.core.type.AnnotationMetadata;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

public class DynamicDataSourceRegister
        implements ImportBeanDefinitionRegistrar, EnvironmentAware {

    private static final Logger logger = LoggerFactory.getLogger(DynamicDataSourceRegister.class);

    // 如配置文件中未指定数据源类型，使用该默认值
//    private static final Object DATASOURCE_TYPE_DEFAULT = "org.apache.tomcat.jdbc.pool.DataSource";

    // 数据源
    private DataSource defaultDataSource;
    private Map<String, DataSource> customDataSources = new HashMap<>();

    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        Map<Object, Object> targetDataSources = new HashMap<Object, Object>();
        // 将主数据源添加到更多数据源中
        targetDataSources.put("dataSource", defaultDataSource);
        DynamicDataSourceContextHolder.dataSourceIds.add("dataSource");
        // 添加更多数据源
        targetDataSources.putAll(customDataSources);
        for (String key : customDataSources.keySet()) {
            DynamicDataSourceContextHolder.dataSourceIds.add(key);
        }

        // 创建DynamicDataSource
        GenericBeanDefinition beanDefinition = new GenericBeanDefinition();
        beanDefinition.setBeanClass(DynamicDataSource.class);
        beanDefinition.setSynthetic(true);
        MutablePropertyValues mpv = beanDefinition.getPropertyValues();
        mpv.addPropertyValue("defaultTargetDataSource", defaultDataSource);
        mpv.addPropertyValue("targetDataSources", targetDataSources);
        registry.registerBeanDefinition("dataSource", beanDefinition);

        logger.info("Dynamic DataSource Registry");
    }

    /**
     * 创建DataSource
     *
     * @return
     * @author SHANHY
     * @create 2016年1月24日
     */
    public DataSource buildDataSource(Map<String, Object> dsMap) {
        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setDriverClassName(String.valueOf(dsMap.get("driver-class-name")));
        druidDataSource.setUrl(String.valueOf(dsMap.get("url")));
        druidDataSource.setUsername(String.valueOf(dsMap.get("username")));
        druidDataSource.setPassword(String.valueOf(dsMap.get("password")));
        //下面的如果配置文件没有配置就采用默认配置了
        Object initialSize = dsMap.get("initialSize");
        if(null != initialSize){
            druidDataSource.setInitialSize(Integer.valueOf(initialSize.toString()));
        }
        Object minIdle = dsMap.get("minIdle");
        if(null != minIdle){
            druidDataSource.setMinIdle(Integer.valueOf(minIdle.toString()));
        }
        Object maxActive = dsMap.get("maxActive");
        if(null != maxActive){
            druidDataSource.setMaxActive(Integer.valueOf(maxActive.toString()));
        }
        Object maxWait = dsMap.get("maxWait");
        if(null != maxWait){
            druidDataSource.setMaxWait(Integer.valueOf(maxWait.toString()));
        }
        Object timeBetweenEvictionRunsMillis = dsMap.get("timeBetweenEvictionRunsMillis");
        if(null != timeBetweenEvictionRunsMillis){
            druidDataSource.setTimeBetweenEvictionRunsMillis(Long.valueOf(timeBetweenEvictionRunsMillis.toString()));
        }
        Object minEvictableIdleTimeMillis = dsMap.get("minEvictableIdleTimeMillis");
        if(null != minEvictableIdleTimeMillis){
            druidDataSource.setMinEvictableIdleTimeMillis(Long.valueOf(minEvictableIdleTimeMillis.toString()));
        }
        Object validationQuery = dsMap.get("validationQuery");
        if(null != validationQuery){
            druidDataSource.setValidationQuery(String.valueOf(validationQuery.toString()));
        }
        Object testWhileIdle = dsMap.get("testWhileIdle");
        if(null != testWhileIdle){
            druidDataSource.setTestWhileIdle(Boolean.valueOf(testWhileIdle.toString()));
        }
        Object testOnBorrow = dsMap.get("testOnBorrow");
        if(null != testOnBorrow){
            druidDataSource.setTestOnBorrow(Boolean.valueOf(testOnBorrow.toString()));
        }
        Object testOnReturn = dsMap.get("testOnReturn");
        if(null != testOnReturn){
            druidDataSource.setTestOnReturn(Boolean.valueOf(testOnReturn.toString()));
        }
        Object poolPreparedStatements = dsMap.get("poolPreparedStatements");
        if(null != poolPreparedStatements){
            druidDataSource.setPoolPreparedStatements(Boolean.valueOf(poolPreparedStatements.toString()));
        }
        Object maxPoolPreparedStatementPerConnectionSize = dsMap.get("maxPoolPreparedStatementPerConnectionSize");
        if(null != maxPoolPreparedStatementPerConnectionSize){
            druidDataSource.setMaxPoolPreparedStatementPerConnectionSize(Integer.valueOf(maxPoolPreparedStatementPerConnectionSize.toString()));
        }

        Object filters = dsMap.get("filters");
        if(null != filters){
            try {
                druidDataSource.setFilters(String.valueOf(filters.toString()));
            } catch (SQLException e) {
                logger.error("druid configuration initialization filter", e);
            }
        }
        Object connectionProperties = dsMap.get("connectionProperties");
        if(null != connectionProperties){
            druidDataSource.setConnectionProperties(String.valueOf(connectionProperties.toString()));
        }
        return druidDataSource;
    }

    /**
     * 加载多数据源配置
     */
    @Override
    public void setEnvironment(Environment env) {
        // 读取主数据源
        RelaxedPropertyResolver propertyResolver = new RelaxedPropertyResolver(env, "");
        String messageKey = propertyResolver.getProperty("jasypt.encryptor.password");//解密的密钥，正式环境启动传参，开发环境存放在配置文件中
        //解密所有配置文件
        Map<String,Object> map = propertyResolver.getSubProperties("");
        String decrypMessage = "";//配置文件中需要解密的字符串
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            decrypMessage = entry.getValue().toString();
            if(decrypMessage.startsWith("ENC(")){
                decrypMessage = decrypMessage.substring(4, decrypMessage.length()-1);
                System.setProperty(entry.getKey(),ENCEncryptProperty.getDecrypToryString(messageKey, decrypMessage));
            }
        }
        initDefaultDataSource(env,propertyResolver);
        initCustomDataSources(env,propertyResolver);
    }

    /**
     * 初始化主数据源
     *
     * @author SHANHY
     * @create 2016年1月24日
     */
    public void initDefaultDataSource(Environment env,RelaxedPropertyResolver propertyResolver) {
//        RelaxedPropertyResolver propertyResolver = new RelaxedPropertyResolver(env, "spring.datasource.");
        Map<String, Object> dsMap = propertyResolver.getSubProperties("spring.datasource.");
        defaultDataSource = buildDataSource(dsMap);
    }

    /**
     * 初始化更多数据源
     *
     * @author SHANHY
     * @create 2016年1月24日
     */
    public void initCustomDataSources(Environment env,RelaxedPropertyResolver propertyResolver) {
        // 读取配置文件获取更多数据源，也可以通过defaultDataSource读取数据库获取更多数据源
        propertyResolver = new RelaxedPropertyResolver(env, "custom.datasource.");
        String dsPrefixs = propertyResolver.getProperty("names");
        for (String dsPrefix : dsPrefixs.split(",")) {// 多个数据源
            Map<String, Object> dsMap = propertyResolver.getSubProperties(dsPrefix + ".");
            customDataSources.put(dsPrefix, buildDataSource(dsMap));
        }
    }

}