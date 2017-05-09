package jldp.portal.modules.demo.action;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import jldp.portal.core.base.action.BaseAction;
import jldp.portal.modules.security.model.BaseUser;
@RestController
@RequestMapping("api/demo")
public class FileUploadAction extends BaseAction{
	@RequestMapping(value="/upload",method=RequestMethod.POST)
	public void fileUpload(HttpServletRequest request){
		System.out.println("------file upload-----");
		if(request instanceof MultipartHttpServletRequest){
			MultipartHttpServletRequest req = (MultipartHttpServletRequest)request;
			for(MultipartFile file : req.getFileMap().values()){
				System.out.println(file.getOriginalFilename()+"::"+file.getSize());
			}
		}else{
			System.out.println("****no file upload!!!");
		}
	}
	@RequestMapping(value="/upload2",method=RequestMethod.POST)
	public void fileUpload2(MultipartFile[] files, @RequestParam BaseUser user){
		System.out.println(files);
	}
}
