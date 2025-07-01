package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.common.CmResponse;
import aws.community.examples.bedrock.common.CmResponseFactory;
import aws.community.examples.bedrock.dto.StudentDto;
import aws.community.examples.bedrock.mapper.StudentMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@Tag(name = "로그인 API", description = "로그인 API")
public class LoginController {

    @Autowired
    StudentMapper studentMapper;
    
	@PostMapping("/login")
	public CmResponse<StudentDto> login(@RequestBody StudentDto request) {
		try {
			log.info(request.toString());
            return CmResponseFactory.success(studentMapper.getLogin(request.getStudentId()));
        } catch (Exception e) {
            log.error("LoginControllerlist login : ", e);
            return CmResponseFactory.fail("로그인 실패");
        }
	}

}
