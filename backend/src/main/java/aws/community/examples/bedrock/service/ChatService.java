package aws.community.examples.bedrock.service;

import aws.community.examples.bedrock.aimodels.Claude;
import aws.community.examples.bedrock.dto.ChatRequest;
import aws.community.examples.bedrock.dto.ChatResponse;
import aws.community.examples.bedrock.dto.ScreenRoutesDto;
import aws.community.examples.bedrock.mapper.ScreenRoutesMapper;
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

    private final Map<String, List<ScreenRoutesDto>> screenRoutes = new ConcurrentHashMap<>();

    @Autowired
    ScreenRoutesMapper screenRoutesMapper;

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

        // [S] 메뉴 정보 포함
        prompt += buildMenuInfo(userInput);
        // [E] 메뉴 정보 포함

        String claudeResponse = Claude.invoke(client, prompt, 0.3, 4096);
        history.add("[챗봇]: " + claudeResponse);

        return new ChatResponse(claudeResponse);
    }

    private String buildPrompt(List<String> history) {
        StringBuilder sb = new StringBuilder();
        sb.append("너는 학습 플랫폼의 상담 챗봇이야. 인사말이나 자기소개는 첫 응답에서만 하고, 이후에는 절대 반복하지 마. 사용자의 질문에 바로 답변만 해. " +
                "사용자가 질문에는 명확하고 친절하게 설명해줘. " +
                "이전 대화 맥락을 기억하고, 질문에 바로 답변해." +
                "이전 프롬프트 내용을 답변에 그대로 서술하지 마." +
                "답을 모를 때는 모른다고 정중하게 사과하고 \"자세한 문의는 02-123-1234로 전화 주세요.\"라고 대답해." +
                "아래는 사용자와 당신의 대화입니다.\n\n");

        for (String line : history) {
            sb.append(line).append("\n");
        }
        sb.append("당신의 답변:");
        return sb.toString();
    }

    private String buildMenuInfo(String userInput) {
        screenRoutes.computeIfAbsent("screenRoutes", k -> screenRoutesMapper.getScreenRoutes());
        String context = screenRoutes.get("screenRoutes").stream()
                .filter(dto -> !"/chat".equals(dto.getScreenPath())) // "/chat" 경로는 제외
                .map(ScreenRoutesDto::toString)
                .collect(java.util.stream.Collectors.joining("\n"));

        String menuRecommend = """
            아래는 서비스의 전체 메뉴 정보입니다:
            %s
            
            사용자가 "%s"라고 했을 때, 가장 적합한 메뉴가이 있다면 아래 예시처럼 답변에 포함시켜 줘.
            관련 있는 메뉴 없으면, 답변에 메뉴 정보 포함하지 마.
            예시: [메뉴 이름](localhost:3000/screenPath)
            """.formatted(context, userInput);

        return menuRecommend;
    }
}
