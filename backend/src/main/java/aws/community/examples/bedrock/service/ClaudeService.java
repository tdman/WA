package aws.community.examples.bedrock.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelRequest;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelResponse;

@Service
@RequiredArgsConstructor
public class ClaudeService {

    private final BedrockRuntimeClient bedrockClient;

    private static final String MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";

    public String getFeedback(String prompt) {
        String fullPrompt = "Human: " + prompt + "\\n\\nAssistant:";

        String body = "{\\\"prompt\\\":\\\"" + fullPrompt.replace("\"", "\\\\\"") +
                "\\\", \\\"max_tokens_to_sample\\\":300}";

        InvokeModelRequest request = InvokeModelRequest.builder()
                .modelId(MODEL_ID)
                .contentType("application/json")
                .accept("application/json")
                .body(SdkBytes.fromUtf8String(body))
                .build();

        InvokeModelResponse response = bedrockClient.invokeModel(request);
        return extractCompletion(response);
    }


    private String extractCompletion(InvokeModelResponse response) {
        try {
            String json = response.body().asUtf8String();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json);
            return root.get("completion").asText();
        } catch (Exception e) {
            return "AI 응답 파싱 중 오류가 발생했습니다.";
        }
    }
}