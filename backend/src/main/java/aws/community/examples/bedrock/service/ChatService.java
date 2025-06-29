package aws.community.examples.bedrock.service;

import aws.community.examples.bedrock.aimodels.Claude;
import aws.community.examples.bedrock.dto.ChatRequest;
import aws.community.examples.bedrock.dto.ChatResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatService {
    private final Map<String, List<String>> sessionHistory = new ConcurrentHashMap<>();

    private final BedrockRuntimeClient client;

    @Autowired
    public ChatService(final BedrockRuntimeClient client) {
        this.client = client;
    }

    public ChatResponse getResponse(ChatRequest request) {
        String sessionId = request.getSessionId();  // 사용자 세션별 구분
        String userInput = request.getMessage();

        List<String> history = sessionHistory.computeIfAbsent(sessionId, k -> new ArrayList<>());
        history.add("[사용자]: " + userInput);

        String prompt = buildPrompt(history);

        String claudeResponse = Claude.invoke(client, prompt, 0.3, 4096);
        history.add("[챗봇]: " + claudeResponse);

        return new ChatResponse(claudeResponse);
    }

    private String buildPrompt(List<String> history) {
        StringBuilder sb = new StringBuilder();
        sb.append("너는 학습 플랫폼의 상담 챗봇이야. 인사말이나 자기소개는 첫 응답에서만 하고, 이후에는 절대 반복하지 마. 사용자의 질문에 바로 답변만 해. " +
                "사용자가 질문에는 명확하고 친절하게 설명해줘. " +
                "이전 대화 맥락을 기억하고, 질문에 바로 답변해." +
                "답을 모를 때는 모른다고 정중하게 사과하고 \"자세한 문의는 02-123-1234로 전화 주세요.\"라고 대답해." +
                "아래는 사용자와 당신의 대화입니다.\n\n");

        for (String line : history) {
            sb.append(line).append("\n");
        }
        sb.append("당신의 답변:");
        return sb.toString();
    }
}
