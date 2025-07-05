package aws.community.examples.bedrock.domain;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Question {
    private String questionId;
    private String subjectType;
    private String difficulty;
    private String questionContent;
    private String answer;
    private String explanation;
    private String questionType;
    private List<String> tags; // JSON 형태 파싱 시 사용 가능
    private String avgSolveTimeSec;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
