package jldp.portal.modules.demo.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import jldp.portal.modules.security.model.BaseLogs;

@Mapper
@Repository("demo.baseLogsMapper")
public interface BaseLogsMapper {
	List<Map<String,Object>> selectBaseLogs(BaseLogs logs);
	
	@Select("select * from base_logs where log_id = #{id} or log_id=#{id2}")
	List<Map<String,Object>> queryBaseLogs(@Param("id") String id,@Param("id2") String id2);
	/**
	 * 分页查询。注意：暂时只支持2个参数,不支持多态（方法名不能重复）
	 * @param logs
	 * @param pageable
	 * @return
	 */
	Page<BaseLogs> selectBaseLogs(BaseLogs logs,Pageable pageable);

	Page<BaseLogs> findBaseLogs(Pageable pageable);
}
