/**
 * @Title: CacheService.java
 * @Package jldp.portal.modules.redis
 * @Description: 缓存管理器
 * Copyright: Copyright (c) 2016
 * Company:北京国安创客
 *
 * @author Comsys-dengzongyu
 * @date 2016年11月24日 下午3:58:39
 * @version V1.0
 */

package jldp.portal.modules.redis;

import java.lang.reflect.Method;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
* @ClassName: CacheService
* @Description: 缓存管理
* @author dengzongyu
* @date 2016年11月24日 下午3:58:39
*
*/
@Configuration
@EnableCaching
public class CacheService extends CachingConfigurerSupport {
	
//	@Value("${spring.redis.defaultExpiration}")
//	String defaultExpiration;

	/**
	 * 默认的key生成器.
	 * @see org.springframework.cache.annotation.CachingConfigurerSupport#keyGenerator()
	 */
	@Bean
	public KeyGenerator keyGenerator(){
		return new KeyGenerator() {
			@Override
			public Object generate(Object arg0, Method arg1, Object... arg2) {
				StringBuilder sb = new StringBuilder();
                sb.append(arg0.getClass().getName());
                sb.append(arg1.getName());
                for (Object obj : arg2) {
                    sb.append(obj.toString());
                }
				return sb.toString();
			}
		};
	}
	
	/**
	 * 缓存管理器
	 * @see org.springframework.cache.annotation.CachingConfigurerSupport#cacheManager()
	 */
	@Bean
	public CacheManager cacheManager(@SuppressWarnings("rawtypes") RedisTemplate redisTemplate){
//		if(StringUtils.isBlank(this.defaultExpiration)){
//			defaultExpiration = "60";
//		}
		RedisCacheManager redisCacheManager = new RedisCacheManager(redisTemplate);
//		redisCacheManager.setDefaultExpiration(Long.valueOf(defaultExpiration));//失效时间秒
		return redisCacheManager;
	}
	
    @SuppressWarnings({ "rawtypes", "unchecked" })
	@Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory factory) {
        StringRedisTemplate template = new StringRedisTemplate(factory);
		Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        template.setValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }
	
}

