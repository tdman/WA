package aws.community.examples.bedrock.external;

import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelRequest;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelResponse;

@Component
public class BedrockAiClient {

    private final BedrockRuntimeClient bedrockClient;

    public BedrockAiClient(BedrockRuntimeClient bedrockClient) {
        this.bedrockClient = bedrockClient;
    }

    public String getTextResponse(String prompt) {
        String body = String.format("""
        {
          "anthropic_version": "bedrock-2023-05-31",
          "messages": [
            {
              "role": "user",
              "content": %s
            }
          ],
          "max_tokens": 500,
          "temperature": 0.7
        }
        """, toJsonString(prompt));

        System.out.println("[DEBUG] Claude Request JSON:\n" + body);

        InvokeModelRequest request = InvokeModelRequest.builder()
                .modelId("anthropic.claude-3-sonnet-20240229-v1:0")
                .contentType("application/json")
                .accept("application/json")
                .body(SdkBytes.fromUtf8String(body))
                .build();

        InvokeModelResponse response = bedrockClient.invokeModel(request);
        return response.body().asUtf8String();
    }

    private String toJsonString(String raw) {
        return "\"" + raw.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\"";
    }

}

