package aws.community.examples.bedrock.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private String sessionId;
    private String studentId;
    private String message;
}
