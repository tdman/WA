package aws.community.examples.bedrock.service;

import aws.community.examples.bedrock.dto.QuestionSearchRequest;
import aws.community.examples.bedrock.dto.QuestionSearchResponse;
import aws.community.examples.bedrock.dto.SaveQuestionResultRequest;
import aws.community.examples.bedrock.mapper.QuestionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final QuestionMapper questionMapper;

    @Override
    public List<QuestionSearchResponse> searchQuestions(QuestionSearchRequest request) {
        return questionMapper.searchQuestions(request);
    }

    @Override
    public String saveQuestionResults(String studentId, List<SaveQuestionResultRequest> results) {
        // attemptId 자동 생성 로직 포함 (예: 날짜+학생ID+순번)
        String attemptId = generateAttemptId(studentId);

        for (SaveQuestionResultRequest result : results) {
            result.setStudentId(studentId);
            result.setAttemptId(attemptId);

            // DB insert
            questionMapper.insertQuestionResult(result);

            // 생성된 result_id 가져오기
//            Integer resultId = result.getResultId();
        }
        return attemptId;
    }

    // attemptId 생성 (년월일+학습자아이디+시퀀스)
    private String generateAttemptId(String studentId) {
        // 오늘 날짜 (yyyyMMdd)
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        // 시퀀스 번호 (DB에서 해당 날짜 + 학생 ID 기준으로 max 값 조회 + 1)
        int sequence = questionMapper.selectTodayMaxSequence(studentId, date) + 1;

        // attemptId 형식: yyyyMMdd-studentId-seq
        return date + "-" + studentId + "-" + sequence;
    }


}
