package aws.community.examples.bedrock.service;

import aws.community.examples.bedrock.domain.ProgressStats;
import aws.community.examples.bedrock.domain.StudyResult;
import aws.community.examples.bedrock.external.BedrockProgressClient;
import aws.community.examples.bedrock.mapper.ProgressMapper;
import aws.community.examples.bedrock.util.ProgressUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressServiceImpl implements ProgressService {
    private final ProgressMapper progressMapper;
    private final BedrockProgressClient bedrockClient;

        @Override
        public String generateProgress(String studentId) {
            // 1. 최근 1주일 학습 결과 조회
            List<StudyResult> results = progressMapper.findResultsForPastWeek(studentId);

            // 2. 통계 계산 (예시)
            ProgressStats stats = ProgressUtils.analyzeResults(results);

            // 3. Prompt 구성
            String prompt = ProgressUtils.buildPrompt(stats);

            // 4. Bedrock 호출
            return bedrockClient.getTextResponse(prompt);
        }
}
