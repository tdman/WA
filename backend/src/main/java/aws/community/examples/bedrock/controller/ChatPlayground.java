package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.aimodels.Claude;
import aws.community.examples.bedrock.aimodels.Titan;
import aws.community.examples.bedrock.dto.ScreenRoutesDto;
import aws.community.examples.bedrock.mapper.ScreenRoutesMapper;
import aws.community.examples.bedrock.service.WeaviateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.AccessDeniedException;


import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static aws.community.examples.bedrock.aimodels.LLM.Request;
import static aws.community.examples.bedrock.aimodels.LLM.Response;

@RestController
@RequestMapping("/chat/support/")
public class ChatPlayground {

    private final String SYS_PROMPT = "You are a friendly chatbot for study app." +
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

    @Autowired
    ScreenRoutesMapper screenRoutesMapper;

    @Autowired
    WeaviateService weaviateService;

    // 예시: 메뉴 정보 캐싱
    private final Map<String, List<ScreenRoutesDto>> screenRoutes = new ConcurrentHashMap<>();

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

    @PostMapping("/test2")
    public Response test(@RequestBody Request body) {
        try {
            String userQuery = body.prompt();
            Titan titan = new Titan(client);
            Float[] queryEmbedding = titan.embed(userQuery);  // Titan 임베딩

            List<String> similarSentences = weaviateService.searchSimilarTexts(queryEmbedding, 3, "Tutors");

            String context = String.join("\n", similarSentences);
            String prompt = """
                사용자 질문: %s
                질의 관련 정보: %s
                
                질의 관련 정보가 있으면, 참고해서 정확하게 답변해줘.
                """.formatted(context, userQuery);

            return runSimpleQuery(prompt);

        } catch (Exception e) {
            logger.error("Exception: %s".formatted(e.getMessage()));
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/test")
    public Response classifyIntentWithClaude(@RequestBody Request body) throws Exception {

        String userQuery = body.prompt();
        String prompt = """
        다음 사용자 질문이 있습니다:

        "%s"

        이 질문이 단순한 데이터 조회인지, 아니면 데이터를 기반으로 한 분석을 요구하는 질문인지 판단해 주세요.

        - 단순 정보 요청이면: "정보"
        - 데이터 분석 요청이면: "분석"

        대답은 "정보" 또는 "분석" 둘 중 하나만 해주세요.
        """.formatted(userQuery);

        String fstResult =  Claude.invoke(client, prompt, 0.3, 4096);

        logger.info(" @@@@@@@@@@ Claude classification result: {}", fstResult);
       // return runSimpleQuery(userQuestion);
        return runRdbAnalysis(userQuery);
/*        if ("분석".equals(fstResult)) {

        } else {
            return runSimpleQuery(userQuery);
        }*/
    }

    public Response runRdbAnalysis(String userQuery) {
        screenRoutes.computeIfAbsent("screenRoutes", k -> screenRoutesMapper.getScreenRoutes());
        String context = screenRoutes.get("screenRoutes").stream()
                .map(ScreenRoutesDto::toString)
                .collect(java.util.stream.Collectors.joining("\n"));

        String prompt = """
            아래는 서비스의 전체 메뉴 정보입니다:
            %s
            
            프롬프트 내용을 답변에 그대로 서술하지 마.
            사용자가 "%s"라고 했을 때, 가장 적합한 screenPath이 있다면 연결 링크 형식으로, 적합한 screenPath만 답변에 포함시켜 줘
            없으면 포함하지 마.
            예시: [메뉴 이름](localhost:3000/screenPath)
            """.formatted(context, userQuery);

        String answer = Claude.invoke(client, SYS_PROMPT + "\n\n" + prompt, 0.7, 4096);
        return new Response(answer);
    }

    public Response runSimpleQuery(String userQuery) {

        String prompt = SYS_PROMPT + "\n\n" + userQuery;

        return new Response(Claude.invoke(client, prompt, 0.8, 4096));
    }

}
