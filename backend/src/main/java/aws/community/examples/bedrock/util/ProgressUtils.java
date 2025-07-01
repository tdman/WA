package aws.community.examples.bedrock.util;

import aws.community.examples.bedrock.domain.ProgressStats;
import aws.community.examples.bedrock.domain.StudyResult;

import java.util.*;

public class ProgressUtils {

    public static ProgressStats analyzeResults(List<StudyResult> results) {
        // 간단한 통계 계산: 정답률, 과목별 성과, 취약 유형 등
        Map<String, Integer> correctCount = new HashMap<>();
        Map<String, Integer> totalCount = new HashMap<>();

        for (StudyResult r : results) {
            String key = r.getSubjectType() + "-" + r.getQuestionType();
            totalCount.merge(key, 1, Integer::sum);
            if (r.isResultIsCorrect()) {
                correctCount.merge(key, 1, Integer::sum);
            }
        }

        // 예시: 정답률 낮은 유형 찾기
        String weakestType = totalCount.keySet().stream()
                .min(Comparator.comparingDouble(k ->
                        (double) correctCount.getOrDefault(k, 0) / totalCount.get(k)))
                .orElse("정보 없음");

        int accuracyPercent = 88;   // TEST
        int avgSolveTimeSec = 13;   // TEST
        List<String> weakTags = Arrays.asList("수학_도형", "과학_역학", "사회_경제");   // TEST

        return new ProgressStats(correctCount, totalCount, weakestType, accuracyPercent, avgSolveTimeSec, weakTags);
    }

    public static String buildPrompt(ProgressStats stats) {
        // 주석은 처음 작석했던 코드
//        StringBuilder prompt = new StringBuilder();
//        prompt.append("아래는 학습자의 1주일간 학습 결과입니다. 자연어로 피드백을 3문장 이내로 생성해주세요.\n\n");
//
//        for (String key : stats.getTotalCount().keySet()) {
//            int total = stats.getTotalCount().get(key);
//            int correct = stats.getCorrectCount().getOrDefault(key, 0);
//            double rate = (correct * 100.0) / total;
//            prompt.append("- ").append(key).append(": ")
//                    .append(String.format("정답률 %.1f%% (%d문제)\n", rate, total));
//        }
//
//        prompt.append("\n취약한 유형: ").append(stats.getWeakestType()).append("\n");
//        prompt.append("학생에게 따뜻하게 조언해주세요.");
//
//        return prompt.toString();
        return """
        당신은 AI 학습 튜터입니다.
        다음 학습자의 통계를 기반으로 맞춤형 피드백을 작성해주세요.
        
        [출력 형식]
        1. 학습 상태 요약:
        2. 주요 문제 유형:
        3. 다음 학습 추천:
        
        [학습 통계 요약]
        - 정답률: %s%%
        - 평균 풀이 시간: %s초
        - 오답 비율이 높은 태그: %s
        """
        .formatted(
                stats.getAccuracyPercent(),
                stats.getAvgSolveTimeSec(),
                stats.getWeakTags().isEmpty() ? "없음" : stats.getWeakTags()
        );
    }
}

