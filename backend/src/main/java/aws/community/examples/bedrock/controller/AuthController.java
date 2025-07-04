package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.common.CmResponse;
import aws.community.examples.bedrock.common.CmResponseFactory;
import aws.community.examples.bedrock.dto.StudentDto;
import aws.community.examples.bedrock.mapper.StudentMapper;

import aws.community.examples.bedrock.service.ProgressService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;

import org.springframework.context.annotation.Description;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "인증 및 사용자 관리 API", description = "인증 및 사용자 관리 API")

public class AuthController {

    private final StudentMapper studentMapper;
    private final ProgressService progressService;

	@PostMapping("/signup")
	public CmResponse<StudentDto> signup(@RequestBody StudentDto request) {

		try {
			int result = studentMapper.saveStudent(request);
            return CmResponseFactory.success(request);
          
        } catch (Exception e) {
            log.error("AuthController signup : ", e);
            return CmResponseFactory.fail(false, e.getMessage(), request);
        }
		
	}

    @Description("최근 1주일 학습내용 기반 피드백 확인")
    @PostMapping("/{studentId}/progress")
    public ResponseEntity<String> getProgress(@PathVariable String studentId) {
        String progress = progressService.generateProgress(studentId);
        return ResponseEntity.ok(progress);
    }

}
