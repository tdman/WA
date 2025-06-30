package aws.community.examples.bedrock.service;

import aws.community.examples.bedrock.domain.FeedbackStats;
import aws.community.examples.bedrock.domain.StudyResult;
import aws.community.examples.bedrock.external.BedrockAiClient;
import aws.community.examples.bedrock.mapper.FeedbackMapper;
import aws.community.examples.bedrock.util.FeedbackUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
    private final FeedbackMapper feedbackMapper;
    private final BedrockAiClient bedrockClient;

        @Override
        public String generateFeedback(String studentId) {
            // 1. 최근 1주일 학습 결과 조회
            List<StudyResult> results = feedbackMapper.findResultsForPastWeek(studentId);

            // 2. 통계 계산 (예시)
            FeedbackStats stats = FeedbackUtils.analyzeResults(results);

            // 3. Prompt 구성
            String prompt = FeedbackUtils.buildPrompt(stats);

            // 4. Bedrock 호출
            return bedrockClient.getTextResponse(prompt);
        }
}
