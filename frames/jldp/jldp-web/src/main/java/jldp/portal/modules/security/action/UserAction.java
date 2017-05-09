package jldp.portal.modules.security.action;

import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import jldp.portal.core.base.action.BaseAction;
import jldp.portal.core.exception.action.GenericActionException;
import jldp.portal.core.exception.service.GenericServiceException;
import jldp.portal.core.exception.service.ServiceException;
import jldp.portal.framework.core.authentication.JldpUser;
import jldp.portal.framework.core.authentication.annotation.CurrentUser;
import jldp.portal.framework.core.authentication.annotation.Security;
import jldp.portal.modules.security.model.BaseUser;
import jldp.portal.modules.security.model.BaseUserDto;
import jldp.portal.modules.security.model.UserHead;
import jldp.portal.modules.security.service.IUserService;

@RestController
@Api("用户表接口")
@RequestMapping("api/security/user")
public class UserAction extends BaseAction {
	@Autowired
	@Qualifier("security.userService")
	IUserService userService;

	@ApiOperation("获取用户列表")
	@RequestMapping(value = "/queryUser", method = RequestMethod.GET)
	public Page<BaseUser> queryUser(String nodeName, String userName, Pageable pageable) {
		return userService.findUser(nodeName, userName, pageable);
	}

	@ApiOperation("根据用户Id获取用户信息")
	@RequestMapping(value = "/getUser", method = RequestMethod.GET)
	public BaseUser getUser(String userid) {
		return userService.getBaseUser(userid);
	}

	@ApiOperation("根据用户Id获取用户信息")
	@RequestMapping(value = "/getUserRole", method = RequestMethod.GET)
	public BaseUser getUserRole(String userid) {
		return userService.getUserAndRole(userid);
	}

	@ApiOperation("获取当前用户信息")
	@RequestMapping(value = "/getCurrentUser", method = RequestMethod.GET)
	public BaseUser getCurrentUser(@CurrentUser JldpUser auth) {
		if (auth == null) {
			throw new GenericActionException(1002, "session is not exist!");
		}

		return userService.getBaseUser(auth.getUserid());
	}

	/**
	 * @param auth
	 * @param user
	 * @return 1001:用户名存在 1010:人员已有用户名 1100:其他
	 */
	@ApiOperation("保存用户")
	@RequestMapping(value = "/saveUser", method = RequestMethod.POST)
	@Security
	public BaseUser saveUser(@CurrentUser JldpUser auth, @RequestBody BaseUser user) {
		try {
			if (StringUtils.isNotBlank(user.getUserid()))// 修改
				return userService.saveUser(user);
			else {// 新增
				if (userService.isExistUsername(user.getUsername()))
					throw new GenericActionException(1001, "userName:" + user.getUsername() + ",is exist!");
				else {
					Assert.notNull(user.getEmployee());
					user.setCreator(auth.getUserid());
					return userService.saveUser(user);
				}
			}
		} catch (ServiceException ex) {
			throw new GenericActionException(ex.getRetcode(), "service:" + ex.getRetmsg());
		}
	}

	@ApiOperation("保存当前用户")
	@RequestMapping(value = "/saveCurrentUser", method = RequestMethod.POST)
	@Security
	public BaseUser saveCurrentUser(@CurrentUser JldpUser auth, @RequestBody BaseUser user) {
		if (auth == null) {
			throw new GenericActionException(1002, "session is not exist!");
		}

		user.setUserid(auth.getUserid());

		return userService.saveUser(user);
	}

	@ApiOperation("保存用户角色")
	@RequestMapping(value = "/saveUserRole", method = RequestMethod.POST)
	public void saveUserRole(@RequestBody BaseUserDto user, @CurrentUser JldpUser jldpUser) {
		userService.saveUserRole(user, jldpUser.getUserid());
	}

	@ApiOperation("修改当前用户密码")
	@RequestMapping(value = "/updatePassword", method = RequestMethod.POST)
	@Security
	public void updatePassword(@CurrentUser JldpUser auth, @RequestBody BaseUser user) {
		// creator中暂存原密码
		try {
			userService.updateUserPassword(user.getCreator(), user.getPassword(), auth.getUserid());
		} catch (GenericServiceException e) {
			throw new GenericActionException(e.getRetcode(), e.getMessage());
		}
	}

	@ApiOperation("修改用户密码")
	@RequestMapping(value = "/updateUserPassword", method = RequestMethod.POST)
	public void updateUserPassword(@RequestBody BaseUser user) {
		BaseUser po = userService.getBaseUser(user.getUserid());
		if (po == null) {
			throw new GenericActionException(1010, "user not exist !");
		} else {
			userService.updateUserPassword(user.getPassword(), po.getUserid());
		}
	}

	@ApiOperation("修改用户状态")
	@RequestMapping(value = "/updateUserStatus", method = RequestMethod.POST)
	public BaseUser updateUserStatus(@RequestBody BaseUser user) {
		BaseUser bUser = userService.getBaseUser(user.getUserid());
		bUser.setStatus(user.getStatus());
		userService.updateBaseUserStatus(bUser.getUserid(), bUser.getStatus());
		return bUser;
	}

	@ApiOperation("保存用户头像")
	@RequestMapping(value = "/saveIcon", method = RequestMethod.POST)
	@Security
	public void saveIcon(@CurrentUser JldpUser auth, HttpServletRequest req) {

		// Charset charset = Charset.forName("UTF-8");

		DataInputStream in = null;

		try {
			in = new DataInputStream(req.getInputStream());

			int rc = 0;
			ByteArrayOutputStream swap = new ByteArrayOutputStream();
			byte[] buff = new byte[100];

			while ((rc = in.read(buff, 0, 100)) > 0) {
				swap.write(buff, 0, rc);
			}
			// String s = new String(swap.toByteArray(), charset);
			// s = s.replaceAll("data:image/png;base64,", "");
			// byte[] decode = Base64.decodeBase64(s.getBytes(charset));

			UserHead head = new UserHead();
			head.setUserid(auth.getUserid());
			head.setImg(swap.toByteArray());
			userService.saveUserHeadImg(head);

		} catch (IOException e1) {
			throw new GenericActionException(1004, "img upload error !");
		}
	}

	@ApiOperation("获取用户头像")
	@RequestMapping(value = "/getIcon", method = RequestMethod.GET)
	@Security
	public UserHead getIcon(@CurrentUser JldpUser auth) {
		UserHead head = userService.getUserHeadImg(auth.getUserid());
		if (head != null) {
			String base64 = new String(head.getImg());
			head.setFileName(base64);
			return head;
		} else {
			return null;
		}

		// res.setContentType(MediaType.IMAGE_PNG_VALUE);
		// OutputStream ots = new ByteArrayOutputStream();
		// try {
		// ots = res.getOutputStream();
		// ots.write(head.getImg());
		// ots.flush();
		// ots.close();
		// } catch (IOException e) {
		// throw new GenericActionException(1005, "get head img error !");
		// }
	}

	@ApiOperation("删除用户头像")
	@RequestMapping(value = "/deleteIcon", method = RequestMethod.GET)
	@Security
	public void deleteIcon(@CurrentUser JldpUser auth) {
		userService.deleteUserHeadImg(auth.getUserid());
	}
}