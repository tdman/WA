package aws.community.examples.bedrock.aimodels;

import org.json.JSONArray;
import org.json.JSONObject;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelRequest;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelResponse;

public class Titan {
    public static final String MODEL_ID = "amazon.titan-embed-text-v2:0";

    private final BedrockRuntimeClient client;

    public Titan(BedrockRuntimeClient client) {
        this.client = client;
    }
    public Float[] embed(String input) {
        JSONObject jsonBody = new JSONObject()
                .put("inputText", input);

        InvokeModelRequest request = InvokeModelRequest.builder()
                .modelId(MODEL_ID)
                .contentType("application/json")
                .body(SdkBytes.fromUtf8String(jsonBody.toString()))
                .build();

        InvokeModelResponse response = client.invokeModel(request);

        String responseString = response.body().asUtf8String();
        JSONObject json = new JSONObject(responseString);

        // 임베딩 벡터 추출
        JSONArray embeddingArray = json.getJSONArray("embedding");
        Float[] embedding = new Float[embeddingArray.length()];
        for (int i = 0; i < embeddingArray.length(); i++) {
            embedding[i] = embeddingArray.getNumber(i).floatValue();
        }
        return embedding;
    }
}