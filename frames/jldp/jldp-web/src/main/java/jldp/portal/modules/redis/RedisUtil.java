/**
 * @Title: RedisUtil.java
 * @Package jldp.portal.utils
 * @Description: 缓存工具类
 * Copyright: Copyright (c) 2016
 * Company:北京国安创客
 * @author Comsys-dengzongyu
 * @date 2016年11月24日 下午4:56:18
 * @version V1.0
 */
package jldp.portal.modules.redis;

import java.io.Serializable;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

/**
 * @ClassName: RedisUtil
 * @Description: 缓存工具
 * @author dengzongyu
 * @date 2016年11月24日 下午4:56:18
 *
 */
@Component
public class RedisUtil {

	@SuppressWarnings("rawtypes")
	@Autowired
	private RedisTemplate redisTemplate;

	/**
	 * 
	 * remove:批量删除对应的value
	 * @author dengzongyu
	 * @param keys
	 * @since JDK 1.8
	 */
	public void remove(final String... keys) {
		for (String key : keys) {
			remove(key);
		}
	}

	/**
	 * 
	 * removePattern:模糊删除所有的key
	 * @author dengzongyu
	 * @param pattern 模糊的key串
	 * @since JDK 1.8
	 */
	@SuppressWarnings("unchecked") 
	public void removePattern(final String pattern) {
		Set<Serializable> keys = redisTemplate.keys(pattern);
		if (keys.size() > 0)
			redisTemplate.delete(keys);
	}

	/**
	 * 
	 * remove:删除对应的value
	 * @author dengzongyu
	 * @param key
	 * @since JDK 1.8
	 */
	@SuppressWarnings("unchecked") 
	public void remove(final String key) {
		if (exists(key)) {
			redisTemplate.delete(key);
		}
	}

	/**
	 * exists:判断缓存中是否有对应的value
	 * @author dengzongyu
	 * @param key
	 * @return true存在，false不存在
	 * @since JDK 1.8
	 */
	@SuppressWarnings("unchecked")
	public boolean exists(final String key) {
		return redisTemplate.hasKey(key);
	}

	/**
	 * 
	 * get:读取缓存
	 *
	 * @author dengzongyu
	 * @param key
	 * @return
	 * @since JDK 1.8
	 */
	@SuppressWarnings("unchecked")
	public Object get(final String key) {
		Object result = null;
		ValueOperations<Serializable, Object> operations = redisTemplate.opsForValue();
		result = operations.get(key);
		return result;
	}

	/**
	 * 
	 * set:写入缓存
	 * @author dengzongyu
	 * @param key 对应的key
	 * @param value 对应的值
	 * @return
	 * @since JDK 1.8
	 */
	@SuppressWarnings("unchecked")
	public boolean set(final String key, Object value) {
		boolean result = false;
		try {
			ValueOperations<Serializable, Object> operations = redisTemplate.opsForValue();
			operations.set(key, value);
			result = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	/**
	 * set:写入缓存，并设置失效时间
	 * @author dengzongyu
	 * @param key key键
	 * @param value value值
	 * @param expireTime 失效时间
	 * @return 是否成功
	 * @since JDK 1.8
	 */
	@SuppressWarnings("unchecked")
	public boolean set(final String key, Object value, Long expireTime) {
		boolean result = false;
		try {
			ValueOperations<Serializable, Object> operations = redisTemplate.opsForValue();
			operations.set(key, value);
			redisTemplate.expire(key, expireTime, TimeUnit.SECONDS);
			result = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

}
