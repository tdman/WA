package aws.community.examples.bedrock.domain;

import lombok.Data;
import org.apache.ibatis.type.Alias;

@Data
@Alias("StudyResult")
public class StudyResult {
    private String studentId;       // 학습자 ID
    private String subjectType;     // 과목 (예: 연산, 기하, 추론 등)
    private String questionType;    // 문제 유형 (예: 곱셈, 나눗셈 등)
    private boolean resultIsCorrect;      // 정답 여부
    private String resultTimeSec;        // 풀이 시간 (옵션)
}
