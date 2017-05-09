package jldp.portal.framework.components.encry;

import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.StandardPBEByteEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;

import jldp.portal.utils.StringUtils;

/**
 * 
 * @ProjectName statistics-web<br/>
 * @Package com.gack.modules.fsdt.controller<br/>
 * @ClassName ENCEncryptProperty.java<br/>
 * @Description [信息加密解密工具类]<br/>
 * @Author dengzy<br/>
 * @CreateDate 2016年10月31日下午3:17:24<br/>
 * @UpdateUser <br/>
 * @UpdateDate 2016年10月31日下午3:17:24<br/>
 * @UpdateRemark <br/>
 * @Version 1.0
 */
public class ENCEncryptProperty{

    /**
     * @Title: encrypToryString   
     * @Description: 信息加密方法     
     * @param key 加密密钥
     * @return 加密信息
     * @author: dengzy
     * @CreateDate 2016年11月2日
     */
    private static StringEncryptor encrypToryString(String key){
    	if(!StringUtils.isNotEmpty(key)){
    		return null;
    	}
    	PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
    	SimpleStringPBEConfig config = new SimpleStringPBEConfig();
    	config.setPassword(key);
    	config.setAlgorithm(StandardPBEByteEncryptor.DEFAULT_ALGORITHM);
    	config.setKeyObtentionIterations(StandardPBEByteEncryptor.DEFAULT_KEY_OBTENTION_ITERATIONS);
    	config.setPoolSize(StandardPBEByteEncryptor.DEFAULT_SALT_SIZE_BYTES);
    	config.setStringOutputType("base64");
    	encryptor.setConfig(config);
    	return encryptor;
    }
    
    /**
     * 
     * @Title: getEncrypToryString   
     * @Description: 加密字符串      
     * @param key 加密密钥
     * @param message 需要加密的字符串
     * @return 加密后的字符串
     * @author: dengzy
     * @CreateDate 2016年11月2日
     */
    public static String getEncrypToryString(String key,String message){
    	if(!StringUtils.isNotEmpty(key) || !StringUtils.isNotEmpty(message)){
    		return null;
    	}
    	return encrypToryString(key).encrypt(message);
    }
 
    /**
     * @Title: getDecrypToryString   
     * @Description: 解密加密的字符串   
     * @param key 解密字符串对应的key
     * @param message 需要解密的字符串
     * @return 解密后的字符串
     * @author: dengzy
     * @CreateDate 2016年11月2日
     */
    public static String getDecrypToryString(String key,String message){
    	if(!StringUtils.isNotEmpty(key) || !StringUtils.isNotEmpty(message)){
    		return null;
    	}
    	return encrypToryString(key).decrypt(message);
    }
    
}
