package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.aimodels.Claude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.AccessDeniedException;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelRequest;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelResponse;


import java.util.List;
import java.util.Map;

import static aws.community.examples.bedrock.aimodels.LLM.Request;
import static aws.community.examples.bedrock.aimodels.LLM.Response;

@RestController
@RequestMapping("/chat/support/")
public class ChatPlayground {

    private final String SYS_PROMPT = "You are a friendly chatbot for an elementary school study app." +
            "Please explain things clearly and kindly when users ask questions." +
            "If you don’t know the answer, politely say," +
            "\"For more detailed inquiries, please call 1234-1234.\"" +
            "Always maintain a warm and gentle tone.";

    private static final Logger logger = LoggerFactory.getLogger(ChatPlayground.class);

    private final BedrockRuntimeClient client;

    @Autowired
    public ChatPlayground(final BedrockRuntimeClient client) {
        this.client = client;
    }

    //@Autowired
    //public

    @PostMapping("/conversation")
    public Response invoke(@RequestBody Request body) {
        try {

           return runSimpleQuery(body.prompt());

        } catch (AccessDeniedException e) {
            logger.error("Access Denied: %s".formatted(e.getMessage()));
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            logger.error("Exception: %s".formatted(e.getMessage()));
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/test")
    public Response classifyIntentWithClaude(String userQuestion) throws Exception {
        String prompt = """
        다음 사용자 질문이 있습니다:

        "%s"

        이 질문이 단순한 데이터 조회인지, 아니면 데이터를 기반으로 한 분석을 요구하는 질문인지 판단해 주세요.

        - 단순 정보 요청이면: "정보"
        - 데이터 분석 요청이면: "분석"

        대답은 "정보" 또는 "분석" 둘 중 하나만 해주세요.
        """.formatted(userQuestion);

        Map<String, Object> body = Map.of(
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "max_tokens", 10,
                "temperature", 0.0
        );

        ObjectMapper mapper = new ObjectMapper();
        String requestJson = mapper.writeValueAsString(body);

        InvokeModelRequest request = InvokeModelRequest.builder()
                .modelId("anthropic.claude-3-sonnet-20240229-v1:0")
                .contentType("application/json")
                .body(SdkBytes.fromUtf8String(requestJson))
                .build();

        BedrockRuntimeClient client = BedrockRuntimeClient.create();
        InvokeModelResponse response = client.invokeModel(request);

        String rawResponse = response.body().asUtf8String();
        String ret = parseLLMClassification(rawResponse);

        return runSimpleQuery(userQuestion);
        /*
        if ("분석".equals(ret)) {

            return runRagAnalysis(userQuestion);
        } else {
            return runSimpleQuery(userQuestion);
        }
        */
    }

    public Response runSimpleQuery(String userQuestion) {

        String prompt = SYS_PROMPT + "\n\n" + userQuestion;

        return new Response(Claude.invoke(client, prompt, 0.8, 4096));
    }

    public String parseLLMClassification(String responseJson) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(responseJson);
        String content = root.get("content").asText().trim();
        return content;
    }


}
