package aws.community.examples.bedrock.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatResponse {
    private String reply;
    private String response;
    private String greeting;

    private String studentId;
    private String intent;
    private String field;
    private String value;

    public ChatResponse(String reply) {
        this.reply = reply;
    }
}
