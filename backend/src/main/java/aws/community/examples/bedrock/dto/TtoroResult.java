package aws.community.examples.bedrock.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TtoroResult {
    private String questionId;
    private String ttoroText;
}
