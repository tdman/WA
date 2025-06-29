package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.dto.StudentDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private static final Logger log = LoggerFactory.getLogger(AuthController.class);

	@PostMapping("/signup")
	public StudentDto signup(@RequestBody StudentDto request) {
		//TODO 오희진 로직작성 필요
		StudentDto result = new StudentDto();
		result.setStudentId(request.getStudentId());
		result.setName("오히디니");
		log.info("TEST [{}]", "끼히히히히히");
		return result;
	}

}
