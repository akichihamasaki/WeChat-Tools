package jldp.portal.modules.commons.service.impl;

import java.text.DecimalFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

import jldp.portal.modules.commons.dao.DbDateRepository;
import jldp.portal.modules.commons.dao.SeqGenRepository;
import jldp.portal.modules.commons.model.DbDate;
import jldp.portal.modules.commons.model.SeqGen;
import jldp.portal.modules.commons.service.ICommonsService;

@Service("commons.commonsService")
public class CommonsServiceImpl implements ICommonsService{
	/**
	 * 默认步长
	 */
	public final static int SEQ_ALLOCATION_SIZE = 1;

	/**
	 * 默认初始值
	 */
	public final static int SEQ_INITIAL_VALUE = 1;

	@Autowired
	@Qualifier("commons.seqGenRepository")
	private SeqGenRepository seqGenRepository;

	@Autowired
	@Qualifier("commons.dbDateRepository")
	DbDateRepository dbDateRepository;
	
    @Autowired
	private TransactionTemplate transactionTemplate;
    
    /**
     * @PostConstruct 表示初始化完成后执行，此方法无法加@Transactional
     * 解决方案:1.使用PlatformTransactionManager,此次使用此方法
     * 2.调用另一接口类的接口方法，事务在另一接口类方法实现上，推荐使用此方法
     */
    @PostConstruct
    public void afterPropertiesSet(){
    	transactionTemplate.execute(new TransactionCallbackWithoutResult() {
			protected void doInTransactionWithoutResult(TransactionStatus status) {
				init();
			}
		});
    }
    
	public void init()  {
		List<DbDate> list=dbDateRepository.findAll();
		int cnt = list.size();
		if(cnt!=1){
			dbDateRepository.deleteAll();
			DbDate dd = new DbDate("0");
			dbDateRepository.save(dd);
		}
	}
	@Transactional
	public int getNextSeqVal(String tableName, String columnName, int allocationSize) {
		if (StringUtils.isBlank(tableName) || StringUtils.isBlank(columnName)) {
			return -1;
		}

		if (allocationSize <= 0)
			allocationSize = SEQ_ALLOCATION_SIZE;

		String id = tableName + "-" + columnName;
		SeqGen gen = seqGenRepository.findSeqForUpdate(id);

		if (gen == null) {
			gen = new SeqGen();
			gen.setId(id);
			gen.setTableName(tableName);
			gen.setColumnName(columnName);
			gen.setColumnValue(SEQ_INITIAL_VALUE);
			gen = seqGenRepository.save(gen);
		} else {
			int columnValue = gen.getColumnValue() + allocationSize;
			gen.setColumnValue(columnValue);
			gen = seqGenRepository.save(gen);
		}
		return gen.getColumnValue();
	}
	
	public String genFormatSeq(String format, int seq) {

		DecimalFormat df = new DecimalFormat(format);

		return df.format(seq);
	}

	public String UUID() {
		return UUID.randomUUID().toString();
	}

	public Date getDBDate() {
		return dbDateRepository.selectDbSysDate();
	}
}
