package aws.community.examples.bedrock.service;

import aws.community.examples.bedrock.dto.QuestionSearchRequest;
import aws.community.examples.bedrock.dto.QuestionSearchResponse;
import aws.community.examples.bedrock.dto.SaveQuestionResultRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface QuestionService {
    List<QuestionSearchResponse> searchQuestions(QuestionSearchRequest request);

    String saveQuestionResults(String studentId, List<SaveQuestionResultRequest> results);
}
