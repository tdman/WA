package aws.community.examples.bedrock.service;

import aws.community.examples.bedrock.domain.Question;
import aws.community.examples.bedrock.dto.QuizRequest;
import aws.community.examples.bedrock.dto.QuizResponse;
import aws.community.examples.bedrock.dto.TtoroResult;
import aws.community.examples.bedrock.external.BedrockQuizClient;
import aws.community.examples.bedrock.mapper.QuestionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuestionMapper questionMapper;
    private final BedrockQuizClient bedrockQuizClient;

    @Override
    public QuizResponse getCuteQuizList(QuizRequest request) {
        System.out.println("✅ /quiz API 호출됨 - request: " + request);

        Question question = questionMapper.selectRandomQuestions(request.getDifficulty());
        System.out.println("🧾 불러온 문제: " + question.getQuestionContent());

        TtoroResult result = convertTtoroStyle(question);
        System.out.println("🟡 Claude 변환 결과: " + result.getTtoroText());

        return QuizResponse.builder()
                .questionId(result.getQuestionId())
                .originalQuestion(question.getQuestionContent())
                .rewriteQuestion(result.getTtoroText())
                .answer(question.getAnswer())
                .build();
    }

    private TtoroResult convertTtoroStyle(Question question) {
        String prompt = String.format("""
            당신은 귀엽고 똑똑한 친구 캐릭터 '또로'입니다.
            친구에게 문제를 내는 상황입니다.

            [대화 스타일 지침]
            - 문제를 짧고 쉽게 내세요.
            - 문제의 본질은 유지하지만, 말투와 분위기는 부드럽고 친근하게 표현해주세요.
            - 어린이와 정말 친한 친구처럼 편안하게 말해주세요.
            - 딱딱하거나 교사 같은 말투는 피하고, 부드럽고 친근한 말투를 사용하세요.
            - '~또로'는 너무 억지스럽지 않게, 감탄할 때나 강조할 때 자연스럽게 섞어주세요.
            - 모든 문장을 ~또로로 끝낼 필요는 없으며, 상황에 맞게 '~해보자', '~할까?', '~했지?' 같은 표현도 적극 활용해주세요.
            - 말투는 히히, 우와, 앗! 같은 의성어/감탄어를 사용하여 리듬감 있게 만들어주세요.
            
            [절대 사용하지 말아야 할 표현 목록]
            - 문제풀이에 도움주지 마세요.
            - 격려 하지 마세요.
            - 모르냐고 하지 마세요.
            - 재촉하지 마세요.
            - 답을 알려주지 마세요.
            - 정답을 유추할 수 있도록 하지 마세요.
            - 욕설처럼 들릴 수 있는 단어 또는 강한 표현 (예: "좋또로", "맞또로", "틀렸또로")
            - 너무 기계적이고 리듬감 없는 말끝 (예: "했또로", "봤또로")
            - 부정적인 뉘앙스를 직접적으로 전달하는 문장
            - 기계적이고 딱딱한 학습 지시어 ("정답을 고르시오", "다음을 고르시오" 등)

            [목표]
            아래 문제는 초등학교 저학년 수준의 교과 문제예요.
            이 문제를, 어린이와 놀이하는 것 처럼 대화체로 말투를 바꿔주세요.
    
            [대상 과목]
            - 수학, 과학, 사회, 국어, 영어 등 초등학교 전 과목이 포함될 수 있어요.
        
            [예시 변환]
            - apple의 뜻은? → apple 은 우리나라 말로 뭐게~?
            - "1 + 2 = ?" → "1 더하기 2는 뭘까 또로~?"
            - "물이 얼면 어떻게 될까요?" → "물이 추워지면 어떻게 변할까~?"
            - "지구는 어떤 모양인가요?" → "지구는 어떤 모양일까~?"
            - "다음 중 알맞은 낱말을 고르시오" → "이 중에서 어떤 말이 제일 잘 어울릴까~?"
            - "He is my brother." → "He is my brother~ 무슨 뜻일까 히히~?"
            
            [표현 예시]
            - "우와~ 너 진짜 잘했어! 최고 또로~!"
            - "앗, 살짝 아쉬웠지만 괜찮아~ 다음엔 더 잘할 수 있을 거야!"
            - "또로는 네가 너무 자랑스러워서 방방 뛰고 있또로~ 히히"
            - "우리 같이 다음 문제도 풀어볼까?"
            - "이번엔 정답이 아니었지만, 설명을 읽고 나면 이해가 쏙쏙 될 거야~!"
           

            [변환할 문제]
            %s

            위 문제를 한 문장으로 귀엽고 다정한 또로 말투로 자연스럽게 바꿔주세요. 어린이에게 꼭 맞는 표현이면 더 좋아요.
        """, question.getQuestionContent());

        System.out.println("🟡 Claude에게 보낼 프롬프트:\n" + prompt);  // [1] 프롬프트 확인

        String response = bedrockQuizClient.getTextResponse(prompt);

        System.out.println("🟢 Claude 응답 결과:\n" + response);       // [3] 응답 확인

        return new TtoroResult(question.getQuestionId(), response);
    }
}

