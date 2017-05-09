package jldp.portal.framework.web.converter.json;

import java.io.IOException;
import java.lang.reflect.Type;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.HttpMessageNotWritableException;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.alibaba.fastjson.support.config.FastJsonConfig;
import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter4;
import com.alibaba.fastjson.support.springfox.SwaggerJsonSerializer;

import springfox.documentation.spring.web.json.Json;

@Configuration
@ConditionalOnClass({JSON.class})
public class FastJsonHttpMessageConvertersConfiguration {

    @Configuration
    @ConditionalOnClass({FastJsonHttpMessageConverter4.class})
    @ConditionalOnProperty(
            name = {"spring.http.converters.preferred-json-mapper"},
            havingValue = "fastjson",
            matchIfMissing = false
    )
    protected static class FastJson2HttpMessageConverterConfiguration{
        protected FastJson2HttpMessageConverterConfiguration() {
        }

        @Bean
        @ConditionalOnMissingBean({FastJsonHttpMessageConverter4.class})
        public FastJsonHttpMessageConverter4 fastJsonHttpMessageConverter() {
            FastJsonHttpMessageConverter4 converter = new FastJsonHttpMessageConverter4(){

				protected void writeInternal(Object obj, Type type, HttpOutputMessage outputMessage)
						throws IOException, HttpMessageNotWritableException {
					
					super.writeInternal(obj, type, outputMessage);
				}
            	
            };

            FastJsonConfig fastJsonConfig = new FastJsonConfig();
            fastJsonConfig.setSerializerFeatures(
            		SerializerFeature.WriteMapNullValue,// 输出空置字段
            		SerializerFeature.WriteNullListAsEmpty, // list字段如果为null，输出为[]，而不是null
            		SerializerFeature.WriteNullNumberAsZero, // 数值字段如果为null，输出为0，而不是null
            		SerializerFeature.WriteNullBooleanAsFalse, // Boolean字段如果为null，输出为false，而不是null
            		SerializerFeature.WriteNullStringAsEmpty, // 字符类型字段如果为null，输出为""，而不是null
            		SerializerFeature.DisableCircularReferenceDetect,//关闭引用检测和生成
            		SerializerFeature.WriteDateUseDateFormat,
            		SerializerFeature.PrettyFormat/*,
                    SerializerFeature.WriteClassName*/
            );
//            ValueFilter valueFilter = new ValueFilter() {
//                //o 是class
//                //s 是key值
//                //o1 是value值
//                public Object process(Object o, String s, Object o1) {
//                    if (null == o1){
//                        o1 = "";
//                    }
//                    return o1;
//                }
//            };
            //fastJsonConfig.setSerializeFilters(valueFilter);

            fastJsonConfig.getSerializeConfig().put(Json.class, SwaggerJsonSerializer.instance);
            converter.setFastJsonConfig(fastJsonConfig);
            return converter;
        }
    }
}
