package aws.community.examples.bedrock.dto;

import lombok.Data;

@Data
public class QuestionSearchResponse {
    private String questionId;
    private String subjectType;
    private String questionContent;
    private String difficulty;
    private String questionType;
    private String answer;
    private String explanation;
    private String imageUrl;
    private String tags;
    private String avgSolveTimeSec;
}
