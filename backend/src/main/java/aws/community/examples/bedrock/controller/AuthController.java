package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.common.CmResponse;
import aws.community.examples.bedrock.common.CmResponseFactory;
import aws.community.examples.bedrock.dto.StudentDto;
import aws.community.examples.bedrock.mapper.StudentMapper;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    StudentMapper studentMapper;
    
	@PostMapping("/signup")
	public CmResponse<StudentDto> signup(@RequestBody StudentDto request) {

		try {
			int result = studentMapper.saveStudent(request);
            return CmResponseFactory.success(request);
          
        } catch (Exception e) {
            log.error("AuthController signup : ", e);
            return CmResponseFactory.fail("학생 등록 실패");
        }
		
	}

}
