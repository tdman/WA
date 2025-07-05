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
        return """
        당신은 학생의 학습 성과를 분석하는 AI 튜터입니다.
        학생에게 부족한 부분을 보완할 수 있도록 정확한 분석을 기반으로 조언해주세요.
        
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

