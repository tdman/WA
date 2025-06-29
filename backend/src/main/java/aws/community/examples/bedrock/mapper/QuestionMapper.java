package aws.community.examples.bedrock.mapper;

import aws.community.examples.bedrock.dto.QuestionSearchRequest;
import aws.community.examples.bedrock.dto.QuestionSearchResponse;
import aws.community.examples.bedrock.dto.SaveQuestionResultRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QuestionMapper {
    List<QuestionSearchResponse> searchQuestions(QuestionSearchRequest request);

    void insertQuestionResult(SaveQuestionResultRequest result);

    int selectTodayMaxSequence(@Param("studentId") String studentId, @Param("date") String date);


}