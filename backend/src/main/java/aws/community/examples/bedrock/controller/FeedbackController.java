package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.dto.FeedbackRequest;
import aws.community.examples.bedrock.service.ClaudeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class FeedbackController {

    private final ClaudeService claudeService;

    @PostMapping("/feedback")
    public ResponseEntity<Map<String, String>> getFeedback(@RequestBody FeedbackRequest req) {
        String prompt = String.format("""
            다음은 학생이 푼 문제입니다.

            문제: %s
            학생의 답변: %s
            정답: %s
            문제 해설: %s

            학생의 답변에 대해 친절하고 이해하기 쉬운 피드백을 주세요.
        """, req.getQuestion(), req.getStudentAnswer(), req.getAnswer(), req.getExplanation());

        String feedback = claudeService.getFeedback(prompt);
        return ResponseEntity.ok(Map.of("feedback", feedback));
    }
}
