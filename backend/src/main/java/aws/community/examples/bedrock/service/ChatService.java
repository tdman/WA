package aws.community.examples.bedrock.service;

import aws.community.examples.bedrock.aimodels.Claude;
import aws.community.examples.bedrock.dto.ChatRequest;
import aws.community.examples.bedrock.dto.ChatResponse;
import aws.community.examples.bedrock.dto.ScreenRoutesDto;
import aws.community.examples.bedrock.mapper.ScreenRoutesMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final StudentService studentService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public ChatService(final BedrockRuntimeClient client, StudentService studentService) {
        this.client = client;
        this.studentService = studentService;
    }

    public ChatResponse getResponse(ChatRequest request, String studentId) throws JsonProcessingException {
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

        ChatResponse dto = objectMapper.readValue(claudeResponse, ChatResponse.class);

        // 필수 정보 설정
        dto.setStudentId(studentId);

        // intent 기반 분기 처리
        String reply;
        if (dto.getIntent() != null &&
                (dto.getIntent().startsWith("update") || dto.getIntent().startsWith("change"))) {

            if (dto.getField() == null || dto.getValue() == null) {
                reply = dto.getReply();
            } else {
                boolean result = studentService.updateUserField(
                        studentId,
                        dto.getField(),
                        dto.getValue()
                );
                reply = result
                        ? (dto.getReply() != null ? dto.getReply() : "정보가 성공적으로 변경되었습니다.")
                        : "정보를 업데이트할 수 없습니다.";
            }

        } else {
            reply = dto.getReply();
            if (reply == null) reply = dto.getResponse();
            if (reply == null) reply = dto.getGreeting();
            if (reply == null) reply = "어떤 도움이 필요하신가요?";
        }

        System.out.println("Claude 응답: " + claudeResponse);

        // 최종 응답 생성
        ChatResponse response = new ChatResponse();
        response.setReply(reply);
        response.setIntent(dto.getIntent());
        response.setField(dto.getField());
        response.setValue(dto.getValue());
        response.setStudentId(dto.getStudentId());

        return response;
    }

    private String buildPrompt(List<String> history) {
        StringBuilder sb = new StringBuilder();
        sb.append("너는 학습 플랫폼의 상담 챗봇이야. 인사말이나 자기소개는 첫 응답에서만 하고, 이후에는 절대 반복하지 마. 사용자의 질문에 바로 답변만 해. " +
                "사용자가 질문에는 명확하고 친절하게 설명해줘. " +
                "이전 대화 맥락을 기억하고, 질문에 바로 답변해." +
                "이전 프롬프트 내용을 답변에 그대로 서술하지 마." +
                "답을 모를 때는 모른다고 정중하게 사과하고 \"자세한 문의는 02-123-1234로 전화 주세요.\"라고 대답해." +
                "다음 사용자 요청에 대해 JSON으로 응답해줘. 문자열 안의 줄바꿈은 반드시 \\\\n 으로 이스케이프 처리해줘." +
                "그리고 사용자가 정보를 바꿔달라고 요청하면 intent, field, value 를 JSON 형식으로 추출해줘." +
                "형식은 이렇게 해주면 돼. " +
                "형식: {\"intent\": \"...\", \"field\": \"...\", \"value\": \"...\"}" +
                "만약 사용자의 의도가 \"update_user_info\"인데 field나 value가 빠져 있을 경우, \n" +
                "reply 필드에 \"어떤 정보를 변경하실 건가요?\", \"어떤 값으로 바꾸고 싶으신가요?\"와 같은 질문을 작성해줘." +
                "반드시 아래 JSON 포맷으로 응답해:" +
                "{\n" +
                "  \"intent\": \"update_user_info\" | \"etc\",\n" +
                "  \"field\": \"변경 대상 필드 (예: phone, email, address)\" | null,\n" +
                "  \"value\": \"변경할 값\" | null,\n" +
                "  \"reply\": \"사용자에게 보여줄 답변 문장\"\n" +
                "}" +
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
