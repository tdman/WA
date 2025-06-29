package aws.community.examples.bedrock.mapper;

import aws.community.examples.bedrock.dto.QuestionSearchRequest;
import aws.community.examples.bedrock.dto.QuestionSearchResponse;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface QuestionMapper {
    List<QuestionSearchResponse> searchQuestions(QuestionSearchRequest request);
}