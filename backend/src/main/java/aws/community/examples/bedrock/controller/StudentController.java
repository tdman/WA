package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.common.CmResponse;
import aws.community.examples.bedrock.common.CmResponseFactory;
import aws.community.examples.bedrock.dto.StudentDto;
import aws.community.examples.bedrock.mapper.StudentMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Description;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
public class StudentController {

    private static final Logger log = LoggerFactory.getLogger(StudentController.class);


    @Autowired
    StudentMapper studentMapper;

  
    @Description("한 학생에 대한 정보 조회")
    @GetMapping("/get/{studentId}")
    public CmResponse<StudentDto> getStudentInfo(@PathVariable String studentId) {
        log.info("Fetching student info for ID: {}", studentId);
        try {
            return CmResponseFactory.success(studentMapper.getStudentInfo(studentId));
        } catch (Exception e) {
            log.error("getStudentInfo err: ", e);
            return CmResponseFactory.fail("학생 정보 조회 실패");
        }
    }

}
