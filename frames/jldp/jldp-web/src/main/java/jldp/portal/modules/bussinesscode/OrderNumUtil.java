/**
 * @Title: OrderNumUtil.java
 * @Package jldp.portal.modules.bussinesscode
 * Copyright: Copyright (c) 2016
 * Company:北京国安创客
 * @author BambooJN-dengzongyu
 * @date 2016年12月9日 下午3:44:14
 * @version V1.0
 */

package jldp.portal.modules.bussinesscode;

import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;

import jldp.portal.framework.context.BeanTools;
import jldp.portal.modules.redis.RedisUtil;
import jldp.portal.utils.IPUtils;

/**
 * @ClassName: OrderNumUtil
 * @Description: 获取订单编号辅助类
 * @author dengzongyu
 * @date 2016年12月9日 下午3:44:14
 *
 */
public class OrderNumUtil {

	@Autowired
	private RedisUtil redisUtil;

	private final long twepoch = 1288834974657L;
	private final long workerIdBits = 5L;
	private final long datacenterIdBits = 5L;
	private final long maxWorkerId = -1L ^ (-1L << workerIdBits);
	private final long maxDatacenterId = -1L ^ (-1L << datacenterIdBits);
	private final long sequenceBits = 12L;
	private final long workerIdShift = sequenceBits;
	private final long datacenterIdShift = sequenceBits + workerIdBits;
	private final long timestampLeftShift = sequenceBits + workerIdBits + datacenterIdBits;
	private final long sequenceMask = -1L ^ (-1L << sequenceBits);

	private static long workerId;
	private static long datacenterId;
	private long sequence = 0L;
	private long lastTimestamp = -1L;
	
	volatile private static OrderNumUtil instance = null;

	private OrderNumUtil(long workerId, long datacenterId) {
		if (workerId > maxWorkerId || workerId < 0) {
			throw new IllegalArgumentException(
					String.format("worker Id can't be greater than %d or less than 0", maxWorkerId));
		}
		if (datacenterId > maxDatacenterId || datacenterId < 0) {
			throw new IllegalArgumentException(
					String.format("datacenter Id can't be greater than %d or less than 0", maxDatacenterId));
		}
		OrderNumUtil.workerId = workerId;
		OrderNumUtil.datacenterId = datacenterId;
	}

	public static OrderNumUtil getInstance() {
        if(null == instance){
        	synchronized (OrderNumUtil.class) {  
		        if(null == instance){//二次检查  
		            instance = new OrderNumUtil(workerId,datacenterId);  
		        }  
		    } 
		} 
        return instance;  
    }  
	
	private synchronized long getNextId() {
		long timestamp = timeGen();
		if (timestamp < lastTimestamp) {
			throw new RuntimeException(String.format(
					"Clock moved backwards.  Refusing to generate id for %d milliseconds", lastTimestamp - timestamp));
		}
		if (lastTimestamp == timestamp) {
			sequence = (sequence + 1) & sequenceMask;
			if (sequence == 0) {
				timestamp = tilNextMillis(lastTimestamp);
			}
		} else {
			sequence = 0L;
		}

		lastTimestamp = timestamp;

		return ((timestamp - twepoch) << timestampLeftShift) | (datacenterId << datacenterIdShift)
				| (workerId << workerIdShift) | sequence;
	}

	private long tilNextMillis(long lastTimestamp) {
		long timestamp = timeGen();
		while (timestamp <= lastTimestamp) {
			timestamp = timeGen();
		}
		return timestamp;
	}

	private long timeGen() {
		return System.currentTimeMillis();
	}
	
	/**
	 * nextId:获取流水号.
	 * @author dengzongyu
	 * @param bussinessCode
	 * @return
	 * @since JDK 1.8
	 */
	public String nextId(String bussinessCode){
		OrderNumUtil ord = getBussinessOrder(bussinessCode);
		return String.valueOf(ord.getNextId());
	}

	/**
	 * getOrderNum: 获取订单编号
	 * @author dengzongyu
	 * @param bussinessCode 业务系统号
	 * @return 订单编号
	 * @since JDK 1.8
	 */
	public String getOrderNum(String bussinessCode) {
		// 1.判断业务系统是否有订单号
		// 2.没有产生过订单号，写入业务系统_ORDER:IP,机器码为1
		// 3.产生过订单号，获取IP,IP2,IP3计算长度，获取机器码为N+1
		// 4.产生订单号
		OrderNumUtil ord = getBussinessOrder(bussinessCode);
		String timeStr = LocalTime.now().toString();//当前时常
		timeStr = timeStr.substring(timeStr.lastIndexOf(":")+1, timeStr.length()).replace(".", "");
		String idStr = String.valueOf(ord.getNextId());
		return new StringBuffer(bussinessCode).append(timeStr).append(idStr.substring(9, idStr.length())).toString();
	}
	
	/**
	 * 
	 * getBussinessOrder:组合获取机器码
	 * @author dengzongyu
	 * @param bussinessCode 业务系统标识
	 * @return 业务系统当前进行产生订单的机器码
	 * @since JDK 1.8
	 */
	private OrderNumUtil getBussinessOrder(String bussinessCode){
		String bussinessKey = "ORDER_" + bussinessCode;
		int machineNo = 0;// 机器编号
		String curIp = IPUtils.getLocalIp();
		if(null == redisUtil){
			redisUtil = (RedisUtil) BeanTools.getBean(RedisUtil.class);
		}
		boolean machineOrder = redisUtil.exists(bussinessKey);
		if (machineOrder) {
			// 已经存在产生订单的机器
			String bussMacs = redisUtil.get(bussinessKey).toString();
			String[] machineIps = bussMacs.split(",");
			if (bussMacs.contains(curIp)) {
				// 已经注册过的机器，马丹- -真应该用zk
				for (String string : machineIps) {
					if (curIp.equals(string)) {
						machineNo++;
						break;
					}
					machineNo++;
				}
			} else {
				// 新加机器
				machineNo = machineIps.length;
			}
		} else {
			// 从来没有产生过订单
			redisUtil.set(bussinessKey, curIp);
			machineNo = 1;
		}
		OrderNumUtil.workerId = machineNo;
		OrderNumUtil.datacenterId = 0;//就1个机房
		return OrderNumUtil.getInstance();
	}

}
