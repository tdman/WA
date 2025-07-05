package aws.community.examples.bedrock.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuizResponse {
    private String questionId;
    private String originalQuestion;
    private String rewriteQuestion;
    private String answer;
}

