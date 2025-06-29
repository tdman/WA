package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.dto.QuestionSearchRequest;
import aws.community.examples.bedrock.dto.QuestionSearchResponse;
import aws.community.examples.bedrock.dto.SaveQuestionResultRequest;
import aws.community.examples.bedrock.service.QuestionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
@Tag(name = "문제 API", description = "문제 조회 API")
public class QuestionController {

    private final QuestionService questionService;

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

}