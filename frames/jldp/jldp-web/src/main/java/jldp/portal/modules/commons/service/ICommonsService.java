package jldp.portal.modules.commons.service;

import java.util.Date;

public interface ICommonsService {
	
	void init();
	/**
	 * 生成整型序列号
	 * 
	 * @param tableName
	 * @param columnName
	 * @param allocationSize
	 * @return
	 */
	int getNextSeqVal(String tableName, String columnName, int allocationSize);

	/**
	 * 生成UUID2
	 * 
	 * @return
	 */
	String UUID();

	/**
	 * 获取数据库时间
	 * 
	 * @return
	 */
	Date getDBDate();
	
	/**
	 * 获取格式化后的序列号 ,格式化的模式，请参考DecimalFormat
	 * 
	 * @param format
	 * @param seq
	 * 
	 * @return
	 */
	String genFormatSeq(String format, int seq);
}