package aws.community.examples.bedrock.service;

import aws.community.examples.bedrock.aimodels.Claude;
import aws.community.examples.bedrock.controller.LoginController;
import aws.community.examples.bedrock.dto.ChatRequest;
import aws.community.examples.bedrock.dto.ChatResponse;
import aws.community.examples.bedrock.dto.FeedbackDto;
import aws.community.examples.bedrock.dto.StudentDto;
import aws.community.examples.bedrock.mapper.FeedbackMapper;
import aws.community.examples.bedrock.mapper.StudentMapper;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.services.bedrock.BedrockClient;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class FeedbackService {
    private final Map<String, List<String>> sessionHistory = new ConcurrentHashMap<>();

    @Autowired
    FeedbackMapper feedbackMapper;
    

    @Autowired
    StudentMapper studentMapper;
    
    @Autowired
    BedrockRuntimeClient bedrockClient;
    
    public ChatResponse getResponse(FeedbackDto request) {
//        String sessionId = request.getSessionId();  // 사용자 세션별 구분
//        String userInput = request.getMessage();

//        List<String> history = sessionHistory.computeIfAbsent(sessionId, k -> new ArrayList<>());
//        history.add("[사용자]: " + userInput);
    	StudentDto student = studentMapper.getLogin(request.getStudentId());  	// 학생정보
    	List<FeedbackDto> list = feedbackMapper.getFeedbackProblems(request); 	// 학생이 방금 푼 문제
        String prompt = buildPrompt(list);
       
        
		log.info("student" + student.toString());
		log.info("list" + list.toString());
       // return bedrockClient.getClaudeFeedback(prompt);
        String claudeResponse = Claude.invoke(bedrockClient, prompt, 0.3, 1500);
        //list.add("[챗봇]: " + claudeResponse);

		log.info("claudeResponse" + claudeResponse.toString());
        return new ChatResponse(claudeResponse);
    }

    private String buildPrompt(List<FeedbackDto> list) {
        StringBuilder sb = new StringBuilder();

      //0. JSON 변환 양식설정
        sb.append(getTextToJson());
        
        //1.명시적 요청
        sb.append(getInstruction());
        
        //2.피드백 양식 예시
       // sb.append(getFeedbackExample());
        
        //3. 문제풀이 결과
        sb.append(getQuestionResultsBlock(list));
        
        //4. 종합평가
        sb.append(getOverallRequest());
        
        //5. 칭찬멘트
        sb.append(getEncouragementRequest());
       

        
        sb.append("끝! 수고하셨습니다.");
        return sb.toString();
    }
    
    //0. JSON 변환 양식설정
    private String getTextToJson() {
        String txt = """
            당신은 초등학생에게 맞춤형 피드백을 제공하는 AI 선생님입니다.
            아래 문제 풀이 결과를 분석하여 JSON 형식으로 피드백을 작성해주세요.

            반드시 다음 JSON 형식에 맞춰 출력해 주세요:

            {
              "questions": [
                {
                  "questionNumber": 1,
                  "subject": "수학",
                  "questionType": "사고력",
                  "difficulty": "상",
                  "questionContent": "45 * 66",
                  "answer": "2970",
                  "studentAnswer": "2970",
                  "solveTime": "13초",
                  "averageSolveTime": "16초",
                  "tags": ["연산", "고등", "초등", "중등"],
                  "explanation": "문제 15에 대한 설명입니다.",
                  "isCorrect": "정답/오답",
                  "isMarked": "Y:이해도부족/ N:이해함",
                  "feedback": "짧은 한문장으로 averageSolveTime 시간대비 solveTime 에 대한 피드백을 해주고, 1초는 암상이 너무 빠르다고 피드백하기:",
                }
              ],
              "summary": {
                "strength": "학생의 강점 문장",
                "weakness": "부족한 점 문장",
                "direction": "학습 방향 문장",
                "encouragement": "칭찬과 응원 문장"
              }
            }

            출력은 반드시 위 JSON 구조에 맞춰 주세요. 
            """;

        return txt;
    }

    
    //1. 명시적요청
    private String getInstruction() {
    	String txt = """
    			
    			당신은 초등학생에게 맞춤형 피드백을 제공하는 AI 선생님입니다.
    			아래에 주어진 문제 풀이 결과를 바탕으로 각 문제에 대해 피드백을 작성해주세요.

    			""";
    	
    	return txt;
    }
    
	//2. 피드백 양식 예시
    private String getFeedbackExample() {
    	String txt = """
    			
    			다음 형식을 반드시 지켜서 출력해주세요.

    			[문제 풀이 결과]
				- 문제번호: 1  
				- 과목: 수학  
				- 문제유형: 사고력  
				- 난이도: 상  
				- 문제내용: 45 * 66
				- 정답: 2970  
				- 📝학생의 답안: 2970  
				- ⏱️풀이 시간: 13초  
				- ⏱️평균 풀이 시간: 16초  
				- 태그: 연산, 고등, 초등, 중등  
				- 해설: 문제 15에 대한 설명입니다.  
				- 정답여부: 정답 or 오답 
				- ✅이해도 체크: 이해감 or 이해도 부족  
    			""";
    	
    	return txt;
    }
    
    //3. 문제풀이 결과
    private StringBuilder getQuestionResultsBlock(List<FeedbackDto> list) {
    	
    	 StringBuilder sb = new StringBuilder();
        sb.append("[문제 리스트]\n");


        int number = 1;
        for (FeedbackDto dto : list) {
            sb.append("questionNumber: ").append(dto.getQuestionId()).append("\n");
            sb.append("subject: ").append(dto.getSubjectType()).append("\n");
            sb.append("questionType: ").append(dto.getQuestionType()).append("\n");
            sb.append("difficulty: ").append(dto.getDifficulty()).append("\n");
            sb.append("questionContent: ").append(dto.getQuestionContent()).append("\n");
            sb.append("answer: ").append(dto.getAnswer()).append("\n");
            sb.append("studentAnswer: ").append(dto.getResultAnswer() == null || dto.getResultAnswer().isEmpty() ? "(미입력)" : dto.getResultAnswer()).append("\n");
            sb.append("solveTime: ").append(dto.getResultTimeSec()).append("초\n");
            sb.append("averageSolveTime: ").append(dto.getAvgSolveTimeSec()).append("초\n");
           // sb.append("태그: ").append(dto.getTags()).append("\n");
           // sb.append("해설: ").append(dto.getResultTimeSec()).append("\n");
            sb.append("isCorrect: ").append(dto.getResultIsCorrect()).append("\n");
             sb.append("isMarked: ").append(dto.getResultIsMarked()).append("\n");

            if (dto.getTags() != null && !dto.getTags().isEmpty()) {
                sb.append("tags: ").append(String.join(", ", dto.getTags())).append("\n");
            }

            sb.append("explanation: ").append(dto.getExplanation()).append("\n\n");
            sb.append("feedback: ").append("짧은 한문장으로 averageSolveTime 시간대비 solveTime 에 대한 피드백을 해주고, 1초는 암산이 너무 빠르다고 피드백하기:").append("\n\n");
        }
    	
    	return sb;
    }
    
    //4. 종합평가
    private String getOverallRequest() {
    	String txt= """
    			
				위 문제들에 대한 종합적인 평가도 마지막에 작성해주세요.
				- strength:학생의 강점
				- weakness: 부족한 부분
				- direction: 앞으로의 학습 방향
    			""";
    	return txt;
    }
    
    
    //5. 칭찬멘트
    private String getEncouragementRequest() {
    	String txt= """
    			
				encouragement: 마지막으로 학생을 위한 칭찬과 응원의 멘트로 마무리해주세요.
				초등학생의 MBTI의 성향을 잘 반영하여 멘트를 사용합니다.
				초등학생 눈높이에 맞게 다정하고 긍정적인 말투를 사용해주세요.
				
    			""";
    	return txt;
    }
    

}
