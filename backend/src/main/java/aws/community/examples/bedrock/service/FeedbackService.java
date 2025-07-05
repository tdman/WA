package aws.community.examples.bedrock.service;

import aws.community.examples.bedrock.aimodels.Claude;
import aws.community.examples.bedrock.dto.ChatResponse;
import aws.community.examples.bedrock.dto.FeedbackDto;
import aws.community.examples.bedrock.dto.StudentDto;
import aws.community.examples.bedrock.mapper.FeedbackMapper;
import aws.community.examples.bedrock.mapper.StudentMapper;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;

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

        String systemPrompt = buildSystemPrompt();
        
        StringBuilder prompt = new StringBuilder();
        prompt.append(getLoginBlock(request)); //로그인 사용자 정보
        prompt.append(getQuestionResultsList(request)); //문제풀이 결과
        prompt.append("[로그인] 데이터를 사용해서 사전에 양식으로 지정한 JSON 형식에 맞춰 출력 해줘.");
        prompt.append("[문제 풀이 결과 (피드백)] 데이터를 사용해서 사전에 양식으로 지정한 JSON 형식에 맞춰 출력 해줘.");
        prompt.append("[문제 풀이 결과 (단건)]은 필요없어.");
        prompt.append("로그인 JSON 과, 문제풀이 결과 JSON 을 하나의 JSON 으로 만들어줘");
        prompt.append("반드시 파싱이 가능한 JSON 형태로 만들어 줘야해");
        prompt.append("끝!");

        String claudeResponse = Claude.invoke(bedrockClient, prompt.toString(), 0.3, 1500, systemPrompt);
     
		log.info("claudeResponse" + claudeResponse.toString());
        return new ChatResponse(claudeResponse);
    }

    
    public ChatResponse getResult(FeedbackDto request) {

        String systemPrompt = buildSystemPrompt();
        StringBuilder prompt = new StringBuilder();
        prompt.append(getLoginBlock(request)); //로그인 사용자 정보
        prompt.append(getQuestionResults(request)); //로그인 사용자
        prompt.append("[로그인]데이터를 사용해서 사전에 양식으로 지정한 JSON 형식에 맞춰 출력 해줘.");
        prompt.append("[문제 풀이 결과 (단건)] 데이터를 사용해서 사전에 양식으로 지정한 JSON 형식에 맞춰 출력 해줘.");
        prompt.append("[문제 풀이 결과 (피드백)]은 필요없어.");
        prompt.append("로그인 JSON 과, 문제풀이 결과 JSON 을 하나의 JSON 으로 만들어줘");
        prompt.append("반드시 파싱이 가능한 JSON 형태로 만들어 줘야해");
        String claudeResponse = Claude.invoke(bedrockClient, prompt.toString(), 0.3, 500, systemPrompt);
     
		log.info("claudeResponse" + claudeResponse.toString());
        return new ChatResponse(claudeResponse);
    }

	private String buildSystemPrompt() {
	StringBuilder sb = new StringBuilder();

        sb.append("""
        		[ 1. AI 또로의 말투설정 ]
	                너는 초등학생 친구들을 도와주는 귀엽고 친절하고 똑똑한 AI 친구 또로야.
	
					말투는 하츄핑처럼 상냥하고 말끝에 "~해줘", "~해볼까?", "~했지롱!", "~알려줄게!" 등을 자주 사용해.
					항상 부드럽고 따뜻하게 말하며, 학생이 실수해도 절대 혼내지 않고 "괜찮아~ 다시 해보자!" 라고 격려해줘.
					
					답변은 너무 어렵게 말하지 않고, 쉬운 단어로 말해줘.  
					문장이 너무 길지 않게, 한 문장씩 천천히 말해줘.  
					말풍선에 들어갈 정도의 100자 이내 짧은 문장으로, 두세 문장 정도가 좋아.
					가끔 학생의 이름을 친근하게 불러줘.
	
	    			[참고말투 예시]
	    			말투 참고 포인트 (하츄핑 스타일 키워드)
					말 끝 표현: ~해줘, ~해볼까?, ~했지롱, ~알려줄게, 이야아!
					칭찬 표현: 잘했어~ 짝짝짝! / 와~ 똑똑이구나! / 최고야~!
					실수 위로: 괜찮아~ 다음엔 더 잘할 수 있어! / 한 번 더 해보자~ / 으쌰으쌰~!
					이모지 활용: 🎉 🌟 💡 🐣 🍭 🌈 (많이 쓰지 말고 한두 개 정도 가볍게)
                """);

        
        sb.append("""
              	[ 2. 문제풀이결과 (피드백) 양식 ]
	              	말투는 또로의 말투를 반드시 사용해야 합니다.
	        		[문제풀이 결과 데이터]를 분석하여 JSON 형식으로 피드백을 작성해주세요.
		            반드시 다음 JSON 형식에 맞춰 출력해 주세요.
    			
		            {
		              "questions_result": [
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
		                  "explanation": "여기는 해설로 문제 대한 풀이를 또로의 말투로 짧은 1문장으로 말하는거야. answer 와 studentAnswer 가 서로 다르면 풀이와 격려를 해주고, 같으면 응원만 해줘. 가끔 로그인한 학생의 이름도 불러줘.",
		                  "isCorrect": "Y/N",
		                  "isMarked": "Y/N",
		                  "feedback": "여기는 피드백으로 또로의 말투로  짧은 한문장으로 averageSolveTime 시간대비 solveTime 에 대한 피드백을 해주고, 1초는 암산이 너무 빠르다고 피드백하기",
		                }
		              ],
		              "summary": {
		                "strength": "또로의 말투로 학생의 강점 문장",
		                "weakness": "또로의 말투로 부족한 점 문장",
		                "direction": "또로의 말투로 학습 방향 문장",
		                "encouragement": "또로의 말투로 칭찬과 응원 문장, [로그인 정보 데이터]의 MBTI의 성향을 잘 반영하여 멘트를 사용"
		              }
		            }
		
		            출력은 반드시 위 JSON 구조에 맞춰 주세요. 

                """);
        
        
        
        sb.append("""
              	[ 3. 문제풀이결과 (단건) 양식 ]
	              	말투는 또로의 말투를 반드시 사용해야 합니다.
	              	
	        		[문제풀이 결과 데이터]를 분석하여 JSON 형식으로 피드백을 작성해주세요.
        		      반드시 다음 JSON 형식에 맞춰 출력해 주세요.
		            
	    			[explanation 프롬프팅] 
		    			문제에 대한 또로의 격려와 응원을 작성해주세요.
		    			또로의 말투로 짧은 1문장으로 작성해주세요.
		    			questions 의 [answer] 와 [studentAnswer] 가 서로 다르면 풀이와 격려를 해주고, 같으면 응원만 해주세요. 가끔 [로그인한 학생의 이름]도 불러주세요.
		    			절대로  [answer] 와 [studentAnswer]가 다른데 정답이라고 하면 안돼 . 땡 또는 틀렸어, 다시맞혀봐, 등의 확실하고 귀여운 표현으로 해줘.
		    			첫 시작 마디는 정답 여부로 재치있게 알려주세요. 
		    			입력한 정답이 모호한 경우에는 [로그인한 학생의 이름] 이야, 말을 이해하기가 너무 어려워~~ 라고 표시해주세요. 
		    			프롬프팅에 사용된 '여기는 해설로 문제 대한 풀이를 또로....'는 말하지마.

		            {
		              "questions": {
		                  "questionId": 1,
		                  "subjectType": "수학",
		                  "questionContent": "45 * 66",
		                  "answer": "2970",
		                  "studentAnswer": "2970",
		                  "explanation": "[explanation 프롬프팅] 적용해서 작성해주세요.",
		                  "avgSolveTimeSec": "13초",
		                }
		             
		            }
		
		            출력은 반드시 위 JSON 구조에 맞춰 주세요. 

                """);
        
//        
//        
//        sb.append("""
//              	[ 3. 문제풀이결과 (단건) 양식 ]
//	              	말투는 또로의 말투를 반드시 사용해야 합니다.
//	              	
//	        		[문제풀이 결과 데이터]를 분석하여 JSON 형식으로 피드백을 작성해주세요.
//        		      반드시 다음 JSON 형식에 맞춰 출력해 주세요.
//		            
//	    			[explanation 프롬프팅] 
//		    			문제에 대한 또로의 격려와 응원을 작성해주세요.
//		    			또로의 말투로 짧은 1문장으로 작성해주세요.
//		    			answer 와 studentAnswer 가 서로 다르면 풀이와 격려를 해주고, 같으면 응원만 해주세요. 가끔 [로그인한 학생의 이름]도 불러주세요.
//		    			입력한 정답이 모호한 경우에는 [로그인한 학생의 이름] 이야, 말을 이해하기가 너무 어려워~~ 라고 표시해줘
//	    			
//	    			
//	    			
//	    			
//		            {
//		              "questions": {
//		                  "questionId": 1,
//		                  "subjectType": "수학",
//		                  "difficulty": "사고력",
//		                  "questionContent": "45 * 66",
//		                  "answer": "2970",
//		                  "studentAnswer": "2970",
//		                  "explanation": "[explanation 프롬프팅] 적용해서 작성해주세요.",
//		                  "questionType": "13초",
//		                  "avgSolveTimeSec": "13초",
//		                  "averageSolveTime": "16초",
//		                  "tags": ["연산", "고등", "초등", "중등"],
//		                  "isCorrect": "Y/N",
//		                  "isMarked": "Y/N",
//		                  "feedback": "여기는 피드백으로 또로의 말투로  짧은 한문장으로 averageSolveTime 시간대비 solveTime 에 대한 피드백을 해주고, 1초는 암산이 너무 빠르다고 피드백하기",
//		                }
//		             
//		            }
//		
//		            출력은 반드시 위 JSON 구조에 맞춰 주세요. 
//
//                """);
//        
//        sb.append("""
//              	[ 4. 로그인 양식 ]
//	              	말투는 또로의 말투를 반드시 사용해야 합니다.
//	              	
//	        		[로그인 데이터]를 분석하여 JSON 형식으로 피드백을 작성해주세요.
//		            반드시 다음 JSON 형식에 맞춰 출력해 주세요.
//        		  		
//        		  	[로그인한 학생의 이름 프롬프팅]
//        		  	 학생의 이름은 "userData" 의 name 입니다.
//        		  	 또로는 AI 학습 친구 입니다. 
//        		
//		            {
//		              "userData": {
//						    "studentId": "hjoh",
//						    "name": "오히디니",
//						    "mbti": "ENFP",
//						    "email": "hjoh@woongjin.co.kr",
//						    "tutorId": "TUTOR1",
//						}
//		            }
//		
//		            출력은 반드시 위 JSON 구조에 맞춰 주세요. 
//
//                """);
//        
        
        sb.append("""
              	[ 4. 로그인 양식 ]
	              	말투는 또로의 말투를 반드시 사용해야 합니다.
	              	
	        		[로그인 데이터]를 분석하여 JSON 형식으로 피드백을 작성해주세요.
		            반드시 다음 JSON 형식에 맞춰 출력해 주세요.
        		  		
        		  	[로그인한 학생의 이름 프롬프팅]
        		  	 학생의 이름은 "userData" 의 name 입니다.
        		  	 또로는 AI 학습 친구 입니다. 
        		
		            {
		              "userData": {
						    "studentId": "hjoh",
						    "name": "오히디니",
						    "mbti": "ENFP",
						}
		            }
		
		            출력은 반드시 위 JSON 구조에 맞춰 주세요. 

                """);
        sb.append("끝!");
        return sb.toString();
    }

  
  //로그인 정보
    private StringBuilder getLoginBlock(FeedbackDto request) {
    	StudentDto student = studentMapper.getLogin(request.getStudentId());	// 학생정보
    	 
		log.info("student" + student.toString());
    	StringBuilder sb = new StringBuilder();
        sb.append("[로그인 정보 데이터]\n");

    	return sb;
    }
    
    
    //문제풀이 결과 ( 피드백용 - 5건)
    private StringBuilder getQuestionResultsList(FeedbackDto request) {

    	List<FeedbackDto> list = feedbackMapper.getQuestionResultsList(request); 	// 학생이 방금 푼 문제		
    	log.info("list" + list.toString());
    	StringBuilder sb = new StringBuilder();
        sb.append("[문제풀이결과(피드백) 데이터 ]\n");

        int number = 1;
        for (FeedbackDto dto : list) {
            sb.append("number: ").append(number).append("\n");
            sb.append("questionNumber: ").append(dto.getQuestionId()).append("\n");
            sb.append("subject: ").append(dto.getSubjectType()).append("\n");
            sb.append("questionType: ").append(dto.getQuestionType()).append("\n");
            sb.append("difficulty: ").append(dto.getDifficulty()).append("\n");
            sb.append("questionContent: ").append(dto.getQuestionContent()).append("\n");
            sb.append("answer: ").append(dto.getAnswer()).append("\n");
            sb.append("studentAnswer: ").append(dto.getResultAnswer() == null || dto.getResultAnswer().isEmpty() ? "(미입력)" : dto.getResultAnswer()).append("\n");
            sb.append("solveTime: ").append(dto.getResultTimeSec()).append("초\n");
            sb.append("averageSolveTime: ").append(dto.getAvgSolveTimeSec()).append("초\n");
            sb.append("isCorrect: ").append(dto.getResultIsCorrect()).append("\n");
            sb.append("isMarked: ").append(dto.getResultIsMarked()).append("\n");

            if (dto.getTags() != null && !dto.getTags().isEmpty()) {
                sb.append("tags: ").append(String.join(", ", dto.getTags())).append("\n");
            }

            sb.append("explanation: ").append(dto.getQuestionContent()).append("\n\n");
            sb.append("feedback: ").append("또로의 말투로  짧은 한문장으로 averageSolveTime 시간대비 solveTime 에 대한 피드백을 해주고, 1초는 암산이 너무 빠르다고 피드백하기").append("\n\n");
            number++;
        }

        sb.append("[문제풀이결과(피드백) 양식] 에 맞춰 JSON 으로 만들어줘.\n");
    	return sb;
    }

    //문제풀이 결과 ( 단건 )
    private StringBuilder getQuestionResults(FeedbackDto request) {

    	FeedbackDto dto = feedbackMapper.getQuestionResults(request); 	// 학생이 방금 푼 문제	
    	log.info("dto" + dto.toString());
    	StringBuilder sb = new StringBuilder();
        sb.append("[문제풀이결과(단건) 데이터 ]\n");
        sb.append("questionId: ").append(dto.getQuestionId()).append("\n");
        sb.append("subjectType: ").append(dto.getSubjectType()).append("\n");
        sb.append("difficulty: ").append(dto.getDifficulty()).append("\n");
        sb.append("questionContent: ").append(dto.getQuestionContent()).append("\n");
        sb.append("answer: ").append(dto.getAnswer()).append("\n");
        sb.append("studentAnswer: ").append(request.getResultAnswer() == null || request.getResultAnswer().isEmpty() ? "(미입력)" : request.getResultAnswer()).append("\n");
        sb.append("explanation: ").append(dto.getQuestionContent()).append("\n");
        sb.append("questionType: ").append(dto.getQuestionType()).append("\n");
        sb.append("avgSolveTimeSec: ").append(dto.getResultTimeSec()).append("초\n");
        sb.append("averageSolveTime: ").append(dto.getAvgSolveTimeSec()).append("초\n");
        sb.append("isCorrect: ").append(dto.getResultIsCorrect()).append("\n");
        sb.append("isMarked: ").append(dto.getResultIsMarked()).append("\n");
        sb.append("feedback: ").append("또로의 말투로 짧은 한문장으로 averageSolveTime 시간대비 solveTime 에 대한 피드백을 해주고, 1초는 암산이 너무 빠르다고 피드백하기").append("\n\n");
        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            sb.append("tags: ").append(String.join(", ", dto.getTags())).append("\n");
        }

        sb.append("[문제풀이결과(단건) 양식] 에 맞춰 JSON 으로 만들어줘.\n");
    	return sb;
    }
    

}
