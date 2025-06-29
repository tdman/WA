package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.dto.QuestionSearchRequest;
import aws.community.examples.bedrock.dto.QuestionSearchResponse;
import aws.community.examples.bedrock.service.QuestionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


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

}