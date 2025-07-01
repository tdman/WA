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
        당신은 학생의 학습 성과를 분석하는 AI 튜터입니다.
        
        다음은 한 학생의 최근 1주일간 문제 풀이 기록입니다. 이 기록을 바탕으로 아래 3가지를 JSON 형식으로 출력해 주세요:

        1. chart_data: 취약한 영역 리스트. 각 항목에 name (영역명)과 errors (오답 수)를 포함한 배열 형태. 예: [{ "name": "수학 도형", "errors": 5 }, ...]
        2. summary: 전체 학습 상태 요약. 현재 학습 성취도, 정답률, 전반적 강점·약점 요약
        3. details: 각 취약 영역별 개선 방안. 키는 영역명, 값은 학습 전략 또는 공부법 제안

        반드시 아래 형식의 JSON으로만 출력해 주세요. 설명이나 다른 텍스트 없이 JSON 본문만 출력해 주세요:

        {
          "chart_data": [...],
          "summary": "...",
          "details": {
            "수학 도형": "...",
            "과학 역학": "..."
          }
        }

        [학생 기록]
        %s
        """
        .formatted(
                stats.getAccuracyPercent(),
                stats.getAvgSolveTimeSec(),
                stats.getWeakTags().isEmpty() ? "없음" : stats.getWeakTags()
        );
    }
}

