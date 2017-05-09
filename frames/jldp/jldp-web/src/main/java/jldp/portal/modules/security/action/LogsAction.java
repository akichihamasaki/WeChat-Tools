package jldp.portal.modules.security.action;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import jldp.portal.core.base.action.BaseAction;
import jldp.portal.modules.security.model.BaseLogs;
import jldp.portal.modules.security.service.ILogsService;

@RestController
@Api("日志表接口")
@RequestMapping("api/security/logs")
public class LogsAction extends BaseAction {
	@Autowired
	@Qualifier("security.LogsService")
	ILogsService logsService;

	@ApiOperation("获取日志表分页数据")
	@RequestMapping(value = "/queryBaseLogs")
	public Page<BaseLogs> queryBaseLogs(@RequestBody Map<String,String> params, Pageable pageable) {
		String startDate = params.get("startDate")== null ? "":params.get("startDate");
		String endDate = params.get("endDate")== null ? "":params.get("endDate");
		String nodeId = params.get("nodeId") == null ? "":params.get("nodeId");
		return logsService.findBaseLogs(startDate, endDate, nodeId, pageable);
//		return logsService.findBaseLogs(pageable);
	}
}
