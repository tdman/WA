package aws.community.examples.bedrock.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import aws.community.examples.bedrock.dto.StudentRequest;
import aws.community.examples.bedrock.dto.StudentResponse;
import aws.community.examples.bedrock.service.StudentService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
public class StudentController {

    private static final Logger log = LoggerFactory.getLogger(StudentController.class);

    private final StudentService studentService;

    @PostMapping("/test")
    public StudentResponse createStudent(@RequestBody StudentRequest request) {
    	StudentResponse response = null;
    			
       try {
    	log.info(request.toString());
    	response =   studentService.createStudent(request);
       } catch (Exception e) {
       	log.info(e.toString());
       }
       return response;
    }
}
