package aws.community.examples.bedrock.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class FeedbackStats {
    // 유형별 정답 수
    private Map<String, Integer> correctCount;

    // 유형별 총 시도 수
    private Map<String, Integer> totalCount;

    // 정답률이 가장 낮은 유형
    private String weakestType;

    private int accuracyPercent;
    private int avgSolveTimeSec;
    private List<String> weakTags;
}
