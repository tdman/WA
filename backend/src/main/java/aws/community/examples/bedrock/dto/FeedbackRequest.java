package aws.community.examples.bedrock.dto;

import lombok.Data;

@Data
public class FeedbackRequest {
    private String question;
    private String studentAnswer;
    private String answer;
    private String explanation;
}
