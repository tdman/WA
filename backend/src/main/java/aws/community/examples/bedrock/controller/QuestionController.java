package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.common.CmResponse;
import aws.community.examples.bedrock.common.CmResponseFactory;
import aws.community.examples.bedrock.dto.ChatRequest;
import aws.community.examples.bedrock.dto.ChatResponse;
import aws.community.examples.bedrock.dto.FeedbackDto;
import aws.community.examples.bedrock.dto.QuestionSearchRequest;
import aws.community.examples.bedrock.dto.QuestionSearchResponse;
import aws.community.examples.bedrock.dto.SaveQuestionResultRequest;
import aws.community.examples.bedrock.dto.StudentDto;
import aws.community.examples.bedrock.service.FeedbackService;
import aws.community.examples.bedrock.service.QuestionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
@Tag(name = "문제 API", description = "문제 조회 API")
public class QuestionController {

    private final QuestionService questionService;
    private final FeedbackService feedbackService;

    @PostMapping("/search")
    public List<QuestionSearchResponse> searchQuestions(@RequestBody QuestionSearchRequest request) {
        return questionService.searchQuestions(request);
    }

    // StudentController 에 만들고 싶은데 Student 쪽에는 ServiceImpl 이 없어서 임시로 이쪽에 생성함
    @PostMapping("/{studentId}/results")
    public Map<String, Object> saveResults(
            @PathVariable String studentId,
            @RequestBody List<SaveQuestionResultRequest> requestList
    ) {
        String attemptId = questionService.saveQuestionResults(studentId, requestList);
        return Map.of(
                "message", "문제 결과 저장 완료",
                "resultId", attemptId
        );
    }

    @PostMapping("/feedback")
    public CmResponse<ResponseEntity<ChatResponse>> feedback(@RequestBody FeedbackDto request) {
	    try {
			log.info(request.toString());
	        return CmResponseFactory.success(ResponseEntity.ok(feedbackService.getResponse(request)));
	    } catch (Exception e) {
	        log.error("getStudentInfo err: ", e);
	        return CmResponseFactory.fail("문제풀이 피드백 실패");
	    }
	}

}