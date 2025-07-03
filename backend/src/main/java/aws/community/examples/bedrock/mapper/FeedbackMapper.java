package aws.community.examples.bedrock.mapper;

import aws.community.examples.bedrock.dto.FeedbackDto;
import aws.community.examples.bedrock.dto.StudentDto;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FeedbackMapper {
	List<FeedbackDto> getFeedbackProblems(FeedbackDto dto);
}
