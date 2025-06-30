package aws.community.examples.bedrock.mapper;

import aws.community.examples.bedrock.domain.StudyResult;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FeedbackMapper {
    List<StudyResult> findResultsForPastWeek(@Param("studentId") String studentId);
}
