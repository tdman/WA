package aws.community.examples.bedrock.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelRequest;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelResponse;

import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
public class BedrockQuizClient {

    private final BedrockRuntimeClient bedrockRuntimeClient;
    private final ObjectMapper mapper = new ObjectMapper(); // JSON 구성용

    public String getTextResponse(String prompt) {
        System.out.println("📤 [프롬프트 전달]: " + prompt);

        String requestBody = buildRequestBody(prompt);
        System.out.println("📦 [요청 JSON]: " + requestBody); // 요청 바디 로그

        InvokeModelRequest request = InvokeModelRequest.builder()
                .modelId("anthropic.claude-3-haiku-20240307-v1:0")
                .contentType("application/json")
                .accept("application/json")
                .body(SdkBytes.fromString(requestBody, StandardCharsets.UTF_8))
                .build();

        try {
            InvokeModelResponse response = bedrockRuntimeClient.invokeModel(request);
            String responseBody = response.body().asUtf8String();

            System.out.println("📥 [모델 응답 원문]: " + responseBody);
            return parseClaudeText(responseBody);
        } catch (Exception e) {
            log.error("❌ Claude 응답 처리 중 오류 발생", e);
            return "또로가 잠깐 쉬고 있또로~ 나중에 다시 불러줘또로!";
        }
    }

    /**
     * 안전한 Claude API 요청 JSON 구성
     */
    private String buildRequestBody(String prompt) {
        try {
            ObjectNode root = mapper.createObjectNode();

            // messages 구성
            ArrayNode messages = mapper.createArrayNode();
            ObjectNode userMessage = mapper.createObjectNode();
            userMessage.put("role", "user");
            userMessage.put("content", prompt);
            messages.add(userMessage);

            root.set("messages", messages);
            root.put("max_tokens", 500);
            root.put("temperature", 0.7);
            root.put("anthropic_version", "bedrock-2023-05-31"); // ✅ 필수

            return mapper.writeValueAsString(root);
        } catch (Exception e) {
            log.error("❌ 요청 바디 생성 중 오류", e);
            throw new RuntimeException("Claude 요청 바디 생성 실패");
        }
    }


    /**
     * Claude 응답에서 텍스트 추출
     */
    private String parseClaudeText(String responseJson) {
        try {
            JsonNode node = mapper.readTree(responseJson);
            return node.at("/content/0/text").asText();  // Claude 3 기준 응답 경로
        } catch (Exception e) {
            log.error("❌ Claude 응답 파싱 실패", e);
            return "또로가 이해를 못했또로... 다시 한 번 시도해줄래또로?";
        }
    }
}
