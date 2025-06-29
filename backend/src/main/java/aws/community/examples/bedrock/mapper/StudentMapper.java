package aws.community.examples.bedrock.mapper;

import aws.community.examples.bedrock.dto.StudentDto;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StudentMapper {

    public StudentDto getStudentInfo (String studentId);
    public StudentDto getLogin (String studentId);
    public int saveStudent (StudentDto dto);
    public List<StudentDto> getMyTutorsList();
}
