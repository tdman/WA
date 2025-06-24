package aws.community.examples.bedrock.aimodels;

import org.json.JSONArray;
import org.json.JSONObject;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelRequest;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelResponse;

public class Claude {
    public static final String MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";

    public static String invoke(BedrockRuntimeClient client, String prompt, double temperature, int maxTokens) {

        JSONObject jsonBody = new JSONObject()
                .put("anthropic_version", "bedrock-2023-05-31")
                .put("messages", new JSONArray()
                        .put(new JSONObject()
                                .put("role", "user")
                                .put("content", prompt)))
                .put("temperature", temperature)
                .put("max_tokens", maxTokens);

        InvokeModelRequest request = InvokeModelRequest.builder()
                .modelId(MODEL_ID)
                .contentType("application/json")
                .body(SdkBytes.fromUtf8String(jsonBody.toString()))
                .build();

        InvokeModelResponse response = client.invokeModel(request);

        String responseString = response.body().asUtf8String();
        JSONObject json = new JSONObject(responseString);


        // 응답 텍스트 추출
        JSONArray contentArray = json.getJSONArray("content");

        return contentArray.getJSONObject(0).getString("text");
    }
}
