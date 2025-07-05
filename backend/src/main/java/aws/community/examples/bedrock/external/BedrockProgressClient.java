package aws.community.examples.bedrock.external;

import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelRequest;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelResponse;

@Component
public class BedrockProgressClient {

    private final BedrockRuntimeClient bedrockClient;

    public BedrockProgressClient(BedrockRuntimeClient bedrockClient) {
        this.bedrockClient = bedrockClient;
    }

    private static final String ANALYSIS_PROMPT_TEMPLATE = """
        당신은 학생의 학습 성과를 분석하는 AI 튜터입니다.

        다음은 한 학생의 최근 1주일간 문제 풀이 기록입니다. 이 기록을 바탕으로 아래 3가지를 JSON 형식으로 출력해 주세요:

        1. chart_data: 취약한 영역 리스트. 각 항목에 name (영역명)과 errors (오답 수)를 포함한 배열 형태. 예: [{ "name": "수학 도형", "errors": 5 }, ...]
        2. summary: 전체 학습 상태 요약. 현재 학습 성취도, 정답률, 전반적 강점·약점 요약
        3. details: 각 취약 영역별 개선 방안. 키는 영역명, 값은 학습 전략 또는 공부법 제안

        반드시 아래 형식의 JSON으로만 출력해 주세요. 설명이나 다른 텍스트 없이 JSON 본문만 출력해 주세요:

        {
          "chart_data": [...],
          "summary": "...",
          "details": {
            "수학 도형": "...",
            "과학 역학": "..."
          }
        }

        [학생 기록]
        %s
        """;

//    public String getTextResponse(String studentLearningData) {
    public String getTextResponse(String prompt) {
//        String prompt = ANALYSIS_PROMPT_TEMPLATE.formatted(studentLearningData);

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
        return "\"" + raw.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n") + "\"";
    }
}
