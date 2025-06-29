package aws.community.examples.bedrock.mapper;

import aws.community.examples.bedrock.dto.TutorsDto;

import java.util.List;

//@Mapper
public interface TutorsMapper {

    public List<TutorsDto> getTutorsList();
    public List<TutorsDto> getTutorScheduleList(String tutorId);
}
