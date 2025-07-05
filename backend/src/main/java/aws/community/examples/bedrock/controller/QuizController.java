package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.dto.QuizRequest;
import aws.community.examples.bedrock.dto.QuizResponse;
import aws.community.examples.bedrock.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping
    public ResponseEntity<QuizResponse> getQuizWithCuteStyle(@RequestBody QuizRequest request) {
        System.out.println("🟠 QuizController - /quiz 호출됨");

        request.setDifficulty("하");

        QuizResponse quiz = quizService.getCuteQuizList(request);
        return ResponseEntity.ok(quiz);
    }
}