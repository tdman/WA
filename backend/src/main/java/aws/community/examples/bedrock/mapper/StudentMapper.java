package aws.community.examples.bedrock.mapper;

import aws.community.examples.bedrock.dto.StudentDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StudentMapper {

    public StudentDto getStudentInfo (String studentId);
}
