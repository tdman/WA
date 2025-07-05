package aws.community.examples.bedrock.service;

import aws.community.examples.bedrock.dto.QuizRequest;
import aws.community.examples.bedrock.dto.QuizResponse;
import org.springframework.stereotype.Service;

import java.util.List;

public interface QuizService {
//    List<QuizResponse> getCuteQuizList(QuizRequest request);
    QuizResponse getCuteQuizList(QuizRequest request);
}

